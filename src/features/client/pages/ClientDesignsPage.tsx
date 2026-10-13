import React, { useState } from 'react';
import {
  Layers,
  Eye,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  Maximize2,
  Clock,
  History,
  Info,
  Check,
  X,
  FileText,
  Filter,
  MessageSquare,
} from 'lucide-react';
import { useDemoStore } from '@/stores/demoStore';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { DesignVersion } from '@/types';

export function ClientDesignsPage() {
  const { designVersions, rooms, projects, currentProjectId, reviewDesignVersion } =
    useDemoStore();
  const project = projects.find((p) => p.id === currentProjectId) || projects[0];

  // Project designs
  const projectDesigns = designVersions.filter((d) => d.project_id === project?.id);

  // Filters
  const [selectedRoomId, setSelectedRoomId] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Preview / Lightbox Modal State
  const [previewDesign, setPreviewDesign] = useState<DesignVersion | null>(null);

  // Request Revision Modal State
  const [revisionDesign, setRevisionDesign] = useState<DesignVersion | null>(null);
  const [revisionComments, setRevisionComments] = useState('');
  const [revisionError, setRevisionError] = useState('');

  // Confirmation Success Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const projectRooms = rooms.filter((r) => r.project_id === project?.id);

  // Filtered designs
  const filteredDesigns = projectDesigns.filter((d) => {
    const matchesRoom = selectedRoomId === 'all' || d.room_id === selectedRoomId;
    const matchesStatus =
      selectedStatus === 'all' ||
      (selectedStatus === 'under_review' && d.status === 'under_review') ||
      (selectedStatus === 'approved' && d.status === 'approved') ||
      (selectedStatus === 'revision_requested' && d.status === 'revision_requested');
    return matchesRoom && matchesStatus;
  });

  // Action handlers
  const handleApprove = (design: DesignVersion) => {
    reviewDesignVersion(design.id, 'approved', 'Approved by homeowner Rahul Sharma');
    showToast(`"${design.title}" has been approved! On-site execution team notified.`);
    if (previewDesign?.id === design.id) {
      setPreviewDesign({ ...design, status: 'approved' });
    }
  };

  const handleOpenRevision = (design: DesignVersion) => {
    setRevisionDesign(design);
    setRevisionComments('');
    setRevisionError('');
  };

  const handleSubmitRevision = (e: React.FormEvent) => {
    e.preventDefault();
    if (!revisionComments.trim()) {
      setRevisionError('Please describe the adjustments or preferences you would like the design team to make.');
      return;
    }

    if (revisionDesign) {
      reviewDesignVersion(revisionDesign.id, 'revision_requested', revisionComments.trim());
      showToast(`Revision request logged for "${revisionDesign.title}". Designer notified.`);
      if (previewDesign?.id === revisionDesign.id) {
        setPreviewDesign({
          ...revisionDesign,
          status: 'revision_requested',
          client_feedback: revisionComments.trim(),
        });
      }
      setRevisionDesign(null);
      setRevisionComments('');
    }
  };

  // Group counts
  const underReviewCount = projectDesigns.filter((d) => d.status === 'under_review').length;
  const approvedCount = projectDesigns.filter((d) => d.status === 'approved').length;
  const revisionCount = projectDesigns.filter((d) => d.status === 'revision_requested').length;

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#2A5C45] text-white text-xs px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 border border-emerald-600 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-200 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header & Subtitle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight flex items-center gap-2">
            <Layers className="w-5 h-5 sm:w-6 sm:h-6 text-[#2A5C45]" />
            Designs & Approvals
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Review 3D photorealistic architectural renders, elevations, and layout plans for each room.
          </p>
        </div>

        {/* Status Quick Pills */}
        <div className="flex items-center gap-2 text-xs">
          <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200/80 font-medium">
            {underReviewCount} Awaiting Review
          </span>
          <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-900 border border-emerald-200/80 font-medium">
            {approvedCount} Approved
          </span>
        </div>
      </div>

      {/* Filter Tabs Toolbar */}
      <div className="bg-white p-3.5 rounded-xl border border-stone-200/90 shadow-2xs space-y-3">
        {/* Room Filter */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 text-xs">
          <span className="text-stone-500 font-medium shrink-0 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Room:
          </span>
          <button
            onClick={() => setSelectedRoomId('all')}
            className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              selectedRoomId === 'all'
                ? 'bg-[#2A5C45] text-white'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            All Rooms ({projectDesigns.length})
          </button>
          {projectRooms.map((room) => {
            const roomDesignCount = projectDesigns.filter((d) => d.room_id === room.id).length;
            if (roomDesignCount === 0) return null;
            return (
              <button
                key={room.id}
                onClick={() => setSelectedRoomId(room.id)}
                className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedRoomId === room.id
                    ? 'bg-[#2A5C45] text-white'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {room.name} ({roomDesignCount})
              </button>
            );
          })}
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar text-xs border-t border-stone-100 pt-2.5">
          <span className="text-stone-500 font-medium shrink-0">Status:</span>
          {[
            { id: 'all', label: 'All Statuses' },
            { id: 'under_review', label: `Awaiting Sign-off (${underReviewCount})` },
            { id: 'approved', label: `Approved (${approvedCount})` },
            { id: 'revision_requested', label: `Revision Requested (${revisionCount})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedStatus(tab.id)}
              className={`px-2.5 py-1 rounded text-xs font-medium transition-colors ${
                selectedStatus === tab.id
                  ? 'bg-stone-800 text-white'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Designs Grid */}
      {filteredDesigns.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredDesigns.map((design) => {
            const room = rooms.find((r) => r.id === design.room_id);
            const isPending = design.status === 'under_review';
            const isApproved = design.status === 'approved';
            const isRevision = design.status === 'revision_requested';

            return (
              <Card
                key={design.id}
                className="overflow-hidden border-stone-200/90 bg-white shadow-2xs hover:shadow-sm transition-shadow flex flex-col"
              >
                {/* Visual Thumbnail with Action Overlay */}
                <div className="relative aspect-video w-full bg-stone-100 overflow-hidden group">
                  {design.preview_url ? (
                    <img
                      src={design.preview_url}
                      alt={design.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 cursor-pointer"
                      onClick={() => setPreviewDesign(design)}
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-stone-400 text-xs">
                      <Layers className="w-6 h-6 mb-1 text-stone-300" />
                      <span>Draft Render Pending</span>
                    </div>
                  )}

                  {/* Render Type Badge */}
                  <div className="absolute top-2.5 left-2.5 bg-black/60 backdrop-blur-xs text-white text-[11px] font-mono px-2 py-0.5 rounded">
                    {design.render_type === '3d_render'
                      ? '3D Visual'
                      : design.render_type === '2d_cad'
                      ? '2D CAD'
                      : 'Moodboard'}
                  </div>

                  {/* Version Badge */}
                  <div className="absolute top-2.5 right-2.5 bg-[#2A5C45] text-white text-[11px] font-mono font-semibold px-2 py-0.5 rounded">
                    {design.version_number}
                  </div>

                  {/* Quick Expand Button */}
                  <button
                    onClick={() => setPreviewDesign(design)}
                    className="absolute bottom-2.5 right-2.5 p-1.5 rounded bg-black/60 hover:bg-black/80 text-white transition-opacity"
                    title="Expand View"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Card Content */}
                <CardContent className="p-4 flex-1 flex flex-col justify-between space-y-3.5">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-medium text-stone-500 uppercase tracking-wider">
                        {room?.name || 'Interior Area'}
                      </span>
                      <StatusBadge status={design.status} />
                    </div>

                    <h3 className="font-semibold text-stone-900 text-sm leading-snug line-clamp-1">
                      {design.title}
                    </h3>

                    {design.description && (
                      <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                        {design.description}
                      </p>
                    )}
                  </div>

                  {/* Designer Notes Callout */}
                  {design.designer_notes && (
                    <div className="p-2.5 rounded bg-stone-50 border border-stone-200/70 text-[11px] text-stone-600">
                      <span className="font-semibold text-stone-700 block mb-0.5">
                        Designer's Note:
                      </span>
                      {design.designer_notes}
                    </div>
                  )}

                  {/* Client Feedback Display (if revision requested) */}
                  {design.client_feedback && (
                    <div className="p-2.5 rounded bg-amber-50/70 border border-amber-200/70 text-[11px] text-amber-900">
                      <span className="font-semibold block mb-0.5">Your Feedback:</span>
                      "{design.client_feedback}"
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="pt-2 border-t border-stone-100 flex items-center gap-2">
                    {isPending ? (
                      <>
                        <Button
                          size="sm"
                          onClick={() => handleApprove(design)}
                          className="flex-1 text-xs h-8 bg-[#2A5C45] hover:bg-[#204E38] text-white"
                        >
                          <Check className="w-3.5 h-3.5 mr-1" /> Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleOpenRevision(design)}
                          className="text-xs h-8 border-stone-300 text-stone-700 hover:bg-stone-50"
                        >
                          <RefreshCw className="w-3.5 h-3.5 mr-1 text-amber-700" /> Request Changes
                        </Button>
                      </>
                    ) : isApproved ? (
                      <div className="w-full flex items-center justify-between text-xs text-emerald-800 bg-emerald-50 px-2.5 py-1.5 rounded">
                        <span className="flex items-center gap-1.5 font-medium">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          Approved for On-Site Execution
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setPreviewDesign(design)}
                          className="text-[11px] h-6 px-1.5 text-emerald-900 hover:text-emerald-950"
                        >
                          View
                        </Button>
                      </div>
                    ) : (
                      <div className="w-full flex items-center justify-between text-xs text-amber-800 bg-amber-50 px-2.5 py-1.5 rounded">
                        <span className="flex items-center gap-1.5 font-medium">
                          <Clock className="w-4 h-4 text-amber-600" />
                          Revision in Progress by Team
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setPreviewDesign(design)}
                          className="text-[11px] h-6 px-1.5 text-amber-900"
                        >
                          View
                        </Button>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="p-12 text-center bg-white rounded-xl border border-stone-200">
          <Layers className="w-10 h-10 text-stone-300 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-stone-900">No designs match this filter</h3>
          <p className="text-xs text-stone-500 mt-1">
            Try switching rooms or resetting the status filter above.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedRoomId('all');
              setSelectedStatus('all');
            }}
            className="text-xs mt-3 h-8"
          >
            Show All Designs
          </Button>
        </div>
      )}

      {/* Modal 1: Lightbox & Full Render Viewer */}
      <Dialog open={!!previewDesign} onOpenChange={(open) => !open && setPreviewDesign(null)}>
        <DialogContent className="max-w-4xl p-5 overflow-hidden">
          {previewDesign && (
            <div className="space-y-4">
              <DialogHeader className="space-y-1">
                <div className="flex items-center justify-between gap-3">
                  <DialogTitle className="text-base sm:text-lg font-bold text-stone-900">
                    {previewDesign.title}
                  </DialogTitle>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs bg-[#2A5C45] text-white px-2 py-0.5 rounded font-semibold">
                      {previewDesign.version_number}
                    </span>
                    <StatusBadge status={previewDesign.status} />
                  </div>
                </div>
                <DialogDescription className="text-xs text-stone-500">
                  {rooms.find((r) => r.id === previewDesign.room_id)?.name} • Submitted{' '}
                  {new Date(previewDesign.submitted_at).toLocaleDateString('en-IN', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </DialogDescription>
              </DialogHeader>

              {/* Full Image Preview */}
              <div className="relative aspect-video w-full rounded-lg overflow-hidden border border-stone-200 bg-stone-900">
                {previewDesign.preview_url ? (
                  <img
                    src={previewDesign.preview_url}
                    alt={previewDesign.title}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-stone-400 text-xs">
                    No image preview available
                  </div>
                )}
              </div>

              {/* Details & Designer Rationale */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1">
                <div className="space-y-2">
                  <span className="font-semibold text-stone-800 block">Design Overview:</span>
                  <p className="text-stone-600 leading-relaxed">
                    {previewDesign.description || 'Architectural design specification.'}
                  </p>
                </div>
                <div className="space-y-2 bg-stone-50 p-3 rounded-lg border border-stone-200/80">
                  <span className="font-semibold text-stone-800 block">
                    Designer Architectural Notes:
                  </span>
                  <p className="text-stone-600 leading-relaxed">
                    {previewDesign.designer_notes ||
                      'Standard design execution specs aligned with project floor plan.'}
                  </p>
                </div>
              </div>

              {/* Modal Decision Buttons if Under Review */}
              {previewDesign.status === 'under_review' && (
                <div className="pt-3 border-t border-stone-200 flex items-center justify-end gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const d = previewDesign;
                      setPreviewDesign(null);
                      handleOpenRevision(d);
                    }}
                    className="text-xs h-8 text-amber-800 border-amber-300 hover:bg-amber-50"
                  >
                    <RefreshCw className="w-3.5 h-3.5 mr-1" /> Request Revision
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => handleApprove(previewDesign)}
                    className="text-xs h-8 bg-[#2A5C45] hover:bg-[#204E38] text-white"
                  >
                    <Check className="w-3.5 h-3.5 mr-1" /> Approve Design Version
                  </Button>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal 2: Request Revision Dialog */}
      <Dialog open={!!revisionDesign} onOpenChange={(open) => !open && setRevisionDesign(null)}>
        <DialogContent className="max-w-md p-5">
          {revisionDesign && (
            <form onSubmit={handleSubmitRevision} className="space-y-4">
              <DialogHeader className="space-y-1">
                <DialogTitle className="text-base font-semibold text-stone-900">
                  Request Revision for {revisionDesign.title}
                </DialogTitle>
                <DialogDescription className="text-xs text-stone-500">
                  Your feedback goes directly to Lead Designer Arjun Mehta to prepare version{' '}
                  <span className="font-semibold text-stone-700">v2.0</span>.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-2 text-xs">
                <label className="font-medium text-stone-700 block">
                  What would you like adjusted? <span className="text-rose-500">*</span>
                </label>
                <textarea
                  value={revisionComments}
                  onChange={(e) => {
                    setRevisionComments(e.target.value);
                    setRevisionError('');
                  }}
                  rows={4}
                  placeholder="e.g. Please change the upper wardrobe shutters from tinted glass to warm beige matte laminate, and add warm sensor LED strips..."
                  className="w-full text-xs p-3 rounded-md border border-stone-300 focus:outline-none focus:ring-1 focus:ring-[#2A5C45] focus:border-[#2A5C45]"
                />
                {revisionError && (
                  <p className="text-rose-600 text-[11px] font-medium">{revisionError}</p>
                )}
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setRevisionDesign(null)}
                  className="text-xs h-8"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="text-xs h-8 bg-[#2A5C45] hover:bg-[#204E38] text-white"
                >
                  Submit Revision Request
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
