// ==============================================================================
// StudioFlow — Core Type Definitions
// ==============================================================================

export type UserRole = 'admin' | 'designer' | 'site_manager' | 'client';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  phone?: string;
  avatar_url?: string;
  company_name?: string;
  specialization?: string;
  status?: 'available' | 'busy' | 'on_leave';
  assigned_project_ids?: string[];
  created_at?: string;
}

export interface Client {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  property_address: string;
  city: string;
  project_id?: string;
  avatar_url?: string;
  notes?: string;
  created_at?: string;
}

export type ProjectStatus =
  | 'lead'
  | 'design_phase'
  | 'procurement'
  | 'execution'
  | 'snagging'
  | 'completed'
  | 'on_hold';

export interface Project {
  id: string;
  project_code: string;
  title: string;
  client_id?: string;
  lead_designer_id?: string;
  site_manager_id?: string;
  location: string;
  city: string;
  property_type: string;
  carpet_area_sqft: number;
  total_budget: number;
  estimated_start_date: string;
  target_handover_date: string;
  status: ProjectStatus;
  progress_percentage: number;
  notes?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Room {
  id: string;
  project_id: string;
  name: string;
  floor?: string;
  dimensions?: string;
  area_sqft?: number;
  status: 'pending' | 'in_design' | 'client_review' | 'approved' | 'in_execution' | 'completed';
  progress_percentage?: number;
  specifications?: string;
  created_at?: string;
}

export interface DesignVersion {
  id: string;
  project_id: string;
  room_id?: string;
  version_number: string;
  title: string;
  description?: string;
  file_url?: string;
  preview_url?: string;
  render_type: '2d_cad' | '3d_render' | 'moodboard' | 'boq_drawing' | 'electrical_plan';
  status: 'draft' | 'under_review' | 'approved' | 'revision_requested';
  designer_notes?: string;
  client_feedback?: string;
  submitted_at: string;
  reviewed_at?: string;
}

export interface Approval {
  id: string;
  project_id: string;
  room_id?: string;
  design_version_id?: string;
  title: string;
  category: 'design' | 'material' | 'layout' | 'commercial' | 'color_palette';
  description?: string;
  status: 'pending' | 'approved' | 'rejected' | 'revision_requested';
  due_date?: string;
  client_comments?: string;
  internal_notes?: string;
  approved_at?: string;
  approved_by?: string;
  created_at?: string;
}

export type ChangeRequestStatus =
  | 'draft'
  | 'requested'
  | 'submitted'
  | 'under_review'
  | 'reviewed'
  | 'quoted'
  | 'approved'
  | 'rejected'
  | 'implemented'
  | 'cancelled';

export interface ChangeRequest {
  id: string;
  project_id: string;
  room_id?: string;
  request_code: string;
  title: string;
  description: string;
  original_spec?: string;
  requested_change?: string;
  cost_impact: number;
  timeline_impact_days: number;
  requested_by?: string;
  reviewed_by?: string;
  client_decision?: 'approved' | 'rejected' | 'pending';
  client_decision_notes?: string;
  status: ChangeRequestStatus;
  approved_at?: string;
  created_at?: string;
}

export interface Material {
  id: string;
  project_id: string;
  room_id?: string;
  item_code: string;
  name: string;
  category: 'flooring' | 'woodwork' | 'hardware' | 'electrical' | 'sanitary' | 'paint' | 'furnishing';
  brand_spec?: string;
  unit: string;
  quantity: number;
  estimated_rate: number;
  actual_rate: number;
  approval_status: 'spec_draft' | 'client_approved' | 'sample_approved' | 'rejected';
  procurement_status: 'not_ordered' | 'po_issued' | 'in_transit' | 'delivered' | 'inspected';
  selection_status?: 'proposed' | 'selected_by_client' | 'approved' | 'rejected';
  proposed_price?: number;
  swatch_url?: string;
  created_at?: string;
}

export type ProcurementDeliveryStatus =
  | 'draft'
  | 'approved'
  | 'ordered'
  | 'dispatched'
  | 'in_transit'
  | 'received'
  | 'delivered'
  | 'installed'
  | 'delayed';

export interface ProcurementOrder {
  id: string;
  project_id: string;
  material_id?: string;
  material_name?: string;
  po_number: string;
  vendor_name: string;
  vendor_contact?: string;
  quantity?: number;
  unit?: string;
  order_date: string;
  expected_delivery_date?: string;
  actual_delivery_date?: string;
  total_amount: number;
  payment_status: 'pending' | 'partially_paid' | 'paid';
  delivery_status: ProcurementDeliveryStatus;
  notes?: string;
  created_at?: string;
}

export interface Task {
  id: string;
  project_id: string;
  room_id?: string;
  title: string;
  category: 'civil' | 'electrical' | 'plumbing' | 'carpentry' | 'false_ceiling' | 'painting' | 'deep_cleaning' | 'snagging' | 'flooring';
  assigned_to?: string;
  start_date?: string;
  due_date?: string;
  status: 'todo' | 'in_progress' | 'blocked' | 'under_inspection' | 'completed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  progress_percent: number;
  blocker_notes?: string;
  dependencies?: string;
  created_at?: string;
}

export interface SiteUpdate {
  id: string;
  project_id: string;
  room_id?: string;
  reporter_id?: string;
  title: string;
  description: string;
  photo_urls: string[];
  date: string;
  work_completed_summary?: string;
  next_planned_activity?: string;
  workforce_count: number;
  delay_flag: boolean;
  weather_conditions?: string;
  is_client_visible?: boolean;
  created_at?: string;
}

export interface Issue {
  id: string;
  project_id: string;
  room_id?: string;
  issue_code: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'investigating' | 'action_assigned' | 'resolved' | 'verified_closed';
  reported_by?: string;
  assigned_to?: string;
  photos?: string[];
  resolution_notes?: string;
  resolution_deadline?: string;
  created_at?: string;
  resolved_at?: string;
}

export interface Expense {
  id: string;
  project_id: string;
  room_id?: string;
  category: 'petty_cash' | 'contractor_advance' | 'material_local' | 'permit_fee' | 'transport';
  amount: number;
  payment_mode: 'upi' | 'bank_transfer' | 'cash' | 'cheque';
  paid_to: string;
  receipt_url?: string;
  status: 'pending_verification' | 'approved' | 'reimbursed';
  incurred_on: string;
  notes?: string;
  created_at?: string;
}

export interface PaymentMilestone {
  id: string;
  project_id: string;
  milestone_code: string;
  name: string;
  stage_trigger: string;
  percentage: number;
  amount: number;
  due_date?: string;
  status: 'scheduled' | 'invoice_raised' | 'payment_received' | 'overdue';
  paid_at?: string;
  invoice_number?: string;
  created_at?: string;
}

export interface Notification {
  id: string;
  user_id: string;
  project_id?: string;
  title: string;
  message: string;
  type: 'approval_required' | 'milestone_due' | 'site_delay' | 'design_uploaded' | 'payment_received' | 'issue_logged';
  is_read: boolean;
  link?: string;
  created_at: string;
}

export interface StudioSettings {
  company_name: string;
  legal_name: string;
  gstin: string;
  email: string;
  phone: string;
  address: string;
  currency: string;
  currency_symbol: string;
  standard_timeline_weeks: number;
  default_gst_percentage: number;
  standard_design_fee_sqft: number;
  notes?: string;
}
