-- ==============================================================================
-- StudioFlow / Interior Project Control System — Initial Schema
-- Migration: 01_initial_schema.sql
-- ==============================================================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Profiles (Users across Admin, Designers, Site Managers, Clients)
create table if not exists public.profiles (
    id uuid primary key default uuid_generate_v4(),
    email text unique not null,
    full_name text not null,
    role text not null check (role in ('admin', 'designer', 'site_manager', 'client')),
    phone text,
    avatar_url text,
    company_name text default 'StudioFlow Interiors',
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Projects (Core project tracking)
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

-- 3. Project Members (Team assignments)
create table if not exists public.project_members (
    id uuid primary key default uuid_generate_v4(),
    project_id uuid not null references public.projects(id) on delete cascade,
    profile_id uuid not null references public.profiles(id) on delete cascade,
    role text not null check (role in ('admin', 'lead_designer', 'site_manager', 'procurement_specialist', 'client')),
    assigned_at timestamp with time zone default timezone('utc'::text, now()) not null,
    unique(project_id, profile_id)
);

-- 4. Rooms (Living Room, Kitchen, Master Bed, etc.)
create table if not exists public.rooms (
    id uuid primary key default uuid_generate_v4(),
    project_id uuid not null references public.projects(id) on delete cascade,
    name text not null,
    floor text default 'Ground',
    dimensions text,
    area_sqft numeric(8, 2),
    status text not null default 'in_execution' check (status in ('pending', 'in_design', 'client_review', 'approved', 'in_execution', 'completed')),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Design Versions (2D CAD, 3D Renders, Moodboards)
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

-- 6. Approvals (Formal client sign-offs)
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
    approved_at timestamp with time zone,
    approved_by uuid references public.profiles(id),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 7. Change Requests (Variations affecting budget/timeline)
create table if not exists public.change_requests (
    id uuid primary key default uuid_generate_v4(),
    project_id uuid not null references public.projects(id) on delete cascade,
    room_id uuid references public.rooms(id) on delete set null,
    request_code text unique not null,
    title text not null,
    description text not null,
    cost_impact numeric(10, 2) not null default 0.00,
    timeline_impact_days integer not null default 0,
    requested_by uuid references public.profiles(id),
    status text not null default 'under_review' check (status in ('draft', 'submitted', 'under_review', 'approved', 'rejected')),
    approved_at timestamp with time zone,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 8. Materials (BOQ line items and finishes)
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
    approval_status text not null default 'spec_draft' check (approval_status in ('spec_draft', 'client_approved', 'sample_approved', 'rejected')),
    procurement_status text not null default 'not_ordered' check (procurement_status in ('not_ordered', 'po_issued', 'in_transit', 'delivered', 'inspected')),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 9. Procurement Orders (Purchase orders to suppliers)
create table if not exists public.procurement_orders (
    id uuid primary key default uuid_generate_v4(),
    project_id uuid not null references public.projects(id) on delete cascade,
    po_number text unique not null,
    vendor_name text not null,
    vendor_contact text,
    order_date date not null default current_date,
    expected_delivery_date date,
    actual_delivery_date date,
    total_amount numeric(12, 2) not null default 0.00,
    payment_status text not null default 'pending' check (payment_status in ('pending', 'partially_paid', 'paid')),
    delivery_status text not null default 'ordered' check (delivery_status in ('draft', 'ordered', 'dispatched', 'received', 'delayed')),
    notes text,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 10. Tasks (Site schedule & trade workflows)
create table if not exists public.tasks (
    id uuid primary key default uuid_generate_v4(),
    project_id uuid not null references public.projects(id) on delete cascade,
    room_id uuid references public.rooms(id) on delete set null,
    title text not null,
    category text not null check (category in ('civil', 'electrical', 'plumbing', 'carpentry', 'false_ceiling', 'painting', 'deep_cleaning', 'snagging')),
    assigned_to uuid references public.profiles(id),
    start_date date,
    due_date date,
    status text not null default 'todo' check (status in ('todo', 'in_progress', 'blocked', 'under_inspection', 'completed')),
    priority text not null default 'medium' check (priority in ('low', 'medium', 'high', 'critical')),
    progress_percent integer default 0 check (progress_percent >= 0 and progress_percent <= 100),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 11. Site Updates (Daily logs and on-site photos)
create table if not exists public.site_updates (
    id uuid primary key default uuid_generate_v4(),
    project_id uuid not null references public.projects(id) on delete cascade,
    reporter_id uuid references public.profiles(id),
    title text not null,
    description text not null,
    photo_urls text[] default array[]::text[],
    date date not null default current_date,
    work_completed_summary text,
    workforce_count integer default 6,
    delay_flag boolean default false,
    weather_conditions text default 'Clear',
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 12. Issues & Snags (Quality defects and blockers)
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
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    resolved_at timestamp with time zone
);

-- 13. Expenses (Petty cash & site expenses)
create table if not exists public.expenses (
    id uuid primary key default uuid_generate_v4(),
    project_id uuid not null references public.projects(id) on delete cascade,
    category text not null check (category in ('petty_cash', 'contractor_advance', 'material_local', 'permit_fee', 'transport')),
    amount numeric(10, 2) not null,
    payment_mode text not null default 'upi' check (payment_mode in ('upi', 'bank_transfer', 'cash', 'cheque')),
    paid_to text not null,
    receipt_url text,
    status text not null default 'approved' check (status in ('pending_verification', 'approved', 'reimbursed')),
    incurred_on date not null default current_date,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 14. Payment Milestones (Commercial schedules)
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

-- 15. Notifications (Alerts and activity feeds)
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

-- Indexes for performance
create index if not exists idx_projects_client_id on public.projects(client_id);
create index if not exists idx_rooms_project_id on public.rooms(project_id);
create index if not exists idx_design_versions_project_id on public.design_versions(project_id);
create index if not exists idx_approvals_project_id on public.approvals(project_id);
create index if not exists idx_materials_project_id on public.materials(project_id);
create index if not exists idx_tasks_project_id on public.tasks(project_id);
create index if not exists idx_site_updates_project_id on public.site_updates(project_id);
create index if not exists idx_issues_project_id on public.issues(project_id);
create index if not exists idx_payment_milestones_project_id on public.payment_milestones(project_id);
create index if not exists idx_notifications_user_id on public.notifications(user_id);

-- Row Level Security (RLS) Setup
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

-- Basic RLS Policies (allows authenticated and anon demo access as configured)
create policy "Allow read access to profiles" on public.profiles for select using (true);
create policy "Allow read access to projects" on public.projects for select using (true);
create policy "Allow write access to projects" on public.projects for all using (true);
create policy "Allow read access to rooms" on public.rooms for select using (true);
create policy "Allow all access to design_versions" on public.design_versions for all using (true);
create policy "Allow all access to approvals" on public.approvals for all using (true);
create policy "Allow all access to materials" on public.materials for all using (true);
create policy "Allow all access to tasks" on public.tasks for all using (true);
create policy "Allow all access to site_updates" on public.site_updates for all using (true);
create policy "Allow all access to issues" on public.issues for all using (true);
create policy "Allow all access to payment_milestones" on public.payment_milestones for all using (true);
create policy "Allow all access to notifications" on public.notifications for all using (true);
