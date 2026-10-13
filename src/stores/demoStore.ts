import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  UserProfile,
  Client,
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
  UserRole,
  StudioSettings,
} from '@/types';

// Demo Identies for Quick-Switcher
export const DEMO_USERS: Record<UserRole, UserProfile> = {
  admin: {
    id: '11111111-1111-4111-8111-111111111111',
    email: 'priya.nair@studioflow.design',
    full_name: 'Priya Nair',
    role: 'admin',
    phone: '+91 98490 12345',
    avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    company_name: 'StudioFlow Interiors',
    specialization: 'Principal Architect & Studio Director',
    status: 'available',
  },
  designer: {
    id: '22222222-2222-4222-8222-222222222222',
    email: 'arjun.mehta@studioflow.design',
    full_name: 'Arjun Mehta',
    role: 'designer',
    phone: '+91 98490 23456',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    company_name: 'StudioFlow Interiors',
    specialization: 'Senior Interior Designer & Millwork Lead',
    status: 'busy',
  },
  site_manager: {
    id: '44444444-4444-4444-8444-444444444444',
    email: 'suresh.rao@studioflow.design',
    full_name: 'Suresh Rao',
    role: 'site_manager',
    phone: '+91 98490 44556',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    company_name: 'StudioFlow Interiors',
    specialization: 'Senior Site Execution Engineer (Civil & MEP)',
    status: 'busy',
  },
  client: {
    id: '33333333-3333-4333-8333-333333333333',
    email: 'rahul.sharma@gmail.com',
    full_name: 'Rahul Sharma',
    role: 'client',
    phone: '+91 98490 34567',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    company_name: 'Homeowner',
  },
};

export const SEED_PROJECT_ID = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';
export const SEED_CLIENT_ID = '33333333-3333-4333-8333-333333333333';

const initialTeamMembers: UserProfile[] = [
  {
    id: '11111111-1111-4111-8111-111111111111',
    email: 'priya.nair@studioflow.design',
    full_name: 'Priya Nair',
    role: 'admin',
    phone: '+91 98490 12345',
    avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    company_name: 'StudioFlow Interiors',
    specialization: 'Principal Architect & Studio Director',
    status: 'available',
    assigned_project_ids: [SEED_PROJECT_ID, 'aaaaaaaa-bbbb-4aaa-8aaa-bbbbbbbbbbbb', 'aaaaaaaa-cccc-4aaa-8aaa-cccccccccccc'],
    created_at: '2023-08-01T09:00:00Z',
  },
  {
    id: '22222222-2222-4222-8222-222222222222',
    email: 'arjun.mehta@studioflow.design',
    full_name: 'Arjun Mehta',
    role: 'designer',
    phone: '+91 98490 23456',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    company_name: 'StudioFlow Interiors',
    specialization: 'Senior Interior Designer & Millwork Lead',
    status: 'busy',
    assigned_project_ids: [SEED_PROJECT_ID, 'aaaaaaaa-bbbb-4aaa-8aaa-bbbbbbbbbbbb'],
    created_at: '2023-09-15T10:00:00Z',
  },
  {
    id: '55555555-5555-4555-8555-555555555555',
    email: 'kavita.sundaram@studioflow.design',
    full_name: 'Kavita Sundaram',
    role: 'designer',
    phone: '+91 98490 67890',
    avatar_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
    company_name: 'StudioFlow Interiors',
    specialization: '3D Visualizer & FF&E Specialist',
    status: 'available',
    assigned_project_ids: ['aaaaaaaa-bbbb-4aaa-8aaa-bbbbbbbbbbbb', 'aaaaaaaa-cccc-4aaa-8aaa-cccccccccccc'],
    created_at: '2023-11-10T11:00:00Z',
  },
  {
    id: '44444444-4444-4444-8444-444444444444',
    email: 'suresh.rao@studioflow.design',
    full_name: 'Suresh Rao',
    role: 'site_manager',
    phone: '+91 98490 44556',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    company_name: 'StudioFlow Interiors',
    specialization: 'Senior Site Execution Engineer (Civil & MEP)',
    status: 'busy',
    assigned_project_ids: [SEED_PROJECT_ID, 'aaaaaaaa-bbbb-4aaa-8aaa-bbbbbbbbbbbb'],
    created_at: '2023-10-01T08:30:00Z',
  },
];

const initialClients: Client[] = [
  {
    id: SEED_CLIENT_ID,
    full_name: 'Rahul Sharma',
    email: 'rahul.sharma@gmail.com',
    phone: '+91 98490 34567',
    property_address: 'Flat 1204, Tower B, Aparna Sarovar Grande, Nallagandla',
    city: 'Hyderabad',
    project_id: SEED_PROJECT_ID,
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    notes: 'Premium 3BHK turnkey interior with Italian marble and fluted oak veneer highlights.',
    created_at: '2026-08-08T10:00:00Z',
  },
  {
    id: '33333333-bbbb-4333-8333-bbbbbbbbbbbb',
    full_name: 'Ananya Reddy',
    email: 'ananya.reddy@gmail.com',
    phone: '+91 98490 99887',
    property_address: 'Villa 42, Palm Meadows, Gachibowli',
    city: 'Hyderabad',
    project_id: 'aaaaaaaa-bbbb-4aaa-8aaa-bbbbbbbbbbbb',
    avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
    notes: '4BHK Duplex Villa with double-height chandelier foyer and private terrace lounge.',
    created_at: '2026-08-22T14:30:00Z',
  },
  {
    id: '33333333-cccc-4333-8333-cccccccccccc',
    full_name: 'Vikramaditya & Sneha Varma',
    email: 'vikram.varma@techventures.io',
    phone: '+91 99890 55443',
    property_address: 'Penthouse 2101, Jayabheri The Peak, Financial District',
    city: 'Hyderabad',
    project_id: 'aaaaaaaa-cccc-4aaa-8aaa-cccccccccccc',
    avatar_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150',
    notes: 'Luxury penthouse with automated home cinema, imported quartz kitchen island.',
    created_at: '2026-09-05T16:00:00Z',
  },
];

const initialProjects: Project[] = [
  {
    id: SEED_PROJECT_ID,
    project_code: 'PRJ-HYD-2601',
    title: 'Rahul Sharma — 3BHK Apartment',
    client_id: SEED_CLIENT_ID,
    lead_designer_id: '22222222-2222-4222-8222-222222222222',
    site_manager_id: '44444444-4444-4444-8444-444444444444',
    location: 'Flat 1204, Tower B, Aparna Sarovar Grande, Nallagandla',
    city: 'Hyderabad',
    property_type: '3BHK Apartment',
    carpet_area_sqft: 1850,
    total_budget: 1834500,
    estimated_start_date: '2026-08-15',
    target_handover_date: '2026-11-30',
    status: 'execution',
    progress_percentage: 45,
    notes:
      'Turnkey interior transformation with bespoke oak veneer cabinetry, quartz countertops, and concealed architectural warm lighting.',
    created_at: '2026-08-10T10:00:00Z',
  },
  {
    id: 'aaaaaaaa-bbbb-4aaa-8aaa-bbbbbbbbbbbb',
    project_code: 'PRJ-HYD-2602',
    title: 'Ananya Reddy — 4BHK Villa',
    client_id: '33333333-bbbb-4333-8333-bbbbbbbbbbbb',
    lead_designer_id: '55555555-5555-4555-8555-555555555555',
    site_manager_id: '44444444-4444-4444-8444-444444444444',
    location: 'Villa 42, Palm Meadows, Gachibowli',
    city: 'Hyderabad',
    property_type: '4BHK Duplex Villa',
    carpet_area_sqft: 3400,
    total_budget: 4200000,
    estimated_start_date: '2026-09-01',
    target_handover_date: '2027-02-28',
    status: 'design_phase',
    progress_percentage: 20,
    notes: 'Contemporary minimalist villa with Italian marble and double-height living foyer.',
    created_at: '2026-08-25T11:30:00Z',
  },
  {
    id: 'aaaaaaaa-cccc-4aaa-8aaa-cccccccccccc',
    project_code: 'PRJ-HYD-2603',
    title: 'Vikramaditya Varma — Penthouse',
    client_id: '33333333-cccc-4333-8333-cccccccccccc',
    lead_designer_id: '22222222-2222-4222-8222-222222222222',
    site_manager_id: '44444444-4444-4444-8444-444444444444',
    location: 'Penthouse 2101, Jayabheri The Peak, Financial District',
    city: 'Hyderabad',
    property_type: 'Penthouse',
    carpet_area_sqft: 4100,
    total_budget: 3500000,
    estimated_start_date: '2026-11-01',
    target_handover_date: '2027-04-30',
    status: 'lead',
    progress_percentage: 10,
    notes: 'Turnkey luxury penthouse, smart lighting, automated acoustic wall panelling.',
    created_at: '2026-10-01T15:00:00Z',
  },
];

const initialRooms: Room[] = [
  {
    id: 'bbbbbbbb-0001-4bbb-8bbb-bbbbbbbbbbbb',
    project_id: SEED_PROJECT_ID,
    name: 'Living & Dining Room',
    floor: '12th Floor',
    dimensions: '24 ft x 16 ft',
    area_sqft: 384,
    status: 'in_execution',
    progress_percentage: 65,
    specifications: 'Botticino Italian marble flooring, Saint-Gobain gypsum perimeter false ceiling with cove LED, fluted charcoal acoustic wall panelling behind TV unit.',
  },
  {
    id: 'bbbbbbbb-0002-4bbb-8bbb-bbbbbbbbbbbb',
    project_id: SEED_PROJECT_ID,
    name: 'Modular Kitchen',
    floor: '12th Floor',
    dimensions: '14 ft x 10 ft',
    area_sqft: 140,
    status: 'client_review',
    progress_percentage: 45,
    specifications: 'PU matte eucalyptus sage finish, Blum tandembox soft-close drawer runners, 20mm Calacatta Gold quartz countertop, chimney core duct 150mm.',
  },
  {
    id: 'bbbbbbbb-0003-4bbb-8bbb-bbbbbbbbbbbb',
    project_id: SEED_PROJECT_ID,
    name: 'Master Bedroom',
    floor: '12th Floor',
    dimensions: '16 ft x 14 ft',
    area_sqft: 224,
    status: 'approved',
    progress_percentage: 75,
    specifications: 'Natural smoked oak veneer wardrobes, tinted bronze glass sliding shutters, automated curtain pelmet raceway, 3000K warm downlights.',
  },
  {
    id: 'bbbbbbbb-0004-4bbb-8bbb-bbbbbbbbbbbb',
    project_id: SEED_PROJECT_ID,
    name: 'Bedroom 2 (Kids Room)',
    floor: '12th Floor',
    dimensions: '14 ft x 12 ft',
    area_sqft: 168,
    status: 'in_design',
    progress_percentage: 20,
    specifications: 'Ergonomic dual-study desk, soft-close toy storage drawers, wall shelving with cable grommets, pastel laminate accents.',
  },
  {
    id: 'bbbbbbbb-0005-4bbb-8bbb-bbbbbbbbbbbb',
    project_id: SEED_PROJECT_ID,
    name: 'Bedroom 3 (Study / Guest)',
    floor: '12th Floor',
    dimensions: '13 ft x 11 ft',
    area_sqft: 143,
    status: 'pending',
    progress_percentage: 10,
    specifications: 'Convertible daybed niche, floating study console, matte laminate bookshelves, two-way reading spotlights.',
  },
  // Rooms for Project 2 (Villa)
  {
    id: 'bbbbbbbb-0010-4bbb-8bbb-bbbbbbbbbbbb',
    project_id: 'aaaaaaaa-bbbb-4aaa-8aaa-bbbbbbbbbbbb',
    name: 'Foyer & Formal Living',
    floor: 'Ground Floor',
    dimensions: '28 ft x 20 ft',
    area_sqft: 560,
    status: 'in_design',
    progress_percentage: 30,
    specifications: 'Double height chandelier structural anchor, Italian Statuario marble, acoustic baffle ceiling.',
  },
  {
    id: 'bbbbbbbb-0011-4bbb-8bbb-bbbbbbbbbbbb',
    project_id: 'aaaaaaaa-bbbb-4aaa-8aaa-bbbbbbbbbbbb',
    name: 'Open Chef Kitchen',
    floor: 'Ground Floor',
    dimensions: '18 ft x 14 ft',
    area_sqft: 252,
    status: 'in_design',
    progress_percentage: 25,
    specifications: 'Open island chef kitchen, integrated wine chiller niche, porcelain slab countertops.',
  },
];

const initialDesignVersions: DesignVersion[] = [
  {
    id: 'cccccccc-0001-4ccc-8ccc-cccccccccccc',
    project_id: SEED_PROJECT_ID,
    room_id: 'bbbbbbbb-0001-4bbb-8bbb-bbbbbbbbbbbb',
    version_number: 'v2.1',
    title: 'Living Room 3D Render & False Ceiling Plan',
    description:
      'Cove lighting layout with acoustic fluted panelling behind TV console and Italian marble feature wall.',
    preview_url:
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&auto=format&fit=crop&q=80',
    render_type: '3d_render',
    status: 'approved',
    designer_notes:
      'Revised TV console depth from 450mm to 380mm per client clearance request.',
    submitted_at: '2026-09-15T10:00:00Z',
  },
  {
    id: 'cccccccc-0002-4ccc-8ccc-cccccccccccc',
    project_id: SEED_PROJECT_ID,
    room_id: 'bbbbbbbb-0002-4bbb-8bbb-bbbbbbbbbbbb',
    version_number: 'v1.4',
    title: 'Parallel Modular Kitchen Elevation & Layout',
    description:
      'PU matte finish in Eucalyptus Sage green, tandem Blum drawers, and Calacatta quartz countertops.',
    preview_url:
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&auto=format&fit=crop&q=80',
    render_type: '3d_render',
    status: 'under_review',
    designer_notes:
      'Awaiting client approval for upper cabinet flap lift-up system vs bi-fold.',
    submitted_at: '2026-10-04T14:30:00Z',
  },
  {
    id: 'cccccccc-0003-4ccc-8ccc-cccccccccccc',
    project_id: SEED_PROJECT_ID,
    room_id: 'bbbbbbbb-0003-4bbb-8bbb-bbbbbbbbbbbb',
    version_number: 'v1.0',
    title: 'Master Suite Wardrobe & Bed Back Elevation',
    description:
      'Floor-to-ceiling tinted glass sliding wardrobe with sensor profile LEDs and fabric upholstered headboard.',
    preview_url:
      'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800&auto=format&fit=crop&q=80',
    render_type: '3d_render',
    status: 'approved',
    designer_notes: 'Signed off during site review meeting.',
    submitted_at: '2026-09-10T09:15:00Z',
  },
  {
    id: 'cccccccc-0004-4ccc-8ccc-cccccccccccc',
    project_id: SEED_PROJECT_ID,
    room_id: 'bbbbbbbb-0004-4bbb-8bbb-bbbbbbbbbbbb',
    version_number: 'v1.1',
    title: 'Kids Bedroom Dual Study & Bunk Framework Layout',
    description:
      'Dual-study station with ergonomic clearance, wall-mounted display cubbies, and rounded edges.',
    preview_url:
      'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800&auto=format&fit=crop&q=80',
    render_type: '2d_cad',
    status: 'under_review',
    designer_notes: 'Updated cable grommets and softer corner radii per client feedback.',
    submitted_at: '2026-10-08T11:00:00Z',
  },
  {
    id: 'cccccccc-0005-4ccc-8ccc-cccccccccccc',
    project_id: SEED_PROJECT_ID,
    room_id: 'bbbbbbbb-0005-4bbb-8bbb-bbbbbbbbbbbb',
    version_number: 'v1.0',
    title: 'Guest Bedroom Floating Desk & Daybed Concept',
    description:
      'Multi-purpose work desk with integrated pull-out daybed and minimalist overhead cabinetry.',
    preview_url:
      'https://images.unsplash.com/photo-1540518614846-7ede433c4ef4?w=800&auto=format&fit=crop&q=80',
    render_type: 'moodboard',
    status: 'draft',
    designer_notes: 'Initial concept draft for internal team review before presentation.',
    submitted_at: '2026-10-10T16:00:00Z',
  },
];

const initialApprovals: Approval[] = [
  {
    id: 'dddddddd-0001-4ddd-8ddd-dddddddddddd',
    project_id: SEED_PROJECT_ID,
    room_id: 'bbbbbbbb-0002-4bbb-8bbb-bbbbbbbbbbbb',
    design_version_id: 'cccccccc-0002-4ccc-8ccc-cccccccccccc',
    title: 'Kitchen Countertop Quartz Selection — Calacatta Gold',
    category: 'material',
    description:
      'Review and approve 20mm engineered quartz slab specification and anti-stain warranty.',
    status: 'pending',
    due_date: '2026-10-22',
    client_comments: 'Checking edge profile details with family.',
    created_at: '2026-10-08T10:00:00Z',
  },
  {
    id: 'dddddddd-0002-4ddd-8ddd-dddddddddddd',
    project_id: SEED_PROJECT_ID,
    room_id: 'bbbbbbbb-0001-4bbb-8bbb-bbbbbbbbbbbb',
    design_version_id: 'cccccccc-0001-4ccc-8ccc-cccccccccccc',
    title: 'Living Room Acoustic Fluted Charcoal Panelling',
    category: 'material',
    description: 'E0 grade charcoal acoustic charcoal louver panels from CenturyPly.',
    status: 'approved',
    due_date: '2026-09-28',
    client_comments: 'Approved sample in person on site.',
    approved_at: '2026-09-27T16:00:00Z',
    created_at: '2026-09-20T10:00:00Z',
  },
  {
    id: 'dddddddd-0003-4ddd-8ddd-dddddddddddd',
    project_id: SEED_PROJECT_ID,
    room_id: 'bbbbbbbb-0004-4bbb-8bbb-bbbbbbbbbbbb',
    title: 'Kids Bedroom Dual Study & Bunk Framework Layout',
    category: 'layout',
    description: 'Ergonomic dual-study desk with book storage along East wall.',
    status: 'revision_requested',
    due_date: '2026-10-20',
    client_comments: 'Please add cable grommets and softer corner radii.',
    created_at: '2026-10-06T11:20:00Z',
  },
];

const initialChangeRequests: ChangeRequest[] = [
  {
    id: 'eeeeeeee-0001-4eee-8eee-eeeeeeeeeeee',
    project_id: SEED_PROJECT_ID,
    room_id: 'bbbbbbbb-0001-4bbb-8bbb-bbbbbbbbbbbb',
    request_code: 'CR-001',
    title: 'Concealed Magnetic Track Lights in Living Dining',
    description:
      'Client requested upgrading 4 conventional downlights to 3-meter magnetic recessed track lighting with dimmable spotlights.',
    original_spec: '4x Standard 12W warm recessed LED downlights on 2 gang switches.',
    requested_change: '3m Recessed magnetic track with 4x 10W magnetic spotlights and RF dimming module.',
    cost_impact: 34500,
    timeline_impact_days: 2,
    requested_by: 'Rahul Sharma',
    reviewed_by: 'Arjun Mehta',
    client_decision: 'approved',
    client_decision_notes: 'Approved during site mockup session.',
    status: 'approved',
    approved_at: '2026-09-28T11:00:00Z',
    created_at: '2026-09-25T14:00:00Z',
  },
  {
    id: 'eeeeeeee-0002-4eee-8eee-eeeeeeeeeeee',
    project_id: SEED_PROJECT_ID,
    room_id: 'bbbbbbbb-0003-4bbb-8bbb-bbbbbbbbbbbb',
    request_code: 'CR-002',
    title: 'Smart Motorized Curtains in Master Suite',
    description:
      'Provision electrical raceway and motor tracks for automated sheer and blackout dual tracks.',
    original_spec: 'Manual double curtain rod with ceiling concealment pelmet.',
    requested_change: 'Somfy motorized dual curtain track with Zigbee wall switch and smart automation tie-in.',
    cost_impact: 22000,
    timeline_impact_days: 1,
    requested_by: 'Rahul Sharma',
    reviewed_by: 'Arjun Mehta',
    client_decision: 'pending',
    client_decision_notes: 'Client evaluating quote against motor brand warranty.',
    status: 'quoted',
    created_at: '2026-10-08T09:30:00Z',
  },
  {
    id: 'eeeeeeee-0003-4eee-8eee-eeeeeeeeeeee',
    project_id: 'aaaaaaaa-bbbb-4aaa-8aaa-bbbbbbbbbbbb',
    room_id: 'bbbbbbbb-0011-4bbb-8bbb-bbbbbbbbbbbb',
    request_code: 'CR-003',
    title: 'Add Wine Chiller Niche in Open Chef Kitchen',
    description:
      'Incorporate 300mm under-counter wine cooler cabinet with dedicated electrical socket.',
    original_spec: 'Standard 600mm crockery base unit.',
    requested_change: '300mm wine cooler niche + 300mm spice pullout with ventilation louvers.',
    cost_impact: 18500,
    timeline_impact_days: 0,
    requested_by: 'Ananya Reddy',
    reviewed_by: 'Kavita Sundaram',
    client_decision: 'pending',
    status: 'reviewed',
    created_at: '2026-10-02T16:00:00Z',
  },
];

const initialMaterials: Material[] = [
  {
    id: 'ffffffff-0001-4fff-8fff-ffffffffffff',
    project_id: SEED_PROJECT_ID,
    room_id: 'bbbbbbbb-0001-4bbb-8bbb-bbbbbbbbbbbb',
    item_code: 'MAT-FL-01',
    name: 'Botticino Italian Marble 18mm Slab',
    category: 'flooring',
    brand_spec: 'Classic Italian Botticino / Polished',
    unit: 'sqft',
    quantity: 420,
    estimated_rate: 480,
    actual_rate: 465,
    proposed_price: 480,
    selection_status: 'approved',
    approval_status: 'client_approved',
    procurement_status: 'delivered',
    swatch_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400',
  },
  {
    id: 'ffffffff-0002-4fff-8fff-ffffffffffff',
    project_id: SEED_PROJECT_ID,
    room_id: 'bbbbbbbb-0002-4bbb-8bbb-bbbbbbbbbbbb',
    item_code: 'MAT-WW-02',
    name: 'BWP Marine Ply (710 Grade) Framework',
    category: 'woodwork',
    brand_spec: 'CenturyPly Club Prime 18mm & 12mm',
    unit: 'sqft',
    quantity: 680,
    estimated_rate: 145,
    actual_rate: 142,
    proposed_price: 145,
    selection_status: 'approved',
    approval_status: 'client_approved',
    procurement_status: 'po_issued',
  },
  {
    id: 'ffffffff-0003-4fff-8fff-ffffffffffff',
    project_id: SEED_PROJECT_ID,
    room_id: 'bbbbbbbb-0002-4bbb-8bbb-bbbbbbbbbbbb',
    item_code: 'MAT-HW-03',
    name: 'Blum Tandembox Antaro Soft-Close Drawers',
    category: 'hardware',
    brand_spec: 'Blum Austria / Silk White 30kg load',
    unit: 'sets',
    quantity: 12,
    estimated_rate: 4200,
    actual_rate: 4100,
    proposed_price: 4200,
    selection_status: 'approved',
    approval_status: 'client_approved',
    procurement_status: 'in_transit',
  },
  {
    id: 'ffffffff-0004-4fff-8fff-ffffffffffff',
    project_id: SEED_PROJECT_ID,
    room_id: 'bbbbbbbb-0003-4bbb-8bbb-bbbbbbbbbbbb',
    item_code: 'MAT-EL-04',
    name: 'Warm Architectural COB Downlights 3000K',
    category: 'electrical',
    brand_spec: 'Philips Hue / Deep Recessed 9W CRI>90',
    unit: 'pcs',
    quantity: 32,
    estimated_rate: 850,
    actual_rate: 820,
    proposed_price: 850,
    selection_status: 'selected_by_client',
    approval_status: 'sample_approved',
    procurement_status: 'delivered',
  },
  {
    id: 'ffffffff-0005-4fff-8fff-ffffffffffff',
    project_id: SEED_PROJECT_ID,
    room_id: 'bbbbbbbb-0001-4bbb-8bbb-bbbbbbbbbbbb',
    item_code: 'MAT-PT-05',
    name: 'Velvet Luxury Emulsion Paint — Chalk White',
    category: 'paint',
    brand_spec: 'Asian Paints Royale Luxury Matt',
    unit: 'litres',
    quantity: 45,
    estimated_rate: 680,
    actual_rate: 680,
    proposed_price: 680,
    selection_status: 'proposed',
    approval_status: 'spec_draft',
    procurement_status: 'not_ordered',
  },
  {
    id: 'ffffffff-0006-4fff-8fff-ffffffffffff',
    project_id: SEED_PROJECT_ID,
    room_id: 'bbbbbbbb-0001-4bbb-8bbb-bbbbbbbbbbbb',
    item_code: 'MAT-WW-06',
    name: 'Fluted Acoustic Charcoal Louver Panels',
    category: 'woodwork',
    brand_spec: 'CenturyPly 12mm E0 Acoustic Grade',
    unit: 'sqft',
    quantity: 180,
    estimated_rate: 320,
    actual_rate: 310,
    proposed_price: 320,
    selection_status: 'approved',
    approval_status: 'client_approved',
    procurement_status: 'po_issued',
    swatch_url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=400',
  },
  {
    id: 'ffffffff-0007-4fff-8fff-ffffffffffff',
    project_id: SEED_PROJECT_ID,
    room_id: 'bbbbbbbb-0002-4bbb-8bbb-bbbbbbbbbbbb',
    item_code: 'MAT-ST-07',
    name: 'Calacatta Gold 20mm Engineered Quartz Slab',
    category: 'hardware',
    brand_spec: 'Caesarstone 5111 / Polished Double Bevel',
    unit: 'sqft',
    quantity: 85,
    estimated_rate: 550,
    actual_rate: 550,
    proposed_price: 550,
    selection_status: 'proposed',
    approval_status: 'spec_draft',
    procurement_status: 'not_ordered',
    swatch_url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400',
  },
];

const initialProcurementOrders: ProcurementOrder[] = [
  {
    id: 'gggggggg-0001-4ggg-8ggg-gggggggggggg',
    project_id: SEED_PROJECT_ID,
    material_id: 'ffffffff-0001-4fff-8fff-ffffffffffff',
    material_name: 'Botticino Italian Marble 18mm Slab',
    po_number: 'PO-2026-001',
    vendor_name: 'Decorex Marble Importers, Banjara Hills',
    vendor_contact: '+91 98491 11222',
    quantity: 420,
    unit: 'sqft',
    order_date: '2026-09-02',
    expected_delivery_date: '2026-09-18',
    actual_delivery_date: '2026-09-17',
    total_amount: 195300,
    payment_status: 'paid',
    delivery_status: 'delivered',
    notes: 'All 420 sqft slabs delivered and inspected for hairline fissures. Approved on site.',
    created_at: '2026-09-02T09:00:00Z',
  },
  {
    id: 'gggggggg-0002-4ggg-8ggg-gggggggggggg',
    project_id: SEED_PROJECT_ID,
    material_id: 'ffffffff-0003-4fff-8fff-ffffffffffff',
    material_name: 'Blum Tandembox Antaro Soft-Close Drawers',
    po_number: 'PO-2026-002',
    vendor_name: 'Häfele & Blum Hardware Galleria, Jubilee Hills',
    vendor_contact: '+91 98492 33445',
    quantity: 12,
    unit: 'sets',
    order_date: '2026-10-02',
    expected_delivery_date: '2026-10-19',
    total_amount: 86400,
    payment_status: 'partially_paid',
    delivery_status: 'in_transit',
    notes: 'Drawer slides and tip-on aventos mechanisms dispatched via Bluedart tracking #BL99214.',
    created_at: '2026-10-02T11:00:00Z',
  },
  {
    id: 'gggggggg-0003-4ggg-8ggg-gggggggggggg',
    project_id: SEED_PROJECT_ID,
    material_id: 'ffffffff-0002-4fff-8fff-ffffffffffff',
    material_name: 'BWP Marine Ply (710 Grade) Framework',
    po_number: 'PO-2026-003',
    vendor_name: 'Greenlam & Century Laminate Depot, Secunderabad',
    vendor_contact: '+91 98493 55667',
    quantity: 680,
    unit: 'sqft',
    order_date: '2026-10-08',
    expected_delivery_date: '2026-10-22',
    total_amount: 62000,
    payment_status: 'pending',
    delivery_status: 'ordered',
    notes: 'Natural Smoked Oak 1mm veneer sheets scheduled for delivery.',
    created_at: '2026-10-08T14:00:00Z',
  },
];

const initialTasks: Task[] = [
  {
    id: 'hhhhhhhh-0001-4hhh-8hhh-hhhhhhhhhhhh',
    project_id: SEED_PROJECT_ID,
    room_id: 'bbbbbbbb-0001-4bbb-8bbb-bbbbbbbbbbbb',
    title: 'Living Room false ceiling framing & gypsum boarding',
    category: 'false_ceiling',
    start_date: '2026-09-05',
    due_date: '2026-09-20',
    status: 'completed',
    priority: 'high',
    progress_percent: 100,
  },
  {
    id: 'hhhhhhhh-0002-4hhh-8hhh-hhhhhhhhhhhh',
    project_id: SEED_PROJECT_ID,
    room_id: 'bbbbbbbb-0002-4bbb-8bbb-bbbbbbbbbbbb',
    title: 'Kitchen carcass installation and plumbing rough-ins',
    category: 'carpentry',
    start_date: '2026-10-01',
    due_date: '2026-10-22',
    status: 'in_progress',
    priority: 'critical',
    progress_percent: 60,
  },
  {
    id: 'hhhhhhhh-0003-4hhh-8hhh-hhhhhhhhhhhh',
    project_id: SEED_PROJECT_ID,
    room_id: 'bbbbbbbb-0003-4bbb-8bbb-bbbbbbbbbbbb',
    title: 'Master Bedroom electrical conduit wiring & sensor points',
    category: 'electrical',
    start_date: '2026-10-05',
    due_date: '2026-10-18',
    status: 'in_progress',
    priority: 'high',
    progress_percent: 40,
  },
  {
    id: 'hhhhhhhh-0004-4hhh-8hhh-hhhhhhhhhhhh',
    project_id: SEED_PROJECT_ID,
    room_id: 'bbbbbbbb-0001-4bbb-8bbb-bbbbbbbbbbbb',
    title: 'Floor marble diamond polishing (5-cut slurry stage)',
    category: 'civil',
    start_date: '2026-10-24',
    due_date: '2026-10-31',
    status: 'todo',
    priority: 'medium',
    progress_percent: 0,
  },
  {
    id: 'hhhhhhhh-0005-4hhh-8hhh-hhhhhhhhhhhh',
    project_id: SEED_PROJECT_ID,
    room_id: 'bbbbbbbb-0004-4bbb-8bbb-bbbbbbbbbbbb',
    title: 'Kids room wardrobe shutter alignment & soft-close test',
    category: 'carpentry',
    start_date: '2026-11-02',
    due_date: '2026-11-10',
    status: 'todo',
    priority: 'medium',
    progress_percent: 0,
  },
  {
    id: 'hhhhhhhh-0006-4hhh-8hhh-hhhhhhhhhhhh',
    project_id: SEED_PROJECT_ID,
    room_id: 'bbbbbbbb-0003-4bbb-8bbb-bbbbbbbbbbbb',
    title: 'Master Bedroom motorized curtain pelmet wiring',
    category: 'electrical',
    start_date: '2026-10-08',
    due_date: '2026-10-11',
    status: 'in_progress',
    priority: 'medium',
    progress_percent: 50,
    blocker_notes: 'Awaiting client approval on change request CR-002',
    dependencies: 'Somfy motorized motor supply',
  },
  {
    id: 'hhhhhhhh-0007-4hhh-8hhh-hhhhhhhhhhhh',
    project_id: SEED_PROJECT_ID,
    room_id: 'bbbbbbbb-0001-4bbb-8bbb-bbbbbbbbbbbb',
    title: 'Primer and 1st coat acrylic wall putty application',
    category: 'painting',
    start_date: '2026-10-28',
    due_date: '2026-11-06',
    status: 'todo',
    priority: 'medium',
    progress_percent: 0,
    dependencies: 'After marble polishing slurry cleanup',
  },
];

const initialSiteUpdates: SiteUpdate[] = [
  {
    id: 'iiiiiiii-0001-4iii-8iii-iiiiiiiiiiii',
    project_id: SEED_PROJECT_ID,
    room_id: 'bbbbbbbb-0001-4bbb-8bbb-bbbbbbbbbbbb',
    title: 'False Ceiling Gypsum Boarding Done in Living & Dining',
    description:
      'Completed Saint-Gobain channel perimeter grid and 12.5mm gypsum sheets. Recessed cove channel ready for LED strip testing.',
    photo_urls: [
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80',
    ],
    date: '2026-10-05',
    work_completed_summary: 'Framing 100%, joint taping in progress, zero level check passed.',
    next_planned_activity: 'Acoustic louver battens anchoring and primer coat on ceiling joints.',
    workforce_count: 7,
    delay_flag: false,
    weather_conditions: 'Sunny 29°C',
    is_client_visible: true,
  },
  {
    id: 'iiiiiiii-0002-4iii-8iii-iiiiiiiiiiii',
    project_id: SEED_PROJECT_ID,
    room_id: 'bbbbbbbb-0002-4bbb-8bbb-bbbbbbbbbbbb',
    title: 'Kitchen Plumbing Line Relocation & Tile Core-Cutting',
    description:
      'Completed under-sink dishwasher inlet water connection and water purifier drain point core cutting.',
    photo_urls: [
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop&q=80',
    ],
    date: '2026-10-09',
    work_completed_summary: 'Plumber completed pressure gauge leak test at 4 bar for 45 mins.',
    next_planned_activity: 'Base cabinet carcass level shimming and dado granite ledge fixing.',
    workforce_count: 5,
    delay_flag: false,
    weather_conditions: 'Clear 31°C',
    is_client_visible: true,
  },
  {
    id: 'iiiiiiii-0003-4iii-8iii-iiiiiiiiiiii',
    project_id: SEED_PROJECT_ID,
    room_id: 'bbbbbbbb-0003-4bbb-8bbb-bbbbbbbbbbbb',
    title: 'Master Suite Electrical Conduit Checking & Switch Alignment',
    description:
      'Laser leveling verified for bedside two-way switch boxes and wall light junction boxes.',
    photo_urls: [
      'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=600&auto=format&fit=crop&q=80',
    ],
    date: '2026-10-12',
    work_completed_summary: 'Verified 8 switch boxes with laser level; installed 25mm PVC heavy duty conduits.',
    next_planned_activity: 'Pulling 2.5 sqmm copper wires and sensor profile raceway connections.',
    workforce_count: 4,
    delay_flag: false,
    weather_conditions: 'Sunny 30°C',
    is_client_visible: true,
  },
];

const initialIssues: Issue[] = [
  {
    id: 'jjjjjjjj-0001-4jjj-8jjj-jjjjjjjjjjjj',
    project_id: SEED_PROJECT_ID,
    room_id: 'bbbbbbbb-0002-4bbb-8bbb-bbbbbbbbbbbb',
    issue_code: 'ISS-014',
    title: 'Discrepancy in Chimney Duct Core Diameter',
    description:
      'Builder duct hole is 120mm whereas Faber curved chimney spec requires 150mm. Core cutter technician scheduled.',
    severity: 'high',
    status: 'action_assigned',
    resolution_deadline: '2026-10-20',
  },
  {
    id: 'jjjjjjjj-0002-4jjj-8jjj-jjjjjjjjjjjj',
    project_id: SEED_PROJECT_ID,
    room_id: 'bbbbbbbb-0001-4bbb-8bbb-bbbbbbbbbbbb',
    issue_code: 'ISS-009',
    title: 'Minor Chip on Botticino Marble Tile Border (West Wall)',
    description:
      'Edge polishing buffing pad left a 3mm hairline chipped seam. Tile mastic epoxy filling required before crystallization.',
    severity: 'medium',
    status: 'investigating',
    resolution_deadline: '2026-10-24',
  },
  {
    id: 'jjjjjjjj-0003-4jjj-8jjj-jjjjjjjjjjjj',
    project_id: SEED_PROJECT_ID,
    room_id: 'bbbbbbbb-0004-4bbb-8bbb-bbbbbbbbbbbb',
    issue_code: 'ISS-018',
    title: 'Kids Bedroom Study Switchboard Height Discrepancy',
    description:
      'Conduit box placed at 900mm from floor, needs to be 750mm to align beneath study tabletop grommet pass-through.',
    severity: 'low',
    status: 'open',
    resolution_deadline: '2026-10-28',
  },
];

const initialExpenses: Expense[] = [
  {
    id: 'kkkkkkkk-0001-4kkk-8kkk-kkkkkkkkkkkk',
    project_id: SEED_PROJECT_ID,
    room_id: 'bbbbbbbb-0001-4bbb-8bbb-bbbbbbbbbbbb',
    category: 'contractor_advance',
    amount: 45000,
    payment_mode: 'bank_transfer',
    paid_to: 'Ramesh Carpentry Contractor',
    status: 'approved',
    incurred_on: '2026-09-20',
    notes: 'Stage 1 carpentry carcass assembly advance for living dining units.',
    created_at: '2026-09-20T10:00:00Z',
  },
  {
    id: 'kkkkkkkk-0002-4kkk-8kkk-kkkkkkkkkkkk',
    project_id: SEED_PROJECT_ID,
    room_id: 'bbbbbbbb-0002-4bbb-8bbb-bbbbbbbbbbbb',
    category: 'material_local',
    amount: 8400,
    payment_mode: 'upi',
    paid_to: 'Sri Balaji Hardware & Fasteners',
    status: 'approved',
    incurred_on: '2026-10-04',
    notes: 'Urgent SS 304 screws, expansion rawl plugs, and Fevicol Marine grade adhesive.',
    created_at: '2026-10-04T12:00:00Z',
  },
  {
    id: 'kkkkkkkk-0003-4kkk-8kkk-kkkkkkkkkkkk',
    project_id: SEED_PROJECT_ID,
    category: 'permit_fee',
    amount: 3500,
    payment_mode: 'upi',
    paid_to: 'Aparna Sarovar Residents Association Debris Pass',
    status: 'approved',
    incurred_on: '2026-08-25',
    notes: 'Association debris movement and lift protection security deposit fee.',
    created_at: '2026-08-25T09:00:00Z',
  },
  {
    id: 'kkkkkkkk-0004-4kkk-8kkk-kkkkkkkkkkkk',
    project_id: 'aaaaaaaa-bbbb-4aaa-8aaa-bbbbbbbbbbbb',
    category: 'transport',
    amount: 6200,
    payment_mode: 'cash',
    paid_to: 'City Logistics Tempo Service',
    status: 'approved',
    incurred_on: '2026-09-12',
    notes: 'Direct transit of architectural marble catalog samples from Hyderabad airport cargo.',
    created_at: '2026-09-12T14:00:00Z',
  },
];

const initialPaymentMilestones: PaymentMilestone[] = [
  {
    id: 'llllllll-0001-4lll-8lll-llllllllllll',
    project_id: SEED_PROJECT_ID,
    milestone_code: 'MS-01',
    name: 'Booking & Concept Design Advance',
    stage_trigger: 'Signing of Agreement & Concept Sign-off',
    percentage: 10,
    amount: 180000,
    due_date: '2026-08-20',
    status: 'payment_received',
    paid_at: '2026-08-22T11:30:00Z',
    invoice_number: 'INV-2026-001',
  },
  {
    id: 'llllllll-0002-4lll-8lll-llllllllllll',
    project_id: SEED_PROJECT_ID,
    milestone_code: 'MS-02',
    name: 'Civil & False Ceiling Completion',
    stage_trigger: 'Completion of masonry, electrical roughing & false ceiling',
    percentage: 25,
    amount: 450000,
    due_date: '2026-09-25',
    status: 'payment_received',
    paid_at: '2026-09-27T16:45:00Z',
    invoice_number: 'INV-2026-014',
  },
  {
    id: 'llllllll-0003-4lll-8lll-llllllllllll',
    project_id: SEED_PROJECT_ID,
    milestone_code: 'MS-03',
    name: 'Modular Woodwork Carcass & Factory Dispatch',
    stage_trigger: 'Factory manufacturing ready & on-site assembly commencement',
    percentage: 35,
    amount: 630000,
    due_date: '2026-10-25',
    status: 'invoice_raised',
    invoice_number: 'INV-2026-032',
  },
  {
    id: 'llllllll-0004-4lll-8lll-llllllllllll',
    project_id: SEED_PROJECT_ID,
    milestone_code: 'MS-04',
    name: 'Countertops, Painting & Fixtures Installation',
    stage_trigger: 'Quartz installation, 2nd coat paint & electrical fittings',
    percentage: 20,
    amount: 360000,
    due_date: '2026-11-15',
    status: 'scheduled',
  },
  {
    id: 'llllllll-0005-4lll-8lll-llllllllllll',
    project_id: SEED_PROJECT_ID,
    milestone_code: 'MS-05',
    name: 'Final Snag Resolution & Key Handover',
    stage_trigger: 'Client walkthrough snag closure & possession handover',
    percentage: 10,
    amount: 180000,
    due_date: '2026-11-30',
    status: 'scheduled',
  },
  // Villa Milestones
  {
    id: 'llllllll-0010-4lll-8lll-llllllllllll',
    project_id: 'aaaaaaaa-bbbb-4aaa-8aaa-bbbbbbbbbbbb',
    milestone_code: 'MS-01',
    name: 'Villa Booking & 3D Architectural Advance',
    stage_trigger: 'Concept walkthrough sign-off',
    percentage: 15,
    amount: 630000,
    due_date: '2026-09-10',
    status: 'payment_received',
    paid_at: '2026-09-12T12:00:00Z',
    invoice_number: 'INV-2026-008',
  },
  {
    id: 'llllllll-0011-4lll-8lll-llllllllllll',
    project_id: 'aaaaaaaa-bbbb-4aaa-8aaa-bbbbbbbbbbbb',
    milestone_code: 'MS-02',
    name: 'Civil Demolition & MEP Conduit Rough-in',
    stage_trigger: 'Electrical & sanitary conduit sign-off',
    percentage: 25,
    amount: 1050000,
    due_date: '2026-11-15',
    status: 'scheduled',
  },
];

const initialNotifications: Notification[] = [
  {
    id: 'mmmmmmmm-0001-4mmm-8mmm-mmmmmmmmmmmm',
    user_id: '33333333-3333-4333-8333-333333333333',
    project_id: SEED_PROJECT_ID,
    title: 'Countertop Quartz Approval Pending',
    message: 'Please review and sign off on the Calacatta Gold 20mm quartz specification.',
    type: 'approval_required',
    is_read: false,
    link: '/client/approvals',
    created_at: '2026-10-10T10:00:00Z',
  },
  {
    id: 'mmmmmmmm-0002-4mmm-8mmm-mmmmmmmmmmmm',
    user_id: '33333333-3333-4333-8333-333333333333',
    project_id: SEED_PROJECT_ID,
    title: 'Milestone 3 Invoice Generated',
    message: 'Invoice INV-2026-032 (₹6,30,000) is ready for modular woodwork commencement.',
    type: 'milestone_due',
    is_read: false,
    link: '/client/payments',
    created_at: '2026-10-09T12:00:00Z',
  },
  {
    id: 'mmmmmmmm-0003-4mmm-8mmm-mmmmmmmmmmmm',
    user_id: '22222222-2222-4222-8222-222222222222',
    project_id: SEED_PROJECT_ID,
    title: 'Client Feedback on Kids Room',
    message: 'Rahul Sharma requested cable grommet revisions on study desk layout.',
    type: 'approval_required',
    is_read: false,
    link: '/team/approvals',
    created_at: '2026-10-08T15:30:00Z',
  },
];

const initialStudioSettings: StudioSettings = {
  company_name: 'StudioFlow Interiors',
  legal_name: 'StudioFlow Design & Build Private Limited',
  gstin: '36AAACS1429B1Z8',
  email: 'contact@studioflow.design',
  phone: '+91 98490 12345',
  address: 'Plot 84, Road No. 36, Jubilee Hills, Hyderabad, Telangana 500033',
  currency: 'INR',
  currency_symbol: '₹',
  standard_timeline_weeks: 14,
  default_gst_percentage: 18,
  standard_design_fee_sqft: 250,
  notes: 'Standard residential turnkey architecture fee terms and GST schedule.',
};

interface DemoState {
  currentUser: UserProfile;
  currentProjectId: string;
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
  studioSettings: StudioSettings;

  // Actions
  switchRole: (role: UserRole) => void;
  setCurrentProject: (projectId: string) => void;

  // Projects
  addProject: (project: Omit<Project, 'id' | 'created_at' | 'updated_at'>) => Project;
  updateProject: (id: string, updates: Partial<Project>) => void;
  deleteProject: (id: string) => void;

  // Clients
  addClient: (client: Omit<Client, 'id' | 'created_at'>) => Client;
  updateClient: (id: string, updates: Partial<Client>) => void;

  // Team
  addTeamMember: (member: Omit<UserProfile, 'id' | 'created_at'>) => UserProfile;
  updateTeamMember: (id: string, updates: Partial<UserProfile>) => void;

  // Expenses
  addExpense: (expense: Omit<Expense, 'id' | 'created_at'>) => Expense;
  updateExpense: (id: string, updates: Partial<Expense>) => void;

  // Procurement
  addProcurementOrder: (order: Omit<ProcurementOrder, 'id' | 'created_at'>) => ProcurementOrder;
  updateProcurementOrder: (id: string, updates: Partial<ProcurementOrder>) => void;

  // Change Requests
  addChangeRequest: (cr: Omit<ChangeRequest, 'id' | 'created_at'>) => ChangeRequest;
  updateChangeRequest: (id: string, updates: Partial<ChangeRequest>) => void;

  // Approvals
  updateApprovalStatus: (
    id: string,
    status: 'approved' | 'rejected' | 'revision_requested',
    comments?: string
  ) => void;

  // Rooms
  addRoom: (room: Omit<Room, 'id'>) => Room;
  updateRoom: (id: string, updates: Partial<Room>) => void;
  deleteRoom: (id: string) => void;

  // Designs
  addDesignVersion: (version: Omit<DesignVersion, 'id' | 'submitted_at'>) => DesignVersion;
  updateDesignVersion: (id: string, updates: Partial<DesignVersion>) => void;
  submitDesignForApproval: (designId: string, approvalTitle?: string, approvalNotes?: string) => Approval;
  reviewDesignVersion: (designId: string, decision: 'approved' | 'revision_requested', feedback?: string) => void;

  // Approvals
  addApproval: (approval: Omit<Approval, 'id' | 'created_at'>) => Approval;
  updateApproval: (id: string, updates: Partial<Approval>) => void;
  deleteApproval: (id: string) => void;

  // Materials
  addMaterial: (material: Omit<Material, 'id'>) => Material;
  updateMaterial: (id: string, updates: Partial<Material>) => void;
  selectMaterial: (materialId: string, selectionStatus: 'selected_by_client' | 'approved' | 'rejected', notes?: string) => void;
  deleteMaterial: (id: string) => void;

  // Tasks
  addTask: (task: Omit<Task, 'id'>) => Task;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;

  // Site Updates
  addSiteUpdate: (update: Omit<SiteUpdate, 'id'>) => SiteUpdate;
  updateSiteUpdate: (id: string, updates: Partial<SiteUpdate>) => void;
  deleteSiteUpdate: (id: string) => void;

  // Issues
  addIssue: (issue: Omit<Issue, 'id'>) => Issue;
  updateIssue: (id: string, updates: Partial<Issue>) => void;
  deleteIssue: (id: string) => void;

  // Settings
  updateStudioSettings: (updates: Partial<StudioSettings>) => void;

  // Payment Milestones
  updatePaymentMilestone: (id: string, updates: Partial<PaymentMilestone>) => void;

  // Utility
  markNotificationRead: (id: string) => void;
  resetDemoData: () => void;
}

export const useDemoStore = create<DemoState>()(
  persist(
    (set, get) => ({
      currentUser: DEMO_USERS.admin,
      currentProjectId: SEED_PROJECT_ID,
      projects: initialProjects,
      clients: initialClients,
      teamMembers: initialTeamMembers,
      rooms: initialRooms,
      designVersions: initialDesignVersions,
      approvals: initialApprovals,
      changeRequests: initialChangeRequests,
      materials: initialMaterials,
      procurementOrders: initialProcurementOrders,
      tasks: initialTasks,
      siteUpdates: initialSiteUpdates,
      issues: initialIssues,
      expenses: initialExpenses,
      paymentMilestones: initialPaymentMilestones,
      notifications: initialNotifications,
      studioSettings: initialStudioSettings,

      switchRole: (role: UserRole) => {
        set({ currentUser: DEMO_USERS[role] });
      },

      setCurrentProject: (projectId: string) => {
        set({ currentProjectId: projectId });
      },

      addProject: (projectData) => {
        const id = 'proj-' + Math.random().toString(36).substring(2, 9);
        const newProject: Project = {
          ...projectData,
          id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        // Create standard initial milestones for the project
        const b = projectData.total_budget;
        const newMilestones: PaymentMilestone[] = [
          {
            id: 'ms-' + Math.random().toString(36).substring(2, 9),
            project_id: id,
            milestone_code: 'MS-01',
            name: 'Booking & Concept Sign-off',
            stage_trigger: 'Contract signing',
            percentage: 15,
            amount: Math.round(b * 0.15),
            due_date: projectData.estimated_start_date,
            status: 'scheduled',
          },
          {
            id: 'ms-' + Math.random().toString(36).substring(2, 9),
            project_id: id,
            milestone_code: 'MS-02',
            name: 'Civil & MEP Rough-in',
            stage_trigger: 'Rough-in completion',
            percentage: 25,
            amount: Math.round(b * 0.25),
            due_date: projectData.estimated_start_date,
            status: 'scheduled',
          },
          {
            id: 'ms-' + Math.random().toString(36).substring(2, 9),
            project_id: id,
            milestone_code: 'MS-03',
            name: 'Modular Carcass Dispatch',
            stage_trigger: 'Factory dispatch',
            percentage: 35,
            amount: Math.round(b * 0.35),
            due_date: projectData.target_handover_date,
            status: 'scheduled',
          },
          {
            id: 'ms-' + Math.random().toString(36).substring(2, 9),
            project_id: id,
            milestone_code: 'MS-04',
            name: 'Finishing & Handover',
            stage_trigger: 'Final possession',
            percentage: 25,
            amount: Math.round(b * 0.25),
            due_date: projectData.target_handover_date,
            status: 'scheduled',
          },
        ];

        set((state) => ({
          projects: [newProject, ...state.projects],
          paymentMilestones: [...state.paymentMilestones, ...newMilestones],
          currentProjectId: id,
        }));
        return newProject;
      },

      updateProject: (id, updates) => {
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === id ? { ...p, ...updates, updated_at: new Date().toISOString() } : p
          ),
        }));
      },

      deleteProject: (id) => {
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== id),
          currentProjectId:
            state.currentProjectId === id
              ? state.projects.find((p) => p.id !== id)?.id || ''
              : state.currentProjectId,
        }));
      },

      addClient: (clientData) => {
        const id = 'client-' + Math.random().toString(36).substring(2, 9);
        const newClient: Client = {
          ...clientData,
          id,
          created_at: new Date().toISOString(),
        };
        set((state) => ({
          clients: [newClient, ...state.clients],
        }));
        return newClient;
      },

      updateClient: (id, updates) => {
        set((state) => ({
          clients: state.clients.map((c) => (c.id === id ? { ...c, ...updates } : c)),
        }));
      },

      addTeamMember: (memberData) => {
        const id = 'team-' + Math.random().toString(36).substring(2, 9);
        const newMember: UserProfile = {
          ...memberData,
          id,
          created_at: new Date().toISOString(),
        };
        set((state) => ({
          teamMembers: [newMember, ...state.teamMembers],
        }));
        return newMember;
      },

      updateTeamMember: (id, updates) => {
        set((state) => ({
          teamMembers: state.teamMembers.map((m) =>
            m.id === id ? { ...m, ...updates } : m
          ),
        }));
      },

      addExpense: (expenseData) => {
        const id = 'exp-' + Math.random().toString(36).substring(2, 9);
        const newExpense: Expense = {
          ...expenseData,
          id,
          created_at: new Date().toISOString(),
        };
        set((state) => ({
          expenses: [newExpense, ...state.expenses],
        }));
        return newExpense;
      },

      updateExpense: (id, updates) => {
        set((state) => ({
          expenses: state.expenses.map((e) => (e.id === id ? { ...e, ...updates } : e)),
        }));
      },

      addProcurementOrder: (orderData) => {
        const id = 'po-' + Math.random().toString(36).substring(2, 9);
        const newOrder: ProcurementOrder = {
          ...orderData,
          id,
          created_at: new Date().toISOString(),
        };
        set((state) => {
          let updatedMaterials = state.materials;
          if (orderData.material_id) {
            updatedMaterials = state.materials.map((m) =>
              m.id === orderData.material_id
                ? { ...m, procurement_status: 'po_issued' as const }
                : m
            );
          }
          return {
            procurementOrders: [newOrder, ...state.procurementOrders],
            materials: updatedMaterials,
          };
        });
        return newOrder;
      },

      updateProcurementOrder: (id, updates) => {
        set((state) => {
          const order = state.procurementOrders.find((o) => o.id === id);
          const updatedOrders = state.procurementOrders.map((o) =>
            o.id === id ? { ...o, ...updates } : o
          );

          let updatedMaterials = state.materials;
          if (order?.material_id && updates.delivery_status) {
            const matProcStatus: Material['procurement_status'] =
              updates.delivery_status === 'delivered'
                ? 'delivered'
                : updates.delivery_status === 'in_transit'
                ? 'in_transit'
                : updates.delivery_status === 'ordered' || updates.delivery_status === 'dispatched'
                ? 'po_issued'
                : 'not_ordered';

            updatedMaterials = state.materials.map((m) =>
              m.id === order.material_id
                ? { ...m, procurement_status: matProcStatus }
                : m
            );
          }

          return {
            procurementOrders: updatedOrders,
            materials: updatedMaterials,
          };
        });
      },

      addChangeRequest: (crData) => {
        const id = 'cr-' + Math.random().toString(36).substring(2, 9);
        const newCR: ChangeRequest = {
          ...crData,
          id,
          created_at: new Date().toISOString(),
        };
        set((state) => ({
          changeRequests: [newCR, ...state.changeRequests],
        }));
        return newCR;
      },

      updateChangeRequest: (id, updates) => {
        set((state) => {
          const currentCR = state.changeRequests.find((cr) => cr.id === id);
          if (!currentCR) return state;

          const wasApproved = currentCR.status === 'approved';
          const isNowApproved =
            updates.status !== undefined ? updates.status === 'approved' : wasApproved;

          let updatedProjects = state.projects;
          if (!wasApproved && isNowApproved) {
            // Transitioned from not approved to approved
            const costDiff = updates.cost_impact ?? currentCR.cost_impact;
            updatedProjects = state.projects.map((p) =>
              p.id === currentCR.project_id
                ? { ...p, total_budget: p.total_budget + costDiff }
                : p
            );
          } else if (wasApproved && !isNowApproved) {
            // Transitioned from approved to declined/reopened
            const costDiff = currentCR.cost_impact;
            updatedProjects = state.projects.map((p) =>
              p.id === currentCR.project_id
                ? { ...p, total_budget: p.total_budget - costDiff }
                : p
            );
          } else if (
            wasApproved &&
            isNowApproved &&
            updates.cost_impact !== undefined &&
            updates.cost_impact !== currentCR.cost_impact
          ) {
            // Cost impact adjustment on already approved change request
            const delta = updates.cost_impact - currentCR.cost_impact;
            updatedProjects = state.projects.map((p) =>
              p.id === currentCR.project_id
                ? { ...p, total_budget: p.total_budget + delta }
                : p
            );
          }

          return {
            projects: updatedProjects,
            changeRequests: state.changeRequests.map((cr) =>
              cr.id === id ? { ...cr, ...updates } : cr
            ),
          };
        });
      },

      updateApprovalStatus: (id, status, comments) => {
        set((state) => {
          const currentAppr = state.approvals.find((a) => a.id === id);
          const updatedApprovals = state.approvals.map((item) =>
            item.id === id
              ? {
                  ...item,
                  status,
                  client_comments: comments ?? item.client_comments,
                  approved_at: status === 'approved' ? new Date().toISOString() : item.approved_at,
                }
              : item
          );

          let updatedDesignVersions = state.designVersions;
          let updatedRooms = state.rooms;
          let updatedMaterials = state.materials;

          if (currentAppr) {
            // Synchronize linked DesignVersion
            if (currentAppr.design_version_id) {
              const newDesignStatus =
                status === 'approved'
                  ? 'approved'
                  : status === 'revision_requested'
                  ? 'revision_requested'
                  : 'under_review';

              updatedDesignVersions = state.designVersions.map((d) =>
                d.id === currentAppr.design_version_id
                  ? { ...d, status: newDesignStatus }
                  : d
              );
            }

            // Synchronize linked Room
            if (currentAppr.room_id) {
              const newRoomStatus =
                status === 'approved'
                  ? 'approved'
                  : status === 'revision_requested'
                  ? 'in_design'
                  : 'client_review';

              updatedRooms = state.rooms.map((r) =>
                r.id === currentAppr.room_id ? { ...r, status: newRoomStatus } : r
              );
            }

            // Synchronize linked Material if category === 'material'
            if (currentAppr.category === 'material') {
              const targetTitle = currentAppr.title.toLowerCase();
              const targetDesc = (currentAppr.description || '').toLowerCase();
              updatedMaterials = state.materials.map((m) => {
                const matchName =
                  targetTitle.includes(m.name.toLowerCase()) ||
                  targetDesc.includes(m.name.toLowerCase());
                if (!matchName) return m;

                const newSelectionStatus: Material['selection_status'] =
                  status === 'approved'
                    ? 'approved'
                    : status === 'revision_requested'
                    ? 'rejected'
                    : m.selection_status;

                const newApprovalStatus: Material['approval_status'] =
                  status === 'approved'
                    ? 'client_approved'
                    : status === 'revision_requested'
                    ? 'rejected'
                    : m.approval_status;

                return {
                  ...m,
                  selection_status: newSelectionStatus,
                  approval_status: newApprovalStatus,
                };
              });
            }
          }

          return {
            approvals: updatedApprovals,
            designVersions: updatedDesignVersions,
            rooms: updatedRooms,
            materials: updatedMaterials,
          };
        });
      },

      // Rooms
      addRoom: (roomData) => {
        const id = 'room-' + Math.random().toString(36).substring(2, 9);
        const newRoom: Room = {
          ...roomData,
          id,
        };
        set((state) => {
          const updatedRooms = [...state.rooms, newRoom];
          const projectRooms = updatedRooms.filter((r) => r.project_id === newRoom.project_id);
          const totalProgress = projectRooms.reduce((acc, r) => acc + (r.progress_percentage || 0), 0);
          const avgProgress = projectRooms.length > 0 ? Math.round(totalProgress / projectRooms.length) : 0;
          const updatedProjects = state.projects.map((p) =>
            p.id === newRoom.project_id
              ? { ...p, progress_percentage: avgProgress, updated_at: new Date().toISOString() }
              : p
          );
          return {
            rooms: updatedRooms,
            projects: updatedProjects,
          };
        });
        return newRoom;
      },

      updateRoom: (id, updates) => {
        set((state) => {
          const updatedRooms = state.rooms.map((r) =>
            r.id === id ? { ...r, ...updates } : r
          );
          const currentRoom = state.rooms.find((r) => r.id === id);
          let updatedProjects = state.projects;
          if (currentRoom) {
            const projectRooms = updatedRooms.filter((r) => r.project_id === currentRoom.project_id);
            if (projectRooms.length > 0) {
              const totalProgress = projectRooms.reduce((acc, r) => acc + (r.progress_percentage || 0), 0);
              const avgProgress = Math.round(totalProgress / projectRooms.length);
              updatedProjects = state.projects.map((p) =>
                p.id === currentRoom.project_id ? { ...p, progress_percentage: avgProgress, updated_at: new Date().toISOString() } : p
              );
            }
          }
          return {
            rooms: updatedRooms,
            projects: updatedProjects,
          };
        });
      },

      deleteRoom: (id) => {
        set((state) => {
          const currentRoom = state.rooms.find((r) => r.id === id);
          const updatedRooms = state.rooms.filter((r) => r.id !== id);
          let updatedProjects = state.projects;
          if (currentRoom) {
            const projectRooms = updatedRooms.filter((r) => r.project_id === currentRoom.project_id);
            const totalProgress = projectRooms.reduce((acc, r) => acc + (r.progress_percentage || 0), 0);
            const avgProgress = projectRooms.length > 0 ? Math.round(totalProgress / projectRooms.length) : 0;
            updatedProjects = state.projects.map((p) =>
              p.id === currentRoom.project_id
                ? { ...p, progress_percentage: avgProgress, updated_at: new Date().toISOString() }
                : p
            );
          }
          return {
            rooms: updatedRooms,
            projects: updatedProjects,
          };
        });
      },

      // Designs
      addDesignVersion: (versionData) => {
        const id = 'design-' + Math.random().toString(36).substring(2, 9);
        const newDesign: DesignVersion = {
          ...versionData,
          id,
          submitted_at: new Date().toISOString(),
        };
        set((state) => ({
          designVersions: [newDesign, ...state.designVersions],
        }));
        return newDesign;
      },

      updateDesignVersion: (id, updates) => {
        set((state) => ({
          designVersions: state.designVersions.map((d) =>
            d.id === id ? { ...d, ...updates } : d
          ),
        }));
      },

      submitDesignForApproval: (designId, approvalTitle, approvalNotes) => {
        const state = get();
        const design = state.designVersions.find((d) => d.id === designId);
        if (!design) throw new Error('Design version not found');

        const updatedDesign: DesignVersion = {
          ...design,
          status: 'under_review',
          designer_notes: approvalNotes || design.designer_notes,
        };

        const room = state.rooms.find((r) => r.id === design.room_id);
        const title =
          approvalTitle || `${room ? room.name + ': ' : ''}${design.title} (${design.version_number})`;

        // Prevent duplicate approval records for the exact same design version
        const existingApproval = state.approvals.find((a) => a.design_version_id === designId);
        let updatedApprovals: Approval[];
        let targetApproval: Approval;

        if (existingApproval) {
          targetApproval = {
            ...existingApproval,
            title,
            status: 'pending',
            description: design.description,
            internal_notes: approvalNotes || existingApproval.internal_notes,
            due_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          };
          updatedApprovals = state.approvals.map((a) =>
            a.id === existingApproval.id ? targetApproval : a
          );
        } else {
          targetApproval = {
            id: 'appr-' + Math.random().toString(36).substring(2, 9),
            project_id: design.project_id,
            room_id: design.room_id,
            design_version_id: design.id,
            title,
            category: 'design',
            description: design.description,
            status: 'pending',
            internal_notes: approvalNotes,
            due_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            created_at: new Date().toISOString(),
          };
          updatedApprovals = [targetApproval, ...state.approvals];
        }

        const notifId = 'notif-' + Math.random().toString(36).substring(2, 9);
        const newNotif: Notification = {
          id: notifId,
          user_id: SEED_CLIENT_ID,
          project_id: design.project_id,
          title: 'Design Approval Required',
          message: `${title} is ready for client review and sign-off.`,
          type: 'approval_required',
          is_read: false,
          link: '/client/designs',
          created_at: new Date().toISOString(),
        };

        const updatedRooms = state.rooms.map((r) =>
          r.id === design.room_id && r.status === 'in_design'
            ? { ...r, status: 'client_review' as const }
            : r
        );

        set({
          designVersions: state.designVersions.map((d) => (d.id === designId ? updatedDesign : d)),
          approvals: updatedApprovals,
          notifications: [newNotif, ...state.notifications],
          rooms: updatedRooms,
        });

        return targetApproval;
      },

      reviewDesignVersion: (designId, decision, feedback) => {
        set((state) => {
          const design = state.designVersions.find((d) => d.id === designId);
          if (!design) return state;

          const updatedDesignVersions = state.designVersions.map((d) =>
            d.id === designId
              ? {
                  ...d,
                  status: decision,
                  client_feedback: feedback || d.client_feedback,
                  reviewed_at: new Date().toISOString(),
                }
              : d
          );

          // Synchronize linked Approval if exists
          const existingApproval = state.approvals.find((a) => a.design_version_id === designId);
          let updatedApprovals = state.approvals;
          if (existingApproval) {
            updatedApprovals = state.approvals.map((a) =>
              a.id === existingApproval.id
                ? {
                    ...a,
                    status: decision === 'approved' ? 'approved' : 'revision_requested',
                    client_comments: feedback || a.client_comments,
                    approved_at: decision === 'approved' ? new Date().toISOString() : a.approved_at,
                  }
                : a
            );
          } else {
            const newApproval: Approval = {
              id: 'appr-' + Math.random().toString(36).substring(2, 9),
              project_id: design.project_id,
              room_id: design.room_id,
              design_version_id: design.id,
              title: `${design.title} (${design.version_number})`,
              category: 'design',
              description: design.description,
              status: decision === 'approved' ? 'approved' : 'revision_requested',
              client_comments: feedback,
              approved_at: decision === 'approved' ? new Date().toISOString() : undefined,
              created_at: new Date().toISOString(),
            };
            updatedApprovals = [newApproval, ...state.approvals];
          }

          // Synchronize linked Room
          let updatedRooms = state.rooms;
          if (design.room_id) {
            updatedRooms = state.rooms.map((r) =>
              r.id === design.room_id
                ? {
                    ...r,
                    status: decision === 'approved' ? ('approved' as const) : ('in_design' as const),
                  }
                : r
            );
          }

          // Add notification for the designer
          const notif: Notification = {
            id: 'notif-' + Math.random().toString(36).substring(2, 9),
            user_id: '22222222-2222-4222-8222-222222222222',
            project_id: design.project_id,
            title: decision === 'approved' ? 'Design Approved by Client' : 'Revision Requested on Design',
            message: `${design.title} was ${decision === 'approved' ? 'approved' : 'marked for revision'}${feedback ? `: "${feedback}"` : '.'}`,
            type: 'approval_required',
            is_read: false,
            link: '/team/designs',
            created_at: new Date().toISOString(),
          };

          return {
            designVersions: updatedDesignVersions,
            approvals: updatedApprovals,
            rooms: updatedRooms,
            notifications: [notif, ...state.notifications],
          };
        });
      },

      // Approvals
      addApproval: (approvalData) => {
        const id = 'appr-' + Math.random().toString(36).substring(2, 9);
        const newApproval: Approval = {
          ...approvalData,
          id,
          created_at: new Date().toISOString(),
        };
        set((state) => ({
          approvals: [newApproval, ...state.approvals],
        }));
        return newApproval;
      },

      updateApproval: (id, updates) => {
        set((state) => ({
          approvals: state.approvals.map((a) => (a.id === id ? { ...a, ...updates } : a)),
        }));
      },

      deleteApproval: (id) => {
        set((state) => ({
          approvals: state.approvals.filter((a) => a.id !== id),
        }));
      },

      // Materials
      addMaterial: (materialData) => {
        const id = 'mat-' + Math.random().toString(36).substring(2, 9);
        const newMaterial: Material = {
          ...materialData,
          id,
        };
        set((state) => ({
          materials: [newMaterial, ...state.materials],
        }));
        return newMaterial;
      },

      updateMaterial: (id, updates) => {
        set((state) => ({
          materials: state.materials.map((m) => (m.id === id ? { ...m, ...updates } : m)),
        }));
      },

      selectMaterial: (materialId, selectionStatus, notes) => {
        set((state) => {
          const material = state.materials.find((m) => m.id === materialId);
          if (!material) return state;

          const approvalStatus: Material['approval_status'] =
            selectionStatus === 'rejected' ? 'rejected' : 'client_approved';
          const updatedMaterials = state.materials.map((m) =>
            m.id === materialId
              ? {
                  ...m,
                  selection_status: selectionStatus,
                  approval_status: approvalStatus,
                }
              : m
          );

          // Synchronize linked approval if exists
          const linkedAppr = state.approvals.find(
            (a) =>
              (a.title && a.title.toLowerCase().includes(material.name.toLowerCase())) ||
              (a.description && a.description.toLowerCase().includes(material.name.toLowerCase()))
          );
          let updatedApprovals = state.approvals;
          if (linkedAppr) {
            updatedApprovals = state.approvals.map((a) =>
              a.id === linkedAppr.id
                ? {
                    ...a,
                    status: selectionStatus === 'rejected' ? ('revision_requested' as const) : ('approved' as const),
                    client_comments: notes || (selectionStatus === 'rejected' ? 'Alternative requested' : 'Approved by client'),
                    approved_at: selectionStatus !== 'rejected' ? new Date().toISOString() : undefined,
                  }
                : a
            );
          }

          // Add notification for team
          const notif: Notification = {
            id: 'notif-' + Math.random().toString(36).substring(2, 9),
            user_id: '22222222-2222-4222-8222-222222222222',
            project_id: material.project_id,
            title: selectionStatus === 'rejected' ? 'Material Alternative Requested' : 'Material Selected by Client',
            message: `${material.name} ${selectionStatus === 'rejected' ? 'was rejected with request for alternative' : 'was confirmed by homeowner'}${notes ? `: "${notes}"` : '.'}`,
            type: 'approval_required',
            is_read: false,
            link: '/team/materials',
            created_at: new Date().toISOString(),
          };

          return {
            materials: updatedMaterials,
            approvals: updatedApprovals,
            notifications: [notif, ...state.notifications],
          };
        });
      },

      deleteMaterial: (id) => {
        set((state) => ({
          materials: state.materials.filter((m) => m.id !== id),
        }));
      },

      // Tasks
      addTask: (taskData) => {
        const id = 'task-' + Math.random().toString(36).substring(2, 9);
        const newTask: Task = {
          ...taskData,
          id,
        };
        set((state) => ({
          tasks: [newTask, ...state.tasks],
        }));
        return newTask;
      },

      updateTask: (id, updates) => {
        set((state) => ({
          tasks: state.tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)),
        }));
      },

      deleteTask: (id) => {
        set((state) => ({
          tasks: state.tasks.filter((t) => t.id !== id),
        }));
      },

      // Site Updates
      addSiteUpdate: (updateData) => {
        const id = 'siteup-' + Math.random().toString(36).substring(2, 9);
        const newUpdate: SiteUpdate = {
          ...updateData,
          id,
        };
        set((state) => ({
          siteUpdates: [newUpdate, ...state.siteUpdates],
        }));
        return newUpdate;
      },

      updateSiteUpdate: (id, updates) => {
        set((state) => ({
          siteUpdates: state.siteUpdates.map((s) => (s.id === id ? { ...s, ...updates } : s)),
        }));
      },

      deleteSiteUpdate: (id) => {
        set((state) => ({
          siteUpdates: state.siteUpdates.filter((s) => s.id !== id),
        }));
      },

      // Issues
      addIssue: (issueData) => {
        const id = 'issue-' + Math.random().toString(36).substring(2, 9);
        const newIssue: Issue = {
          ...issueData,
          id,
        };
        set((state) => ({
          issues: [newIssue, ...state.issues],
        }));
        return newIssue;
      },

      updateIssue: (id, updates) => {
        set((state) => ({
          issues: state.issues.map((i) => (i.id === id ? { ...i, ...updates } : i)),
        }));
      },

      deleteIssue: (id) => {
        set((state) => ({
          issues: state.issues.filter((i) => i.id !== id),
        }));
      },

      updateStudioSettings: (updates) => {
        set((state) => ({
          studioSettings: { ...state.studioSettings, ...updates },
        }));
      },

      updatePaymentMilestone: (id, updates) => {
        set((state) => ({
          paymentMilestones: state.paymentMilestones.map((m) =>
            m.id === id
              ? {
                  ...m,
                  ...updates,
                  paid_at:
                    updates.status === 'payment_received'
                      ? updates.paid_at || new Date().toISOString()
                      : m.paid_at,
                }
              : m
          ),
        }));
      },

      markNotificationRead: (id) => {
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, is_read: true } : n
          ),
        }));
      },

      resetDemoData: () => {
        set({
          currentUser: DEMO_USERS.admin,
          currentProjectId: SEED_PROJECT_ID,
          projects: initialProjects,
          clients: initialClients,
          teamMembers: initialTeamMembers,
          rooms: initialRooms,
          designVersions: initialDesignVersions,
          approvals: initialApprovals,
          changeRequests: initialChangeRequests,
          materials: initialMaterials,
          procurementOrders: initialProcurementOrders,
          tasks: initialTasks,
          siteUpdates: initialSiteUpdates,
          issues: initialIssues,
          expenses: initialExpenses,
          paymentMilestones: initialPaymentMilestones,
          notifications: initialNotifications,
          studioSettings: initialStudioSettings,
        });
        localStorage.removeItem('studioflow-demo-store-v2');
        localStorage.removeItem('studioflow-demo-store-v3');
      },
    }),
    {
      name: 'studioflow-demo-store-v3',
      version: 4,
      migrate: (persistedState: any, version: number) => {
        if (
          version < 4 ||
          persistedState?.projects?.[0]?.target_handover_date?.includes('2024')
        ) {
          return {
            ...persistedState,
            projects: initialProjects,
            clients: initialClients,
            teamMembers: initialTeamMembers,
            rooms: initialRooms,
            designVersions: initialDesignVersions,
            approvals: initialApprovals,
            changeRequests: initialChangeRequests,
            materials: initialMaterials,
            procurementOrders: initialProcurementOrders,
            tasks: initialTasks,
            siteUpdates: initialSiteUpdates,
            issues: initialIssues,
            expenses: initialExpenses,
            paymentMilestones: initialPaymentMilestones,
            notifications: initialNotifications,
            studioSettings: initialStudioSettings,
          };
        }
        return persistedState;
      },
      partialize: (state) => ({
        currentProjectId: state.currentProjectId,
        projects: state.projects,
        clients: state.clients,
        teamMembers: state.teamMembers,
        rooms: state.rooms,
        designVersions: state.designVersions,
        approvals: state.approvals,
        changeRequests: state.changeRequests,
        materials: state.materials,
        procurementOrders: state.procurementOrders,
        tasks: state.tasks,
        siteUpdates: state.siteUpdates,
        issues: state.issues,
        expenses: state.expenses,
        paymentMilestones: state.paymentMilestones,
        studioSettings: state.studioSettings,
      }),
    }
  )
);
