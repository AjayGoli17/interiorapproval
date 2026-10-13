import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  AlertTriangle,
  Clock,
  Layers,
  HardHat,
  ArrowRight,
  Plus,
  Calendar,
  AlertOctagon,
  FileSignature,
  Package,
  TrendingUp,
  Camera,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { useDemoStore } from '@/stores/demoStore';
import { formatINR, formatINRCompact, formatDate } from '@/lib/utils';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { StatusBadge } from '@/components/shared/StatusBadge';

export function TeamDashboardPage() {
  const navigate = useNavigate();
  const {
    currentUser,
    projects,
    clients,
    tasks,
    approvals,
    changeRequests,
    materials,
    issues,
    siteUpdates,
    currentProjectId,
    setCurrentProject,
    updateTask,
    updateIssue,
  } = useDemoStore();

  const [filterProject, setFilterProject] = useState<string>('all');

  // Filter projects assigned to current user or active in studio
  const assignedProjects = projects.filter((p) => {
    if (currentUser.role === 'designer') {
      return p.lead_designer_id === currentUser.id || !p.lead_designer_id;
    }
    if (currentUser.role === 'site_manager') {
      return p.site_manager_id === currentUser.id || !p.site_manager_id;
    }
    return true;
  });

  const activeProjectsToDisplay = filterProject === 'all'
    ? assignedProjects
    : assignedProjects.filter((p) => p.id === filterProject);

  const todayStr = new Date().toISOString().split('T')[0];

  // Dynamic Metrics strictly from store
  const allTasks = filterProject === 'all'
    ? tasks
    : tasks.filter((t) => t.project_id === filterProject);

  const pendingTasks = allTasks.filter((t) => t.status !== 'completed');
  const overdueTasks = allTasks.filter(
    (t) => t.status !== 'completed' && t.due_date && t.due_date < todayStr
  );
  const dueTodayTasks = allTasks.filter(
    (t) => t.status !== 'completed' && t.due_date === todayStr
  );

  const allApprovals = filterProject === 'all'
    ? approvals
    : approvals.filter((a) => a.project_id === filterProject);

  const pendingApprovals = allApprovals.filter((a) => a.status === 'pending');
  const revisionApprovals = allApprovals.filter((a) => a.status === 'revision_requested');

  const allCRs = filterProject === 'all'
    ? changeRequests
    : changeRequests.filter((cr) => cr.project_id === filterProject);

  const openCRs = allCRs.filter((cr) => cr.status === 'quoted' || cr.status === 'reviewed' || cr.status === 'requested');

  const allMaterials = filterProject === 'all'
    ? materials
    : materials.filter((m) => m.project_id === filterProject);

  const materialsAwaitingProcurement = allMaterials.filter(
    (m) => m.procurement_status === 'not_ordered' || m.selection_status === 'proposed'
  );

  const allIssues = filterProject === 'all'
    ? issues
    : issues.filter((i) => i.project_id === filterProject);

  const openIssues = allIssues.filter(
    (i) => i.status !== 'resolved' && i.status !== 'verified_closed'
  );
  const criticalIssues = openIssues.filter((i) => i.severity === 'critical' || i.severity === 'high');

  const allUpdates = filterProject === 'all'
    ? siteUpdates
    : siteUpdates.filter((u) => u.project_id === filterProject);

  const handleOpenProject = (projId: string) => {
    setCurrentProject(projId);
    navigate('/team/project-overview');
  };

  const handleToggleTask = (taskId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'completed' ? 'in_progress' : 'completed';
    const progress = nextStatus === 'completed' ? 100 : 50;
    updateTask(taskId, { status: nextStatus, progress_percent: progress });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-stone-900">
              Welcome back, {currentUser.full_name.split(' ')[0]}
            </h1>
            <Badge variant="outline" className="text-xs bg-stone-100 text-stone-700 capitalize">
              {currentUser.role === 'designer' ? 'Lead Designer' : 'Site Execution Manager'}
            </Badge>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            {currentUser.specialization || 'Interior Architecture & Execution Team'} • Real-time project operations and daily trade coordination.
          </p>
        </div>

        {/* Quick Workflow Action Shortcuts */}
        <div className="flex items-center gap-2 flex-wrap">
          <Button
            size="sm"
            variant="outline"
            className="text-xs border-stone-200 hover:bg-stone-50 text-stone-700"
            onClick={() => navigate('/team/designs')}
          >
            <Layers className="h-3.5 w-3.5 mr-1.5 text-stone-500" />
            Upload Drawing
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="text-xs border-stone-200 hover:bg-stone-50 text-stone-700"
            onClick={() => navigate('/team/execution')}
          >
            <Camera className="h-3.5 w-3.5 mr-1.5 text-[#2A5C45]" />
            Log Site Progress
          </Button>
          <Button
            size="sm"
            variant="default"
            className="text-xs bg-[#2A5C45] hover:bg-[#234c39] text-white"
            onClick={() => navigate('/team/issues')}
          >
            <AlertOctagon className="h-3.5 w-3.5 mr-1.5" />
            Report Snag
          </Button>
        </div>
      </div>

      {/* KPI Metric Strip */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        {/* Metric 1 */}
        <Card className="p-3 border-stone-200 shadow-none hover:border-stone-300 transition-colors cursor-pointer" onClick={() => navigate('/team/project-overview')}>
          <div className="flex items-center justify-between text-stone-500 mb-1">
            <span className="text-[11px] font-medium uppercase tracking-wider">Assigned Projects</span>
            <FolderKanban className="h-3.5 w-3.5 text-stone-400" />
          </div>
          <div className="text-xl font-bold text-stone-900">{assignedProjects.length}</div>
          <div className="text-[10px] text-stone-500 mt-0.5">Active sites in studio</div>
        </Card>

        {/* Metric 2 */}
        <Card className="p-3 border-stone-200 shadow-none hover:border-stone-300 transition-colors cursor-pointer" onClick={() => navigate('/team/tasks')}>
          <div className="flex items-center justify-between text-stone-500 mb-1">
            <span className="text-[11px] font-medium uppercase tracking-wider">Urgent Tasks</span>
            <Calendar className="h-3.5 w-3.5 text-amber-500" />
          </div>
          <div className="text-xl font-bold text-stone-900 flex items-baseline gap-1.5">
            <span>{overdueTasks.length + dueTodayTasks.length}</span>
            {overdueTasks.length > 0 && (
              <span className="text-[11px] text-rose-600 font-medium">({overdueTasks.length} overdue)</span>
            )}
          </div>
          <div className="text-[10px] text-stone-500 mt-0.5">{pendingTasks.length} total pending</div>
        </Card>

        {/* Metric 3 */}
        <Card className="p-3 border-stone-200 shadow-none hover:border-stone-300 transition-colors cursor-pointer" onClick={() => navigate('/team/approvals')}>
          <div className="flex items-center justify-between text-stone-500 mb-1">
            <span className="text-[11px] font-medium uppercase tracking-wider">Client Sign-offs</span>
            <CheckSquare className="h-3.5 w-3.5 text-amber-600" />
          </div>
          <div className="text-xl font-bold text-amber-700">{pendingApprovals.length}</div>
          <div className="text-[10px] text-stone-500 mt-0.5">
            {revisionApprovals.length > 0 ? `${revisionApprovals.length} revision requested` : '0 revisions pending'}
          </div>
        </Card>

        {/* Metric 4 */}
        <Card className="p-3 border-stone-200 shadow-none hover:border-stone-300 transition-colors cursor-pointer" onClick={() => navigate('/team/approvals')}>
          <div className="flex items-center justify-between text-stone-500 mb-1">
            <span className="text-[11px] font-medium uppercase tracking-wider">Change Requests</span>
            <FileSignature className="h-3.5 w-3.5 text-stone-400" />
          </div>
          <div className="text-xl font-bold text-stone-900">{openCRs.length}</div>
          <div className="text-[10px] text-stone-500 mt-0.5">Under quote & review</div>
        </Card>

        {/* Metric 5 */}
        <Card className="p-3 border-stone-200 shadow-none hover:border-stone-300 transition-colors cursor-pointer" onClick={() => navigate('/team/materials')}>
          <div className="flex items-center justify-between text-stone-500 mb-1">
            <span className="text-[11px] font-medium uppercase tracking-wider">Material BOQ</span>
            <Package className="h-3.5 w-3.5 text-stone-400" />
          </div>
          <div className="text-xl font-bold text-stone-900">{materialsAwaitingProcurement.length}</div>
          <div className="text-[10px] text-stone-500 mt-0.5">Awaiting PO / sample</div>
        </Card>

        {/* Metric 6 */}
        <Card className="p-3 border-stone-200 shadow-none hover:border-stone-300 transition-colors cursor-pointer" onClick={() => navigate('/team/issues')}>
          <div className="flex items-center justify-between text-stone-500 mb-1">
            <span className="text-[11px] font-medium uppercase tracking-wider">Site Snags</span>
            <AlertOctagon className="h-3.5 w-3.5 text-rose-500" />
          </div>
          <div className="text-xl font-bold text-rose-600 flex items-baseline gap-1.5">
            <span>{openIssues.length}</span>
            {criticalIssues.length > 0 && (
              <span className="text-[10px] text-rose-700 bg-rose-50 px-1.5 rounded font-medium">
                {criticalIssues.length} High
              </span>
            )}
          </div>
          <div className="text-[10px] text-stone-500 mt-0.5">Open site tickets</div>
        </Card>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols) — Assigned Projects & Priority Site Tasks */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card: Assigned Projects */}
          <Card className="border-stone-200 shadow-none">
            <CardHeader className="py-3 px-4 border-b border-stone-200/80 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-semibold text-stone-900 flex items-center gap-2">
                  <FolderKanban className="h-4 w-4 text-[#2A5C45]" />
                  Active Project Workspaces
                </CardTitle>
                <p className="text-xs text-stone-500 mt-0.5">
                  Select a project to enter its room breakdown, drawing studio, and trade schedules.
                </p>
              </div>
              <Button
                size="sm"
                variant="ghost"
                className="text-xs text-stone-600 hover:text-stone-900"
                onClick={() => navigate('/team/project-overview')}
              >
                View Directory <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </CardHeader>
            <div className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="bg-stone-50/50 hover:bg-stone-50/50 border-b border-stone-200/80 text-[11px]">
                    <TableHead className="font-semibold text-stone-700 py-2.5">Project & Client</TableHead>
                    <TableHead className="font-semibold text-stone-700 py-2.5">Stage</TableHead>
                    <TableHead className="font-semibold text-stone-700 py-2.5">Progress</TableHead>
                    <TableHead className="font-semibold text-stone-700 py-2.5">Target Handover</TableHead>
                    <TableHead className="font-semibold text-stone-700 py-2.5 text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {activeProjectsToDisplay.map((proj) => {
                    const client = clients.find((c) => c.project_id === proj.id);
                    const isSelected = proj.id === currentProjectId;
                    return (
                      <TableRow
                        key={proj.id}
                        className={`hover:bg-stone-50/60 transition-colors border-b border-stone-100 ${
                          isSelected ? 'bg-stone-50/80' : ''
                        }`}
                      >
                        <TableCell className="py-3">
                          <div className="font-medium text-xs text-stone-900 flex items-center gap-1.5">
                            {proj.title}
                            {isSelected && (
                              <Badge className="text-[9px] h-4 bg-[#2A5C45]/10 text-[#2A5C45] border-none px-1">
                                Active Context
                              </Badge>
                            )}
                          </div>
                          <div className="text-[11px] text-stone-500 truncate max-w-xs mt-0.5">
                            {client?.full_name} • {proj.location}
                          </div>
                        </TableCell>
                        <TableCell className="py-3">
                          <StatusBadge status={proj.status} />
                        </TableCell>
                        <TableCell className="py-3">
                          <div className="w-28 space-y-1">
                            <div className="flex justify-between text-[11px]">
                              <span className="font-medium text-stone-700">{proj.progress_percentage}%</span>
                            </div>
                            <div className="h-1.5 w-full bg-stone-100 rounded-full overflow-hidden">
                              <div
                                className="h-full bg-[#2A5C45] rounded-full transition-all"
                                style={{ width: `${proj.progress_percentage}%` }}
                              />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-3 text-xs text-stone-600">
                          {formatDate(proj.target_handover_date)}
                        </TableCell>
                        <TableCell className="py-3 text-right">
                          <Button
                            size="sm"
                            variant="outline"
                            className="text-xs h-7 border-stone-200 text-stone-700 hover:bg-stone-100 hover:text-stone-900"
                            onClick={() => handleOpenProject(proj.id)}
                          >
                            Open Workspace
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </Card>

          {/* Card: Urgent Site Tasks & Due Activities */}
          <Card className="border-stone-200 shadow-none">
            <CardHeader className="py-3 px-4 border-b border-stone-200/80 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-semibold text-stone-900 flex items-center gap-2">
                  <Clock className="h-4 w-4 text-amber-600" />
                  Site Execution Tasks (Due Today & Active)
                </CardTitle>
                <p className="text-xs text-stone-500 mt-0.5">
                  Click the checkmark to mark completed or update site progress.
                </p>
              </div>
              <Button
                size="sm"
                variant="ghost"
                className="text-xs text-stone-600 hover:text-stone-900"
                onClick={() => navigate('/team/tasks')}
              >
                All Tasks ({tasks.length}) <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </CardHeader>
            <div className="divide-y divide-stone-100">
              {allTasks.slice(0, 5).map((task) => {
                const isOverdue = task.status !== 'completed' && task.due_date && task.due_date < todayStr;
                const isDueToday = task.status !== 'completed' && task.due_date === todayStr;
                return (
                  <div
                    key={task.id}
                    className="p-3.5 flex items-start justify-between gap-3 hover:bg-stone-50/50 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => handleToggleTask(task.id, task.status)}
                        className={`mt-0.5 h-4 w-4 rounded border flex items-center justify-center transition-colors ${
                          task.status === 'completed'
                            ? 'bg-[#2A5C45] border-[#2A5C45] text-white'
                            : 'border-stone-300 hover:border-[#2A5C45] text-transparent'
                        }`}
                        title={task.status === 'completed' ? 'Mark In Progress' : 'Mark Completed'}
                      >
                        <CheckCircle2 className="h-3.5 w-3.5 fill-current" />
                      </button>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-xs font-medium ${
                              task.status === 'completed'
                                ? 'text-stone-400 line-through'
                                : 'text-stone-900'
                            }`}
                          >
                            {task.title}
                          </span>
                          <StatusBadge status={task.priority} />
                          <Badge variant="outline" className="text-[10px] text-stone-500 uppercase px-1 py-0">
                            {task.category.replace('_', ' ')}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-3 text-[11px] text-stone-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3 text-stone-400" />
                            Due: {formatDate(task.due_date)}
                            {isOverdue && (
                              <span className="text-rose-600 font-semibold ml-1">Overdue</span>
                            )}
                            {isDueToday && (
                              <span className="text-amber-600 font-semibold ml-1">Today</span>
                            )}
                          </span>

                          <span>• Progress: {task.progress_percent}%</span>

                          {task.blocker_notes && (
                            <span className="text-rose-600 flex items-center gap-1 font-medium">
                              <AlertTriangle className="h-3 w-3" />
                              Blocker: {task.blocker_notes}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="h-7 text-xs text-stone-500 hover:text-stone-900 px-2"
                        onClick={() => navigate('/team/tasks')}
                      >
                        Details
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </div>

        {/* Right Column (1 Col) — Approvals, Variations & Daily Logs */}
        <div className="space-y-6">
          {/* Card: Pending Client Approvals */}
          <Card className="border-stone-200 shadow-none">
            <CardHeader className="py-3 px-4 border-b border-stone-200/80 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-semibold text-stone-900 flex items-center gap-1.5">
                  <CheckSquare className="h-4 w-4 text-amber-600" />
                  Client Approvals Pending
                </CardTitle>
                <p className="text-[11px] text-stone-500 mt-0.5">
                  Drawings and finishes awaiting client sign-off.
                </p>
              </div>
              <Button
                size="sm"
                variant="ghost"
                className="text-xs h-7 px-2 text-stone-600"
                onClick={() => navigate('/team/approvals')}
              >
                View ({pendingApprovals.length})
              </Button>
            </CardHeader>
            <div className="p-3 divide-y divide-stone-100">
              {pendingApprovals.length === 0 ? (
                <div className="text-xs text-stone-500 py-3 text-center">
                  No approvals currently pending with clients.
                </div>
              ) : (
                pendingApprovals.slice(0, 3).map((item) => (
                  <div key={item.id} className="py-2.5 first:pt-0 last:pb-0 space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-xs font-medium text-stone-900 leading-snug">
                        {item.title}
                      </span>
                      <StatusBadge status={item.status} />
                    </div>
                    <p className="text-[11px] text-stone-500 line-clamp-1">
                      {item.description}
                    </p>
                    {item.client_comments && (
                      <div className="text-[10px] text-stone-600 bg-stone-50 p-1.5 rounded border border-stone-100">
                        <span className="font-semibold text-stone-700">Client note:</span> "{item.client_comments}"
                      </div>
                    )}
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] text-stone-400">
                        Due: {formatDate(item.due_date)}
                      </span>
                      <Button
                        size="sm"
                        variant="link"
                        className="h-auto p-0 text-[11px] text-[#2A5C45]"
                        onClick={() => navigate('/team/approvals')}
                      >
                        Review Item →
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>

          {/* Card: Active Change Requests */}
          <Card className="border-stone-200 shadow-none">
            <CardHeader className="py-3 px-4 border-b border-stone-200/80 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-semibold text-stone-900 flex items-center gap-1.5">
                  <FileSignature className="h-4 w-4 text-stone-700" />
                  Active Variations (Change Requests)
                </CardTitle>
              </div>
              <Button
                size="sm"
                variant="ghost"
                className="text-xs h-7 px-2 text-stone-600"
                onClick={() => navigate('/team/approvals')}
              >
                Track All
              </Button>
            </CardHeader>
            <div className="p-3 divide-y divide-stone-100">
              {allCRs.slice(0, 3).map((cr) => (
                <div key={cr.id} className="py-2.5 first:pt-0 last:pb-0 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-stone-900 font-mono">
                      {cr.request_code}
                    </span>
                    <StatusBadge status={cr.status} />
                  </div>
                  <div className="text-xs text-stone-800 font-medium">{cr.title}</div>
                  <div className="flex items-center justify-between text-[11px] text-stone-500">
                    <span>Impact: <strong className="text-stone-900">+{formatINR(cr.cost_impact)}</strong></span>
                    <span>+{cr.timeline_impact_days} days</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Card: Recent Daily Site Logs & Snags Preview */}
          <Card className="border-stone-200 shadow-none">
            <CardHeader className="py-3 px-4 border-b border-stone-200/80 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-semibold text-stone-900 flex items-center gap-1.5">
                  <HardHat className="h-4 w-4 text-[#2A5C45]" />
                  Latest Site Log & Photos
                </CardTitle>
              </div>
              <Button
                size="sm"
                variant="ghost"
                className="text-xs h-7 px-2 text-stone-600"
                onClick={() => navigate('/team/execution')}
              >
                Open Logs
              </Button>
            </CardHeader>
            <div className="p-3 space-y-3">
              {allUpdates.slice(0, 2).map((log) => (
                <div key={log.id} className="p-2.5 rounded border border-stone-200 bg-stone-50/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-stone-900">{log.title}</span>
                    <span className="text-[10px] text-stone-500">{formatDate(log.date)}</span>
                  </div>
                  <p className="text-[11px] text-stone-600 line-clamp-2">
                    {log.description}
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-stone-500 pt-1 border-t border-stone-200/60">
                    <span>👷 {log.workforce_count} Workforce on site</span>
                    <span>🌤️ {log.weather_conditions}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
