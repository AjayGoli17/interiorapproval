import React, { useState } from 'react';
import {
  AlertOctagon,
  Plus,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Search,
  Filter,
  Camera,
  Calendar,
  Layers,
  Edit,
  Trash2,
  Check,
  Eye,
  Maximize2,
  ExternalLink,
} from 'lucide-react';
import { useDemoStore } from '@/stores/demoStore';
import { formatDate } from '@/lib/utils';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { StatusBadge } from '@/components/shared/StatusBadge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Issue, SiteUpdate } from '@/types';

const SITE_PHOTO_PRESETS = [
  'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=600&auto=format&fit=crop&q=80',
];

export function TeamIssuesPage() {
  const {
    projects,
    currentProjectId,
    setCurrentProject,
    rooms,
    issues,
    siteUpdates,
    addIssue,
    updateIssue,
    deleteIssue,
    addSiteUpdate,
  } = useDemoStore();

  const activeProject = projects.find((p) => p.id === currentProjectId) || projects[0];
  const todayStr = new Date().toISOString().split('T')[0];

  // Active Tab: 'snags' | 'logs'
  const [activeTab, setActiveTab] = useState<'snags' | 'logs'>('snags');

  // Filters for Snags
  const [severityFilter, setSeverityFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [roomFilter, setRoomFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Dialog States
  const [isAddSnagOpen, setIsAddSnagOpen] = useState(false);
  const [isResolveSnagOpen, setIsResolveSnagOpen] = useState(false);
  const [isAddLogOpen, setIsAddLogOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);

  // Form State: Add Snag
  const [snagFormData, setSnagFormData] = useState({
    issue_code: '',
    title: '',
    room_id: '',
    description: '',
    severity: 'medium' as Issue['severity'],
    status: 'open' as Issue['status'],
    resolution_deadline: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  });

  // Form State: Resolve Snag
  const [resolutionNotes, setResolutionNotes] = useState('');

  // Form State: Add Daily Log
  const [logFormData, setLogFormData] = useState({
    title: '',
    room_id: '',
    description: '',
    date: todayStr,
    work_completed_summary: '',
    next_planned_activity: '',
    workforce_count: 5,
    weather_conditions: 'Sunny 29°C',
    delay_flag: false,
    is_client_visible: true,
    photo_urls: [SITE_PHOTO_PRESETS[0]],
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const projectRooms = rooms.filter((r) => r.project_id === activeProject?.id);
  const projectIssues = issues.filter((i) => i.project_id === activeProject?.id);
  const projectLogs = siteUpdates.filter((u) => u.project_id === activeProject?.id);

  const filteredIssues = projectIssues.filter((i) => {
    const matchesSev = severityFilter === 'all' || i.severity === severityFilter;
    const matchesStatus = statusFilter === 'all' || i.status === statusFilter;
    const matchesRoom = roomFilter === 'all' || i.room_id === roomFilter;
    const matchesSearch =
      i.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.issue_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      i.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSev && matchesStatus && matchesRoom && matchesSearch;
  });

  // Counters
  const totalSnags = projectIssues.length;
  const openSnags = projectIssues.filter((i) => i.status !== 'resolved' && i.status !== 'verified_closed').length;
  const criticalSnags = projectIssues.filter(
    (i) => (i.severity === 'critical' || i.severity === 'high') && i.status !== 'resolved'
  ).length;
  const resolvedSnags = projectIssues.filter(
    (i) => i.status === 'resolved' || i.status === 'verified_closed'
  ).length;

  const handleOpenAddSnag = () => {
    setSnagFormData({
      issue_code: `ISS-0${issues.length + 10}`,
      title: '',
      room_id: projectRooms[0]?.id || '',
      description: '',
      severity: 'medium',
      status: 'open',
      resolution_deadline: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    });
    setIsAddSnagOpen(true);
  };

  const handleCreateSnag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!snagFormData.title || !activeProject) return;

    addIssue({
      project_id: activeProject.id,
      room_id: snagFormData.room_id || projectRooms[0]?.id || '',
      issue_code: snagFormData.issue_code || `ISS-0${issues.length + 10}`,
      title: snagFormData.title,
      description: snagFormData.description,
      severity: snagFormData.severity,
      status: snagFormData.status,
      resolution_deadline: snagFormData.resolution_deadline,
    });

    setIsAddSnagOpen(false);
    showToast(`Snag ${snagFormData.issue_code} logged into defect register.`);
  };

  const handleOpenResolveSnag = (issue: Issue) => {
    setSelectedIssue(issue);
    setResolutionNotes('');
    setIsResolveSnagOpen(true);
  };

  const handleConfirmResolveSnag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIssue) return;

    updateIssue(selectedIssue.id, {
      status: 'resolved',
      description: resolutionNotes
        ? `${selectedIssue.description} [Rectification Note: ${resolutionNotes}]`
        : selectedIssue.description,
    });

    setIsResolveSnagOpen(false);
    setSelectedIssue(null);
    showToast(`Snag ${selectedIssue.issue_code} marked as resolved.`);
  };

  const handleCreateLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!logFormData.title || !activeProject) return;

    addSiteUpdate({
      project_id: activeProject.id,
      room_id: logFormData.room_id || projectRooms[0]?.id || '',
      title: logFormData.title,
      description: logFormData.description,
      date: logFormData.date,
      work_completed_summary: logFormData.work_completed_summary,
      next_planned_activity: logFormData.next_planned_activity,
      workforce_count: Number(logFormData.workforce_count) || 1,
      weather_conditions: logFormData.weather_conditions,
      delay_flag: logFormData.delay_flag,
      is_client_visible: logFormData.is_client_visible,
      photo_urls: logFormData.photo_urls,
    });

    setIsAddLogOpen(false);
    showToast(`Site log "${logFormData.title}" saved.`);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-4 py-2.5 rounded-md flex items-center justify-between shadow-sm animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>{toastMessage}</span>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-emerald-700 hover:text-emerald-900 font-bold ml-4"
          >
            ✕
          </button>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-stone-900">
              Snag List & Site Quality Defect Tracker
            </h1>
            <Badge variant="outline" className="text-xs bg-stone-100 text-stone-700">
              {openSnags} Open Issues
            </Badge>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Defect logging, contractor rectification assignments, severity prioritization, and handover clearance punch lists.
          </p>
        </div>

        {/* Project Selector & Actions */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-white border border-stone-200 rounded-md px-2.5 py-1">
            <span className="text-[11px] text-stone-500 font-medium">Project:</span>
            <select
              value={activeProject?.id}
              onChange={(e) => setCurrentProject(e.target.value)}
              className="text-xs font-semibold text-stone-800 bg-transparent border-none focus:outline-none cursor-pointer"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
          </div>

          {activeTab === 'snags' ? (
            <Button
              size="sm"
              className="bg-[#2A5C45] hover:bg-[#234c39] text-white text-xs"
              onClick={handleOpenAddSnag}
            >
              <Plus className="h-3.5 w-3.5 mr-1" />
              Log Defect Snag
            </Button>
          ) : (
            <Button
              size="sm"
              className="bg-[#2A5C45] hover:bg-[#234c39] text-white text-xs"
              onClick={() => setIsAddLogOpen(true)}
            >
              <Camera className="h-3.5 w-3.5 mr-1" />
              Post Daily Log
            </Button>
          )}
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex items-center gap-2 border-b border-stone-200">
        <button
          onClick={() => setActiveTab('snags')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors ${
            activeTab === 'snags'
              ? 'border-[#2A5C45] text-[#2A5C45]'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <AlertOctagon className="h-4 w-4" />
          Defect Punch List & Snags ({projectIssues.length})
        </button>

        <button
          onClick={() => setActiveTab('logs')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors ${
            activeTab === 'logs'
              ? 'border-[#2A5C45] text-[#2A5C45]'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Camera className="h-4 w-4" />
          Daily Supervisor Diaries & Photos ({projectLogs.length})
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: DEFECT PUNCH LIST */}
      {/* ========================================================================= */}
      {activeTab === 'snags' && (
        <div className="space-y-4">
          {/* Counters Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Card className="p-3 border-stone-200 shadow-none">
              <span className="text-[10px] text-stone-500 block uppercase font-mono">Total Recorded Snags</span>
              <span className="text-xl font-bold text-stone-900">{totalSnags} Defects</span>
            </Card>
            <Card className="p-3 border-stone-200 shadow-none">
              <span className="text-[10px] text-stone-500 block uppercase font-mono">Action Required</span>
              <span className="text-xl font-bold text-amber-700">{openSnags} Active</span>
            </Card>
            <Card className="p-3 border-stone-200 shadow-none">
              <span className="text-[10px] text-stone-500 block uppercase font-mono">High / Critical Blocker</span>
              <span className="text-xl font-bold text-rose-600 flex items-baseline gap-1">
                {criticalSnags}
                {criticalSnags > 0 && <span className="text-xs text-rose-500 font-normal">Immediate fix</span>}
              </span>
            </Card>
            <Card className="p-3 border-stone-200 shadow-none">
              <span className="text-[10px] text-stone-500 block uppercase font-mono">Rectified & Closed</span>
              <span className="text-xl font-bold text-emerald-700">{resolvedSnags} Resolved</span>
            </Card>
          </div>

          {/* Filter Toolbar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-lg border border-stone-200">
            <div className="flex items-center gap-2 w-full sm:w-72">
              <Search className="h-4 w-4 text-stone-400" />
              <Input
                placeholder="Search snags by code or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-8 text-xs border-stone-200"
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
              <select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
                className="h-8 text-xs border border-stone-200 rounded-md px-2 bg-white text-stone-700"
              >
                <option value="all">All Severities</option>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-8 text-xs border border-stone-200 rounded-md px-2 bg-white text-stone-700"
              >
                <option value="all">All Statuses</option>
                <option value="open">Open</option>
                <option value="action_assigned">Action Assigned</option>
                <option value="investigating">Investigating</option>
                <option value="resolved">Resolved</option>
              </select>

              <select
                value={roomFilter}
                onChange={(e) => setRoomFilter(e.target.value)}
                className="h-8 text-xs border border-stone-200 rounded-md px-2 bg-white text-stone-700"
              >
                <option value="all">All Rooms</option>
                {projectRooms.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Snags Table */}
          <Card className="border-stone-200 shadow-none overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-stone-50/70 border-b border-stone-200 text-[11px]">
                  <TableHead className="py-3 font-semibold text-stone-700">Code</TableHead>
                  <TableHead className="py-3 font-semibold text-stone-700">Defect Description & Location</TableHead>
                  <TableHead className="py-3 font-semibold text-stone-700">Room</TableHead>
                  <TableHead className="py-3 font-semibold text-stone-700">Severity</TableHead>
                  <TableHead className="py-3 font-semibold text-stone-700">Deadline</TableHead>
                  <TableHead className="py-3 font-semibold text-stone-700">Status</TableHead>
                  <TableHead className="py-3 font-semibold text-stone-700 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredIssues.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-xs text-stone-500">
                      No defect snags found matching the filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredIssues.map((iss) => {
                    const room = rooms.find((r) => r.id === iss.room_id);
                    const isResolved = iss.status === 'resolved' || iss.status === 'verified_closed';
                    const isOverdue = !isResolved && iss.resolution_deadline && iss.resolution_deadline < todayStr;

                    return (
                      <TableRow
                        key={iss.id}
                        className={`hover:bg-stone-50/70 border-b border-stone-100 text-xs ${
                          isResolved ? 'bg-stone-50/40 text-stone-400' : ''
                        }`}
                      >
                        <TableCell className="py-3 font-mono font-bold text-rose-700">
                          {iss.issue_code}
                        </TableCell>
                        <TableCell className="py-3 max-w-sm">
                          <div className={`font-semibold ${isResolved ? 'line-through text-stone-400' : 'text-stone-900'}`}>
                            {iss.title}
                          </div>
                          <div className="text-[11px] text-stone-500 mt-0.5 line-clamp-2">
                            {iss.description}
                          </div>
                        </TableCell>
                        <TableCell className="py-3 text-stone-600">
                          {room?.name || 'Whole Site'}
                        </TableCell>
                        <TableCell className="py-3">
                          <StatusBadge status={iss.severity} />
                        </TableCell>
                        <TableCell className="py-3">
                          <span className={isOverdue ? 'text-rose-600 font-bold' : 'text-stone-600'}>
                            {formatDate(iss.resolution_deadline)}
                          </span>
                          {isOverdue && (
                            <span className="block text-[10px] text-rose-600 uppercase font-semibold">
                              Overdue
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="py-3">
                          <StatusBadge status={iss.status} />
                        </TableCell>
                        <TableCell className="py-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {!isResolved ? (
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 text-xs border-stone-200 text-[#2A5C45] hover:bg-emerald-50"
                                onClick={() => handleOpenResolveSnag(iss)}
                              >
                                <Check className="h-3.5 w-3.5 mr-1" />
                                Mark Resolved
                              </Button>
                            ) : (
                              <Badge className="bg-emerald-50 text-emerald-800 border-none text-[10px]">
                                Rectified
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </Card>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: DAILY SITE LOGS FEED */}
      {/* ========================================================================= */}
      {activeTab === 'logs' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-stone-900">
              Daily Supervisor Inspection Feed ({projectLogs.length} Records)
            </h2>
          </div>

          <div className="space-y-4">
            {projectLogs.map((log) => {
              const room = rooms.find((r) => r.id === log.room_id);

              return (
                <Card key={log.id} className="border-stone-200 shadow-none p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-stone-900">{log.title}</span>
                        {room && <Badge variant="outline" className="text-[10px]">{room.name}</Badge>}
                      </div>
                      <div className="text-[11px] text-stone-500 mt-0.5">
                        Date: {formatDate(log.date)} • {log.workforce_count} Workforce • {log.weather_conditions}
                      </div>
                    </div>
                    {log.is_client_visible && (
                      <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]">
                        Client Visible
                      </Badge>
                    )}
                  </div>

                  <p className="text-xs text-stone-700 leading-relaxed">{log.description}</p>

                  {log.photo_urls && log.photo_urls.length > 0 && (
                    <div className="flex gap-2 pt-1">
                      {log.photo_urls.map((url, i) => (
                        <img
                          key={i}
                          src={url}
                          alt="Inspection"
                          className="w-28 h-20 object-cover rounded border border-stone-200 cursor-pointer hover:opacity-90"
                          onClick={() => setSelectedPhoto(url)}
                        />
                      ))}
                    </div>
                  )}
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* DIALOG: LOG NEW SNAG */}
      {/* ========================================================================= */}
      <Dialog open={isAddSnagOpen} onOpenChange={setIsAddSnagOpen}>
        <DialogContent className="max-w-md">
          <form onSubmit={handleCreateSnag}>
            <DialogHeader>
              <DialogTitle className="text-base font-bold text-stone-900">
                Log Defect Snag Ticket
              </DialogTitle>
              <DialogDescription className="text-xs text-stone-500">
                Record workmanship defects, chip seams, or architectural discrepancies for contractor rework.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs font-semibold text-stone-700">Issue Code *</Label>
                  <Input
                    required
                    value={snagFormData.issue_code}
                    onChange={(e) => setSnagFormData({ ...snagFormData, issue_code: e.target.value })}
                    className="h-8 text-xs mt-1 font-mono font-bold"
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold text-stone-700">Room Location</Label>
                  <select
                    value={snagFormData.room_id}
                    onChange={(e) => setSnagFormData({ ...snagFormData, room_id: e.target.value })}
                    className="h-8 text-xs border border-stone-200 rounded-md px-2 bg-white text-stone-800 w-full mt-1"
                  >
                    {projectRooms.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <Label className="text-xs font-semibold text-stone-700">Defect Title *</Label>
                <Input
                  required
                  placeholder="e.g. Chipped marble corner on West wall border"
                  value={snagFormData.title}
                  onChange={(e) => setSnagFormData({ ...snagFormData, title: e.target.value })}
                  className="h-8 text-xs mt-1"
                />
              </div>

              <div>
                <Label className="text-xs font-semibold text-stone-700">Detailed Description & Rectification Scope</Label>
                <Textarea
                  required
                  placeholder="Exact defect location, trade contractor liable, required rework..."
                  value={snagFormData.description}
                  onChange={(e) => setSnagFormData({ ...snagFormData, description: e.target.value })}
                  className="text-xs mt-1 resize-none h-20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs font-semibold text-stone-700">Severity</Label>
                  <select
                    value={snagFormData.severity}
                    onChange={(e) => setSnagFormData({ ...snagFormData, severity: e.target.value as Issue['severity'] })}
                    className="h-8 text-xs border border-stone-200 rounded-md px-2 bg-white text-stone-800 w-full mt-1"
                  >
                    <option value="low">Low (Cosmetic finish)</option>
                    <option value="medium">Medium (Requires buff/fill)</option>
                    <option value="high">High (Trade blocker)</option>
                    <option value="critical">Critical (Handover stopper)</option>
                  </select>
                </div>
                <div>
                  <Label className="text-xs font-semibold text-stone-700">Resolution Deadline</Label>
                  <Input
                    type="date"
                    value={snagFormData.resolution_deadline}
                    onChange={(e) => setSnagFormData({ ...snagFormData, resolution_deadline: e.target.value })}
                    className="h-8 text-xs mt-1"
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsAddSnagOpen(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                className="bg-[#2A5C45] hover:bg-[#234c39] text-white text-xs"
              >
                Register Snag
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ========================================================================= */}
      {/* DIALOG: RESOLVE SNAG */}
      {/* ========================================================================= */}
      <Dialog open={isResolveSnagOpen} onOpenChange={setIsResolveSnagOpen}>
        <DialogContent className="max-w-md">
          <form onSubmit={handleConfirmResolveSnag}>
            <DialogHeader>
              <DialogTitle className="text-base font-bold text-stone-900">
                Rectify & Resolve Snag: {selectedIssue?.issue_code}
              </DialogTitle>
              <DialogDescription className="text-xs text-stone-500">
                Document how the contractor rectified this defect for quality handover sign-off.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-3">
              <div className="p-2.5 bg-stone-50 rounded border border-stone-200 text-xs">
                <span className="font-semibold text-stone-900 block">{selectedIssue?.title}</span>
                <span className="text-stone-500 block text-[11px] mt-0.5">{selectedIssue?.description}</span>
              </div>

              <div>
                <Label className="text-xs font-semibold text-stone-700">Rectification Notes *</Label>
                <Textarea
                  required
                  placeholder="e.g. Tile mastic epoxy filling buffed flush and crystallized. Passed visual inspection."
                  value={resolutionNotes}
                  onChange={(e) => setResolutionNotes(e.target.value)}
                  className="text-xs mt-1 resize-none h-20"
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsResolveSnagOpen(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                className="bg-[#2A5C45] hover:bg-[#234c39] text-white text-xs"
              >
                Confirm Resolution
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ========================================================================= */}
      {/* DIALOG: PHOTO ZOOM LIGHTBOX */}
      {/* ========================================================================= */}
      <Dialog open={!!selectedPhoto} onOpenChange={() => setSelectedPhoto(null)}>
        <DialogContent className="max-w-3xl p-2 bg-black/90 border-stone-800">
          {selectedPhoto && (
            <div className="rounded overflow-hidden">
              <img
                src={selectedPhoto}
                alt="High-res inspection photo"
                className="w-full h-auto max-h-[80vh] object-contain mx-auto"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
