import React, { useState } from 'react';
import {
  FileSignature,
  Plus,
  Search,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowRight,
  TrendingUp,
  AlertCircle,
  X,
  Eye,
  Calendar,
  Building2,
} from 'lucide-react';
import { useDemoStore } from '@/stores/demoStore';
import { ChangeRequest, ChangeRequestStatus } from '@/types';
import { formatINR, formatDate } from '@/lib/utils';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { EmptyState } from '@/components/shared/EmptyState';
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

export function AdminChangeRequestsPage() {
  const {
    changeRequests,
    projects,
    rooms,
    addChangeRequest,
    updateChangeRequest,
  } = useDemoStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Detail / Review Modal State
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedCR, setSelectedCR] = useState<ChangeRequest | null>(null);

  // New CR Modal State
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [newCRForm, setNewCRForm] = useState({
    request_code: `CR-00${changeRequests.length + 1}`,
    project_id: projects[0]?.id || '',
    room_id: '',
    title: '',
    description: '',
    original_spec: '',
    requested_change: '',
    cost_impact: 15000,
    timeline_impact_days: 2,
    requested_by: 'Client',
    status: 'requested' as ChangeRequestStatus,
  });

  const [formError, setFormError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Filtering
  const filteredCRs = changeRequests.filter((cr) => {
    const proj = projects.find((p) => p.id === cr.project_id);
    const search = searchQuery.toLowerCase();
    const matchesSearch =
      cr.request_code.toLowerCase().includes(search) ||
      cr.title.toLowerCase().includes(search) ||
      cr.description.toLowerCase().includes(search) ||
      (proj && proj.title.toLowerCase().includes(search));

    const matchesStatus = statusFilter === 'all' || cr.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalCostImpactApproved = changeRequests
    .filter((cr) => cr.status === 'approved' || cr.status === 'implemented')
    .reduce((sum, cr) => sum + cr.cost_impact, 0);

  const pendingReviewCount = changeRequests.filter(
    (cr) => cr.status === 'requested' || cr.status === 'submitted' || cr.status === 'under_review' || cr.status === 'reviewed'
  ).length;

  const handleOpenDetail = (cr: ChangeRequest) => {
    setSelectedCR(cr);
    setDetailModalOpen(true);
  };

  const handleUpdateStatus = (status: ChangeRequestStatus, clientDecision?: 'approved' | 'rejected') => {
    if (selectedCR) {
      updateChangeRequest(selectedCR.id, {
        status,
        client_decision: clientDecision ?? (status === 'approved' ? 'approved' : status === 'rejected' ? 'rejected' : selectedCR.client_decision),
        approved_at: status === 'approved' ? new Date().toISOString() : selectedCR.approved_at,
      });

      setSuccessMsg(`Change request ${selectedCR.request_code} transitioned to "${status}".`);
      setDetailModalOpen(false);
      setTimeout(() => setSuccessMsg(''), 4000);
    }
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCRForm.title.trim()) {
      setFormError('Please enter a change title');
      return;
    }
    if (!newCRForm.requested_change.trim()) {
      setFormError('Please describe the requested architectural variation');
      return;
    }

    const created = addChangeRequest({
      ...newCRForm,
      client_decision: 'pending',
    });

    setSuccessMsg(`Variation order ${created.request_code} logged for review.`);
    setCreateModalOpen(false);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const selectedProjectRooms = rooms.filter(
    (r) => r.project_id === newCRForm.project_id
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Change Requests & Margin Control"
        subtitle="Manage client variation orders, cost escalations, schedule shifts, and formal digital sign-offs."
        breadcrumbs={[{ label: 'Admin' }, { label: 'Change Requests' }]}
        actions={
          <Button onClick={() => setCreateModalOpen(true)} size="sm" className="text-xs">
            <Plus className="w-3.5 h-3.5 mr-1.5" /> Log Variation Order
          </Button>
        }
      />

      {/* Success Notification */}
      {successMsg && (
        <div className="p-3 rounded-md bg-[#EAF2ED] border border-[#CDE1D4] text-[#204E38] text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-[#2A5C45]" />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg('')} className="text-stone-500 hover:text-stone-800">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Card className="p-3.5">
          <div className="flex items-center justify-between text-stone-500 mb-1">
            <span className="text-[11px] uppercase tracking-wider font-medium">Approved Variation Total</span>
            <TrendingUp className="w-4 h-4 text-[#2A5C45]" />
          </div>
          <span className="text-xl font-bold text-stone-900 block">
            +{formatINR(totalCostImpactApproved)}
          </span>
          <span className="text-xs text-stone-500">
            Added to baseline project billings
          </span>
        </Card>

        <Card className="p-3.5">
          <div className="flex items-center justify-between text-stone-500 mb-1">
            <span className="text-[11px] uppercase tracking-wider font-medium">Pending Review / Quote</span>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <span className="text-xl font-bold text-amber-800 block">
            {pendingReviewCount} Requests
          </span>
          <span className="text-xs text-stone-500">
            Awaiting designer estimation or client approval
          </span>
        </Card>

        <Card className="p-3.5">
          <div className="flex items-center justify-between text-stone-500 mb-1">
            <span className="text-[11px] uppercase tracking-wider font-medium">Standard Workflow</span>
            <FileSignature className="w-4 h-4 text-[#2A5C45]" />
          </div>
          <span className="text-xs font-semibold text-stone-800 block mt-1">
            Requested → Reviewed → Quoted → Approved → Implemented
          </span>
          <span className="text-[11px] text-stone-400 mt-1 block">
            With audit trail and cost protection
          </span>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-lg border border-stone-200">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          <Input
            placeholder="Search by code (e.g. CR-001), title, or project..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 text-xs h-9"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="w-44">
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs h-9"
            >
              <option value="all">All Stages ({changeRequests.length})</option>
              <option value="requested">Requested</option>
              <option value="reviewed">Reviewed</option>
              <option value="quoted">Quoted</option>
              <option value="approved">Approved</option>
              <option value="implemented">Implemented</option>
              <option value="rejected">Rejected</option>
              <option value="cancelled">Cancelled</option>
            </Select>
          </div>

          {(searchQuery || statusFilter !== 'all') && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
              }}
              className="text-xs h-9 text-stone-500"
            >
              Reset
            </Button>
          )}
        </div>
      </div>

      {/* Change Requests Table */}
      {filteredCRs.length === 0 ? (
        <EmptyState
          icon={FileSignature}
          title="No variation orders found"
          description="No change requests match your search criteria."
          actionLabel="Log Variation Order"
          onAction={() => setCreateModalOpen(true)}
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>CR Code</TableHead>
              <TableHead>Title & Specification</TableHead>
              <TableHead>Project & Space</TableHead>
              <TableHead>Cost Impact</TableHead>
              <TableHead>Timeline Shift</TableHead>
              <TableHead>Workflow Stage</TableHead>
              <TableHead>Client Sign-off</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCRs.map((cr) => {
              const proj = projects.find((p) => p.id === cr.project_id);
              const room = rooms.find((r) => r.id === cr.room_id);

              return (
                <TableRow
                  key={cr.id}
                  className="cursor-pointer hover:bg-stone-50/70 transition-colors"
                  onClick={() => handleOpenDetail(cr)}
                >
                  <TableCell className="font-mono text-xs font-semibold text-stone-800">
                    {cr.request_code}
                  </TableCell>
                  <TableCell className="text-xs max-w-xs">
                    <span className="font-medium text-stone-900 block truncate">{cr.title}</span>
                    <span className="text-[11px] text-stone-500 line-clamp-1">{cr.description}</span>
                  </TableCell>
                  <TableCell className="text-xs text-stone-600">
                    <span className="font-medium text-stone-800 block truncate">{proj?.title || 'General'}</span>
                    <span className="text-[11px] text-stone-400">{room?.name || 'All Spaces'}</span>
                  </TableCell>
                  <TableCell className="text-xs font-semibold text-emerald-800 whitespace-nowrap">
                    +{formatINR(cr.cost_impact)}
                  </TableCell>
                  <TableCell className="text-xs text-stone-600 whitespace-nowrap">
                    +{cr.timeline_impact_days} days
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={cr.status} />
                  </TableCell>
                  <TableCell>
                    {cr.client_decision === 'approved' ? (
                      <span className="text-[11px] text-[#204E38] font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-[#2A5C45]" /> Signed Off
                      </span>
                    ) : cr.client_decision === 'rejected' ? (
                      <span className="text-[11px] text-rose-700 font-medium flex items-center gap-1">
                        <XCircle className="w-3 h-3 text-rose-600" /> Declined
                      </span>
                    ) : (
                      <span className="text-[11px] text-amber-700 font-medium flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-600" /> In Review
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenDetail(cr);
                      }}
                      className="h-7 text-xs px-2.5 text-[#2A5C45]"
                    >
                      <Eye className="w-3 h-3 mr-1" /> Review
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}

      {/* Review & Detail Modal */}
      {selectedCR && (
        <Dialog open={detailModalOpen} onOpenChange={setDetailModalOpen}>
          <DialogHeader>
            <div className="flex items-center justify-between pr-6">
              <DialogTitle className="flex items-center gap-2">
                <span>{selectedCR.request_code}: {selectedCR.title}</span>
                <StatusBadge status={selectedCR.status} />
              </DialogTitle>
            </div>
            <DialogDescription>
              Architectural variation review and financial authorization.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2 text-xs">
            {/* Comparison Grid: Original Spec vs Requested Variation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded border border-stone-200 bg-stone-50/50 space-y-1">
                <span className="text-stone-400 text-[11px] uppercase tracking-wider block font-semibold">
                  Original Contract Specification
                </span>
                <p className="text-stone-700 leading-relaxed">
                  {selectedCR.original_spec || 'Standard drawing specification per signed baseline.'}
                </p>
              </div>

              <div className="p-3 rounded border border-[#CDE1D4] bg-[#EAF2ED]/40 space-y-1">
                <span className="text-[#204E38] text-[11px] uppercase tracking-wider block font-semibold">
                  Requested Variation Modification
                </span>
                <p className="text-stone-800 leading-relaxed font-medium">
                  {selectedCR.requested_change || selectedCR.description}
                </p>
              </div>
            </div>

            {/* Impact Metric Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3 rounded border border-stone-200 bg-white">
              <div>
                <span className="text-stone-400 text-[11px] block">Additional Cost Impact</span>
                <span className="text-sm font-bold text-stone-900 block mt-0.5">
                  +{formatINR(selectedCR.cost_impact)}
                </span>
              </div>
              <div>
                <span className="text-stone-400 text-[11px] block">Timeline Shift</span>
                <span className="text-sm font-bold text-stone-900 block mt-0.5">
                  +{selectedCR.timeline_impact_days} Days
                </span>
              </div>
              <div>
                <span className="text-stone-400 text-[11px] block">Client Decision</span>
                <span className="text-sm font-bold text-stone-900 block mt-0.5 capitalize">
                  {selectedCR.client_decision || 'Pending'}
                </span>
              </div>
            </div>

            {selectedCR.client_decision_notes && (
              <div className="p-2.5 rounded bg-stone-50 border border-stone-200/60 text-stone-700 italic">
                Homeowner Note: "{selectedCR.client_decision_notes}"
              </div>
            )}

            {/* Workflow Action Bar */}
            <div className="border-t border-stone-200 pt-3">
              <span className="text-stone-500 font-medium block mb-2 text-[11px] uppercase tracking-wider">
                Progress Workflow Action:
              </span>
              <div className="flex flex-wrap gap-2">
                {selectedCR.status === 'requested' && (
                  <Button
                    size="sm"
                    className="text-xs h-8"
                    onClick={() => handleUpdateStatus('reviewed')}
                  >
                    Mark as Technical Reviewed
                  </Button>
                )}
                {(selectedCR.status === 'requested' || selectedCR.status === 'reviewed') && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs h-8"
                    onClick={() => handleUpdateStatus('quoted')}
                  >
                    Submit Quotation to Client
                  </Button>
                )}
                {selectedCR.status !== 'approved' && selectedCR.status !== 'implemented' && (
                  <Button
                    size="sm"
                    className="text-xs h-8 bg-[#2A5C45] hover:bg-[#204E38]"
                    onClick={() => handleUpdateStatus('approved', 'approved')}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Approve & Update Budget
                  </Button>
                )}
                {selectedCR.status === 'approved' && (
                  <Button
                    size="sm"
                    className="text-xs h-8 bg-[#2A5C45] hover:bg-[#204E38]"
                    onClick={() => handleUpdateStatus('implemented')}
                  >
                    Mark as Implemented on Site
                  </Button>
                )}
                {selectedCR.status !== 'rejected' && selectedCR.status !== 'implemented' && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-xs h-8 text-rose-700 border-rose-200 hover:bg-rose-50"
                    onClick={() => handleUpdateStatus('rejected', 'rejected')}
                  >
                    Reject Variation
                  </Button>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setDetailModalOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </Dialog>
      )}

      {/* Log Variation Order Modal */}
      <Dialog open={createModalOpen} onOpenChange={setCreateModalOpen}>
        <DialogHeader>
          <DialogTitle>Log Variation / Change Order</DialogTitle>
          <DialogDescription>
            Record out-of-scope customer requests and architectural modifications.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleCreateSubmit} className="space-y-4">
          {formError && (
            <div className="p-2.5 rounded bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-stone-700 block mb-1">
                Change Code *
              </label>
              <Input
                value={newCRForm.request_code}
                onChange={(e) => setNewCRForm({ ...newCRForm, request_code: e.target.value })}
                required
                className="font-mono text-xs"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-stone-700 block mb-1">
                Project *
              </label>
              <Select
                value={newCRForm.project_id}
                onChange={(e) => setNewCRForm({ ...newCRForm, project_id: e.target.value, room_id: '' })}
                className="text-xs"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title} ({p.project_code})
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-stone-700 block mb-1">
              Variation Title *
            </label>
            <Input
              placeholder="e.g. Upgrade to Somfy Motorized Curtains in Master Suite"
              value={newCRForm.title}
              onChange={(e) => setNewCRForm({ ...newCRForm, title: e.target.value })}
              required
              className="text-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-stone-700 block mb-1">
                Specific Room / Space
              </label>
              <Select
                value={newCRForm.room_id}
                onChange={(e) => setNewCRForm({ ...newCRForm, room_id: e.target.value })}
                className="text-xs"
              >
                <option value="">-- All Spaces / General --</option>
                {selectedProjectRooms.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <label className="text-xs font-medium text-stone-700 block mb-1">
                Requested By
              </label>
              <Input
                value={newCRForm.requested_by}
                onChange={(e) => setNewCRForm({ ...newCRForm, requested_by: e.target.value })}
                className="text-xs"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-stone-700 block mb-1">
              Original Contract Specification
            </label>
            <Input
              placeholder="e.g. Standard manual double curtain pelmet track."
              value={newCRForm.original_spec}
              onChange={(e) => setNewCRForm({ ...newCRForm, original_spec: e.target.value })}
              className="text-xs"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-stone-700 block mb-1">
              Requested Modification & Justification *
            </label>
            <Textarea
              placeholder="Detailed description of revised materials, wiring raceways, or structural alterations..."
              value={newCRForm.requested_change}
              onChange={(e) => setNewCRForm({ ...newCRForm, requested_change: e.target.value, description: e.target.value })}
              required
              className="text-xs"
              rows={2}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-stone-700 block mb-1">
                Estimated Cost Impact (₹) *
              </label>
              <Input
                type="number"
                step="500"
                value={newCRForm.cost_impact}
                onChange={(e) => setNewCRForm({ ...newCRForm, cost_impact: Number(e.target.value) })}
                required
                className="text-xs font-semibold"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-stone-700 block mb-1">
                Timeline Shift (Days)
              </label>
              <Input
                type="number"
                value={newCRForm.timeline_impact_days}
                onChange={(e) => setNewCRForm({ ...newCRForm, timeline_impact_days: Number(e.target.value) })}
                className="text-xs"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setCreateModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Save Variation Order
            </Button>
          </DialogFooter>
        </form>
      </Dialog>
    </div>
  );
}
