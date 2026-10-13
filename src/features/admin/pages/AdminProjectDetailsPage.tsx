import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowLeft,
  User,
  Users,
  HardHat,
  Receipt,
  Package,
  Layers,
  AlertOctagon,
  ArrowUpRight,
  TrendingUp,
  FileSignature,
  Edit2,
} from 'lucide-react';
import { useDemoStore } from '@/stores/demoStore';
import { formatINR, formatDate } from '@/lib/utils';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { EmptyState } from '@/components/shared/EmptyState';

export function AdminProjectDetailsPage() {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  const {
    projects,
    clients,
    teamMembers,
    rooms,
    designVersions,
    approvals,
    materials,
    procurementOrders,
    tasks,
    siteUpdates,
    issues,
    expenses,
    paymentMilestones,
    changeRequests,
    setCurrentProject,
  } = useDemoStore();

  const [activeTab, setActiveTab] = useState('overview');

  const project = projects.find((p) => p.id === projectId) || projects[0];

  if (!project) {
    return (
      <div className="p-8">
        <EmptyState
          icon={Building2}
          title="Project Not Found"
          description="The requested project identifier does not exist."
          actionLabel="Back to Projects Directory"
          onAction={() => navigate('/admin/projects')}
        />
      </div>
    );
  }

  // Filter child records strictly by project ID
  const projectRooms = rooms.filter((r) => r.project_id === project.id);
  const projectDesigns = designVersions.filter((d) => d.project_id === project.id);
  const projectApprovals = approvals.filter((a) => a.project_id === project.id);
  const projectMaterials = materials.filter((m) => m.project_id === project.id);
  const projectOrders = procurementOrders.filter((o) => o.project_id === project.id);
  const projectTasks = tasks.filter((t) => t.project_id === project.id);
  const projectSiteUpdates = siteUpdates.filter((u) => u.project_id === project.id);
  const projectIssues = issues.filter((i) => i.project_id === project.id);
  const projectExpenses = expenses.filter((e) => e.project_id === project.id);
  const projectMilestones = paymentMilestones.filter((m) => m.project_id === project.id);
  const projectChanges = changeRequests.filter((c) => c.project_id === project.id);

  const client = clients.find((c) => c.id === project.client_id);
  const designer = teamMembers.find((m) => m.id === project.lead_designer_id);
  const siteLead = teamMembers.find((m) => m.id === project.site_manager_id);

  // Financial aggregates
  const totalExpenses = projectExpenses.reduce((sum, e) => sum + e.amount, 0);
  const totalCollected = projectMilestones
    .filter((m) => m.status === 'payment_received')
    .reduce((sum, m) => sum + m.amount, 0);

  const approvedChangeTotal = projectChanges
    .filter((c) => c.status === 'approved')
    .reduce((sum, c) => sum + c.cost_impact, 0);

  return (
    <div className="space-y-6">
      {/* Top Breadcrumb & Nav Header */}
      <PageHeader
        title={project.title}
        subtitle={`${project.property_type} • ${project.location}`}
        breadcrumbs={[
          { label: 'Admin', href: '/admin/dashboard' },
          { label: 'Projects', href: '/admin/projects' },
          { label: project.project_code },
        ]}
        badge={<StatusBadge status={project.status} />}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setCurrentProject(project.id);
                navigate('/client/dashboard');
              }}
              className="text-xs"
            >
              Client View <ArrowUpRight className="w-3.5 h-3.5 ml-1 text-stone-500" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setCurrentProject(project.id);
                navigate('/team/dashboard');
              }}
              className="text-xs"
            >
              Team View <ArrowUpRight className="w-3.5 h-3.5 ml-1 text-stone-500" />
            </Button>
            <Button
              size="sm"
              onClick={() => navigate('/admin/projects')}
              className="text-xs"
            >
              <ArrowLeft className="w-3.5 h-3.5 mr-1" /> All Projects
            </Button>
          </div>
        }
      />

      {/* High-level Project Metrics Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="p-3.5">
          <span className="text-[11px] font-medium text-stone-500 uppercase tracking-wider block">
            Contracted Budget
          </span>
          <span className="text-lg font-bold text-stone-900 block mt-1">
            {formatINR(project.total_budget)}
          </span>
          {approvedChangeTotal > 0 && (
            <span className="text-[11px] text-emerald-800 font-medium">
              +{formatINR(approvedChangeTotal)} approved changes
            </span>
          )}
        </Card>

        <Card className="p-3.5">
          <span className="text-[11px] font-medium text-stone-500 uppercase tracking-wider block">
            Collected Inflow
          </span>
          <span className="text-lg font-bold text-[#204E38] block mt-1">
            {formatINR(totalCollected)}
          </span>
          <span className="text-[11px] text-stone-500">
            {Math.round((totalCollected / project.total_budget) * 100)}% milestone progress
          </span>
        </Card>

        <Card className="p-3.5">
          <span className="text-[11px] font-medium text-stone-500 uppercase tracking-wider block">
            Recorded Site Expenses
          </span>
          <span className="text-lg font-bold text-stone-900 block mt-1">
            {formatINR(totalExpenses)}
          </span>
          <span className="text-[11px] text-stone-500">
            {projectExpenses.length} verified voucher receipts
          </span>
        </Card>

        <Card className="p-3.5">
          <span className="text-[11px] font-medium text-stone-500 uppercase tracking-wider block">
            Target Handover
          </span>
          <span className="text-lg font-bold text-stone-900 block mt-1">
            {formatDate(project.target_handover_date)}
          </span>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex-1 bg-stone-200 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-[#2A5C45] h-full"
                style={{ width: `${project.progress_percentage}%` }}
              />
            </div>
            <span className="text-xs font-mono font-medium text-stone-700">
              {project.progress_percentage}%
            </span>
          </div>
        </Card>
      </div>

      {/* Tabs Layout */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-white border border-stone-200 p-1 flex overflow-x-auto gap-1">
          <TabsTrigger value="overview" className="text-xs">
            Overview & Rooms ({projectRooms.length})
          </TabsTrigger>
          <TabsTrigger value="financials" className="text-xs">
            Financials & Milestones ({projectMilestones.length})
          </TabsTrigger>
          <TabsTrigger value="designs" className="text-xs">
            Designs & Approvals ({projectApprovals.length})
          </TabsTrigger>
          <TabsTrigger value="procurement" className="text-xs">
            Materials & Orders ({projectOrders.length})
          </TabsTrigger>
          <TabsTrigger value="execution" className="text-xs">
            Site Logs & Snags ({projectIssues.length})
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: Overview & Rooms */}
        <TabsContent value="overview" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Stakeholders Card */}
            <Card className="md:col-span-1">
              <CardHeader className="pb-3 border-b border-stone-100">
                <CardTitle className="text-sm font-semibold">Project Stakeholders</CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4 text-xs">
                <div>
                  <span className="text-stone-400 text-[11px] uppercase tracking-wider block">Client (Homeowner)</span>
                  <div className="font-semibold text-stone-900 text-sm mt-0.5">{client?.full_name || 'Rahul Sharma'}</div>
                  <div className="text-stone-500">{client?.email}</div>
                  <div className="text-stone-500">{client?.phone}</div>
                </div>
                <div className="border-t border-stone-100 pt-3">
                  <span className="text-stone-400 text-[11px] uppercase tracking-wider block">Lead Interior Designer</span>
                  <div className="font-semibold text-stone-900 mt-0.5">{designer?.full_name || 'Arjun Mehta'}</div>
                  <div className="text-stone-500">{designer?.specialization || 'Interior Designer'}</div>
                  <div className="text-stone-500">{designer?.phone}</div>
                </div>
                <div className="border-t border-stone-100 pt-3">
                  <span className="text-stone-400 text-[11px] uppercase tracking-wider block">Site Execution Manager</span>
                  <div className="font-semibold text-stone-900 mt-0.5">{siteLead?.full_name || 'Suresh Rao'}</div>
                  <div className="text-stone-500">{siteLead?.specialization || 'Site Operations'}</div>
                  <div className="text-stone-500">{siteLead?.phone}</div>
                </div>
              </CardContent>
            </Card>

            {/* Room Specifications Table */}
            <Card className="md:col-span-2">
              <CardHeader className="pb-3 border-b border-stone-100">
                <CardTitle className="text-sm font-semibold">Configured Architectural Spaces ({projectRooms.length})</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Space / Room Name</TableHead>
                      <TableHead>Floor</TableHead>
                      <TableHead>Dimensions</TableHead>
                      <TableHead>Area (sqft)</TableHead>
                      <TableHead>Stage Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {projectRooms.map((room) => (
                      <TableRow key={room.id}>
                        <TableCell className="font-medium text-stone-900 text-xs">
                          {room.name}
                        </TableCell>
                        <TableCell className="text-xs text-stone-500">{room.floor || 'Ground'}</TableCell>
                        <TableCell className="text-xs font-mono text-stone-600">{room.dimensions || '—'}</TableCell>
                        <TableCell className="text-xs font-semibold text-stone-800">{room.area_sqft} sqft</TableCell>
                        <TableCell>
                          <StatusBadge status={room.status} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          {/* Scope Notes */}
          {project.notes && (
            <Card className="p-4 bg-stone-50/50">
              <span className="text-xs font-semibold text-stone-800 block mb-1">Architectural Scope Brief:</span>
              <p className="text-xs text-stone-600 leading-relaxed">{project.notes}</p>
            </Card>
          )}
        </TabsContent>

        {/* TAB 2: Financials & Milestones */}
        <TabsContent value="financials" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Milestones Schedule */}
            <Card>
              <CardHeader className="pb-3 border-b border-stone-100">
                <CardTitle className="text-sm font-semibold">Milestone Billing Schedule</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Code</TableHead>
                      <TableHead>Deliverable Trigger</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {projectMilestones.map((m) => (
                      <TableRow key={m.id}>
                        <TableCell className="font-mono text-xs font-semibold">{m.milestone_code}</TableCell>
                        <TableCell className="text-xs">
                          <span className="font-medium text-stone-900 block">{m.name}</span>
                          <span className="text-stone-400 text-[11px]">{m.stage_trigger}</span>
                        </TableCell>
                        <TableCell className="text-xs font-semibold text-stone-800 whitespace-nowrap">
                          {formatINR(m.amount)} ({m.percentage}%)
                        </TableCell>
                        <TableCell>
                          <StatusBadge status={m.status} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Recorded Expenses */}
            <Card>
              <CardHeader className="pb-3 border-b border-stone-100">
                <CardTitle className="text-sm font-semibold">Recorded Site Expenses & Petty Cash</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {projectExpenses.length === 0 ? (
                  <div className="p-6 text-center text-xs text-stone-500">
                    No site expenses logged for this project yet.
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Paid To / Vendor</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {projectExpenses.map((e) => (
                        <TableRow key={e.id}>
                          <TableCell className="text-xs text-stone-500">{e.incurred_on}</TableCell>
                          <TableCell className="text-xs font-medium text-stone-900">{e.paid_to}</TableCell>
                          <TableCell className="text-xs uppercase font-mono text-stone-600">{e.category}</TableCell>
                          <TableCell className="text-xs font-semibold text-stone-800">{formatINR(e.amount)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* TAB 3: Designs & Approvals */}
        <TabsContent value="designs" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* 3D Render Versions */}
            <Card>
              <CardHeader className="pb-3 border-b border-stone-100">
                <CardTitle className="text-sm font-semibold">Design Studio Packages</CardTitle>
              </CardHeader>
              <CardContent className="p-3 space-y-3">
                {projectDesigns.map((d) => (
                  <div key={d.id} className="p-3 rounded border border-stone-200 bg-stone-50/50 flex gap-3 text-xs">
                    {d.preview_url && (
                      <img
                        src={d.preview_url}
                        alt={d.title}
                        className="w-20 h-16 object-cover rounded border border-stone-200 shrink-0"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-stone-900">{d.title}</span>
                        <Badge variant="outline" className="text-[10px] font-mono">{d.version_number}</Badge>
                      </div>
                      <p className="text-[11px] text-stone-500 mt-0.5 line-clamp-1">{d.description}</p>
                      <div className="mt-1">
                        <StatusBadge status={d.status} />
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Approvals Matrix */}
            <Card>
              <CardHeader className="pb-3 border-b border-stone-100">
                <CardTitle className="text-sm font-semibold">Client Approval Queue</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Decision Item</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Due Date</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {projectApprovals.map((a) => (
                      <TableRow key={a.id}>
                        <TableCell className="text-xs font-medium text-stone-900">{a.title}</TableCell>
                        <TableCell className="text-xs uppercase font-mono text-stone-500">{a.category}</TableCell>
                        <TableCell className="text-xs text-stone-500">{a.due_date || 'Flexible'}</TableCell>
                        <TableCell>
                          <StatusBadge status={a.status} />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* TAB 4: Materials & Orders */}
        <TabsContent value="procurement" className="space-y-4 mt-4">
          <div className="space-y-4">
            {/* Purchase Orders */}
            <Card>
              <CardHeader className="pb-3 border-b border-stone-100">
                <CardTitle className="text-sm font-semibold">Vendor Purchase Orders (POs)</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {projectOrders.length === 0 ? (
                  <div className="p-6 text-center text-xs text-stone-500">
                    No purchase orders issued for this project yet.
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>PO Number</TableHead>
                        <TableHead>Vendor</TableHead>
                        <TableHead>Material Item</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Delivery Status</TableHead>
                        <TableHead>Payment</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {projectOrders.map((o) => (
                        <TableRow key={o.id}>
                          <TableCell className="font-mono text-xs font-semibold">{o.po_number}</TableCell>
                          <TableCell className="text-xs font-medium text-stone-900">{o.vendor_name}</TableCell>
                          <TableCell className="text-xs text-stone-600">{o.material_name || 'Specified item'}</TableCell>
                          <TableCell className="text-xs font-semibold">{formatINR(o.total_amount)}</TableCell>
                          <TableCell>
                            <StatusBadge status={o.delivery_status} />
                          </TableCell>
                          <TableCell>
                            <StatusBadge status={o.payment_status} />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* TAB 5: Site Logs & Snags */}
        <TabsContent value="execution" className="space-y-4 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Open Issues & Snags */}
            <Card>
              <CardHeader className="pb-3 border-b border-stone-100">
                <CardTitle className="text-sm font-semibold">Defect Snag Tickets ({projectIssues.length})</CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {projectIssues.length === 0 ? (
                  <div className="p-6 text-center text-xs text-stone-500">
                    No open defects logged on site!
                  </div>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Code</TableHead>
                        <TableHead>Defect Description</TableHead>
                        <TableHead>Severity</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {projectIssues.map((i) => (
                        <TableRow key={i.id}>
                          <TableCell className="font-mono text-xs font-semibold">{i.issue_code}</TableCell>
                          <TableCell className="text-xs">
                            <span className="font-medium text-stone-900 block">{i.title}</span>
                            <span className="text-stone-500 text-[11px]">{i.description}</span>
                          </TableCell>
                          <TableCell>
                            <StatusBadge status={i.severity} />
                          </TableCell>
                          <TableCell>
                            <StatusBadge status={i.status} />
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                )}
              </CardContent>
            </Card>

            {/* Daily Supervisor Logs */}
            <Card>
              <CardHeader className="pb-3 border-b border-stone-100">
                <CardTitle className="text-sm font-semibold">Supervisor Site Logs ({projectSiteUpdates.length})</CardTitle>
              </CardHeader>
              <CardContent className="p-3 space-y-3">
                {projectSiteUpdates.length === 0 ? (
                  <div className="p-4 text-center text-xs text-stone-500">
                    No site logs submitted yet.
                  </div>
                ) : (
                  projectSiteUpdates.map((u) => (
                    <div key={u.id} className="p-3 rounded border border-stone-200 bg-stone-50/50 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-stone-900">{u.title}</span>
                        <span className="text-stone-400 font-mono text-[11px]">{u.date}</span>
                      </div>
                      <p className="text-stone-600 text-[11px]">{u.description}</p>
                      {u.photo_urls && u.photo_urls.length > 0 && (
                        <div className="flex gap-2 pt-1 overflow-x-auto">
                          {u.photo_urls.map((p, i) => (
                            <img
                              key={i}
                              src={p}
                              alt="Site update"
                              className="w-16 h-12 object-cover rounded border border-stone-200"
                            />
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
