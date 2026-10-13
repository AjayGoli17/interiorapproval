import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  CircleDollarSign,
  Receipt,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  Calendar,
  Layers,
  ArrowUpRight,
  HardHat,
  FileSignature,
} from 'lucide-react';
import { useDemoStore } from '@/stores/demoStore';
import { formatINR, formatINRCompact, formatDate } from '@/lib/utils';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { StatusBadge } from '@/components/shared/StatusBadge';

export function AdminDashboardPage() {
  const navigate = useNavigate();
  const {
    projects,
    clients,
    expenses,
    paymentMilestones,
    approvals,
    tasks,
    issues,
    changeRequests,
    siteUpdates,
    setCurrentProject,
  } = useDemoStore();

  // 1. Metric Calculations (strictly dynamic from store)
  const activeProjects = projects.filter(
    (p) => p.status === 'execution' || p.status === 'design_phase' || p.status === 'procurement'
  );

  const totalContractValue = projects.reduce((sum, p) => sum + p.total_budget, 0);

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

  const totalCollections = paymentMilestones
    .filter((m) => m.status === 'payment_received')
    .reduce((sum, m) => sum + m.amount, 0);

  const outstandingInvoices = paymentMilestones
    .filter((m) => m.status === 'invoice_raised' || m.status === 'overdue')
    .reduce((sum, m) => sum + m.amount, 0);

  const pendingApprovalsCount = approvals.filter((a) => a.status === 'pending').length;

  const todayStr = new Date().toISOString().split('T')[0];
  const overdueTasksCount = tasks.filter(
    (t) => t.status !== 'completed' && t.due_date && t.due_date < todayStr
  ).length;

  const openIssuesCount = issues.filter(
    (i) => i.status !== 'resolved' && i.status !== 'verified_closed'
  ).length;

  // Upcoming Milestones (scheduled or raised)
  const upcomingMilestones = paymentMilestones
    .filter((m) => m.status !== 'payment_received')
    .slice(0, 4);

  // Recent activity stream
  const activities = [
    ...siteUpdates.slice(0, 2).map((u) => ({
      id: u.id,
      type: 'site_log',
      title: u.title,
      date: u.date,
      subtitle: `${u.workforce_count} personnel on site`,
      icon: HardHat,
    })),
    ...changeRequests.slice(0, 2).map((cr) => ({
      id: cr.id,
      type: 'change_request',
      title: `${cr.request_code}: ${cr.title}`,
      date: cr.created_at ? cr.created_at.split('T')[0] : 'Recent',
      subtitle: `Impact: +${formatINR(cr.cost_impact)} (${cr.status})`,
      icon: FileSignature,
    })),
  ].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Executive Dashboard"
        subtitle="Studio-wide operational KPIs, active project financials, schedule bottlenecks, and cashflow health."
        breadcrumbs={[{ label: 'Admin' }, { label: 'Dashboard' }]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate('/admin/finance')}
              className="text-xs"
            >
              <CircleDollarSign className="w-3.5 h-3.5 mr-1 text-[#2A5C45]" />
              Record Expense
            </Button>
            <Button
              size="sm"
              onClick={() => navigate('/admin/projects')}
              className="text-xs"
            >
              <Building2 className="w-3.5 h-3.5 mr-1" />
              Manage Projects
            </Button>
          </div>
        }
      />

      {/* Primary KPI Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Active Projects */}
        <Card className="p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-[11px] font-medium uppercase tracking-wider">Active Sites</span>
            <Building2 className="w-4 h-4 text-[#2A5C45]" />
          </div>
          <div>
            <div className="text-xl font-bold text-stone-900 leading-tight">
              {activeProjects.length}{' '}
              <span className="text-xs font-normal text-stone-400">/ {projects.length}</span>
            </div>
            <p className="text-[11px] text-stone-500 mt-1">In active delivery</p>
          </div>
        </Card>

        {/* Total Project Value */}
        <Card className="p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-[11px] font-medium uppercase tracking-wider">Portfolio Value</span>
            <TrendingUp className="w-4 h-4 text-[#2A5C45]" />
          </div>
          <div>
            <div className="text-xl font-bold text-stone-900 leading-tight">
              {formatINRCompact(totalContractValue)}
            </div>
            <p className="text-[11px] text-stone-500 mt-1" title={formatINR(totalContractValue)}>
              Contracted budget
            </p>
          </div>
        </Card>

        {/* Total Expenses */}
        <Card className="p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-[11px] font-medium uppercase tracking-wider">Site Expenses</span>
            <Receipt className="w-4 h-4 text-stone-600" />
          </div>
          <div>
            <div className="text-xl font-bold text-stone-900 leading-tight">
              {formatINRCompact(totalExpenses)}
            </div>
            <p className="text-[11px] text-stone-500 mt-1" title={formatINR(totalExpenses)}>
              Petty cash & advances
            </p>
          </div>
        </Card>

        {/* Outstanding Receivables */}
        <Card className="p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-[11px] font-medium uppercase tracking-wider">Receivables</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <div>
            <div className="text-xl font-bold text-amber-800 leading-tight">
              {formatINRCompact(outstandingInvoices)}
            </div>
            <p className="text-[11px] text-stone-500 mt-1" title={formatINR(outstandingInvoices)}>
              Invoiced pending client
            </p>
          </div>
        </Card>

        {/* Pending Client Sign-offs */}
        <Card className="p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-[11px] font-medium uppercase tracking-wider">Pending Sign-offs</span>
            <CheckCircle2 className="w-4 h-4 text-amber-600" />
          </div>
          <div>
            <div className="text-xl font-bold text-stone-900 leading-tight">
              {pendingApprovalsCount}
            </div>
            <p className="text-[11px] text-amber-700 mt-1 font-medium">Decisions in client queue</p>
          </div>
        </Card>

        {/* Overdue Tasks / Open Issues */}
        <Card className="p-3.5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-[11px] font-medium uppercase tracking-wider">Site Snags & Alerts</span>
            <AlertTriangle className="w-4 h-4 text-rose-600" />
          </div>
          <div>
            <div className="text-xl font-bold text-rose-700 leading-tight">
              {openIssuesCount + overdueTasksCount}
            </div>
            <p className="text-[11px] text-stone-500 mt-1">
              {openIssuesCount} snags • {overdueTasksCount} overdue
            </p>
          </div>
        </Card>
      </div>

      {/* Commercial Cashflow Health Banner */}
      <div className="rounded-lg border border-stone-200 bg-white p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
          <div>
            <h2 className="text-sm font-semibold text-stone-900 flex items-center gap-1.5">
              <span>Studio Capital & Billing Health</span>
              <Badge variant="outline" className="text-[10px] font-mono text-[#2A5C45] border-[#CDE1D4] bg-[#EAF2ED]">
                Real-time Sync
              </Badge>
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Verified funds received vs contracted commitment across all projects.
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div>
              <span className="text-stone-400 block text-[11px]">Collected Funds</span>
              <span className="font-semibold text-[#204E38] text-sm">{formatINR(totalCollections)}</span>
            </div>
            <div className="h-6 w-px bg-stone-200" />
            <div>
              <span className="text-stone-400 block text-[11px]">Uncollected Balance</span>
              <span className="font-semibold text-stone-800 text-sm">
                {formatINR(totalContractValue - totalCollections)}
              </span>
            </div>
          </div>
        </div>

        {/* Progress bar visual */}
        <div className="pt-3">
          <div className="flex justify-between text-xs text-stone-500 mb-1.5">
            <span>Overall Collection Ratio</span>
            <span className="font-medium text-stone-800">
              {totalContractValue > 0
                ? Math.round((totalCollections / totalContractValue) * 100)
                : 0}
              % Collected
            </span>
          </div>
          <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden flex">
            <div
              className="bg-[#2A5C45] h-full transition-all"
              style={{
                width: `${
                  totalContractValue > 0
                    ? Math.min(100, (totalCollections / totalContractValue) * 100)
                    : 0
                }%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Compact Project Overview Table */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-stone-900">Active Projects Portfolio</h2>
            <p className="text-xs text-stone-500">
              Click any project to view its connected specs, rooms, finances, and execution status.
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/admin/projects')}
            className="text-xs text-[#2A5C45] hover:text-[#214A37]"
          >
            All Projects ({projects.length}) <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Project Code</TableHead>
              <TableHead>Project Name</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>City & Location</TableHead>
              <TableHead>Total Budget</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead>Stage</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((proj) => {
              const client = clients.find((c) => c.id === proj.client_id);
              return (
                <TableRow
                  key={proj.id}
                  className="cursor-pointer hover:bg-stone-50/80 transition-colors"
                  onClick={() => {
                    setCurrentProject(proj.id);
                    navigate(`/admin/projects/${proj.id}`);
                  }}
                >
                  <TableCell className="font-mono text-xs font-semibold text-stone-600">
                    {proj.project_code}
                  </TableCell>
                  <TableCell className="font-medium text-stone-900">
                    {proj.title}
                  </TableCell>
                  <TableCell className="text-xs text-stone-600">
                    {client?.full_name || 'Assigned Client'}
                  </TableCell>
                  <TableCell className="text-xs text-stone-500 max-w-xs truncate">
                    {proj.location}
                  </TableCell>
                  <TableCell className="font-semibold text-stone-800 text-xs">
                    {formatINR(proj.total_budget)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-stone-200 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-[#2A5C45] h-full"
                          style={{ width: `${proj.progress_percentage}%` }}
                        />
                      </div>
                      <span className="text-xs font-mono font-medium text-stone-700">
                        {proj.progress_percentage}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={proj.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentProject(proj.id);
                        navigate(`/admin/projects/${proj.id}`);
                      }}
                      className="h-7 text-xs text-stone-600 hover:text-stone-900"
                    >
                      Workspace <ArrowUpRight className="w-3 h-3 ml-1" />
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Two Column Bottom Section: Upcoming Milestones & Recent Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Upcoming Milestones */}
        <Card>
          <CardHeader className="pb-3 border-b border-stone-100 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-semibold text-stone-900 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[#2A5C45]" />
                Upcoming Milestones & Receivables
              </CardTitle>
              <p className="text-xs text-stone-500 mt-0.5">
                Cash inflow triggers tied to verified site deliverables.
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/admin/finance')}
              className="text-xs text-stone-500 hover:text-stone-900 h-7"
            >
              View All
            </Button>
          </CardHeader>
          <CardContent className="p-3 space-y-2">
            {upcomingMilestones.length === 0 ? (
              <div className="text-xs text-stone-500 py-4 text-center">
                All scheduled milestones collected!
              </div>
            ) : (
              upcomingMilestones.map((ms) => {
                const proj = projects.find((p) => p.id === ms.project_id);
                return (
                  <div
                    key={ms.id}
                    className="p-2.5 rounded border border-stone-200/80 bg-stone-50/40 flex items-center justify-between gap-3 text-xs"
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-semibold text-stone-900">{ms.name}</span>
                        <span className="font-mono text-[10px] text-stone-500">({ms.milestone_code})</span>
                      </div>
                      <span className="text-[11px] text-stone-500 block">
                        {proj?.title} • Due: {formatDate(ms.due_date)}
                      </span>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-semibold text-stone-900 block">{formatINR(ms.amount)}</span>
                      <StatusBadge status={ms.status} className="text-[10px] px-1.5 py-0" />
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>

        {/* Recent Activity & Site Updates */}
        <Card>
          <CardHeader className="pb-3 border-b border-stone-100 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-semibold text-stone-900 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#2A5C45]" />
                Recent Studio Activity
              </CardTitle>
              <p className="text-xs text-stone-500 mt-0.5">
                Live stream of site supervisor logs and change orders.
              </p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/admin/change-requests')}
              className="text-xs text-stone-500 hover:text-stone-900 h-7"
            >
              View Changes
            </Button>
          </CardHeader>
          <CardContent className="p-3 space-y-2.5">
            {activities.map((act) => {
              const Icon = act.icon;
              return (
                <div
                  key={act.id}
                  className="flex items-start gap-3 p-2 rounded hover:bg-stone-50 transition-colors text-xs"
                >
                  <div className="p-1.5 rounded-md bg-[#2A5C45]/10 text-[#2A5C45] mt-0.5">
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-stone-900 truncate">{act.title}</p>
                    <p className="text-[11px] text-stone-500">{act.subtitle}</p>
                  </div>
                  <span className="text-[10px] text-stone-400 shrink-0 font-mono">
                    {formatDate(act.date)}
                  </span>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
