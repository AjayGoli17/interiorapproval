-- ==============================================================================
-- StudioFlow / Interior Project Control System — Complete Seed Data
-- Paste into Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql
-- ==============================================================================

DO $$
DECLARE
    -- User IDs
    v_admin_id uuid := '11111111-1111-4111-8111-111111111111';
    v_designer_id uuid := '22222222-2222-4222-8222-222222222222';
    v_site_mgr_id uuid := '44444444-4444-4444-8444-444444444444';
    v_designer_2_id uuid := '55555555-5555-4555-8555-555555555555';
    v_client_id uuid := '33333333-3333-4333-8333-333333333333';
    v_client_2_id uuid := '33333333-bbbb-4333-8333-bbbbbbbbbbbb';
    v_client_3_id uuid := '33333333-cccc-4333-8333-cccccccccccc';
    
    -- Project IDs
    v_project_id uuid := 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
    v_project_2_id uuid := 'aaaaaaaa-bbbb-4aaa-8aaa-bbbbbbbbbbbb';
    v_project_3_id uuid := 'aaaaaaaa-cccc-4aaa-8aaa-cccccccccccc';
    
    -- Room IDs for Project 1
    v_living_id uuid := 'bbbbbbbb-0001-4bbb-8bbb-bbbbbbbbbbbb';
    v_kitchen_id uuid := 'bbbbbbbb-0002-4bbb-8bbb-bbbbbbbbbbbb';
    v_master_id uuid := 'bbbbbbbb-0003-4bbb-8bbb-bbbbbbbbbbbb';
    v_bed2_id uuid := 'bbbbbbbb-0004-4bbb-8bbb-bbbbbbbbbbbb';
    v_bed3_id uuid := 'bbbbbbbb-0005-4bbb-8bbb-bbbbbbbbbbbb';

    -- Design Version IDs
    v_design_living_v2 uuid := 'cccccccc-0001-4ccc-8ccc-cccccccccccc';
    v_design_kitchen_v1 uuid := 'cccccccc-0002-4ccc-8ccc-cccccccccccc';
    v_design_master_v1 uuid := 'cccccccc-0003-4ccc-8ccc-cccccccccccc';

BEGIN
    -- 1. Profiles (Team and Clients)
    insert into public.profiles (id, email, full_name, role, phone, avatar_url, company_name, specialization, status, assigned_project_ids, property_address, city)
    values
        (v_admin_id, 'priya.nair@studioflow.design', 'Priya Nair', 'admin', '+91 98490 12345', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150', 'StudioFlow Interiors', 'Principal Architect & Studio Director', 'available', array[v_project_id::text, v_project_2_id::text, v_project_3_id::text], null, 'Hyderabad'),
        (v_designer_id, 'arjun.mehta@studioflow.design', 'Arjun Mehta', 'designer', '+91 98490 23456', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', 'StudioFlow Interiors', 'Senior Interior Designer & Millwork Lead', 'busy', array[v_project_id::text, v_project_2_id::text], null, 'Hyderabad'),
        (v_site_mgr_id, 'suresh.rao@studioflow.design', 'Suresh Rao', 'site_manager', '+91 98490 44556', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', 'StudioFlow Interiors', 'Senior Site Execution Engineer (Civil & MEP)', 'busy', array[v_project_id::text, v_project_2_id::text], null, 'Hyderabad'),
        (v_designer_2_id, 'kavita.sundaram@studioflow.design', 'Kavita Sundaram', 'designer', '+91 98490 67890', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150', 'StudioFlow Interiors', '3D Visualizer & FF&E Specialist', 'available', array[v_project_2_id::text, v_project_3_id::text], null, 'Hyderabad'),
        (v_client_id, 'rahul.sharma@gmail.com', 'Rahul Sharma', 'client', '+91 98490 34567', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', 'Homeowner', null, 'available', array[v_project_id::text], 'Flat 1204, Tower B, Aparna Sarovar Grande, Nallagandla', 'Hyderabad'),
        (v_client_2_id, 'ananya.reddy@gmail.com', 'Ananya Reddy', 'client', '+91 98490 99887', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150', 'Homeowner', null, 'available', array[v_project_2_id::text], 'Villa 42, Palm Meadows, Gachibowli', 'Hyderabad'),
        (v_client_3_id, 'vikram.varma@techventures.io', 'Vikramaditya & Sneha Varma', 'client', '+91 99890 55443', 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150', 'Homeowner', null, 'available', array[v_project_3_id::text], 'Penthouse 2101, Jayabheri The Peak, Financial District', 'Hyderabad')
    on conflict (id) do update set
        full_name = excluded.full_name,
        role = excluded.role,
        company_name = excluded.company_name;

    -- 2. Projects
    insert into public.projects (
        id, project_code, title, client_id, lead_designer_id, site_manager_id,
        location, city, property_type, carpet_area_sqft, total_budget,
        estimated_start_date, target_handover_date, status, progress_percentage, notes
    )
    values
        (v_project_id, 'PRJ-HYD-2601', 'Rahul Sharma — 3BHK Apartment',
         v_client_id, v_designer_id, v_site_mgr_id,
         'Flat 1204, Tower B, Aparna Sarovar Grande, Nallagandla', 'Hyderabad', '3BHK Apartment', 1850.00, 1834500.00,
         '2026-08-15', '2026-11-30', 'execution', 45,
         'Turnkey interior transformation with bespoke oak veneer cabinetry, quartz countertops, and concealed architectural warm lighting.'),
        (v_project_2_id, 'PRJ-HYD-2602', 'Ananya Reddy — 4BHK Villa',
         v_client_2_id, v_designer_2_id, v_site_mgr_id,
         'Villa 42, Palm Meadows, Gachibowli', 'Hyderabad', '4BHK Duplex Villa', 3400.00, 4200000.00,
         '2026-09-01', '2027-02-28', 'design_phase', 20,
         'Contemporary minimalist villa with Italian marble and double-height living foyer.'),
        (v_project_3_id, 'PRJ-HYD-2603', 'Vikramaditya Varma — Penthouse',
         v_client_3_id, v_designer_id, v_site_mgr_id,
         'Penthouse 2101, Jayabheri The Peak, Financial District', 'Hyderabad', 'Penthouse', 4100.00, 3500000.00,
         '2026-11-01', '2027-04-30', 'lead', 10,
         'Turnkey luxury penthouse, smart lighting, automated acoustic wall panelling.')
    on conflict (id) do update set
        title = excluded.title,
        total_budget = excluded.total_budget,
        progress_percentage = excluded.progress_percentage;

    -- 3. Project Members
    insert into public.project_members (project_id, profile_id, role)
    values
        (v_project_id, v_admin_id, 'admin'),
        (v_project_id, v_designer_id, 'lead_designer'),
        (v_project_id, v_site_mgr_id, 'site_manager'),
        (v_project_id, v_client_id, 'client'),
        (v_project_2_id, v_admin_id, 'admin'),
        (v_project_2_id, v_designer_2_id, 'lead_designer'),
        (v_project_2_id, v_client_2_id, 'client')
    on conflict do nothing;

    -- 4. Rooms
    insert into public.rooms (id, project_id, name, floor, dimensions, area_sqft, status, progress_percentage, specifications)
    values
        (v_living_id, v_project_id, 'Living & Dining Room', '12th Floor', '24 ft x 16 ft', 384.00, 'in_execution', 65, 'Botticino Italian marble flooring, Saint-Gobain gypsum perimeter false ceiling with cove LED, fluted charcoal acoustic wall panelling behind TV unit.'),
        (v_kitchen_id, v_project_id, 'Modular Kitchen', '12th Floor', '14 ft x 10 ft', 140.00, 'client_review', 45, 'PU matte eucalyptus sage finish, Blum tandembox soft-close drawer runners, 20mm Calacatta Gold quartz countertop, chimney core duct 150mm.'),
        (v_master_id, v_project_id, 'Master Bedroom', '12th Floor', '16 ft x 14 ft', 224.00, 'approved', 75, 'Natural smoked oak veneer wardrobes, tinted bronze glass sliding shutters, automated curtain pelmet raceway, 3000K warm downlights.'),
        (v_bed2_id, v_project_id, 'Bedroom 2 (Kids Room)', '12th Floor', '14 ft x 12 ft', 168.00, 'in_design', 20, 'Ergonomic dual-study desk, soft-close toy storage drawers, wall shelving with cable grommets, pastel laminate accents.'),
        (v_bed3_id, v_project_id, 'Bedroom 3 (Study / Guest)', '12th Floor', '13 ft x 11 ft', 143.00, 'pending', 10, 'Convertible daybed niche, floating study console, matte laminate bookshelves, two-way reading spotlights.')
    on conflict (id) do update set
        status = excluded.status,
        progress_percentage = excluded.progress_percentage;

    -- 5. Design Versions
    insert into public.design_versions (id, project_id, room_id, version_number, title, description, render_type, status, designer_notes, client_feedback, submitted_at)
    values
        (v_design_living_v2, v_project_id, v_living_id, 'v2.1', 'Living Room 3D Render & False Ceiling Plan', 'Cove lighting layout with acoustic fluted panelling behind TV console and Italian marble feature wall.', '3d_render', 'approved', 'Revised tv console depth from 450mm to 380mm per client clearance request.', 'Approved! Loving the warm cove LED tone and fluted proportions.', now() - interval '8 days'),
        (v_design_kitchen_v1, v_project_id, v_kitchen_id, 'v1.4', 'Parallel Modular Kitchen Elevation & Layout', 'PU matte finish in Eucalyptus Sage green, tandem Blum drawers, and Calacatta quartz countertops.', '3d_render', 'under_review', 'Awaiting client approval for upper cabinet flap lift-up system vs bi-fold.', 'Checking edge profile details with family.', now() - interval '2 days'),
        (v_design_master_v1, v_project_id, v_master_id, 'v1.0', 'Master Suite Wardrobe & Bed Back Elevation', 'Floor-to-ceiling tinted glass sliding wardrobe with sensor profile LEDs and fabric upholstered headboard.', '3d_render', 'approved', 'Signed off during site review meeting.', 'Flawless aesthetic. Ready to proceed with frame ordering.', now() - interval '14 days')
    on conflict (id) do update set
        status = excluded.status,
        client_feedback = excluded.client_feedback;

    -- 6. Approvals
    insert into public.approvals (id, project_id, room_id, design_version_id, title, category, description, status, due_date, client_comments)
    values
        ('dddddddd-0001-4ddd-8ddd-dddddddddddd', v_project_id, v_kitchen_id, v_design_kitchen_v1, 'Kitchen Countertop Quartz Selection — Calacatta Gold', 'material', 'Review and approve 20mm engineered quartz slab specification and anti-stain warranty.', 'pending', current_date + 3, 'Checking edge profile details with family.'),
        ('dddddddd-0002-4ddd-8ddd-dddddddddddd', v_project_id, v_living_id, v_design_living_v2, 'Living Room Acoustic Fluted Charcoal Panelling', 'material', 'E0 grade charcoal acoustic charcoal louver panels from CenturyPly.', 'approved', current_date - 5, 'Approved sample in person on site.'),
        ('dddddddd-0003-4ddd-8ddd-dddddddddddd', v_project_id, v_bed2_id, null, 'Kids Bedroom Dual Study & Bunk Framework Layout', 'layout', 'Ergonomic dual-study desk with book storage along East wall.', 'revision_requested', current_date + 1, 'Please add cable grommets and softer corner radii.')
    on conflict (id) do update set
        status = excluded.status,
        client_comments = excluded.client_comments;

    -- 7. Change Requests
    insert into public.change_requests (id, project_id, room_id, request_code, title, description, original_spec, requested_change, cost_impact, timeline_impact_days, client_decision, client_decision_notes, status)
    values
        ('eeeeeeee-0001-4eee-8eee-eeeeeeeeeeee', v_project_id, v_living_id, 'CR-001', 'Add Concealed Magnetic Track Lights in Living Dining', 'Client requested upgrading 4 conventional downlights to 3-meter magnetic recessed track lighting with dimmable spotlights.', '4 surface COB downlights (₹8,000 allowance)', 'Recessed trimless magnetic track with 3 adjustable 12W spotlights and linear diffuser.', 34500.00, 2, 'approved', 'Approved by Rahul Sharma via portal. Ready to order track.', 'approved'),
        ('eeeeeeee-0002-4eee-8eee-eeeeeeeeeeee', v_project_id, v_master_id, 'CR-002', 'Smart Motorized Curtains in Master Suite', 'Provision electrical raceway and motor tracks for automated sheer and blackout dual tracks.', 'Manual curtain rod pelmet bracket.', 'Somfy dual-channel RTS motorized motorized track with wall touch controller.', 22000.00, 1, 'pending', 'Reviewing motor noise dB specs with family.', 'under_review')
    on conflict (id) do update set
        status = excluded.status,
        client_decision = excluded.client_decision;

    -- 8. Materials (BOQ items)
    insert into public.materials (id, project_id, room_id, item_code, name, category, brand_spec, unit, quantity, estimated_rate, actual_rate, proposed_price, approval_status, procurement_status, selection_status, swatch_url)
    values
        ('mmmmmmmm-0001-4mmm-8mmm-mmmmmmmmmmmm', v_project_id, v_living_id, 'MAT-FL-01', 'Botticino Italian Marble 18mm Slab', 'flooring', 'Classic Italian Botticino / Polished', 'sqft', 420.00, 480.00, 465.00, 480.00, 'client_approved', 'delivered', 'approved', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400'),
        ('mmmmmmmm-0002-4mmm-8mmm-mmmmmmmmmmmm', v_project_id, v_kitchen_id, 'MAT-WW-02', 'BWP Marine Ply (710 Grade) Framework', 'woodwork', 'CenturyPly Club Prime 18mm & 12mm', 'sqft', 680.00, 145.00, 142.00, 145.00, 'client_approved', 'po_issued', 'approved', 'https://images.unsplash.com/photo-1546484396-fb3fc6f95f98?w=400'),
        ('mmmmmmmm-0003-4mmm-8mmm-mmmmmmmmmmmm', v_project_id, v_kitchen_id, 'MAT-HW-03', 'Blum Tandembox Antaro Soft-Close Drawers', 'hardware', 'Blum Austria / Silk White 30kg load', 'sets', 12.00, 4200.00, 4100.00, 4200.00, 'client_approved', 'in_transit', 'approved', 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400'),
        ('mmmmmmmm-0004-4mmm-8mmm-mmmmmmmmmmmm', v_project_id, v_master_id, 'MAT-EL-04', 'Warm Architectural COB Downlights 3000K', 'electrical', 'Philips Hue / Deep Recessed 9W CRI>90', 'pcs', 32.00, 850.00, 820.00, 850.00, 'sample_approved', 'delivered', 'selected_by_client', 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=400'),
        ('mmmmmmmm-0005-4mmm-8mmm-mmmmmmmmmmmm', v_project_id, v_living_id, 'MAT-PT-05', 'Velvet Luxury Emulsion Paint — Chalk White', 'paint', 'Asian Paints Royale Luxury Matt', 'litres', 45.00, 680.00, 680.00, 680.00, 'spec_draft', 'not_ordered', 'proposed', 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=400')
    on conflict (id) do update set
        approval_status = excluded.approval_status,
        procurement_status = excluded.procurement_status,
        selection_status = excluded.selection_status;

    -- 9. Procurement Orders
    insert into public.procurement_orders (id, project_id, material_id, material_name, po_number, vendor_name, vendor_contact, order_date, expected_delivery_date, total_amount, payment_status, delivery_status, notes)
    values
        ('nnnnnnnn-0001-4nnn-8nnn-nnnnnnnnnnnn', v_project_id, 'mmmmmmmm-0001-4mmm-8mmm-mmmmmmmmmmmm', 'Botticino Italian Marble 18mm Slab', 'PO-2024-001', 'Decorex Marble Importers, Banjara Hills', '+91 98491 11222', current_date - 18, current_date - 4, 195300.00, 'paid', 'received', 'All 420 sqft slabs delivered and inspected for hairline fissures.'),
        ('nnnnnnnn-0002-4nnn-8nnn-nnnnnnnnnnnn', v_project_id, 'mmmmmmmm-0003-4mmm-8mmm-mmmmmmmmmmmm', 'Blum Tandembox Antaro Soft-Close Drawers', 'PO-2024-002', 'Häfele & Blum Hardware Galleria, Jubilee Hills', '+91 98492 33445', current_date - 6, current_date + 2, 86400.00, 'partially_paid', 'ordered', 'Drawer slides and tip-on aventos mechanisms dispatched via Bluedart.'),
        ('nnnnnnnn-0003-4nnn-8nnn-nnnnnnnnnnnn', v_project_id, null, 'Natural Smoked Oak 1mm Veneer Sheets', 'PO-2024-003', 'Greenlam & Century Laminate Depot, Secunderabad', '+91 98493 55667', current_date - 2, current_date + 5, 62000.00, 'pending', 'ordered', 'Natural Smoked Oak 1mm veneer sheets scheduled for delivery.')
    on conflict (id) do update set
        delivery_status = excluded.delivery_status,
        payment_status = excluded.payment_status;

    -- 10. Tasks
    insert into public.tasks (id, project_id, room_id, title, category, assigned_to, start_date, due_date, status, priority, progress_percent, blocker_notes, dependencies)
    values
        ('hhhhhhhh-0001-4hhh-8hhh-hhhhhhhhhhhh', v_project_id, v_living_id, 'Living Room false ceiling framing & gypsum boarding', 'false_ceiling', v_designer_id, current_date - 8, current_date - 1, 'completed', 'high', 100, null, null),
        ('hhhhhhhh-0002-4hhh-8hhh-hhhhhhhhhhhh', v_project_id, v_kitchen_id, 'Kitchen carcass installation and plumbing rough-ins', 'carpentry', v_designer_id, current_date - 3, current_date + 4, 'in_progress', 'critical', 60, null, null),
        ('hhhhhhhh-0003-4hhh-8hhh-hhhhhhhhhhhh', v_project_id, v_master_id, 'Master Bedroom electrical conduit wiring & sensor points', 'electrical', v_designer_id, current_date - 1, current_date + 3, 'in_progress', 'high', 40, null, null),
        ('hhhhhhhh-0004-4hhh-8hhh-hhhhhhhhhhhh', v_project_id, v_living_id, 'Floor marble diamond polishing (5-cut slurry stage)', 'civil', v_designer_id, current_date + 4, current_date + 10, 'todo', 'medium', 0, null, null),
        ('hhhhhhhh-0005-4hhh-8hhh-hhhhhhhhhhhh', v_project_id, v_bed2_id, 'Kids room wardrobe shutter alignment & soft-close test', 'carpentry', v_designer_id, current_date + 8, current_date + 14, 'todo', 'medium', 0, null, null),
        ('hhhhhhhh-0006-4hhh-8hhh-hhhhhhhhhhhh', v_project_id, v_master_id, 'Master Bedroom motorized curtain pelmet wiring', 'electrical', v_designer_id, current_date - 2, current_date + 1, 'in_progress', 'medium', 50, 'Awaiting client approval on change request CR-002', 'Somfy motorized motor supply')
    on conflict (id) do update set
        status = excluded.status,
        progress_percent = excluded.progress_percent;

    -- 11. Site Updates
    insert into public.site_updates (id, project_id, reporter_id, title, description, photo_urls, date, work_completed_summary, next_planned_activity, workforce_count, delay_flag, weather_conditions, is_client_visible)
    values
        ('iiiiiiii-0001-4iii-8iii-iiiiiiiiiiii', v_project_id, v_site_mgr_id, 'False Ceiling Gypsum Boarding Done in Living & Dining', 'Completed Saint-Gobain channel perimeter grid and 12.5mm gypsum sheets. Recessed cove channel ready for LED strip testing.', array['https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600'], current_date - 1, 'Framing 100%, joint taping in progress, zero level check passed.', 'Acoustic louver battens anchoring and primer coat on ceiling joints.', 7, false, 'Sunny 29°C', true),
        ('iiiiiiii-0002-4iii-8iii-iiiiiiiiiiii', v_project_id, v_site_mgr_id, 'Kitchen Plumbing Line Relocation & Tile Core-Cutting', 'Completed under-sink dishwasher inlet water connection and water purifier drain point core cutting.', array['https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600'], current_date - 4, 'Plumber completed pressure gauge leak test at 4 bar for 45 mins.', 'Base cabinet carcass level shimming and dado granite ledge fixing.', 5, false, 'Clear 31°C', true),
        ('iiiiiiii-0003-4iii-8iii-iiiiiiiiiiii', v_project_id, v_site_mgr_id, 'Master Suite Electrical Conduit Checking & Switch Alignment', 'Laser leveling verified for bedside two-way switch boxes and wall light junction boxes.', array['https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=600'], current_date - 6, 'Verified 8 switch boxes with laser level; installed 25mm PVC heavy duty conduits.', 'Pulling 2.5 sqmm copper wires and sensor profile raceway connections.', 4, false, 'Sunny 30°C', true)
    on conflict (id) do nothing;

    -- 12. Issues & Snags
    insert into public.issues (id, project_id, room_id, issue_code, title, description, severity, status, reported_by, assigned_to, resolution_deadline)
    values
        ('jjjjjjjj-0001-4jjj-8jjj-jjjjjjjjjjjj', v_project_id, v_kitchen_id, 'ISS-014', 'Discrepancy in Chimney Duct Core Diameter', 'Builder duct hole is 120mm whereas Faber curved chimney spec requires 150mm. Core cutter technician scheduled.', 'high', 'action_assigned', v_site_mgr_id, v_site_mgr_id, current_date + 4),
        ('jjjjjjjj-0002-4jjj-8jjj-jjjjjjjjjjjj', v_project_id, v_living_id, 'ISS-009', 'Minor Chip on Botticino Marble Tile Border (West Wall)', 'Edge polishing buffing pad left a 3mm hairline chipped seam. Tile mastic epoxy filling required before crystallization.', 'medium', 'investigating', v_site_mgr_id, v_site_mgr_id, current_date + 8)
    on conflict (id) do update set
        status = excluded.status;

    -- 13. Expenses
    insert into public.expenses (id, project_id, category, amount, payment_mode, paid_to, status, incurred_on, notes)
    values
        ('kkkkkkkk-0001-4kkk-8kkk-kkkkkkkkkkkk', v_project_id, 'contractor_advance', 45000.00, 'bank_transfer', 'Ramesh Carpentry Contractor', 'approved', current_date - 5, 'Advance for kitchen modular carcass pre-assembly.'),
        ('kkkkkkkk-0002-4kkk-8kkk-kkkkkkkkkkkk', v_project_id, 'material_local', 8400.00, 'upi', 'Sri Balaji Hardware & Fasteners', 'approved', current_date - 3, 'Anchor bolts, drywall screws, and Bostik adhesive cartridges.'),
        ('kkkkkkkk-0003-4kkk-8kkk-kkkkkkkkkkkk', v_project_id, 'permit_fee', 3500.00, 'upi', 'Aparna Sarovar Residents Association Debris Pass', 'approved', current_date - 12, 'Freight elevator padding deposit and gate pass clearance.')
    on conflict (id) do nothing;

    -- 14. Payment Milestones (Total ₹18,00,000)
    insert into public.payment_milestones (id, project_id, milestone_code, name, stage_trigger, percentage, amount, due_date, status, paid_at, invoice_number)
    values
        ('llllllll-0001-4lll-8lll-llllllllllll', v_project_id, 'MS-01', 'Booking & Concept Design Advance', 'Signing of Agreement & Concept Sign-off', 10.00, 180000.00, current_date - 45, 'payment_received', now() - interval '42 days', 'INV-2024-001'),
        ('llllllll-0002-4lll-8lll-llllllllllll', v_project_id, 'MS-02', 'Civil & False Ceiling Completion', 'Completion of masonry, electrical roughing & false ceiling', 25.00, 450000.00, current_date - 15, 'payment_received', now() - interval '14 days', 'INV-2024-014'),
        ('llllllll-0003-4lll-8lll-llllllllllll', v_project_id, 'MS-03', 'Modular Woodwork Carcass & Factory Dispatch', 'Factory manufacturing ready & on-site assembly commencement', 35.00, 630000.00, current_date + 7, 'invoice_raised', null, 'INV-2024-032'),
        ('llllllll-0004-4lll-8lll-llllllllllll', v_project_id, 'MS-04', 'Countertops, Painting & Fixtures Installation', 'Quartz installation, 2nd coat paint & electrical fittings', 20.00, 360000.00, current_date + 35, 'scheduled', null, null),
        ('llllllll-0005-4lll-8lll-llllllllllll', v_project_id, 'MS-05', 'Final Snag Resolution & Key Handover', 'Client walkthrough snag closure & possession handover', 10.00, 180000.00, current_date + 60, 'scheduled', null, null)
    on conflict (id) do update set
        status = excluded.status,
        paid_at = excluded.paid_at;

    -- 15. Notifications
    insert into public.notifications (user_id, project_id, title, message, type, is_read, link)
    values
        (v_client_id, v_project_id, 'Countertop Quartz Approval Pending', 'Please sign off on the Calacatta Gold 20mm quartz specification for your Modular Kitchen.', 'approval_required', false, '/client/approvals'),
        (v_client_id, v_project_id, 'Milestone 3 Invoice Generated', 'Invoice INV-2024-032 (₹6,30,000) is ready for modular woodwork commencement.', 'milestone_due', false, '/client/payments'),
        (v_designer_id, v_project_id, 'Client Requested Change in Kids Room', 'Rahul Sharma requested softer radii and grommets on dual-study layout.', 'approval_required', false, '/team/approvals')
    on conflict do nothing;

    -- 16. Studio Settings
    insert into public.studio_settings (id, company_name, legal_name, gstin, email, phone, address, currency, currency_symbol, standard_timeline_weeks, default_gst_percentage, standard_design_fee_sqft, notes)
    values
        ('default', 'StudioFlow Interiors Pvt Ltd', 'StudioFlow Design & Build Private Limited', '36AABCS1429B1Z2', 'contact@studioflow.design', '+91 98490 12345', 'Plot 42, Silicon Valley Layout, Madhapur, Hyderabad, TS 500081', 'INR', '₹', 14, 18.00, 250.00, 'Standard residential turnkey architecture fee terms and GST schedule.')
    on conflict (id) do update set
        company_name = excluded.company_name,
        gstin = excluded.gstin;

END $$;
