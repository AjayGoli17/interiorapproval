import { supabase, isSupabaseConfigured, isDemoMode } from './supabase';
import {
  Project,
  Room,
  DesignVersion,
  Approval,
  ChangeRequest,
  Material,
  ProcurementOrder,
  Task,
  SiteUpdate,
  Issue,
  Expense,
  PaymentMilestone,
  Notification,
  StudioSettings,
  UserProfile,
  Client,
} from '@/types';

/**
 * Generate standard RFC4122 v4 UUID compatible with Postgres UUID columns
 */
export function generateUuid(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    try {
      return crypto.randomUUID();
    } catch {
      // Fallback if randomUUID is unavailable in certain environments
    }
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

const UUID_FOREIGN_KEYS = new Set([
  'client_id',
  'lead_designer_id',
  'site_manager_id',
  'project_id',
  'room_id',
  'design_version_id',
  'material_id',
  'assigned_to',
  'reporter_id',
  'requested_by',
  'reviewed_by',
  'approved_by',
  'user_id',
]);

/**
 * Clean object before sending to Supabase by omitting undefined values
 * and transforming empty strings in foreign keys to null
 */
function cleanPayload<T extends Record<string, any>>(obj: T): Record<string, any> {
  const result: Record<string, any> = {};
  for (const [key, value] of Object.entries(obj)) {
    if (value === undefined) continue;
    // If a foreign key field ends in _id or is in UUID_FOREIGN_KEYS and is empty string, convert to null
    if ((key.endsWith('_id') || UUID_FOREIGN_KEYS.has(key)) && value === '') {
      result[key] = null;
    } else {
      result[key] = value;
    }
  }
  return result;
}

export interface SupabaseSyncData {
  projects: Project[];
  clients: Client[];
  teamMembers: UserProfile[];
  rooms: Room[];
  designVersions: DesignVersion[];
  approvals: Approval[];
  changeRequests: ChangeRequest[];
  materials: Material[];
  procurementOrders: ProcurementOrder[];
  tasks: Task[];
  siteUpdates: SiteUpdate[];
  issues: Issue[];
  expenses: Expense[];
  paymentMilestones: PaymentMilestone[];
  notifications: Notification[];
  studioSettings?: StudioSettings;
}

/**
 * Fetches all StudioFlow entity tables from Supabase in parallel
 */
export async function fetchSupabaseData(): Promise<SupabaseSyncData | null> {
  if (!isSupabaseConfigured || isDemoMode || !supabase) {
    return null;
  }

  try {
    const [
      profilesRes,
      projectsRes,
      roomsRes,
      designsRes,
      approvalsRes,
      crRes,
      materialsRes,
      procurementRes,
      tasksRes,
      siteUpdatesRes,
      issuesRes,
      expensesRes,
      milestonesRes,
      notificationsRes,
      settingsRes,
    ] = await Promise.all([
      supabase.from('profiles').select('*'),
      supabase.from('projects').select('*').order('created_at', { ascending: false }),
      supabase.from('rooms').select('*').order('name', { ascending: true }),
      supabase.from('design_versions').select('*').order('submitted_at', { ascending: false }),
      supabase.from('approvals').select('*').order('created_at', { ascending: false }),
      supabase.from('change_requests').select('*').order('created_at', { ascending: false }),
      supabase.from('materials').select('*').order('item_code', { ascending: true }),
      supabase.from('procurement_orders').select('*').order('order_date', { ascending: false }),
      supabase.from('tasks').select('*').order('due_date', { ascending: true }),
      supabase.from('site_updates').select('*').order('date', { ascending: false }),
      supabase.from('issues').select('*').order('created_at', { ascending: false }),
      supabase.from('expenses').select('*').order('incurred_on', { ascending: false }),
      supabase.from('payment_milestones').select('*').order('milestone_code', { ascending: true }),
      supabase.from('notifications').select('*').order('created_at', { ascending: false }),
      supabase.from('studio_settings').select('*').maybeSingle(),
    ]);

    // Handle any serious errors
    if (projectsRes.error) {
      console.error('[SupabaseSync] Failed to fetch projects:', projectsRes.error.message);
      return null;
    }

    // Split profiles into team members and clients
    const allProfiles = profilesRes.data || [];
    const teamMembers: UserProfile[] = allProfiles
      .filter((p: any) => p.role !== 'client')
      .map((p: any) => ({
        id: p.id,
        email: p.email,
        full_name: p.full_name,
        role: p.role,
        phone: p.phone,
        avatar_url: p.avatar_url,
        company_name: p.company_name,
        specialization: p.specialization,
        status: p.status || 'available',
        assigned_project_ids: p.assigned_project_ids || [],
        created_at: p.created_at,
      }));

    const clients: Client[] = allProfiles
      .filter((p: any) => p.role === 'client')
      .map((p: any) => ({
        id: p.id,
        full_name: p.full_name,
        email: p.email,
        phone: p.phone || '',
        property_address: p.property_address || p.company_name || '',
        city: p.city || 'Hyderabad',
        project_id: (p.assigned_project_ids && p.assigned_project_ids[0]) || undefined,
        avatar_url: p.avatar_url,
        notes: p.notes,
        created_at: p.created_at,
      }));

    const projects: Project[] = (projectsRes.data || []).map((p: any) => ({
      id: p.id,
      project_code: p.project_code,
      title: p.title,
      client_id: p.client_id || undefined,
      lead_designer_id: p.lead_designer_id || undefined,
      site_manager_id: p.site_manager_id || undefined,
      location: p.location,
      city: p.city,
      property_type: p.property_type,
      carpet_area_sqft: Number(p.carpet_area_sqft) || 0,
      total_budget: Number(p.total_budget) || 0,
      estimated_start_date: p.estimated_start_date || '',
      target_handover_date: p.target_handover_date || '',
      status: p.status,
      progress_percentage: Number(p.progress_percentage) || 0,
      notes: p.notes,
      created_at: p.created_at,
      updated_at: p.updated_at,
    }));

    const rooms: Room[] = (roomsRes.data || []).map((r: any) => ({
      id: r.id,
      project_id: r.project_id,
      name: r.name,
      floor: r.floor,
      dimensions: r.dimensions,
      area_sqft: Number(r.area_sqft) || undefined,
      status: r.status,
      progress_percentage: Number(r.progress_percentage) || 0,
      specifications: r.specifications,
      created_at: r.created_at,
    }));

    const designVersions: DesignVersion[] = (designsRes.data || []).map((d: any) => ({
      id: d.id,
      project_id: d.project_id,
      room_id: d.room_id || undefined,
      version_number: d.version_number,
      title: d.title,
      description: d.description,
      file_url: d.file_url,
      preview_url: d.preview_url,
      render_type: d.render_type,
      status: d.status,
      designer_notes: d.designer_notes,
      client_feedback: d.client_feedback,
      submitted_at: d.submitted_at,
      reviewed_at: d.reviewed_at,
    }));

    const approvals: Approval[] = (approvalsRes.data || []).map((a: any) => ({
      id: a.id,
      project_id: a.project_id,
      room_id: a.room_id || undefined,
      design_version_id: a.design_version_id || undefined,
      title: a.title,
      category: a.category,
      description: a.description,
      status: a.status,
      due_date: a.due_date,
      client_comments: a.client_comments,
      internal_notes: a.internal_notes,
      approved_at: a.approved_at,
      approved_by: a.approved_by,
      created_at: a.created_at,
    }));

    const changeRequests: ChangeRequest[] = (crRes.data || []).map((c: any) => ({
      id: c.id,
      project_id: c.project_id,
      room_id: c.room_id || undefined,
      request_code: c.request_code,
      title: c.title,
      description: c.description,
      original_spec: c.original_spec,
      requested_change: c.requested_change,
      cost_impact: Number(c.cost_impact) || 0,
      timeline_impact_days: Number(c.timeline_impact_days) || 0,
      requested_by: c.requested_by,
      reviewed_by: c.reviewed_by,
      client_decision: c.client_decision,
      client_decision_notes: c.client_decision_notes,
      status: c.status,
      approved_at: c.approved_at,
      created_at: c.created_at,
    }));

    const materials: Material[] = (materialsRes.data || []).map((m: any) => ({
      id: m.id,
      project_id: m.project_id,
      room_id: m.room_id || undefined,
      item_code: m.item_code,
      name: m.name,
      category: m.category,
      brand_spec: m.brand_spec,
      unit: m.unit,
      quantity: Number(m.quantity) || 1,
      estimated_rate: Number(m.estimated_rate) || 0,
      actual_rate: Number(m.actual_rate) || 0,
      proposed_price: m.proposed_price ? Number(m.proposed_price) : undefined,
      approval_status: m.approval_status,
      procurement_status: m.procurement_status,
      selection_status: m.selection_status,
      swatch_url: m.swatch_url,
      created_at: m.created_at,
    }));

    const procurementOrders: ProcurementOrder[] = (procurementRes.data || []).map((p: any) => ({
      id: p.id,
      project_id: p.project_id,
      material_id: p.material_id || undefined,
      material_name: p.material_name,
      po_number: p.po_number,
      vendor_name: p.vendor_name,
      vendor_contact: p.vendor_contact,
      quantity: p.quantity ? Number(p.quantity) : undefined,
      unit: p.unit,
      order_date: p.order_date,
      expected_delivery_date: p.expected_delivery_date,
      actual_delivery_date: p.actual_delivery_date,
      total_amount: Number(p.total_amount) || 0,
      payment_status: p.payment_status,
      delivery_status: p.delivery_status,
      notes: p.notes,
      created_at: p.created_at,
    }));

    const tasks: Task[] = (tasksRes.data || []).map((t: any) => ({
      id: t.id,
      project_id: t.project_id,
      room_id: t.room_id || undefined,
      title: t.title,
      category: t.category,
      assigned_to: t.assigned_to,
      start_date: t.start_date,
      due_date: t.due_date,
      status: t.status,
      priority: t.priority,
      progress_percent: Number(t.progress_percent) || 0,
      blocker_notes: t.blocker_notes,
      dependencies: t.dependencies,
      created_at: t.created_at,
    }));

    const siteUpdates: SiteUpdate[] = (siteUpdatesRes.data || []).map((u: any) => ({
      id: u.id,
      project_id: u.project_id,
      room_id: u.room_id || undefined,
      reporter_id: u.reporter_id,
      title: u.title,
      description: u.description,
      photo_urls: u.photo_urls || [],
      date: u.date,
      work_completed_summary: u.work_completed_summary,
      next_planned_activity: u.next_planned_activity,
      workforce_count: Number(u.workforce_count) || 0,
      delay_flag: Boolean(u.delay_flag),
      weather_conditions: u.weather_conditions,
      is_client_visible: u.is_client_visible ?? true,
      created_at: u.created_at,
    }));

    const issues: Issue[] = (issuesRes.data || []).map((i: any) => ({
      id: i.id,
      project_id: i.project_id,
      room_id: i.room_id || undefined,
      issue_code: i.issue_code,
      title: i.title,
      description: i.description,
      severity: i.severity,
      status: i.status,
      reported_by: i.reported_by,
      assigned_to: i.assigned_to,
      photos: i.photos || [],
      resolution_notes: i.resolution_notes,
      resolution_deadline: i.resolution_deadline,
      created_at: i.created_at,
      resolved_at: i.resolved_at,
    }));

    const expenses: Expense[] = (expensesRes.data || []).map((e: any) => ({
      id: e.id,
      project_id: e.project_id,
      room_id: e.room_id || undefined,
      category: e.category,
      amount: Number(e.amount) || 0,
      payment_mode: e.payment_mode,
      paid_to: e.paid_to,
      receipt_url: e.receipt_url,
      status: e.status,
      incurred_on: e.incurred_on,
      notes: e.notes,
      created_at: e.created_at,
    }));

    const paymentMilestones: PaymentMilestone[] = (milestonesRes.data || []).map((m: any) => ({
      id: m.id,
      project_id: m.project_id,
      milestone_code: m.milestone_code,
      name: m.name,
      stage_trigger: m.stage_trigger,
      percentage: Number(m.percentage) || 0,
      amount: Number(m.amount) || 0,
      due_date: m.due_date,
      status: m.status,
      paid_at: m.paid_at,
      invoice_number: m.invoice_number,
      created_at: m.created_at,
    }));

    const notifications: Notification[] = (notificationsRes.data || []).map((n: any) => ({
      id: n.id,
      user_id: n.user_id,
      project_id: n.project_id || undefined,
      title: n.title,
      message: n.message,
      type: n.type,
      is_read: Boolean(n.is_read),
      link: n.link,
      created_at: n.created_at,
    }));

    let studioSettings: StudioSettings | undefined;
    if (settingsRes.data) {
      const s = settingsRes.data;
      studioSettings = {
        company_name: s.company_name,
        legal_name: s.legal_name,
        gstin: s.gstin,
        email: s.email,
        phone: s.phone,
        address: s.address,
        currency: s.currency,
        currency_symbol: s.currency_symbol,
        standard_timeline_weeks: Number(s.standard_timeline_weeks) || 14,
        default_gst_percentage: Number(s.default_gst_percentage) || 18,
        standard_design_fee_sqft: Number(s.standard_design_fee_sqft) || 250,
        notes: s.notes,
      };
    }

    return {
      projects,
      clients,
      teamMembers,
      rooms,
      designVersions,
      approvals,
      changeRequests,
      materials,
      procurementOrders,
      tasks,
      siteUpdates,
      issues,
      expenses,
      paymentMilestones,
      notifications,
      studioSettings,
    };
  } catch (err: any) {
    console.error('[SupabaseSync] Unexpected error fetching database data:', err);
    return null;
  }
}

// ==============================================================================
// ASYNCHRONOUS REMOTE MUTATION HANDLERS
// ==============================================================================

export async function persistRemoteProject(project: Project): Promise<void> {
  if (!isSupabaseConfigured || isDemoMode || !supabase) return;
  try {
    const payload = cleanPayload({
      id: project.id,
      project_code: project.project_code,
      title: project.title,
      client_id: project.client_id || null,
      lead_designer_id: project.lead_designer_id || null,
      site_manager_id: project.site_manager_id || null,
      location: project.location,
      city: project.city,
      property_type: project.property_type,
      carpet_area_sqft: project.carpet_area_sqft,
      total_budget: project.total_budget,
      estimated_start_date: project.estimated_start_date || null,
      target_handover_date: project.target_handover_date || null,
      status: project.status,
      progress_percentage: project.progress_percentage,
      notes: project.notes,
    });
    const { error } = await supabase.from('projects').upsert([payload]);
    if (error) console.error('[SupabaseSync] Error persisting project:', error.message);
  } catch (err) {
    console.error('[SupabaseSync] Exception persisting project:', err);
  }
}

export async function updateRemoteProject(id: string, updates: Partial<Project>): Promise<void> {
  if (!isSupabaseConfigured || isDemoMode || !supabase) return;
  try {
    const payload = cleanPayload(updates);
    const { error } = await supabase.from('projects').update(payload).eq('id', id);
    if (error) console.error('[SupabaseSync] Error updating project:', error.message);
  } catch (err) {
    console.error('[SupabaseSync] Exception updating project:', err);
  }
}

export async function deleteRemoteProject(id: string): Promise<void> {
  if (!isSupabaseConfigured || isDemoMode || !supabase) return;
  try {
    const { error } = await supabase.from('projects').delete().eq('id', id);
    if (error) console.error('[SupabaseSync] Error deleting project:', error.message);
  } catch (err) {
    console.error('[SupabaseSync] Exception deleting project:', err);
  }
}

export async function persistRemoteRoom(room: Room): Promise<void> {
  if (!isSupabaseConfigured || isDemoMode || !supabase) return;
  try {
    const payload = cleanPayload({
      id: room.id,
      project_id: room.project_id,
      name: room.name,
      floor: room.floor,
      dimensions: room.dimensions,
      area_sqft: room.area_sqft,
      status: room.status,
      progress_percentage: room.progress_percentage || 0,
      specifications: room.specifications,
    });
    const { error } = await supabase.from('rooms').upsert([payload]);
    if (error) console.error('[SupabaseSync] Error persisting room:', error.message);
  } catch (err) {
    console.error('[SupabaseSync] Exception persisting room:', err);
  }
}

export async function updateRemoteRoom(id: string, updates: Partial<Room>): Promise<void> {
  if (!isSupabaseConfigured || isDemoMode || !supabase) return;
  try {
    const payload = cleanPayload(updates);
    const { error } = await supabase.from('rooms').update(payload).eq('id', id);
    if (error) console.error('[SupabaseSync] Error updating room:', error.message);
  } catch (err) {
    console.error('[SupabaseSync] Exception updating room:', err);
  }
}

export async function deleteRemoteRoom(id: string): Promise<void> {
  if (!isSupabaseConfigured || isDemoMode || !supabase) return;
  try {
    const { error } = await supabase.from('rooms').delete().eq('id', id);
    if (error) console.error('[SupabaseSync] Error deleting room:', error.message);
  } catch (err) {
    console.error('[SupabaseSync] Exception deleting room:', err);
  }
}

export async function persistRemoteDesignVersion(design: DesignVersion): Promise<void> {
  if (!isSupabaseConfigured || isDemoMode || !supabase) return;
  try {
    const payload = cleanPayload({
      id: design.id,
      project_id: design.project_id,
      room_id: design.room_id || null,
      version_number: design.version_number,
      title: design.title,
      description: design.description,
      file_url: design.file_url,
      preview_url: design.preview_url,
      render_type: design.render_type,
      status: design.status,
      designer_notes: design.designer_notes,
      client_feedback: design.client_feedback,
      submitted_at: design.submitted_at,
      reviewed_at: design.reviewed_at,
    });
    const { error } = await supabase.from('design_versions').upsert([payload]);
    if (error) console.error('[SupabaseSync] Error persisting design version:', error.message);
  } catch (err) {
    console.error('[SupabaseSync] Exception persisting design version:', err);
  }
}

export async function updateRemoteDesignVersion(id: string, updates: Partial<DesignVersion>): Promise<void> {
  if (!isSupabaseConfigured || isDemoMode || !supabase) return;
  try {
    const payload = cleanPayload(updates);
    const { error } = await supabase.from('design_versions').update(payload).eq('id', id);
    if (error) console.error('[SupabaseSync] Error updating design version:', error.message);
  } catch (err) {
    console.error('[SupabaseSync] Exception updating design version:', err);
  }
}

export async function persistRemoteApproval(approval: Approval): Promise<void> {
  if (!isSupabaseConfigured || isDemoMode || !supabase) return;
  try {
    const payload = cleanPayload({
      id: approval.id,
      project_id: approval.project_id,
      room_id: approval.room_id || null,
      design_version_id: approval.design_version_id || null,
      title: approval.title,
      category: approval.category,
      description: approval.description,
      status: approval.status,
      due_date: approval.due_date || null,
      client_comments: approval.client_comments,
      internal_notes: approval.internal_notes,
      approved_at: approval.approved_at,
      approved_by: approval.approved_by || null,
    });
    const { error } = await supabase.from('approvals').upsert([payload]);
    if (error) console.error('[SupabaseSync] Error persisting approval:', error.message);
  } catch (err) {
    console.error('[SupabaseSync] Exception persisting approval:', err);
  }
}

export async function updateRemoteApproval(id: string, updates: Partial<Approval>): Promise<void> {
  if (!isSupabaseConfigured || isDemoMode || !supabase) return;
  try {
    const payload = cleanPayload(updates);
    const { error } = await supabase.from('approvals').update(payload).eq('id', id);
    if (error) console.error('[SupabaseSync] Error updating approval:', error.message);
  } catch (err) {
    console.error('[SupabaseSync] Exception updating approval:', err);
  }
}

export async function deleteRemoteApproval(id: string): Promise<void> {
  if (!isSupabaseConfigured || isDemoMode || !supabase) return;
  try {
    const { error } = await supabase.from('approvals').delete().eq('id', id);
    if (error) console.error('[SupabaseSync] Error deleting approval:', error.message);
  } catch (err) {
    console.error('[SupabaseSync] Exception deleting approval:', err);
  }
}

export async function persistRemoteChangeRequest(cr: ChangeRequest): Promise<void> {
  if (!isSupabaseConfigured || isDemoMode || !supabase) return;
  try {
    const payload = cleanPayload({
      id: cr.id,
      project_id: cr.project_id,
      room_id: cr.room_id || null,
      request_code: cr.request_code,
      title: cr.title,
      description: cr.description,
      original_spec: cr.original_spec,
      requested_change: cr.requested_change,
      cost_impact: cr.cost_impact,
      timeline_impact_days: cr.timeline_impact_days,
      requested_by: cr.requested_by || null,
      reviewed_by: cr.reviewed_by || null,
      client_decision: cr.client_decision || 'pending',
      client_decision_notes: cr.client_decision_notes,
      status: cr.status,
      approved_at: cr.approved_at,
    });
    const { error } = await supabase.from('change_requests').upsert([payload]);
    if (error) console.error('[SupabaseSync] Error persisting change request:', error.message);
  } catch (err) {
    console.error('[SupabaseSync] Exception persisting change request:', err);
  }
}

export async function updateRemoteChangeRequest(id: string, updates: Partial<ChangeRequest>): Promise<void> {
  if (!isSupabaseConfigured || isDemoMode || !supabase) return;
  try {
    const payload = cleanPayload(updates);
    const { error } = await supabase.from('change_requests').update(payload).eq('id', id);
    if (error) console.error('[SupabaseSync] Error updating change request:', error.message);
  } catch (err) {
    console.error('[SupabaseSync] Exception updating change request:', err);
  }
}

export async function persistRemoteMaterial(mat: Material): Promise<void> {
  if (!isSupabaseConfigured || isDemoMode || !supabase) return;
  try {
    const payload = cleanPayload({
      id: mat.id,
      project_id: mat.project_id,
      room_id: mat.room_id || null,
      item_code: mat.item_code,
      name: mat.name,
      category: mat.category,
      brand_spec: mat.brand_spec,
      unit: mat.unit,
      quantity: mat.quantity,
      estimated_rate: mat.estimated_rate,
      actual_rate: mat.actual_rate,
      proposed_price: mat.proposed_price,
      approval_status: mat.approval_status,
      procurement_status: mat.procurement_status,
      selection_status: mat.selection_status,
      swatch_url: mat.swatch_url,
    });
    const { error } = await supabase.from('materials').upsert([payload]);
    if (error) console.error('[SupabaseSync] Error persisting material:', error.message);
  } catch (err) {
    console.error('[SupabaseSync] Exception persisting material:', err);
  }
}

export async function updateRemoteMaterial(id: string, updates: Partial<Material>): Promise<void> {
  if (!isSupabaseConfigured || isDemoMode || !supabase) return;
  try {
    const payload = cleanPayload(updates);
    const { error } = await supabase.from('materials').update(payload).eq('id', id);
    if (error) console.error('[SupabaseSync] Error updating material:', error.message);
  } catch (err) {
    console.error('[SupabaseSync] Exception updating material:', err);
  }
}

export async function deleteRemoteMaterial(id: string): Promise<void> {
  if (!isSupabaseConfigured || isDemoMode || !supabase) return;
  try {
    const { error } = await supabase.from('materials').delete().eq('id', id);
    if (error) console.error('[SupabaseSync] Error deleting material:', error.message);
  } catch (err) {
    console.error('[SupabaseSync] Exception deleting material:', err);
  }
}

export async function persistRemoteProcurementOrder(order: ProcurementOrder): Promise<void> {
  if (!isSupabaseConfigured || isDemoMode || !supabase) return;
  try {
    const payload = cleanPayload({
      id: order.id,
      project_id: order.project_id,
      material_id: order.material_id || null,
      material_name: order.material_name,
      po_number: order.po_number,
      vendor_name: order.vendor_name,
      vendor_contact: order.vendor_contact,
      quantity: order.quantity,
      unit: order.unit,
      order_date: order.order_date,
      expected_delivery_date: order.expected_delivery_date || null,
      actual_delivery_date: order.actual_delivery_date || null,
      total_amount: order.total_amount,
      payment_status: order.payment_status,
      delivery_status: order.delivery_status,
      notes: order.notes,
    });
    const { error } = await supabase.from('procurement_orders').upsert([payload]);
    if (error) console.error('[SupabaseSync] Error persisting procurement order:', error.message);
  } catch (err) {
    console.error('[SupabaseSync] Exception persisting procurement order:', err);
  }
}

export async function updateRemoteProcurementOrder(id: string, updates: Partial<ProcurementOrder>): Promise<void> {
  if (!isSupabaseConfigured || isDemoMode || !supabase) return;
  try {
    const payload = cleanPayload(updates);
    const { error } = await supabase.from('procurement_orders').update(payload).eq('id', id);
    if (error) console.error('[SupabaseSync] Error updating procurement order:', error.message);
  } catch (err) {
    console.error('[SupabaseSync] Exception updating procurement order:', err);
  }
}

export async function persistRemoteTask(task: Task): Promise<void> {
  if (!isSupabaseConfigured || isDemoMode || !supabase) return;
  try {
    const payload = cleanPayload({
      id: task.id,
      project_id: task.project_id,
      room_id: task.room_id || null,
      title: task.title,
      category: task.category,
      assigned_to: task.assigned_to || null,
      start_date: task.start_date || null,
      due_date: task.due_date || null,
      status: task.status,
      priority: task.priority,
      progress_percent: task.progress_percent,
      blocker_notes: task.blocker_notes,
      dependencies: task.dependencies,
    });
    const { error } = await supabase.from('tasks').upsert([payload]);
    if (error) console.error('[SupabaseSync] Error persisting task:', error.message);
  } catch (err) {
    console.error('[SupabaseSync] Exception persisting task:', err);
  }
}

export async function updateRemoteTask(id: string, updates: Partial<Task>): Promise<void> {
  if (!isSupabaseConfigured || isDemoMode || !supabase) return;
  try {
    const payload = cleanPayload(updates);
    const { error } = await supabase.from('tasks').update(payload).eq('id', id);
    if (error) console.error('[SupabaseSync] Error updating task:', error.message);
  } catch (err) {
    console.error('[SupabaseSync] Exception updating task:', err);
  }
}

export async function deleteRemoteTask(id: string): Promise<void> {
  if (!isSupabaseConfigured || isDemoMode || !supabase) return;
  try {
    const { error } = await supabase.from('tasks').delete().eq('id', id);
    if (error) console.error('[SupabaseSync] Error deleting task:', error.message);
  } catch (err) {
    console.error('[SupabaseSync] Exception deleting task:', err);
  }
}

export async function persistRemoteSiteUpdate(update: SiteUpdate): Promise<void> {
  if (!isSupabaseConfigured || isDemoMode || !supabase) return;
  try {
    const payload = cleanPayload({
      id: update.id,
      project_id: update.project_id,
      room_id: update.room_id || null,
      reporter_id: update.reporter_id || null,
      title: update.title,
      description: update.description,
      photo_urls: update.photo_urls || [],
      date: update.date,
      work_completed_summary: update.work_completed_summary,
      next_planned_activity: update.next_planned_activity,
      workforce_count: update.workforce_count,
      delay_flag: update.delay_flag,
      weather_conditions: update.weather_conditions,
      is_client_visible: update.is_client_visible ?? true,
    });
    const { error } = await supabase.from('site_updates').upsert([payload]);
    if (error) console.error('[SupabaseSync] Error persisting site update:', error.message);
  } catch (err) {
    console.error('[SupabaseSync] Exception persisting site update:', err);
  }
}

export async function updateRemoteSiteUpdate(id: string, updates: Partial<SiteUpdate>): Promise<void> {
  if (!isSupabaseConfigured || isDemoMode || !supabase) return;
  try {
    const payload = cleanPayload(updates);
    const { error } = await supabase.from('site_updates').update(payload).eq('id', id);
    if (error) console.error('[SupabaseSync] Error updating site update:', error.message);
  } catch (err) {
    console.error('[SupabaseSync] Exception updating site update:', err);
  }
}

export async function deleteRemoteSiteUpdate(id: string): Promise<void> {
  if (!isSupabaseConfigured || isDemoMode || !supabase) return;
  try {
    const { error } = await supabase.from('site_updates').delete().eq('id', id);
    if (error) console.error('[SupabaseSync] Error deleting site update:', error.message);
  } catch (err) {
    console.error('[SupabaseSync] Exception deleting site update:', err);
  }
}

export async function persistRemoteIssue(issue: Issue): Promise<void> {
  if (!isSupabaseConfigured || isDemoMode || !supabase) return;
  try {
    const payload = cleanPayload({
      id: issue.id,
      project_id: issue.project_id,
      room_id: issue.room_id || null,
      issue_code: issue.issue_code,
      title: issue.title,
      description: issue.description,
      severity: issue.severity,
      status: issue.status,
      reported_by: issue.reported_by || null,
      assigned_to: issue.assigned_to || null,
      photos: issue.photos || [],
      resolution_notes: issue.resolution_notes,
      resolution_deadline: issue.resolution_deadline || null,
      resolved_at: issue.resolved_at,
    });
    const { error } = await supabase.from('issues').upsert([payload]);
    if (error) console.error('[SupabaseSync] Error persisting issue:', error.message);
  } catch (err) {
    console.error('[SupabaseSync] Exception persisting issue:', err);
  }
}

export async function updateRemoteIssue(id: string, updates: Partial<Issue>): Promise<void> {
  if (!isSupabaseConfigured || isDemoMode || !supabase) return;
  try {
    const payload = cleanPayload(updates);
    const { error } = await supabase.from('issues').update(payload).eq('id', id);
    if (error) console.error('[SupabaseSync] Error updating issue:', error.message);
  } catch (err) {
    console.error('[SupabaseSync] Exception updating issue:', err);
  }
}

export async function deleteRemoteIssue(id: string): Promise<void> {
  if (!isSupabaseConfigured || isDemoMode || !supabase) return;
  try {
    const { error } = await supabase.from('issues').delete().eq('id', id);
    if (error) console.error('[SupabaseSync] Error deleting issue:', error.message);
  } catch (err) {
    console.error('[SupabaseSync] Exception deleting issue:', err);
  }
}

export async function persistRemoteExpense(exp: Expense): Promise<void> {
  if (!isSupabaseConfigured || isDemoMode || !supabase) return;
  try {
    const payload = cleanPayload({
      id: exp.id,
      project_id: exp.project_id,
      room_id: exp.room_id || null,
      category: exp.category,
      amount: exp.amount,
      payment_mode: exp.payment_mode,
      paid_to: exp.paid_to,
      receipt_url: exp.receipt_url,
      status: exp.status,
      incurred_on: exp.incurred_on,
      notes: exp.notes,
    });
    const { error } = await supabase.from('expenses').upsert([payload]);
    if (error) console.error('[SupabaseSync] Error persisting expense:', error.message);
  } catch (err) {
    console.error('[SupabaseSync] Exception persisting expense:', err);
  }
}

export async function updateRemoteExpense(id: string, updates: Partial<Expense>): Promise<void> {
  if (!isSupabaseConfigured || isDemoMode || !supabase) return;
  try {
    const payload = cleanPayload(updates);
    const { error } = await supabase.from('expenses').update(payload).eq('id', id);
    if (error) console.error('[SupabaseSync] Error updating expense:', error.message);
  } catch (err) {
    console.error('[SupabaseSync] Exception updating expense:', err);
  }
}

export async function updateRemotePaymentMilestone(id: string, updates: Partial<PaymentMilestone>): Promise<void> {
  if (!isSupabaseConfigured || isDemoMode || !supabase) return;
  try {
    const payload = cleanPayload(updates);
    const { error } = await supabase.from('payment_milestones').update(payload).eq('id', id);
    if (error) console.error('[SupabaseSync] Error updating milestone:', error.message);
  } catch (err) {
    console.error('[SupabaseSync] Exception updating milestone:', err);
  }
}

export async function persistRemoteClient(client: Client): Promise<void> {
  if (!isSupabaseConfigured || isDemoMode || !supabase) return;
  try {
    const payload = cleanPayload({
      id: client.id,
      full_name: client.full_name,
      email: client.email,
      role: 'client',
      phone: client.phone,
      property_address: client.property_address,
      city: client.city || 'Hyderabad',
      company_name: 'Homeowner',
      notes: client.notes,
      assigned_project_ids: client.project_id ? [client.project_id] : [],
    });
    const { error } = await supabase.from('profiles').upsert([payload]);
    if (error) console.error('[SupabaseSync] Error persisting client profile:', error.message);
  } catch (err) {
    console.error('[SupabaseSync] Exception persisting client profile:', err);
  }
}

export async function updateRemoteClient(id: string, updates: Partial<Client>): Promise<void> {
  if (!isSupabaseConfigured || isDemoMode || !supabase) return;
  try {
    const profileUpdates: Record<string, any> = {};
    if (updates.full_name) profileUpdates.full_name = updates.full_name;
    if (updates.email) profileUpdates.email = updates.email;
    if (updates.phone) profileUpdates.phone = updates.phone;
    if (updates.property_address) profileUpdates.property_address = updates.property_address;
    if (updates.city) profileUpdates.city = updates.city;
    if (updates.notes) profileUpdates.notes = updates.notes;
    if (updates.project_id) profileUpdates.assigned_project_ids = [updates.project_id];

    const { error } = await supabase.from('profiles').update(profileUpdates).eq('id', id);
    if (error) console.error('[SupabaseSync] Error updating client profile:', error.message);
  } catch (err) {
    console.error('[SupabaseSync] Exception updating client profile:', err);
  }
}

export async function persistRemoteTeamMember(member: UserProfile): Promise<void> {
  if (!isSupabaseConfigured || isDemoMode || !supabase) return;
  try {
    const payload = cleanPayload({
      id: member.id,
      full_name: member.full_name,
      email: member.email,
      role: member.role,
      phone: member.phone,
      avatar_url: member.avatar_url,
      company_name: member.company_name || 'StudioFlow Interiors',
      specialization: member.specialization,
      status: member.status || 'available',
      assigned_project_ids: member.assigned_project_ids || [],
    });
    const { error } = await supabase.from('profiles').upsert([payload]);
    if (error) console.error('[SupabaseSync] Error persisting team member:', error.message);
  } catch (err) {
    console.error('[SupabaseSync] Exception persisting team member:', err);
  }
}

export async function updateRemoteTeamMember(id: string, updates: Partial<UserProfile>): Promise<void> {
  if (!isSupabaseConfigured || isDemoMode || !supabase) return;
  try {
    const payload = cleanPayload(updates);
    const { error } = await supabase.from('profiles').update(payload).eq('id', id);
    if (error) console.error('[SupabaseSync] Error updating team member:', error.message);
  } catch (err) {
    console.error('[SupabaseSync] Exception updating team member:', err);
  }
}

export async function updateRemoteStudioSettings(updates: Partial<StudioSettings>): Promise<void> {
  if (!isSupabaseConfigured || isDemoMode || !supabase) return;
  try {
    const payload = cleanPayload({
      id: 'default',
      ...updates,
      updated_at: new Date().toISOString(),
    });
    const { error } = await supabase.from('studio_settings').upsert([payload]);
    if (error) console.error('[SupabaseSync] Error updating studio settings:', error.message);
  } catch (err) {
    console.error('[SupabaseSync] Exception updating studio settings:', err);
  }
}

export async function persistRemoteNotification(notif: Notification): Promise<void> {
  if (!isSupabaseConfigured || isDemoMode || !supabase) return;
  try {
    const payload = cleanPayload({
      id: notif.id,
      user_id: notif.user_id,
      project_id: notif.project_id || null,
      title: notif.title,
      message: notif.message,
      type: notif.type,
      is_read: notif.is_read,
      link: notif.link,
    });
    const { error } = await supabase.from('notifications').upsert([payload]);
    if (error) console.error('[SupabaseSync] Error persisting notification:', error.message);
  } catch (err) {
    console.error('[SupabaseSync] Exception persisting notification:', err);
  }
}

export async function updateRemoteNotification(id: string, updates: Partial<Notification>): Promise<void> {
  if (!isSupabaseConfigured || isDemoMode || !supabase) return;
  try {
    const payload = cleanPayload(updates);
    const { error } = await supabase.from('notifications').update(payload).eq('id', id);
    if (error) console.error('[SupabaseSync] Error updating notification:', error.message);
  } catch (err) {
    console.error('[SupabaseSync] Exception updating notification:', err);
  }
}

/**
 * Subscribes to Realtime Postgres changes across the tables
 */
export function subscribeToRealtime(onSync: () => void): () => void {
  if (!isSupabaseConfigured || isDemoMode || !supabase) {
    return () => {};
  }

  try {
    const channel = supabase
      .channel('studioflow-realtime-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public' },
        (payload) => {
          console.info('[SupabaseSync] Realtime change detected from postgres:', payload.table, payload.eventType);
          onSync();
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.info('[SupabaseSync] Successfully subscribed to live Supabase Postgres events');
        }
      });

    return () => {
      supabase?.removeChannel(channel);
    };
  } catch (err) {
    console.error('[SupabaseSync] Failed to setup realtime subscription:', err);
    return () => {};
  }
}
