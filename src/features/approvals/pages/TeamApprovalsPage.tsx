import React, { useState } from 'react';
import {
  CheckSquare,
  FileSignature,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  Search,
  Filter,
  DollarSign,
  Calendar,
  MessageSquare,
  FileText,
  Building2,
  ExternalLink,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import { useDemoStore } from '@/stores/demoStore';
import { formatINR, formatDate } from '@/lib/utils';
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
import { Approval, ChangeRequest } from '@/types';

export function TeamApprovalsPage() {
  const {
    projects,
    currentProjectId,
    setCurrentProject,
    rooms,
    approvals,
    changeRequests,
    currentUser,
    addApproval,
    updateApproval,
    updateApprovalStatus,
    addChangeRequest,
    updateChangeRequest,
  } = useDemoStore();

  const activeProject = projects.find((p) => p.id === currentProjectId) || projects[0];

  // Active Tab: 'approvals' | 'change_requests'
  const [activeTab, setActiveTab] = useState<'approvals' | 'change_requests'>('approvals');

  // Filters for Tab 1 (Approvals)
  const [approvalStatusFilter, setApprovalStatusFilter] = useState('all');
  const [approvalCategoryFilter, setApprovalCategoryFilter] = useState('all');
  const [approvalSearch, setApprovalSearch] = useState('');

  // Filters for Tab 2 (Change Requests)
  const [crStatusFilter, setCrStatusFilter] = useState('all');
  const [crSearch, setCrSearch] = useState('');

  // Dialog States
  const [isAddApprovalOpen, setIsAddApprovalOpen] = useState(false);
  const [isAddCROpen, setIsAddCROpen] = useState(false);
  const [isQuoteCROpen, setIsQuoteCROpen] = useState(false);
  const [isDetailApprovalOpen, setIsDetailApprovalOpen] = useState(false);

  // Selected Records for Dialogs
  const [selectedApproval, setSelectedApproval] = useState<Approval | null>(null);
  const [selectedCR, setSelectedCR] = useState<ChangeRequest | null>(null);

  // Form State: Add Approval
  const [approvalFormData, setApprovalFormData] = useState({
    room_id: '',
    title: '',
    category: 'material' as Approval['category'],
    description: '',
    due_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    internal_notes: '',
  });

  // Form State: Add Change Request
  const [crFormData, setCrFormData] = useState({
    room_id: '',
    title: '',
    description: '',
    original_spec: '',
    requested_change: '',
    cost_impact: 15000,
    timeline_impact_days: 2,
    requested_by: 'Rahul Sharma (Client)',
    status: 'requested' as ChangeRequest['status'],
  });

  // Form State: Quote Change Request
  const [crQuoteData, setCrQuoteData] = useState({
    cost_impact: 0,
    timeline_impact_days: 0,
    status: 'quoted' as ChangeRequest['status'],
  });

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Filtered collections for active project
  const projectRooms = rooms.filter((r) => r.project_id === activeProject?.id);
  const projectApprovals = approvals.filter((a) => a.project_id === activeProject?.id);
  const projectCRs = changeRequests.filter((cr) => cr.project_id === activeProject?.id);

  const filteredApprovals = projectApprovals.filter((a) => {
    const matchesStatus = approvalStatusFilter === 'all' || a.status === approvalStatusFilter;
    const matchesCat = approvalCategoryFilter === 'all' || a.category === approvalCategoryFilter;
    const matchesSearch =
      a.title.toLowerCase().includes(approvalSearch.toLowerCase()) ||
      (a.description || '').toLowerCase().includes(approvalSearch.toLowerCase());
    return matchesStatus && matchesCat && matchesSearch;
  });

  const filteredCRs = projectCRs.filter((cr) => {
    const matchesStatus = crStatusFilter === 'all' || cr.status === crStatusFilter;
    const matchesSearch =
      cr.title.toLowerCase().includes(crSearch.toLowerCase()) ||
      cr.request_code.toLowerCase().includes(crSearch.toLowerCase()) ||
      cr.description.toLowerCase().includes(crSearch.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Handlers
  const handleCreateApproval = (e: React.FormEvent) => {
    e.preventDefault();
    if (!approvalFormData.title || !activeProject) return;

    addApproval({
      project_id: activeProject.id,
      room_id: approvalFormData.room_id || projectRooms[0]?.id || '',
      title: approvalFormData.title,
      category: approvalFormData.category,
      description: approvalFormData.description,
      status: 'pending',
      due_date: approvalFormData.due_date,
      internal_notes: approvalFormData.internal_notes,
    });

    setIsAddApprovalOpen(false);
    showToast(`Approval request "${approvalFormData.title}" dispatched to client.`);
  };

  const handleCreateCR = (e: React.FormEvent) => {
    e.preventDefault();
    if (!crFormData.title || !activeProject) return;

    const code = `CR-00${changeRequests.length + 1}`;
    addChangeRequest({
      project_id: activeProject.id,
      room_id: crFormData.room_id || projectRooms[0]?.id || '',
      request_code: code,
      title: crFormData.title,
      description: crFormData.description,
      original_spec: crFormData.original_spec,
      requested_change: crFormData.requested_change,
      cost_impact: Number(crFormData.cost_impact) || 0,
      timeline_impact_days: Number(crFormData.timeline_impact_days) || 0,
      requested_by: crFormData.requested_by,
      reviewed_by: currentUser.full_name,
      status: crFormData.status,
    });

    setIsAddCROpen(false);
    showToast(`Variation Order ${code} logged in review stage.`);
  };

  const handleOpenQuoteCR = (cr: ChangeRequest) => {
    setSelectedCR(cr);
    setCrQuoteData({
      cost_impact: cr.cost_impact,
      timeline_impact_days: cr.timeline_impact_days,
      status: cr.status,
    });
    setIsQuoteCROpen(true);
  };

  const handleSaveQuoteCR = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCR) return;

    updateChangeRequest(selectedCR.id, {
      cost_impact: Number(crQuoteData.cost_impact) || 0,
      timeline_impact_days: Number(crQuoteData.timeline_impact_days) || 0,
      status: crQuoteData.status,
    });

    setIsQuoteCROpen(false);
    showToast(`Quote for ${selectedCR.request_code} updated to ${formatINR(crQuoteData.cost_impact)}.`);
  };

  const handleApproveCR = (cr: ChangeRequest) => {
    updateChangeRequest(cr.id, {
      status: 'approved',
      client_decision: 'approved',
      approved_at: new Date().toISOString(),
    });
    showToast(`Change request ${cr.request_code} approved! Project budget updated.`);
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
              Approvals & Change Requests Hub
            </h1>
            <Badge variant="outline" className="text-xs bg-stone-100 text-stone-700">
              {activeTab === 'approvals' ? `${projectApprovals.length} Sign-offs` : `${projectCRs.length} Variations`}
            </Badge>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Track homeowner material & design sign-offs, prepare variation quotes, and manage cost impacts.
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

          {activeTab === 'approvals' ? (
            <Button
              size="sm"
              className="bg-[#2A5C45] hover:bg-[#234c39] text-white text-xs"
              onClick={() => {
                setApprovalFormData({
                  room_id: projectRooms[0]?.id || '',
                  title: '',
                  category: 'material',
                  description: '',
                  due_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                  internal_notes: '',
                });
                setIsAddApprovalOpen(true);
              }}
            >
              <Plus className="h-3.5 w-3.5 mr-1" />
              Request New Approval
            </Button>
          ) : (
            <Button
              size="sm"
              className="bg-[#2A5C45] hover:bg-[#234c39] text-white text-xs"
              onClick={() => {
                setCrFormData({
                  room_id: projectRooms[0]?.id || '',
                  title: '',
                  description: '',
                  original_spec: '',
                  requested_change: '',
                  cost_impact: 15000,
                  timeline_impact_days: 2,
                  requested_by: 'Rahul Sharma (Client)',
                  status: 'requested',
                });
                setIsAddCROpen(true);
              }}
            >
              <Plus className="h-3.5 w-3.5 mr-1" />
              Raise Change Request
            </Button>
          )}
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex items-center gap-2 border-b border-stone-200">
        <button
          onClick={() => setActiveTab('approvals')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors ${
            activeTab === 'approvals'
              ? 'border-[#2A5C45] text-[#2A5C45]'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <CheckSquare className="h-4 w-4" />
          Client Sign-offs & Approvals ({projectApprovals.length})
        </button>

        <button
          onClick={() => setActiveTab('change_requests')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors ${
            activeTab === 'change_requests'
              ? 'border-[#2A5C45] text-[#2A5C45]'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <FileSignature className="h-4 w-4" />
          Scope Variations / Change Requests ({projectCRs.length})
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: CLIENT SIGN-OFFS & APPROVALS */}
      {/* ========================================================================= */}
      {activeTab === 'approvals' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-lg border border-stone-200">
            <div className="flex items-center gap-2 w-full sm:w-72">
              <Search className="h-4 w-4 text-stone-400" />
              <Input
                placeholder="Search approval items..."
                value={approvalSearch}
                onChange={(e) => setApprovalSearch(e.target.value)}
                className="h-8 text-xs border-stone-200"
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
              <select
                value={approvalCategoryFilter}
                onChange={(e) => setApprovalCategoryFilter(e.target.value)}
                className="h-8 text-xs border border-stone-200 rounded-md px-2 bg-white text-stone-700"
              >
                <option value="all">All Categories</option>
                <option value="design">Design</option>
                <option value="material">Material Finish</option>
                <option value="layout">Layout</option>
                <option value="commercial">Commercial</option>
              </select>

              <select
                value={approvalStatusFilter}
                onChange={(e) => setApprovalStatusFilter(e.target.value)}
                className="h-8 text-xs border border-stone-200 rounded-md px-2 bg-white text-stone-700"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="revision_requested">Revision Requested</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
          </div>

          {/* Approvals Table */}
          <Card className="border-stone-200 shadow-none overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-stone-50/70 border-b border-stone-200 text-[11px]">
                  <TableHead className="py-3 font-semibold text-stone-700">Item Title & Room</TableHead>
                  <TableHead className="py-3 font-semibold text-stone-700">Category</TableHead>
                  <TableHead className="py-3 font-semibold text-stone-700">Due Date</TableHead>
                  <TableHead className="py-3 font-semibold text-stone-700">Client Feedback</TableHead>
                  <TableHead className="py-3 font-semibold text-stone-700">Status</TableHead>
                  <TableHead className="py-3 font-semibold text-stone-700 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredApprovals.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-xs text-stone-500">
                      No approval items match the current filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredApprovals.map((appr) => {
                    const room = rooms.find((r) => r.id === appr.room_id);
                    return (
                      <TableRow key={appr.id} className="hover:bg-stone-50/70 border-b border-stone-100 text-xs">
                        <TableCell className="py-3">
                          <div className="font-semibold text-stone-900">{appr.title}</div>
                          <div className="text-[11px] text-stone-500 font-mono mt-0.5">
                            Room: {room?.name || 'Whole Apartment'}
                          </div>
                        </TableCell>
                        <TableCell className="py-3">
                          <Badge variant="outline" className="text-[10px] uppercase font-mono text-stone-600">
                            {appr.category}
                          </Badge>
                        </TableCell>
                        <TableCell className="py-3 text-stone-600">
                          {formatDate(appr.due_date)}
                        </TableCell>
                        <TableCell className="py-3 max-w-xs">
                          {appr.client_comments ? (
                            <span className="text-[11px] text-stone-700 italic bg-stone-50 px-2 py-1 rounded block border border-stone-100 truncate">
                              "{appr.client_comments}"
                            </span>
                          ) : (
                            <span className="text-stone-400 text-[11px]">—</span>
                          )}
                        </TableCell>
                        <TableCell className="py-3">
                          <StatusBadge status={appr.status} />
                        </TableCell>
                        <TableCell className="py-3 text-right">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs border-stone-200 text-stone-700 hover:bg-stone-50"
                            onClick={() => {
                              setSelectedApproval(appr);
                              setIsDetailApprovalOpen(true);
                            }}
                          >
                            View & Notes
                          </Button>
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
      {/* TAB 2: CHANGE REQUESTS (VARIATIONS) */}
      {/* ========================================================================= */}
      {activeTab === 'change_requests' && (
        <div className="space-y-4">
          {/* Summary Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Card className="p-3 border-stone-200 shadow-none">
              <span className="text-[11px] text-stone-500 block uppercase font-mono">Total Variations</span>
              <span className="text-xl font-bold text-stone-900">{projectCRs.length} Orders</span>
            </Card>
            <Card className="p-3 border-stone-200 shadow-none">
              <span className="text-[11px] text-stone-500 block uppercase font-mono">Approved Cost Added</span>
              <span className="text-xl font-bold text-stone-900">
                +{formatINR(projectCRs.filter(c => c.status === 'approved').reduce((acc, c) => acc + c.cost_impact, 0))}
              </span>
            </Card>
            <Card className="p-3 border-stone-200 shadow-none">
              <span className="text-[11px] text-stone-500 block uppercase font-mono">Awaiting Client Sign-off</span>
              <span className="text-xl font-bold text-amber-700">
                {projectCRs.filter(c => c.status === 'quoted').length} Quoted
              </span>
            </Card>
          </div>

          {/* Change Requests Table */}
          <Card className="border-stone-200 shadow-none overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-stone-50/70 border-b border-stone-200 text-[11px]">
                  <TableHead className="py-3 font-semibold text-stone-700">CR Code & Title</TableHead>
                  <TableHead className="py-3 font-semibold text-stone-700">Original Specification</TableHead>
                  <TableHead className="py-3 font-semibold text-stone-700">Requested Change</TableHead>
                  <TableHead className="py-3 font-semibold text-stone-700">Cost Impact</TableHead>
                  <TableHead className="py-3 font-semibold text-stone-700">Timeline Impact</TableHead>
                  <TableHead className="py-3 font-semibold text-stone-700">Status</TableHead>
                  <TableHead className="py-3 font-semibold text-stone-700 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCRs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-xs text-stone-500">
                      No change requests found for this project.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCRs.map((cr) => {
                    const room = rooms.find((r) => r.id === cr.room_id);
                    return (
                      <TableRow key={cr.id} className="hover:bg-stone-50/70 border-b border-stone-100 text-xs">
                        <TableCell className="py-3">
                          <div className="font-mono font-bold text-[#2A5C45] text-xs">
                            {cr.request_code}
                          </div>
                          <div className="font-medium text-stone-900 mt-0.5">{cr.title}</div>
                          <div className="text-[10px] text-stone-500">{room?.name}</div>
                        </TableCell>
                        <TableCell className="py-3 max-w-xs text-stone-600 text-[11px] line-clamp-2">
                          {cr.original_spec}
                        </TableCell>
                        <TableCell className="py-3 max-w-xs text-stone-800 text-[11px] font-medium line-clamp-2">
                          {cr.requested_change}
                        </TableCell>
                        <TableCell className="py-3 font-bold text-stone-900">
                          +{formatINR(cr.cost_impact)}
                        </TableCell>
                        <TableCell className="py-3 text-stone-600">
                          +{cr.timeline_impact_days} days
                        </TableCell>
                        <TableCell className="py-3">
                          <StatusBadge status={cr.status} />
                        </TableCell>
                        <TableCell className="py-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {cr.status !== 'approved' && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 text-xs border-stone-200 hover:bg-stone-50"
                                onClick={() => handleOpenQuoteCR(cr)}
                              >
                                Edit Quote
                              </Button>
                            )}
                            {cr.status === 'quoted' && (
                              <Button
                                size="sm"
                                className="h-7 text-xs bg-[#2A5C45] hover:bg-[#234c39] text-white"
                                onClick={() => handleApproveCR(cr)}
                              >
                                Mark Approved
                              </Button>
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
      {/* DIALOG: REQUEST NEW APPROVAL */}
      {/* ========================================================================= */}
      <Dialog open={isAddApprovalOpen} onOpenChange={setIsAddApprovalOpen}>
        <DialogContent className="max-w-md">
          <form onSubmit={handleCreateApproval}>
            <DialogHeader>
              <DialogTitle className="text-base font-bold text-stone-900">
                Request Client Sign-off
              </DialogTitle>
              <DialogDescription className="text-xs text-stone-500">
                Create a formal approval request for finish selections, stone slabs, or CAD layouts.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs font-semibold text-stone-700">Room</Label>
                  <select
                    value={approvalFormData.room_id}
                    onChange={(e) => setApprovalFormData({ ...approvalFormData, room_id: e.target.value })}
                    className="h-8 text-xs border border-stone-200 rounded-md px-2 bg-white text-stone-800 w-full mt-1"
                  >
                    {projectRooms.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label className="text-xs font-semibold text-stone-700">Category</Label>
                  <select
                    value={approvalFormData.category}
                    onChange={(e) => setApprovalFormData({ ...approvalFormData, category: e.target.value as Approval['category'] })}
                    className="h-8 text-xs border border-stone-200 rounded-md px-2 bg-white text-stone-800 w-full mt-1"
                  >
                    <option value="material">Material Finish</option>
                    <option value="design">Design / 3D Render</option>
                    <option value="layout">Floor Plan Layout</option>
                    <option value="commercial">Commercial / Budget</option>
                  </select>
                </div>
              </div>

              <div>
                <Label className="text-xs font-semibold text-stone-700">Approval Title *</Label>
                <Input
                  required
                  placeholder="e.g. Master Bedroom Oak Veneer Stain Selection"
                  value={approvalFormData.title}
                  onChange={(e) => setApprovalFormData({ ...approvalFormData, title: e.target.value })}
                  className="h-8 text-xs mt-1"
                />
              </div>

              <div>
                <Label className="text-xs font-semibold text-stone-700">Specification & Details for Client</Label>
                <Textarea
                  required
                  placeholder="Provide manufacturer code, warranty, sample approval reference..."
                  value={approvalFormData.description}
                  onChange={(e) => setApprovalFormData({ ...approvalFormData, description: e.target.value })}
                  className="text-xs mt-1 resize-none h-20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs font-semibold text-stone-700">Due Date</Label>
                  <Input
                    type="date"
                    value={approvalFormData.due_date}
                    onChange={(e) => setApprovalFormData({ ...approvalFormData, due_date: e.target.value })}
                    className="h-8 text-xs mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold text-stone-700">Internal Team Notes</Label>
                  <Input
                    placeholder="Optional internal reminder"
                    value={approvalFormData.internal_notes}
                    onChange={(e) => setApprovalFormData({ ...approvalFormData, internal_notes: e.target.value })}
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
                onClick={() => setIsAddApprovalOpen(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                className="bg-[#2A5C45] hover:bg-[#234c39] text-white text-xs"
              >
                Send Request
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ========================================================================= */}
      {/* DIALOG: RAISE CHANGE REQUEST */}
      {/* ========================================================================= */}
      <Dialog open={isAddCROpen} onOpenChange={setIsAddCROpen}>
        <DialogContent className="max-w-md">
          <form onSubmit={handleCreateCR}>
            <DialogHeader>
              <DialogTitle className="text-base font-bold text-stone-900">
                Raise Variation Order (Change Request)
              </DialogTitle>
              <DialogDescription className="text-xs text-stone-500">
                Document scope changes requested during site visits or design reviews.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-3">
              <div>
                <Label className="text-xs font-semibold text-stone-700">Change Request Title *</Label>
                <Input
                  required
                  placeholder="e.g. Upgrade to Smart Motorized Curtain Tracks"
                  value={crFormData.title}
                  onChange={(e) => setCrFormData({ ...crFormData, title: e.target.value })}
                  className="h-8 text-xs mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs font-semibold text-stone-700">Room</Label>
                  <select
                    value={crFormData.room_id}
                    onChange={(e) => setCrFormData({ ...crFormData, room_id: e.target.value })}
                    className="h-8 text-xs border border-stone-200 rounded-md px-2 bg-white text-stone-800 w-full mt-1"
                  >
                    {projectRooms.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label className="text-xs font-semibold text-stone-700">Requested By</Label>
                  <Input
                    value={crFormData.requested_by}
                    onChange={(e) => setCrFormData({ ...crFormData, requested_by: e.target.value })}
                    className="h-8 text-xs mt-1"
                  />
                </div>
              </div>

              <div>
                <Label className="text-xs font-semibold text-stone-700">Original Baseline Spec</Label>
                <Input
                  placeholder="e.g. Manual curtain pelmet track with rope pull"
                  value={crFormData.original_spec}
                  onChange={(e) => setCrFormData({ ...crFormData, original_spec: e.target.value })}
                  className="h-8 text-xs mt-1"
                />
              </div>

              <div>
                <Label className="text-xs font-semibold text-stone-700">Proposed Variation</Label>
                <Input
                  placeholder="e.g. Somfy motorized Zigbee dual-track with conduit raceway"
                  value={crFormData.requested_change}
                  onChange={(e) => setCrFormData({ ...crFormData, requested_change: e.target.value })}
                  className="h-8 text-xs mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs font-semibold text-stone-700">Cost Impact (₹)</Label>
                  <Input
                    type="number"
                    value={crFormData.cost_impact}
                    onChange={(e) => setCrFormData({ ...crFormData, cost_impact: Number(e.target.value) })}
                    className="h-8 text-xs mt-1 font-mono font-bold"
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold text-stone-700">Timeline Impact (Days)</Label>
                  <Input
                    type="number"
                    value={crFormData.timeline_impact_days}
                    onChange={(e) => setCrFormData({ ...crFormData, timeline_impact_days: Number(e.target.value) })}
                    className="h-8 text-xs mt-1 font-mono"
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsAddCROpen(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                className="bg-[#2A5C45] hover:bg-[#234c39] text-white text-xs"
              >
                Create Variation
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ========================================================================= */}
      {/* DIALOG: EDIT QUOTE FOR CHANGE REQUEST */}
      {/* ========================================================================= */}
      <Dialog open={isQuoteCROpen} onOpenChange={setIsQuoteCROpen}>
        <DialogContent className="max-w-md">
          <form onSubmit={handleSaveQuoteCR}>
            <DialogHeader>
              <DialogTitle className="text-base font-bold text-stone-900">
                Update Variation Quote: {selectedCR?.request_code}
              </DialogTitle>
              <DialogDescription className="text-xs text-stone-500">
                Finalize commercial quote before presenting to client for binding sign-off.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-3">
              <div className="p-2.5 bg-stone-50 rounded border border-stone-200 text-xs">
                <span className="font-semibold text-stone-900 block">{selectedCR?.title}</span>
                <span className="text-stone-500 block text-[11px] mt-0.5">{selectedCR?.requested_change}</span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs font-semibold text-stone-700">Cost Impact (₹)</Label>
                  <Input
                    type="number"
                    value={crQuoteData.cost_impact}
                    onChange={(e) => setCrQuoteData({ ...crQuoteData, cost_impact: Number(e.target.value) })}
                    className="h-8 text-xs mt-1 font-mono font-bold"
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold text-stone-700">Days Added</Label>
                  <Input
                    type="number"
                    value={crQuoteData.timeline_impact_days}
                    onChange={(e) => setCrQuoteData({ ...crQuoteData, timeline_impact_days: Number(e.target.value) })}
                    className="h-8 text-xs mt-1 font-mono"
                  />
                </div>
              </div>

              <div>
                <Label className="text-xs font-semibold text-stone-700">Quote Lifecycle Stage</Label>
                <select
                  value={crQuoteData.status}
                  onChange={(e) => setCrQuoteData({ ...crQuoteData, status: e.target.value as ChangeRequest['status'] })}
                  className="h-8 text-xs border border-stone-200 rounded-md px-2 bg-white text-stone-800 w-full mt-1"
                >
                  <option value="reviewed">Reviewed (Internal)</option>
                  <option value="quoted">Quoted (Sent to Client)</option>
                  <option value="approved">Approved (Binding)</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsQuoteCROpen(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                className="bg-[#2A5C45] hover:bg-[#234c39] text-white text-xs"
              >
                Save Quote
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ========================================================================= */}
      {/* DIALOG: DETAIL & INTERNAL NOTES FOR APPROVAL */}
      {/* ========================================================================= */}
      <Dialog open={isDetailApprovalOpen} onOpenChange={setIsDetailApprovalOpen}>
        <DialogContent className="max-w-md">
          {selectedApproval && (
            <div className="space-y-4">
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <DialogTitle className="text-base font-bold text-stone-900">
                    {selectedApproval.title}
                  </DialogTitle>
                  <StatusBadge status={selectedApproval.status} />
                </div>
                <DialogDescription className="text-xs text-stone-500">
                  Category: {selectedApproval.category} • Due Date: {formatDate(selectedApproval.due_date)}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-3 text-xs">
                <div className="space-y-1">
                  <span className="font-semibold text-stone-700 block">Specification Details</span>
                  <p className="text-stone-600 leading-relaxed bg-stone-50 p-2.5 rounded border border-stone-100">
                    {selectedApproval.description}
                  </p>
                </div>

                {selectedApproval.client_comments && (
                  <div className="space-y-1">
                    <span className="font-semibold text-purple-700 block">Homeowner Feedback</span>
                    <p className="text-purple-900 bg-purple-50 p-2.5 rounded border border-purple-100 italic">
                      "{selectedApproval.client_comments}"
                    </p>
                  </div>
                )}

                <div className="space-y-1">
                  <Label className="font-semibold text-stone-700 block">Internal Team Notes</Label>
                  <Textarea
                    defaultValue={selectedApproval.internal_notes || ''}
                    placeholder="Add internal notes for site manager or lead designer..."
                    onChange={(e) => {
                      updateApproval(selectedApproval.id, { internal_notes: e.target.value });
                    }}
                    className="text-xs resize-none h-16"
                  />
                </div>
              </div>

              <DialogFooter className="flex items-center justify-between">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsDetailApprovalOpen(false)}
                  className="text-xs mr-auto"
                >
                  Close
                </Button>

                {selectedApproval.status === 'pending' && (
                  <Button
                    size="sm"
                    className="bg-[#2A5C45] hover:bg-[#234c39] text-white text-xs"
                    onClick={() => {
                      updateApprovalStatus(selectedApproval.id, 'approved', 'Signed off on behalf of client during site walkthrough.');
                      setIsDetailApprovalOpen(false);
                      showToast('Approval confirmed.');
                    }}
                  >
                    Confirm Sign-off
                  </Button>
                )}
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
