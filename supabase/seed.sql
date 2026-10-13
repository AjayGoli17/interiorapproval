-- ==============================================================================
-- StudioFlow / Interior Project Control System — Seed Data
-- Seed: Rahul Sharma — 3BHK Apartment, Hyderabad (₹18,00,000 Budget)
-- ==============================================================================

-- Fixed UUIDs for predictable relational integrity across panels
DO $$
DECLARE
    -- User IDs
    v_admin_id uuid := '11111111-1111-4111-8111-111111111111';
    v_designer_id uuid := '22222222-2222-4222-8222-222222222222';
    v_client_id uuid := '33333333-3333-4333-8333-333333333333';
    
    -- Project ID
    v_project_id uuid := 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
    
    -- Room IDs
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
    -- 1. Profiles
    insert into public.profiles (id, email, full_name, role, phone, avatar_url, company_name)
    values
        (v_admin_id, 'priya.nair@studioflow.design', 'Priya Nair', 'admin', '+91 98490 12345', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150', 'StudioFlow Interiors'),
        (v_designer_id, 'arjun.mehta@studioflow.design', 'Arjun Mehta', 'designer', '+91 98490 23456', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', 'StudioFlow Interiors'),
        (v_client_id, 'rahul.sharma@gmail.com', 'Rahul Sharma', 'client', '+91 98490 34567', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150', 'Homeowner')
    on conflict (id) do nothing;

    -- 2. Projects
    insert into public.projects (
        id, project_code, title, client_id, lead_designer_id, site_manager_id,
        location, city, property_type, carpet_area_sqft, total_budget,
        estimated_start_date, target_handover_date, status, progress_percentage, notes
    )
    values (
        v_project_id, 'PRJ-HYD-2401', 'Rahul Sharma — 3BHK Apartment',
        v_client_id, v_designer_id, v_designer_id,
        'Flat 1204, Tower B, Aparna Sarovar Grande, Nallagandla',
        'Hyderabad', '3BHK Apartment', 1850.00, 1800000.00,
        '2024-01-15', '2024-04-30', 'execution', 45,
        'Turnkey interior transformation with bespoke oak veneer cabinetry, quartz countertops, and concealed architectural warm lighting.'
    )
    on conflict (id) do nothing;

    -- 3. Project Members
    insert into public.project_members (project_id, profile_id, role)
    values
        (v_project_id, v_admin_id, 'admin'),
        (v_project_id, v_designer_id, 'lead_designer'),
        (v_project_id, v_client_id, 'client')
    on conflict do nothing;

    -- 4. Rooms
    insert into public.rooms (id, project_id, name, floor, dimensions, area_sqft, status)
    values
        (v_living_id, v_project_id, 'Living & Dining Room', '12th Floor', '24 ft x 16 ft', 384.00, 'in_execution'),
        (v_kitchen_id, v_project_id, 'Modular Kitchen', '12th Floor', '14 ft x 10 ft', 140.00, 'client_review'),
        (v_master_id, v_project_id, 'Master Bedroom', '12th Floor', '16 ft x 14 ft', 224.00, 'approved'),
        (v_bed2_id, v_project_id, 'Kids Bedroom (Bed 2)', '12th Floor', '14 ft x 12 ft', 168.00, 'in_design'),
        (v_bed3_id, v_project_id, 'Guest / Study Bedroom (Bed 3)', '12th Floor', '13 ft x 11 ft', 143.00, 'pending')
    on conflict (id) do nothing;

    -- 5. Design Versions
    insert into public.design_versions (id, project_id, room_id, version_number, title, description, render_type, status, designer_notes, submitted_at)
    values
        (v_design_living_v2, v_project_id, v_living_id, 'v2.1', 'Living Room 3D Render & False Ceiling Plan', 'Cove lighting layout with acoustic fluted panelling behind TV console and Italian marble feature wall.', '3d_render', 'approved', 'Revised tv console depth from 450mm to 380mm per client clearance request.', now() - interval '8 days'),
        (v_design_kitchen_v1, v_project_id, v_kitchen_id, 'v1.4', 'Parallel Modular Kitchen Elevation & Layout', 'PU matte finish in Eucalyptus Sage green, tandem Blum drawers, and Calacatta quartz countertops.', '3d_render', 'under_review', 'Awaiting client approval for upper cabinet flap lift-up system vs bi-fold.', now() - interval '2 days'),
        (v_design_master_v1, v_project_id, v_master_id, 'v1.0', 'Master Suite Wardrobe & Bed Back Elevation', 'Floor-to-ceiling tinted glass sliding wardrobe with sensor profile LEDs and fabric upholstered headboard.', '3d_render', 'approved', 'Signed off during site review meeting.', now() - interval '14 days')
    on conflict (id) do nothing;

    -- 6. Approvals
    insert into public.approvals (id, project_id, room_id, design_version_id, title, category, description, status, due_date, client_comments)
    values
        ('dddddddd-0001-4ddd-8ddd-dddddddddddd', v_project_id, v_kitchen_id, v_design_kitchen_v1, 'Kitchen Countertop Quartz Selection — Calacatta Gold', 'material', 'Review and approve 20mm engineered quartz slab specification and anti-stain warranty.', 'pending', current_date + 3, 'Checking edge profile details with family.'),
        ('dddddddd-0002-4ddd-8ddd-dddddddddddd', v_project_id, v_living_id, v_design_living_v2, 'Living Room Acoustic Fluted Charcoal Panelling', 'material', 'E0 grade charcoal acoustic charcoal louver panels from CenturyPly.', 'approved', current_date - 5, 'Approved sample in person on site.'),
        ('dddddddd-0003-4ddd-8ddd-dddddddddddd', v_project_id, v_bed2_id, null, 'Kids Bedroom Dual Study & Bunk Framework Layout', 'layout', 'Ergonomic dual-study desk with book storage along East wall.', 'revision_requested', current_date + 1, 'Please add cable grommets and softer corner radii.')
    on conflict (id) do nothing;

    -- 7. Change Requests
    insert into public.change_requests (project_id, room_id, request_code, title, description, cost_impact, timeline_impact_days, status)
    values
        (v_project_id, v_living_id, 'CR-001', 'Add Concealed Magnetic Track Lights in Living Dining', 'Client requested upgrading 4 conventional downlights to 3-meter magnetic recessed track lighting with dimmable spotlights.', 34500.00, 2, 'approved'),
        (v_project_id, v_master_id, 'CR-002', 'Smart Motorized Curtains in Master Suite', 'Provision electrical raceway and motor tracks for automated sheer and blackout dual tracks.', 22000.00, 1, 'under_review')
    on conflict do nothing;

    -- 8. Materials (BOQ items)
    insert into public.materials (project_id, room_id, item_code, name, category, brand_spec, unit, quantity, estimated_rate, actual_rate, approval_status, procurement_status)
    values
        (v_project_id, v_living_id, 'MAT-FL-01', 'Botticino Italian Marble 18mm Slab', 'flooring', 'Classic Italian Botticino / Polished', 'sqft', 420.00, 480.00, 465.00, 'client_approved', 'delivered'),
        (v_project_id, v_kitchen_id, 'MAT-WW-02', 'BWP Marine Ply (710 Grade) Framework', 'woodwork', 'CenturyPly Club Prime 18mm & 12mm', 'sqft', 680.00, 145.00, 142.00, 'client_approved', 'po_issued'),
        (v_project_id, v_kitchen_id, 'MAT-HW-03', 'Blum Tandembox Antaro Soft-Close Drawers', 'hardware', 'Blum Austria / Silk White 30kg load', 'sets', 12.00, 4200.00, 4100.00, 'client_approved', 'in_transit'),
        (v_project_id, v_master_id, 'MAT-EL-04', 'Warm Architectural COB Downlights 3000K', 'electrical', 'Philips Hue / Deep Recessed 9W CRI>90', 'pcs', 32.00, 850.00, 820.00, 'sample_approved', 'delivered'),
        (v_project_id, v_living_id, 'MAT-PT-05', 'Velvet Luxury Emulsion Paint — Chalk White', 'paint', 'Asian Paints Royale Luxury Matt', 'litres', 45.00, 680.00, 680.00, 'spec_draft', 'not_ordered')
    on conflict do nothing;

    -- 9. Procurement Orders
    insert into public.procurement_orders (project_id, po_number, vendor_name, vendor_contact, order_date, expected_delivery_date, total_amount, payment_status, delivery_status, notes)
    values
        (v_project_id, 'PO-2024-001', 'Decorex Marble Importers, Banjara Hills', '+91 98491 11222', current_date - 18, current_date - 4, 195300.00, 'paid', 'received', 'All 420 sqft slabs delivered and inspected for hairline fissures.'),
        (v_project_id, 'PO-2024-002', 'Häfele & Blum Hardware Galleria, Jubilee Hills', '+91 98492 33445', current_date - 6, current_date + 2, 86400.00, 'partially_paid', 'ordered', 'Drawer slides and tip-on aventos mechanisms dispatched via Bluedart.'),
        (v_project_id, 'PO-2024-003', 'Greenlam & Century Laminate Depot, Secunderabad', '+91 98493 55667', current_date - 2, current_date + 5, 62000.00, 'pending', 'ordered', 'Natural Smoked Oak 1mm veneer sheets scheduled for delivery.')
    on conflict do nothing;

    -- 10. Tasks
    insert into public.tasks (project_id, room_id, title, category, assigned_to, start_date, due_date, status, priority, progress_percent)
    values
        (v_project_id, v_living_id, 'Living Room false ceiling framing & gypsum boarding', 'false_ceiling', v_designer_id, current_date - 8, current_date - 1, 'completed', 'high', 100),
        (v_project_id, v_kitchen_id, 'Kitchen carcass installation and plumbing rough-ins', 'carpentry', v_designer_id, current_date - 3, current_date + 4, 'in_progress', 'critical', 60),
        (v_project_id, v_master_id, 'Master Bedroom electrical conduit wiring & sensor points', 'electrical', v_designer_id, current_date - 1, current_date + 3, 'in_progress', 'high', 40),
        (v_project_id, v_living_id, 'Floor marble diamond polishing (5-cut slurry stage)', 'civil', v_designer_id, current_date + 4, current_date + 10, 'todo', 'medium', 0),
        (v_project_id, v_bed2_id, 'Kids room wardrobe shutter alignment & soft-close test', 'carpentry', v_designer_id, current_date + 8, current_date + 14, 'todo', 'medium', 0)
    on conflict do nothing;

    -- 11. Site Updates
    insert into public.site_updates (project_id, reporter_id, title, description, photo_urls, date, work_completed_summary, workforce_count, delay_flag, weather_conditions)
    values
        (v_project_id, v_designer_id, 'False Ceiling Gypsum Boarding Done in Living & Dining', 'Completed Saint-Gobain channel perimeter grid and 12.5mm gypsum sheets. Recessed cove channel ready for LED strip testing.', array['https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600'], current_date - 1, 'Framing 100%, joint taping in progress, zero level check passed.', 7, false, 'Sunny 29°C'),
        (v_project_id, v_designer_id, 'Kitchen Plumbing Line Relocation & Tile Core-Cutting', 'Completed under-sink dishwasher inlet water connection and water purifier drain point core cutting.', array['https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600'], current_date - 4, 'Plumber completed pressure gauge leak test at 4 bar for 45 mins.', 5, false, 'Clear 31°C')
    on conflict do nothing;

    -- 12. Issues & Snags
    insert into public.issues (project_id, room_id, issue_code, title, description, severity, status, reported_by, assigned_to)
    values
        (v_project_id, v_kitchen_id, 'ISS-014', 'Discrepancy in Chimney Duct Core Diameter', 'Builder duct hole is 120mm whereas Faber curved chimney spec requires 150mm. Core cutter technician scheduled.', 'high', 'action_assigned', v_designer_id, v_designer_id),
        (v_project_id, v_living_id, 'ISS-009', 'Minor Chip on Botticino Marble Tile Border (West Wall)', 'Edge polishing buffing pad left a 3mm hairline chipped seam. Tile mastic epoxy filling required before crystallization.', 'medium', 'investigating', v_designer_id, v_designer_id)
    on conflict do nothing;

    -- 13. Expenses
    insert into public.expenses (project_id, category, amount, payment_mode, paid_to, status, incurred_on)
    values
        (v_project_id, 'contractor_advance', 45000.00, 'bank_transfer', 'Ramesh Carpentry Contractor', 'approved', current_date - 5),
        (v_project_id, 'material_local', 8400.00, 'upi', 'Sri Balaji Hardware & Fasteners', 'approved', current_date - 3),
        (v_project_id, 'permit_fee', 3500.00, 'upi', 'Aparna Sarovar Residents Association Debris Pass', 'approved', current_date - 12)
    on conflict do nothing;

    -- 14. Payment Milestones (Total ₹18,00,000)
    insert into public.payment_milestones (project_id, milestone_code, name, stage_trigger, percentage, amount, due_date, status, paid_at, invoice_number)
    values
        (v_project_id, 'MS-01', 'Booking & Concept Design Advance', 'Signing of Agreement & Concept Sign-off', 10.00, 180000.00, '2024-01-10', 'payment_received', '2024-01-12 11:30:00+00', 'INV-2024-001'),
        (v_project_id, 'MS-02', 'Civil & False Ceiling Completion', 'Completion of masonry, electrical roughing & false ceiling', 25.00, 450000.00, '2024-02-15', 'payment_received', '2024-02-16 16:45:00+00', 'INV-2024-014'),
        (v_project_id, 'MS-03', 'Modular Woodwork Carcass & Factory Dispatch', 'Factory manufacturing ready & on-site assembly commencement', 35.00, 630000.00, current_date + 7, 'invoice_raised', null, 'INV-2024-032'),
        (v_project_id, 'MS-04', 'Countertops, Painting & Fixtures Installation', 'Quartz installation, 2nd coat paint & electrical fittings', 20.00, 360000.00, current_date + 35, 'scheduled', null, null),
        (v_project_id, 'MS-05', 'Final Snag Resolution & Key Handover', 'Client walkthrough snag closure & possession handover', 10.00, 180000.00, '2024-04-30', 'scheduled', null, null)
    on conflict do nothing;

    -- 15. Notifications
    insert into public.notifications (user_id, project_id, title, message, type, is_read, link)
    values
        (v_client_id, v_project_id, 'Countertop Quartz Approval Pending', 'Please sign off on the Calacatta Gold 20mm quartz specification for your Modular Kitchen.', 'approval_required', false, '/client/approvals'),
        (v_client_id, v_project_id, 'Milestone 3 Invoice Generated', 'Invoice INV-2024-032 (₹6,30,000) is ready for modular woodwork commencement.', 'milestone_due', false, '/client/payments'),
        (v_designer_id, v_project_id, 'Client Requested Change in Kids Room', 'Rahul Sharma requested softer radii and grommets on dual-study layout.', 'approval_required', false, '/team/approvals')
    on conflict do nothing;

END $$;
