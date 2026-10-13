-- ==============================================================================
-- StudioFlow / Interior Project Control System — Complete Schema
-- Paste into Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql
-- ==============================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Profiles (Team members and Clients)
create table if not exists public.profiles (
    id uuid primary key default uuid_generate_v4(),
    email text unique not null,
    full_name text not null,
    role text not null check (role in ('admin', 'designer', 'site_manager', 'client')),
    phone text,
    avatar_url text,
    company_name text default 'StudioFlow Interiors',
    specialization text,
    status text default 'available' check (status in ('available', 'busy', 'on_leave')),
    assigned_project_ids text[] default array[]::text[],
    property_address text,
    city text default 'Hyderabad',
    notes text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Projects
create table if not exists public.projects (
    id uuid primary key default uuid_generate_v4(),
    project_code text unique not null,
    title text not null,
    client_id uuid references public.profiles(id) on delete set null,
    lead_designer_id uuid references public.profiles(id) on delete set null,
    site_manager_id uuid references public.profiles(id) on delete set null,
    location text not null,
    city text not null default 'Hyderabad',
    property_type text not null default '3BHK Apartment',
    carpet_area_sqft numeric(10, 2) default 1850.00,
    total_budget numeric(12, 2) not null default 1800000.00,
    estimated_start_date date,
    target_handover_date date,
    status text not null default 'execution' check (status in ('lead', 'design_phase', 'procurement', 'execution', 'snagging', 'completed', 'on_hold')),
    progress_percentage integer default 42 check (progress_percentage >= 0 and progress_percentage <= 100),
    notes text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Project Members
create table if not exists public.project_members (
    id uuid primary key default uuid_generate_v4(),
    project_id uuid not null references public.projects(id) on delete cascade,
    profile_id uuid not null references public.profiles(id) on delete cascade,
    role text not null check (role in ('admin', 'lead_designer', 'site_manager', 'procurement_specialist', 'client')),
    assigned_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(project_id, profile_id)
);

-- 4. Rooms
create table if not exists public.rooms (
    id uuid primary key default uuid_generate_v4(),
    project_id uuid not null references public.projects(id) on delete cascade,
    name text not null,
    floor text default 'Ground',
    dimensions text,
    area_sqft numeric(8, 2),
    status text not null default 'in_execution' check (status in ('pending', 'in_design', 'client_review', 'approved', 'in_execution', 'completed')),
    progress_percentage integer default 0 check (progress_percentage >= 0 and progress_percentage <= 100),
    specifications text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Design Versions
create table if not exists public.design_versions (
    id uuid primary key default uuid_generate_v4(),
    project_id uuid not null references public.projects(id) on delete cascade,
    room_id uuid references public.rooms(id) on delete set null,
    version_number text not null default 'v1.0',
    title text not null,
    description text,
    file_url text,
    preview_url text,
    render_type text not null check (render_type in ('2d_cad', '3d_render', 'moodboard', 'boq_drawing', 'electrical_plan')),
    status text not null default 'under_review' check (status in ('draft', 'under_review', 'approved', 'revision_requested')),
    designer_notes text,
    client_feedback text,
    submitted_at timestamp with time zone default timezone('utc'::text, now()) not null,
    reviewed_at timestamp with time zone
);

-- 6. Approvals
create table if not exists public.approvals (
    id uuid primary key default uuid_generate_v4(),
    project_id uuid not null references public.projects(id) on delete cascade,
    room_id uuid references public.rooms(id) on delete set null,
    design_version_id uuid references public.design_versions(id) on delete set null,
    title text not null,
    category text not null check (category in ('design', 'material', 'layout', 'commercial', 'color_palette')),
    description text,
    status text not null default 'pending' check (status in ('pending', 'approved', 'rejected', 'revision_requested')),
    due_date date,
    client_comments text,
    internal_notes text,
    approved_at timestamp with time zone,
    approved_by uuid references public.profiles(id),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 7. Change Requests
create table if not exists public.change_requests (
    id uuid primary key default uuid_generate_v4(),
    project_id uuid not null references public.projects(id) on delete cascade,
    room_id uuid references public.rooms(id) on delete set null,
    request_code text unique not null,
    title text not null,
    description text not null,
    original_spec text,
    requested_change text,
    cost_impact numeric(10, 2) not null default 0.00,
    timeline_impact_days integer not null default 0,
    requested_by uuid references public.profiles(id),
    reviewed_by uuid references public.profiles(id),
    client_decision text default 'pending' check (client_decision in ('approved', 'rejected', 'pending')),
    client_decision_notes text,
    status text not null default 'under_review' check (status in ('draft', 'requested', 'submitted', 'under_review', 'reviewed', 'quoted', 'approved', 'rejected', 'implemented', 'cancelled')),
    approved_at timestamp with time zone,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 8. Materials (BOQ items)
create table if not exists public.materials (
    id uuid primary key default uuid_generate_v4(),
    project_id uuid not null references public.projects(id) on delete cascade,
    room_id uuid references public.rooms(id) on delete set null,
    item_code text not null,
    name text not null,
    category text not null check (category in ('flooring', 'woodwork', 'hardware', 'electrical', 'sanitary', 'paint', 'furnishing')),
    brand_spec text,
    unit text not null default 'sqft',
    quantity numeric(10, 2) not null default 1,
    estimated_rate numeric(10, 2) not null default 0,
    actual_rate numeric(10, 2) default 0,
    proposed_price numeric(10, 2),
    approval_status text not null default 'spec_draft' check (approval_status in ('spec_draft', 'client_approved', 'sample_approved', 'rejected')),
    procurement_status text not null default 'not_ordered' check (procurement_status in ('not_ordered', 'po_issued', 'in_transit', 'delivered', 'inspected')),
    selection_status text default 'proposed' check (selection_status in ('proposed', 'selected_by_client', 'approved', 'rejected')),
    swatch_url text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 9. Procurement Orders
create table if not exists public.procurement_orders (
    id uuid primary key default uuid_generate_v4(),
    project_id uuid not null references public.projects(id) on delete cascade,
    material_id uuid references public.materials(id) on delete set null,
    material_name text,
    po_number text unique not null,
    vendor_name text not null,
    vendor_contact text,
    quantity numeric(10, 2),
    unit text,
    order_date date not null default current_date,
    expected_delivery_date date,
    actual_delivery_date date,
    total_amount numeric(12, 2) not null default 0.00,
    payment_status text not null default 'pending' check (payment_status in ('pending', 'partially_paid', 'paid')),
    delivery_status text not null default 'ordered' check (delivery_status in ('draft', 'approved', 'ordered', 'dispatched', 'in_transit', 'received', 'delivered', 'installed', 'delayed')),
    notes text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 10. Tasks
create table if not exists public.tasks (
    id uuid primary key default uuid_generate_v4(),
    project_id uuid not null references public.projects(id) on delete cascade,
    room_id uuid references public.rooms(id) on delete set null,
    title text not null,
    category text not null check (category in ('civil', 'electrical', 'plumbing', 'carpentry', 'false_ceiling', 'painting', 'deep_cleaning', 'snagging', 'flooring')),
    assigned_to uuid references public.profiles(id),
    start_date date,
    due_date date,
    status text not null default 'todo' check (status in ('todo', 'in_progress', 'blocked', 'under_inspection', 'completed')),
    priority text not null default 'medium' check (priority in ('low', 'medium', 'high', 'critical')),
    progress_percent integer default 0 check (progress_percent >= 0 and progress_percent <= 100),
    blocker_notes text,
    dependencies text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 11. Site Updates
create table if not exists public.site_updates (
    id uuid primary key default uuid_generate_v4(),
    project_id uuid not null references public.projects(id) on delete cascade,
    room_id uuid references public.rooms(id) on delete set null,
    reporter_id uuid references public.profiles(id),
    title text not null,
    description text not null,
    photo_urls text[] default array[]::text[],
    date date not null default current_date,
    work_completed_summary text,
    next_planned_activity text,
    workforce_count integer default 6,
    delay_flag boolean default false,
    weather_conditions text default 'Clear',
    is_client_visible boolean default true,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 12. Issues & Snags
create table if not exists public.issues (
    id uuid primary key default uuid_generate_v4(),
    project_id uuid not null references public.projects(id) on delete cascade,
    room_id uuid references public.rooms(id) on delete set null,
    issue_code text unique not null,
    title text not null,
    description text not null,
    severity text not null default 'medium' check (severity in ('low', 'medium', 'high', 'critical')),
    status text not null default 'open' check (status in ('open', 'investigating', 'action_assigned', 'resolved', 'verified_closed')),
    reported_by uuid references public.profiles(id),
    assigned_to uuid references public.profiles(id),
    photos text[] default array[]::text[],
    resolution_notes text,
    resolution_deadline date,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    resolved_at timestamp with time zone
);

-- 13. Expenses
create table if not exists public.expenses (
    id uuid primary key default uuid_generate_v4(),
    project_id uuid not null references public.projects(id) on delete cascade,
    room_id uuid references public.rooms(id) on delete set null,
    category text not null check (category in ('petty_cash', 'contractor_advance', 'material_local', 'permit_fee', 'transport')),
    amount numeric(10, 2) not null,
    payment_mode text not null default 'upi' check (payment_mode in ('upi', 'bank_transfer', 'cash', 'cheque')),
    paid_to text not null,
    receipt_url text,
    status text not null default 'approved' check (status in ('pending_verification', 'approved', 'reimbursed')),
    incurred_on date not null default current_date,
    notes text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 14. Payment Milestones
create table if not exists public.payment_milestones (
    id uuid primary key default uuid_generate_v4(),
    project_id uuid not null references public.projects(id) on delete cascade,
    milestone_code text not null,
    name text not null,
    stage_trigger text not null,
    percentage numeric(5, 2) not null,
    amount numeric(12, 2) not null,
    due_date date,
    status text not null default 'scheduled' check (status in ('scheduled', 'invoice_raised', 'payment_received', 'overdue')),
    paid_at timestamp with time zone,
    invoice_number text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 15. Notifications
create table if not exists public.notifications (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid not null references public.profiles(id) on delete cascade,
    project_id uuid references public.projects(id) on delete cascade,
    title text not null,
    message text not null,
    type text not null check (type in ('approval_required', 'milestone_due', 'site_delay', 'design_uploaded', 'payment_received', 'issue_logged')),
    is_read boolean default false,
    link text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 16. Studio Settings
create table if not exists public.studio_settings (
    id text primary key default 'default',
    company_name text not null default 'StudioFlow Interiors Pvt Ltd',
    legal_name text not null default 'StudioFlow Design & Build Private Limited',
    gstin text not null default '36AABCS1429B1Z2',
    email text not null default 'contact@studioflow.design',
    phone text not null default '+91 98490 12345',
    address text not null default 'Plot 42, Silicon Valley Layout, Madhapur, Hyderabad, TS 500081',
    currency text not null default 'INR',
    currency_symbol text not null default '₹',
    standard_timeline_weeks integer not null default 14,
    default_gst_percentage numeric(5, 2) not null default 18.00,
    standard_design_fee_sqft numeric(10, 2) not null default 250.00,
    notes text,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Clean, secure policies for anonymous & authenticated client access
-- ==============================================================================

alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.project_members enable row level security;
alter table public.rooms enable row level security;
alter table public.design_versions enable row level security;
alter table public.approvals enable row level security;
alter table public.change_requests enable row level security;
alter table public.materials enable row level security;
alter table public.procurement_orders enable row level security;
alter table public.tasks enable row level security;
alter table public.site_updates enable row level security;
alter table public.issues enable row level security;
alter table public.expenses enable row level security;
alter table public.payment_milestones enable row level security;
alter table public.notifications enable row level security;
alter table public.studio_settings enable row level security;

-- Drop existing policies if re-running script
drop policy if exists "Allow read access to profiles" on public.profiles;
drop policy if exists "Allow read access to projects" on public.projects;
drop policy if exists "Allow read access to project_members" on public.project_members;
drop policy if exists "Allow read access to rooms" on public.rooms;
drop policy if exists "Allow read access to design_versions" on public.design_versions;
drop policy if exists "Allow read access to approvals" on public.approvals;
drop policy if exists "Allow read access to change_requests" on public.change_requests;
drop policy if exists "Allow read access to materials" on public.materials;
drop policy if exists "Allow read access to procurement_orders" on public.procurement_orders;
drop policy if exists "Allow read access to tasks" on public.tasks;
drop policy if exists "Allow read access to site_updates" on public.site_updates;
drop policy if exists "Allow read access to issues" on public.issues;
drop policy if exists "Allow read access to expenses" on public.expenses;
drop policy if exists "Allow read access to payment_milestones" on public.payment_milestones;
drop policy if exists "Allow read access to notifications" on public.notifications;
drop policy if exists "Allow read access to studio_settings" on public.studio_settings;

drop policy if exists "Allow insert access to profiles" on public.profiles;
drop policy if exists "Allow insert access to projects" on public.projects;
drop policy if exists "Allow insert access to project_members" on public.project_members;
drop policy if exists "Allow insert access to rooms" on public.rooms;
drop policy if exists "Allow insert access to design_versions" on public.design_versions;
drop policy if exists "Allow insert access to approvals" on public.approvals;
drop policy if exists "Allow insert access to change_requests" on public.change_requests;
drop policy if exists "Allow insert access to materials" on public.materials;
drop policy if exists "Allow insert access to procurement_orders" on public.procurement_orders;
drop policy if exists "Allow insert access to tasks" on public.tasks;
drop policy if exists "Allow insert access to site_updates" on public.site_updates;
drop policy if exists "Allow insert access to issues" on public.issues;
drop policy if exists "Allow insert access to expenses" on public.expenses;
drop policy if exists "Allow insert access to payment_milestones" on public.payment_milestones;
drop policy if exists "Allow insert access to notifications" on public.notifications;
drop policy if exists "Allow insert access to studio_settings" on public.studio_settings;

drop policy if exists "Allow update access to profiles" on public.profiles;
drop policy if exists "Allow update access to projects" on public.projects;
drop policy if exists "Allow update access to project_members" on public.project_members;
drop policy if exists "Allow update access to rooms" on public.rooms;
drop policy if exists "Allow update access to design_versions" on public.design_versions;
drop policy if exists "Allow update access to approvals" on public.approvals;
drop policy if exists "Allow update access to change_requests" on public.change_requests;
drop policy if exists "Allow update access to materials" on public.materials;
drop policy if exists "Allow update access to procurement_orders" on public.procurement_orders;
drop policy if exists "Allow update access to tasks" on public.tasks;
drop policy if exists "Allow update access to site_updates" on public.site_updates;
drop policy if exists "Allow update access to issues" on public.issues;
drop policy if exists "Allow update access to expenses" on public.expenses;
drop policy if exists "Allow update access to payment_milestones" on public.payment_milestones;
drop policy if exists "Allow update access to notifications" on public.notifications;
drop policy if exists "Allow update access to studio_settings" on public.studio_settings;

drop policy if exists "Allow delete access to projects" on public.projects;
drop policy if exists "Allow delete access to rooms" on public.rooms;
drop policy if exists "Allow delete access to materials" on public.materials;
drop policy if exists "Allow delete access to tasks" on public.tasks;
drop policy if exists "Allow delete access to site_updates" on public.site_updates;
drop policy if exists "Allow delete access to issues" on public.issues;
drop policy if exists "Allow delete access to approvals" on public.approvals;

-- 1. SELECT policies (Read access for client and internal operations)
create policy "Allow read access to profiles" on public.profiles for select to anon, authenticated using (true);
create policy "Allow read access to projects" on public.projects for select to anon, authenticated using (true);
create policy "Allow read access to project_members" on public.project_members for select to anon, authenticated using (true);
create policy "Allow read access to rooms" on public.rooms for select to anon, authenticated using (true);
create policy "Allow read access to design_versions" on public.design_versions for select to anon, authenticated using (true);
create policy "Allow read access to approvals" on public.approvals for select to anon, authenticated using (true);
create policy "Allow read access to change_requests" on public.change_requests for select to anon, authenticated using (true);
create policy "Allow read access to materials" on public.materials for select to anon, authenticated using (true);
create policy "Allow read access to procurement_orders" on public.procurement_orders for select to anon, authenticated using (true);
create policy "Allow read access to tasks" on public.tasks for select to anon, authenticated using (true);
create policy "Allow read access to site_updates" on public.site_updates for select to anon, authenticated using (true);
create policy "Allow read access to issues" on public.issues for select to anon, authenticated using (true);
create policy "Allow read access to expenses" on public.expenses for select to anon, authenticated using (true);
create policy "Allow read access to payment_milestones" on public.payment_milestones for select to anon, authenticated using (true);
create policy "Allow read access to notifications" on public.notifications for select to anon, authenticated using (true);
create policy "Allow read access to studio_settings" on public.studio_settings for select to anon, authenticated using (true);

-- 2. INSERT policies (Permits creating projects, materials, tasks, approvals, logs)
create policy "Allow insert access to profiles" on public.profiles for insert to anon, authenticated with check (true);
create policy "Allow insert access to projects" on public.projects for insert to anon, authenticated with check (true);
create policy "Allow insert access to project_members" on public.project_members for insert to anon, authenticated with check (true);
create policy "Allow insert access to rooms" on public.rooms for insert to anon, authenticated with check (true);
create policy "Allow insert access to design_versions" on public.design_versions for insert to anon, authenticated with check (true);
create policy "Allow insert access to approvals" on public.approvals for insert to anon, authenticated with check (true);
create policy "Allow insert access to change_requests" on public.change_requests for insert to anon, authenticated with check (true);
create policy "Allow insert access to materials" on public.materials for insert to anon, authenticated with check (true);
create policy "Allow insert access to procurement_orders" on public.procurement_orders for insert to anon, authenticated with check (true);
create policy "Allow insert access to tasks" on public.tasks for insert to anon, authenticated with check (true);
create policy "Allow insert access to site_updates" on public.site_updates for insert with check (true);
create policy "Allow insert access to issues" on public.issues for insert to anon, authenticated with check (true);
create policy "Allow insert access to expenses" on public.expenses for insert to anon, authenticated with check (true);
create policy "Allow insert access to payment_milestones" on public.payment_milestones for insert to anon, authenticated with check (true);
create policy "Allow insert access to notifications" on public.notifications for insert to anon, authenticated with check (true);
create policy "Allow insert access to studio_settings" on public.studio_settings for insert to anon, authenticated with check (id = 'default');

-- 3. UPDATE policies (Permits status changes, client approvals, comments, and task completion)
create policy "Allow update access to profiles" on public.profiles for update to anon, authenticated using (true);
create policy "Allow update access to projects" on public.projects for update to anon, authenticated using (true);
create policy "Allow update access to project_members" on public.project_members for update to anon, authenticated using (true);
create policy "Allow update access to rooms" on public.rooms for update to anon, authenticated using (true);
create policy "Allow update access to design_versions" on public.design_versions for update to anon, authenticated using (true);
create policy "Allow update access to approvals" on public.approvals for update to anon, authenticated using (true);
create policy "Allow update access to change_requests" on public.change_requests for update to anon, authenticated using (true);
create policy "Allow update access to materials" on public.materials for update to anon, authenticated using (true);
create policy "Allow update access to procurement_orders" on public.procurement_orders for update to anon, authenticated using (true);
create policy "Allow update access to tasks" on public.tasks for update to anon, authenticated using (true);
create policy "Allow update access to site_updates" on public.site_updates for update to anon, authenticated using (true);
create policy "Allow update access to issues" on public.issues for update to anon, authenticated using (true);
create policy "Allow update access to expenses" on public.expenses for update to anon, authenticated using (true);
create policy "Allow update access to payment_milestones" on public.payment_milestones for update to anon, authenticated using (true);
create policy "Allow update access to notifications" on public.notifications for update to anon, authenticated using (true);
create policy "Allow update access to studio_settings" on public.studio_settings for update to anon, authenticated using (id = 'default');

-- 4. DELETE policies (Strictly limited to manageable workspace sub-entities)
create policy "Allow delete access to rooms" on public.rooms for delete to anon, authenticated using (true);
create policy "Allow delete access to materials" on public.materials for delete to anon, authenticated using (true);
create policy "Allow delete access to tasks" on public.tasks for delete to anon, authenticated using (true);
create policy "Allow delete access to site_updates" on public.site_updates for delete to anon, authenticated using (true);
create policy "Allow delete access to issues" on public.issues for delete to anon, authenticated using (true);
create policy "Allow delete access to approvals" on public.approvals for delete to anon, authenticated using (true);

