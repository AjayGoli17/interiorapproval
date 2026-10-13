# StudioFlow — Interior Project Control System

A minimal, professional, and intuitive operations platform for interior architecture and design firms.

Designed for studio directors, interior designers, site engineers, and homeowners.

---

## Tech Stack

- **React 18** + **Vite 6** + **TypeScript**
- **Tailwind CSS** with warm architectural palette (stone off-whites, charcoal text, muted-green accent)
- **shadcn/ui** design system components
- **Lucide React** icons
- **React Router v6**
- **Zustand** state management & demo data store
- **Supabase** database schema, migrations & data-access services
- **Recharts** dashboards

---

## Application Architecture & 22 Logical Screens

### 1. Admin Panel (8 Screens) — `/admin/*`
1. **Executive Dashboard** (`/admin/dashboard`) — Studio-wide KPIs, active project count, stage distribution, revenue pipeline.
2. **Projects Directory** (`/admin/projects`) — Portfolio directory, stage tracking, project budgets, and creation entries.
3. **Client Accounts** (`/admin/clients`) — Homeowner directory, contact details, assigned projects.
4. **Team & Resource Allocation** (`/admin/team`) — Designers & site managers workload capacity and project staffing.
5. **Financial Overview & P&L** (`/admin/finance`) — Studio cashflow, milestone receivables, vendor payables, gross margins.
6. **Procurement & Vendor Master** (`/admin/procurement`) — Master vendor list, purchase orders (PO), delivery schedules.
7. **Change Requests & Margin Control** (`/admin/change-requests`) — Studio variation orders, timeline impact, client approvals.
8. **Studio Settings & Rate Cards** (`/admin/settings`) — Firm profile, GST details, standard milestone schedules.

### 2. Project Team Panel (9 Screens) — `/team/*`
1. **Team Workspace Dashboard** (`/team/dashboard`) — Daily priorities, site visits, pending design submissions.
2. **Project Specs & Room Specs** (`/team/project-overview`) — Room dimensions, floor areas, scope checklist.
3. **Design Studio & Version Control** (`/team/designs`) — 2D CAD layouts, 3D renders, moodboard revisions.
4. **Client Approvals Tracker** (`/team/approvals`) — Formal sign-off tracker for layouts, materials, and colors.
5. **Material Specifications & BOQ** (`/team/materials`) — Bill of Quantities, brand specs, unit quantities, sample approvals.
6. **Site Execution & Daily Logs** (`/team/execution`) — Daily contractor attendance, site photos, daily supervisor logs.
7. **Task & Schedule Management** (`/team/tasks`) — Trade schedule checklist (civil, electrical, plumbing, carpentry, painting).
8. **Snag List & Issue Tracker** (`/team/issues`) — Defect identification, punch list tracking, severity assignments.
9. **Project Expenses & Measurements** (`/team/expenses`) — On-site petty cash records, contractor cash advances.

### 3. Client Portal (5 Screens) — `/client/*`
1. **Client Portal Home** (`/client/dashboard`) — Welcome screen, overall progress (45%), active trade stage.
2. **Design Presentation & 3D Views** (`/client/designs`) — High-res 3D photorealistic renderings and room moodboards.
3. **Approvals & Decisions** (`/client/approvals`) — Actionable sign-off queue with one-click approval & revision feedback.
4. **Live Site Progress** (`/client/progress`) — Chronological photo updates from site inspections.
5. **Quotation & Payment Schedule** (`/client/payments`) — Milestone payment schedule, invoice downloads, balance dues.

### Demo Hub
- **Demo Access Hub** (`/`) — Entry portal with role switch cards and seed project summary.

---

## Seed Dataset

**Rahul Sharma — 3BHK Apartment**
- **Location:** Flat 1204, Tower B, Aparna Sarovar Grande, Nallagandla, Hyderabad
- **Total Budget:** ₹18,00,000
- **Carpet Area:** 1,850 sqft
- **Configured Rooms:**
  1. Living & Dining Room (384 sqft)
  2. Modular Kitchen (140 sqft)
  3. Master Bedroom (224 sqft)
  4. Bedroom 2 — Kids Room (168 sqft)
  5. Bedroom 3 — Study / Guest (143 sqft)
- **Milestones (₹18,00,000 total):**
  - MS-01: Booking & Concept (10% / ₹1,80,000) — *Paid*
  - MS-02: Civil & False Ceiling (25% / ₹4,50,000) — *Paid*
  - MS-03: Modular Woodwork Carcass (35% / ₹6,30,000) — *Invoice Raised*
  - MS-04: Countertops & Painting (20% / ₹3,60,000) — *Scheduled*
  - MS-05: Final Handover (10% / ₹1,80,000) — *Scheduled*

---

## Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
The app will start on `http://localhost:5173`.

### 3. Build for Production
```bash
npm run build
```

---

## Supabase Setup (Optional for Demo Mode)

By default, the application runs out-of-the-box using the built-in **Local Demo Store Adapter** (`VITE_USE_LOCAL_DEMO_DATA=true`), so no database provisioning is required to evaluate the demo.

To connect your own Supabase instance:
1. Create a project at [supabase.com](https://supabase.com).
2. Go to the SQL Editor in Supabase and execute `supabase/schema.sql`.
3. Execute `supabase/seed.sql` to populate the Rahul Sharma 3BHK dataset.
4. Copy your Supabase URL and anon public key to `.env`:
   ```env
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
   VITE_USE_LOCAL_DEMO_DATA=false
   ```
5. Restart Vite (`npm run dev`).
