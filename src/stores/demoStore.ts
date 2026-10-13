import { create } from 'zustand';
import {
  UserProfile,
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
} from '@/types';

// Demo Identies
export const DEMO_USERS: Record<UserRole, UserProfile> = {
  admin: {
    id: '11111111-1111-4111-8111-111111111111',
    email: 'priya.nair@studioflow.design',
    full_name: 'Priya Nair',
    role: 'admin',
    phone: '+91 98490 12345',
    avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    company_name: 'StudioFlow Interiors',
  },
  designer: {
    id: '22222222-2222-4222-8222-222222222222',
    email: 'arjun.mehta@studioflow.design',
    full_name: 'Arjun Mehta',
    role: 'designer',
    phone: '+91 98490 23456',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    company_name: 'StudioFlow Interiors',
  },
  site_manager: {
    id: '22222222-2222-4222-8222-222222222222',
    email: 'arjun.mehta@studioflow.design',
    full_name: 'Arjun Mehta (Site Lead)',
    role: 'site_manager',
    phone: '+91 98490 23456',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    company_name: 'StudioFlow Interiors',
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

// Initial Seed Dataset for Rahul Sharma — 3BHK Apartment
const SEED_PROJECT_ID = 'aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa';

const initialProjects: Project[] = [
  {
    id: SEED_PROJECT_ID,
    project_code: 'PRJ-HYD-2401',
    title: 'Rahul Sharma — 3BHK Apartment',
    client_id: '33333333-3333-4333-8333-333333333333',
    lead_designer_id: '22222222-2222-4222-8222-222222222222',
    site_manager_id: '22222222-2222-4222-8222-222222222222',
    location: 'Flat 1204, Tower B, Aparna Sarovar Grande, Nallagandla',
    city: 'Hyderabad',
    property_type: '3BHK Apartment',
    carpet_area_sqft: 1850,
    total_budget: 1800000,
    estimated_start_date: '2024-01-15',
    target_handover_date: '2024-04-30',
    status: 'execution',
    progress_percentage: 45,
    notes:
      'Turnkey interior transformation with bespoke oak veneer cabinetry, quartz countertops, and concealed architectural warm lighting.',
  },
  {
    id: 'aaaaaaaa-bbbb-4aaa-8aaa-bbbbbbbbbbbb',
    project_code: 'PRJ-HYD-2402',
    title: 'Ananya Reddy — 4BHK Villa',
    client_id: 'client-2',
    lead_designer_id: '22222222-2222-4222-8222-222222222222',
    site_manager_id: '22222222-2222-4222-8222-222222222222',
    location: 'Villa 42, Palm Meadows, Gachibowli',
    city: 'Hyderabad',
    property_type: '4BHK Duplex Villa',
    carpet_area_sqft: 3400,
    total_budget: 4200000,
    estimated_start_date: '2024-02-01',
    target_handover_date: '2024-06-15',
    status: 'design_phase',
    progress_percentage: 20,
    notes: 'Contemporary minimalist villa with Italian marble and double-height living foyer.',
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
  },
  {
    id: 'bbbbbbbb-0002-4bbb-8bbb-bbbbbbbbbbbb',
    project_id: SEED_PROJECT_ID,
    name: 'Modular Kitchen',
    floor: '12th Floor',
    dimensions: '14 ft x 10 ft',
    area_sqft: 140,
    status: 'client_review',
  },
  {
    id: 'bbbbbbbb-0003-4bbb-8bbb-bbbbbbbbbbbb',
    project_id: SEED_PROJECT_ID,
    name: 'Master Bedroom',
    floor: '12th Floor',
    dimensions: '16 ft x 14 ft',
    area_sqft: 224,
    status: 'approved',
  },
  {
    id: 'bbbbbbbb-0004-4bbb-8bbb-bbbbbbbbbbbb',
    project_id: SEED_PROJECT_ID,
    name: 'Bedroom 2 (Kids Room)',
    floor: '12th Floor',
    dimensions: '14 ft x 12 ft',
    area_sqft: 168,
    status: 'in_design',
  },
  {
    id: 'bbbbbbbb-0005-4bbb-8bbb-bbbbbbbbbbbb',
    project_id: SEED_PROJECT_ID,
    name: 'Bedroom 3 (Study / Guest)',
    floor: '12th Floor',
    dimensions: '13 ft x 11 ft',
    area_sqft: 143,
    status: 'pending',
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
    submitted_at: '2024-02-10T10:00:00Z',
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
    submitted_at: '2024-02-18T14:30:00Z',
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
    submitted_at: '2024-02-05T09:15:00Z',
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
    due_date: '2024-02-28',
    client_comments: 'Checking edge profile details with family.',
    created_at: '2024-02-18T10:00:00Z',
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
    due_date: '2024-02-15',
    client_comments: 'Approved sample in person on site.',
    approved_at: '2024-02-14T16:00:00Z',
    created_at: '2024-02-08T10:00:00Z',
  },
  {
    id: 'dddddddd-0003-4ddd-8ddd-dddddddddddd',
    project_id: SEED_PROJECT_ID,
    room_id: 'bbbbbbbb-0004-4bbb-8bbb-bbbbbbbbbbbb',
    title: 'Kids Bedroom Dual Study & Bunk Framework Layout',
    category: 'layout',
    description: 'Ergonomic dual-study desk with book storage along East wall.',
    status: 'revision_requested',
    due_date: '2024-02-25',
    client_comments: 'Please add cable grommets and softer corner radii.',
    created_at: '2024-02-15T11:20:00Z',
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
    cost_impact: 34500,
    timeline_impact_days: 2,
    status: 'approved',
    created_at: '2024-02-12T14:00:00Z',
  },
  {
    id: 'eeeeeeee-0002-4eee-8eee-eeeeeeeeeeee',
    project_id: SEED_PROJECT_ID,
    room_id: 'bbbbbbbb-0003-4bbb-8bbb-bbbbbbbbbbbb',
    request_code: 'CR-002',
    title: 'Smart Motorized Curtains in Master Suite',
    description:
      'Provision electrical raceway and motor tracks for automated sheer and blackout dual tracks.',
    cost_impact: 22000,
    timeline_impact_days: 1,
    status: 'under_review',
    created_at: '2024-02-19T09:30:00Z',
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
    approval_status: 'client_approved',
    procurement_status: 'delivered',
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
    approval_status: 'spec_draft',
    procurement_status: 'not_ordered',
  },
];

const initialProcurementOrders: ProcurementOrder[] = [
  {
    id: 'gggggggg-0001-4ggg-8ggg-gggggggggggg',
    project_id: SEED_PROJECT_ID,
    po_number: 'PO-2024-001',
    vendor_name: 'Decorex Marble Importers, Banjara Hills',
    vendor_contact: '+91 98491 11222',
    order_date: '2024-01-28',
    expected_delivery_date: '2024-02-12',
    actual_delivery_date: '2024-02-11',
    total_amount: 195300,
    payment_status: 'paid',
    delivery_status: 'received',
    notes: 'All 420 sqft slabs delivered and inspected for hairline fissures.',
  },
  {
    id: 'gggggggg-0002-4ggg-8ggg-gggggggggggg',
    project_id: SEED_PROJECT_ID,
    po_number: 'PO-2024-002',
    vendor_name: 'Häfele & Blum Hardware Galleria, Jubilee Hills',
    vendor_contact: '+91 98492 33445',
    order_date: '2024-02-15',
    expected_delivery_date: '2024-02-24',
    total_amount: 86400,
    payment_status: 'partially_paid',
    delivery_status: 'ordered',
    notes: 'Drawer slides and tip-on aventos mechanisms dispatched.',
  },
  {
    id: 'gggggggg-0003-4ggg-8ggg-gggggggggggg',
    project_id: SEED_PROJECT_ID,
    po_number: 'PO-2024-003',
    vendor_name: 'Greenlam & Century Laminate Depot, Secunderabad',
    vendor_contact: '+91 98493 55667',
    order_date: '2024-02-18',
    expected_delivery_date: '2024-02-27',
    total_amount: 62000,
    payment_status: 'pending',
    delivery_status: 'ordered',
    notes: 'Natural Smoked Oak 1mm veneer sheets scheduled for delivery.',
  },
];

const initialTasks: Task[] = [
  {
    id: 'hhhhhhhh-0001-4hhh-8hhh-hhhhhhhhhhhh',
    project_id: SEED_PROJECT_ID,
    room_id: 'bbbbbbbb-0001-4bbb-8bbb-bbbbbbbbbbbb',
    title: 'Living Room false ceiling framing & gypsum boarding',
    category: 'false_ceiling',
    start_date: '2024-02-05',
    due_date: '2024-02-14',
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
    start_date: '2024-02-15',
    due_date: '2024-02-26',
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
    start_date: '2024-02-17',
    due_date: '2024-02-23',
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
    start_date: '2024-02-25',
    due_date: '2024-03-04',
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
    start_date: '2024-03-01',
    due_date: '2024-03-08',
    status: 'todo',
    priority: 'medium',
    progress_percent: 0,
  },
];

const initialSiteUpdates: SiteUpdate[] = [
  {
    id: 'iiiiiiii-0001-4iii-8iii-iiiiiiiiiiii',
    project_id: SEED_PROJECT_ID,
    title: 'False Ceiling Gypsum Boarding Done in Living & Dining',
    description:
      'Completed Saint-Gobain channel perimeter grid and 12.5mm gypsum sheets. Recessed cove channel ready for LED strip testing.',
    photo_urls: [
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80',
    ],
    date: '2024-02-20',
    work_completed_summary: 'Framing 100%, joint taping in progress, zero level check passed.',
    workforce_count: 7,
    delay_flag: false,
    weather_conditions: 'Sunny 29°C',
  },
  {
    id: 'iiiiiiii-0002-4iii-8iii-iiiiiiiiiiii',
    project_id: SEED_PROJECT_ID,
    title: 'Kitchen Plumbing Line Relocation & Tile Core-Cutting',
    description:
      'Completed under-sink dishwasher inlet water connection and water purifier drain point core cutting.',
    photo_urls: [
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop&q=80',
    ],
    date: '2024-02-16',
    work_completed_summary: 'Plumber completed pressure gauge leak test at 4 bar for 45 mins.',
    workforce_count: 5,
    delay_flag: false,
    weather_conditions: 'Clear 31°C',
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
  },
];

const initialExpenses: Expense[] = [
  {
    id: 'kkkkkkkk-0001-4kkk-8kkk-kkkkkkkkkkkk',
    project_id: SEED_PROJECT_ID,
    category: 'contractor_advance',
    amount: 45000,
    payment_mode: 'bank_transfer',
    paid_to: 'Ramesh Carpentry Contractor',
    status: 'approved',
    incurred_on: '2024-02-15',
  },
  {
    id: 'kkkkkkkk-0002-4kkk-8kkk-kkkkkkkkkkkk',
    project_id: SEED_PROJECT_ID,
    category: 'material_local',
    amount: 8400,
    payment_mode: 'upi',
    paid_to: 'Sri Balaji Hardware & Fasteners',
    status: 'approved',
    incurred_on: '2024-02-18',
  },
  {
    id: 'kkkkkkkk-0003-4kkk-8kkk-kkkkkkkkkkkk',
    project_id: SEED_PROJECT_ID,
    category: 'permit_fee',
    amount: 3500,
    payment_mode: 'upi',
    paid_to: 'Aparna Sarovar Residents Association Debris Pass',
    status: 'approved',
    incurred_on: '2024-01-20',
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
    due_date: '2024-01-10',
    status: 'payment_received',
    paid_at: '2024-01-12T11:30:00Z',
    invoice_number: 'INV-2024-001',
  },
  {
    id: 'llllllll-0002-4lll-8lll-llllllllllll',
    project_id: SEED_PROJECT_ID,
    milestone_code: 'MS-02',
    name: 'Civil & False Ceiling Completion',
    stage_trigger: 'Completion of masonry, electrical roughing & false ceiling',
    percentage: 25,
    amount: 450000,
    due_date: '2024-02-15',
    status: 'payment_received',
    paid_at: '2024-02-16T16:45:00Z',
    invoice_number: 'INV-2024-014',
  },
  {
    id: 'llllllll-0003-4lll-8lll-llllllllllll',
    project_id: SEED_PROJECT_ID,
    milestone_code: 'MS-03',
    name: 'Modular Woodwork Carcass & Factory Dispatch',
    stage_trigger: 'Factory manufacturing ready & on-site assembly commencement',
    percentage: 35,
    amount: 630000,
    due_date: '2024-03-02',
    status: 'invoice_raised',
    invoice_number: 'INV-2024-032',
  },
  {
    id: 'llllllll-0004-4lll-8lll-llllllllllll',
    project_id: SEED_PROJECT_ID,
    milestone_code: 'MS-04',
    name: 'Countertops, Painting & Fixtures Installation',
    stage_trigger: 'Quartz installation, 2nd coat paint & electrical fittings',
    percentage: 20,
    amount: 360000,
    due_date: '2024-03-25',
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
    due_date: '2024-04-30',
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
    created_at: '2024-02-19T10:00:00Z',
  },
  {
    id: 'mmmmmmmm-0002-4mmm-8mmm-mmmmmmmmmmmm',
    user_id: '33333333-3333-4333-8333-333333333333',
    project_id: SEED_PROJECT_ID,
    title: 'Milestone 3 Invoice Generated',
    message: 'Invoice INV-2024-032 (₹6,30,000) is ready for modular woodwork commencement.',
    type: 'milestone_due',
    is_read: false,
    link: '/client/payments',
    created_at: '2024-02-18T12:00:00Z',
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
    created_at: '2024-02-16T15:30:00Z',
  },
];

interface DemoState {
  currentUser: UserProfile;
  currentProjectId: string;
  projects: Project[];
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

  // Actions
  switchRole: (role: UserRole) => void;
  setCurrentProject: (projectId: string) => void;
  updateApprovalStatus: (
    id: string,
    status: 'approved' | 'rejected' | 'revision_requested',
    comments?: string
  ) => void;
  markNotificationRead: (id: string) => void;
  resetDemoData: () => void;
}

export const useDemoStore = create<DemoState>((set) => ({
  currentUser: DEMO_USERS.admin,
  currentProjectId: SEED_PROJECT_ID,
  projects: initialProjects,
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

  switchRole: (role: UserRole) => {
    set({ currentUser: DEMO_USERS[role] });
  },

  setCurrentProject: (projectId: string) => {
    set({ currentProjectId: projectId });
  },

  updateApprovalStatus: (id, status, comments) => {
    set((state) => ({
      approvals: state.approvals.map((item) =>
        item.id === id
          ? {
              ...item,
              status,
              client_comments: comments ?? item.client_comments,
              approved_at: status === 'approved' ? new Date().toISOString() : item.approved_at,
            }
          : item
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
    });
  },
}));
