import React, { useState } from 'react';
import {
  Layers,
  Plus,
  Eye,
  CheckCircle2,
  Clock,
  Filter,
  Search,
  Sparkles,
  Send,
  Calendar,
  FileCheck,
  FileText,
  Maximize2,
  AlertCircle,
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
import { StatusBadge } from '@/components/shared/StatusBadge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { DesignVersion } from '@/types';

// Preset architectural images for easy demo selection
const ARCHITECTURAL_IMAGE_PRESETS = [
  {
    label: 'Living & Dining 3D Cove',
    url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&auto=format&fit=crop&q=80',
  },
  {
    label: 'Modular Sage Kitchen',
    url: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&auto=format&fit=crop&q=80',
  },
  {
    label: 'Master Suite Tinted Wardrobe',
    url: 'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=800&auto=format&fit=crop&q=80',
  },
  {
    label: 'Kids Dual Study CAD/3D',
    url: 'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?w=800&auto=format&fit=crop&q=80',
  },
  {
    label: 'Guest Daybed & Work Nook',
    url: 'https://images.unsplash.com/photo-1540518614846-7ede433c4ef4?w=800&auto=format&fit=crop&q=80',
  },
  {
    label: 'Double-Height Foyer Marble',
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&auto=format&fit=crop&q=80',
  },
];

export function TeamDesignsPage() {
  const {
    projects,
    currentProjectId,
    setCurrentProject,
    rooms,
    designVersions,
    approvals,
    addDesignVersion,
    updateDesignVersion,
    submitDesignForApproval,
  } = useDemoStore();

  const activeProject = projects.find((p) => p.id === currentProjectId) || projects[0];

  // Filters
  const [selectedRoomFilter, setSelectedRoomFilter] = useState('all');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState('all');
  const [selectedTypeFilter, setSelectedTypeFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isSubmitApprovalOpen, setIsSubmitApprovalOpen] = useState(false);
  const [activeDesign, setActiveDesign] = useState<DesignVersion | null>(null);

  // Form State for New Design Version
  const [formData, setFormData] = useState({
    room_id: '',
    version_number: 'v1.1',
    title: '',
    description: '',
    preview_url: ARCHITECTURAL_IMAGE_PRESETS[0].url,
    render_type: '3d_render' as DesignVersion['render_type'],
    designer_notes: '',
  });

  // Approval Submission State
  const [approvalSubmissionNotes, setApprovalSubmissionNotes] = useState('');
  const [successToast, setSuccessToast] = useState<string | null>(null);

  // Filtered designs
  const projectRooms = rooms.filter((r) => r.project_id === activeProject?.id);
  const projectDesigns = designVersions.filter((d) => d.project_id === activeProject?.id);

  const filteredDesigns = projectDesigns.filter((d) => {
    const matchesRoom = selectedRoomFilter === 'all' || d.room_id === selectedRoomFilter;
    const matchesStatus = selectedStatusFilter === 'all' || d.status === selectedStatusFilter;
    const matchesType = selectedTypeFilter === 'all' || d.render_type === selectedTypeFilter;
    const matchesSearch =
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.version_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (d.designer_notes || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRoom && matchesStatus && matchesType && matchesSearch;
  });

  const handleOpenUpload = (preselectedRoomId?: string) => {
    const defaultRoomId = preselectedRoomId || projectRooms[0]?.id || '';
    setFormData({
      room_id: defaultRoomId,
      version_number: 'v1.1',
      title: '',
      description: '',
      preview_url: ARCHITECTURAL_IMAGE_PRESETS[0].url,
      render_type: '3d_render',
      designer_notes: '',
    });
    setIsUploadOpen(true);
  };

  const handleCreateDesign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.room_id || !activeProject) return;

    addDesignVersion({
      project_id: activeProject.id,
      room_id: formData.room_id,
      version_number: formData.version_number,
      title: formData.title,
      description: formData.description,
      preview_url: formData.preview_url,
      render_type: formData.render_type,
      status: 'draft',
      designer_notes: formData.designer_notes,
    });

    setIsUploadOpen(false);
    setSuccessToast(`Design package "${formData.title}" (${formData.version_number}) created.`);
    setTimeout(() => setSuccessToast(null), 4000);
  };

  const handleOpenSubmitApproval = (design: DesignVersion) => {
    setActiveDesign(design);
    setApprovalSubmissionNotes(design.designer_notes || '');
    setIsSubmitApprovalOpen(true);
  };

  const handleConfirmSubmitApproval = () => {
    if (!activeDesign) return;

    const approval = submitDesignForApproval(
      activeDesign.id,
      `Design Approval: ${activeDesign.title} (${activeDesign.version_number})`,
      approvalSubmissionNotes
    );

    setIsSubmitApprovalOpen(false);
    setActiveDesign(null);
    setSuccessToast(`Submitted for client sign-off. Pending Approval record #${approval.id.slice(-6)} created!`);
    setTimeout(() => setSuccessToast(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {successToast && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-4 py-2.5 rounded-md flex items-center justify-between shadow-sm animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>{successToast}</span>
          </div>
          <button
            onClick={() => setSuccessToast(null)}
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
              Design Studio & Drawing Revision Control
            </h1>
            <Badge variant="outline" className="text-xs bg-stone-100 text-stone-700">
              {filteredDesigns.length} Packages
            </Badge>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Manage photorealistic 3D renders, 2D CAD elevations, electrical layout revisions, and client sign-offs.
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

          <Button
            size="sm"
            className="bg-[#2A5C45] hover:bg-[#234c39] text-white text-xs"
            onClick={() => handleOpenUpload()}
          >
            <Plus className="h-3.5 w-3.5 mr-1" />
            New Design Version
          </Button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-lg border border-stone-200">
        <div className="flex items-center gap-2 w-full sm:w-72">
          <Search className="h-4 w-4 text-stone-400" />
          <Input
            placeholder="Search designs or notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-8 text-xs border-stone-200"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
          {/* Room Filter */}
          <select
            value={selectedRoomFilter}
            onChange={(e) => setSelectedRoomFilter(e.target.value)}
            className="h-8 text-xs border border-stone-200 rounded-md px-2 bg-white text-stone-700"
          >
            <option value="all">All Rooms</option>
            {projectRooms.map((r) => (
              <option key={r.id} value={r.id}>
                {r.name}
              </option>
            ))}
          </select>

          {/* Type Filter */}
          <select
            value={selectedTypeFilter}
            onChange={(e) => setSelectedTypeFilter(e.target.value)}
            className="h-8 text-xs border border-stone-200 rounded-md px-2 bg-white text-stone-700"
          >
            <option value="all">All Types</option>
            <option value="3d_render">3D Render</option>
            <option value="2d_cad">2D CAD</option>
            <option value="moodboard">Moodboard</option>
            <option value="electrical_plan">Electrical Plan</option>
            <option value="boq_drawing">BOQ Drawing</option>
          </select>

          {/* Status Filter */}
          <select
            value={selectedStatusFilter}
            onChange={(e) => setSelectedStatusFilter(e.target.value)}
            className="h-8 text-xs border border-stone-200 rounded-md px-2 bg-white text-stone-700"
          >
            <option value="all">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="under_review">Under Review</option>
            <option value="approved">Approved</option>
            <option value="revision_requested">Revision Requested</option>
          </select>
        </div>
      </div>

      {/* Design Deliverables Visual Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredDesigns.length === 0 ? (
          <div className="col-span-full py-12 text-center bg-white rounded-lg border border-stone-200 text-stone-500 text-xs">
            No design deliverables match the selected room or status filters.
          </div>
        ) : (
          filteredDesigns.map((design) => {
            const room = rooms.find((r) => r.id === design.room_id);
            const linkedApproval = approvals.find((a) => a.design_version_id === design.id);
            const isApproved = design.status === 'approved';
            const isUnderReview = design.status === 'under_review';
            const isRevisionRequested = design.status === 'revision_requested';

            return (
              <Card
                key={design.id}
                className="border-stone-200 shadow-none hover:border-stone-300 transition-all flex flex-col justify-between overflow-hidden group"
              >
                <div>
                  {/* Image Thumbnail with Overlay Badges */}
                  <div className="h-44 bg-stone-100 relative overflow-hidden cursor-pointer" onClick={() => { setActiveDesign(design); setIsPreviewOpen(true); }}>
                    {design.preview_url ? (
                      <img
                        src={design.preview_url}
                        alt={design.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full text-stone-400">
                        <Layers className="h-10 w-10 stroke-1" />
                      </div>
                    )}

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                    {/* Top Badges */}
                    <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between">
                      <Badge className="text-[10px] font-mono bg-black/70 text-white border-none px-2 py-0.5">
                        {design.version_number}
                      </Badge>
                      <StatusBadge status={design.status} />
                    </div>

                    {/* Bottom Metadata inside thumbnail */}
                    <div className="absolute bottom-2.5 left-2.5 right-2.5 text-white">
                      <span className="text-[11px] font-medium tracking-wide uppercase font-mono opacity-80 block">
                        {room?.name}
                      </span>
                      <span className="text-xs font-semibold line-clamp-1">
                        {design.title}
                      </span>
                    </div>

                    {/* Quick Preview Hover Button */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
                      <span className="bg-white/90 text-stone-900 text-xs px-2.5 py-1 rounded shadow-sm flex items-center gap-1 font-medium">
                        <Maximize2 className="h-3 w-3" /> Inspect High-Res
                      </span>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-4 space-y-3">
                    <div className="flex items-center justify-between text-[11px] text-stone-500">
                      <span className="capitalize font-mono">
                        Type: {design.render_type.replace('_', ' ')}
                      </span>
                      <span>Submitted: {formatDate(design.submitted_at)}</span>
                    </div>

                    <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                      {design.description}
                    </p>

                    {/* Designer Notes */}
                    {design.designer_notes && (
                      <div className="bg-stone-50 p-2.5 rounded border border-stone-100 text-xs space-y-0.5">
                        <span className="text-[10px] font-mono uppercase font-semibold text-stone-500 block">
                          Revision Notes:
                        </span>
                        <p className="text-[11px] text-stone-700 italic">
                          "{design.designer_notes}"
                        </p>
                      </div>
                    )}

                    {/* Client Feedback banner if revision requested */}
                    {isRevisionRequested && linkedApproval?.client_comments && (
                      <div className="bg-purple-50 p-2.5 rounded border border-purple-100 text-xs space-y-0.5 text-purple-900">
                        <span className="text-[10px] font-mono uppercase font-semibold text-purple-700 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" /> Client Feedback:
                        </span>
                        <p className="text-[11px] text-purple-800 font-medium">
                          "{linkedApproval.client_comments}"
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Actions Footer */}
                <div className="p-4 pt-0 border-t border-stone-100 flex items-center justify-between gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 text-xs border-stone-200 text-stone-700 hover:bg-stone-50"
                    onClick={() => { setActiveDesign(design); setIsPreviewOpen(true); }}
                  >
                    <Eye className="h-3.5 w-3.5 mr-1" />
                    Details
                  </Button>

                  {isApproved ? (
                    <Badge className="bg-emerald-50 text-emerald-800 border-emerald-200 text-xs flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" /> Approved by Client
                    </Badge>
                  ) : isUnderReview ? (
                    <Badge className="bg-amber-50 text-amber-800 border-amber-200 text-xs flex items-center gap-1">
                      <Clock className="h-3 w-3" /> Awaiting Sign-off
                    </Badge>
                  ) : (
                    <Button
                      size="sm"
                      className="h-8 text-xs bg-[#2A5C45] hover:bg-[#234c39] text-white"
                      onClick={() => handleOpenSubmitApproval(design)}
                    >
                      <Send className="h-3 w-3 mr-1" />
                      Submit for Approval
                    </Button>
                  )}
                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* ========================================================================= */}
      {/* DIALOG: UPLOAD NEW VERSION */}
      {/* ========================================================================= */}
      <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
        <DialogContent className="max-w-lg">
          <form onSubmit={handleCreateDesign}>
            <DialogHeader>
              <DialogTitle className="text-base font-bold text-stone-900">
                Upload New Design Revision
              </DialogTitle>
              <DialogDescription className="text-xs text-stone-500">
                Register a new 3D render or CAD package version. Saved as draft until submitted for client sign-off.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs font-semibold text-stone-700">Room *</Label>
                  <select
                    required
                    value={formData.room_id}
                    onChange={(e) => setFormData({ ...formData, room_id: e.target.value })}
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
                  <Label className="text-xs font-semibold text-stone-700">Version Tag *</Label>
                  <Input
                    required
                    placeholder="e.g. v1.2 or v2.0"
                    value={formData.version_number}
                    onChange={(e) => setFormData({ ...formData, version_number: e.target.value })}
                    className="h-8 text-xs mt-1 font-mono"
                  />
                </div>
              </div>

              <div>
                <Label className="text-xs font-semibold text-stone-700">Package Title *</Label>
                <Input
                  required
                  placeholder="e.g. Master Bedroom Glass Wardrobe & Headboard Detail"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="h-8 text-xs mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs font-semibold text-stone-700">Render / File Type</Label>
                  <select
                    value={formData.render_type}
                    onChange={(e) => setFormData({ ...formData, render_type: e.target.value as DesignVersion['render_type'] })}
                    className="h-8 text-xs border border-stone-200 rounded-md px-2 bg-white text-stone-800 w-full mt-1"
                  >
                    <option value="3d_render">3D Photorealistic Render</option>
                    <option value="2d_cad">2D CAD Elevation / Layout</option>
                    <option value="moodboard">Moodboard & Material Palette</option>
                    <option value="electrical_plan">Electrical & Light Conduit Plan</option>
                    <option value="boq_drawing">Millwork BOQ Drawing</option>
                  </select>
                </div>

                <div>
                  <Label className="text-xs font-semibold text-stone-700">Preset High-Res Image</Label>
                  <select
                    value={formData.preview_url}
                    onChange={(e) => setFormData({ ...formData, preview_url: e.target.value })}
                    className="h-8 text-xs border border-stone-200 rounded-md px-2 bg-white text-stone-800 w-full mt-1"
                  >
                    {ARCHITECTURAL_IMAGE_PRESETS.map((preset) => (
                      <option key={preset.url} value={preset.url}>
                        {preset.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <Label className="text-xs font-semibold text-stone-700">Scope & Design Description</Label>
                <Textarea
                  placeholder="Describe lighting elements, laminate/veneer codes, clearance specifications..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="text-xs mt-1 resize-none h-16"
                />
              </div>

              <div>
                <Label className="text-xs font-semibold text-stone-700">Designer Revision Notes (Internal)</Label>
                <Textarea
                  placeholder="What changed compared to the previous version..."
                  value={formData.designer_notes}
                  onChange={(e) => setFormData({ ...formData, designer_notes: e.target.value })}
                  className="text-xs mt-1 resize-none h-16"
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsUploadOpen(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                className="bg-[#2A5C45] hover:bg-[#234c39] text-white text-xs"
              >
                Save as Draft Version
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ========================================================================= */}
      {/* DIALOG: SUBMIT FOR CLIENT APPROVAL */}
      {/* ========================================================================= */}
      <Dialog open={isSubmitApprovalOpen} onOpenChange={setIsSubmitApprovalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-stone-900">
              Submit Design for Client Sign-off
            </DialogTitle>
            <DialogDescription className="text-xs text-stone-500">
              This will update the design package to <strong>Under Review</strong> and create a formal approval ticket in the Client Portal.
            </DialogDescription>
          </DialogHeader>

          {activeDesign && (
            <div className="space-y-3 py-3 text-xs">
              <div className="p-3 bg-stone-50 rounded border border-stone-200 space-y-1">
                <div className="font-semibold text-stone-900">{activeDesign.title}</div>
                <div className="text-[11px] text-stone-500 font-mono">
                  Version: {activeDesign.version_number} • Room: {rooms.find(r => r.id === activeDesign.room_id)?.name}
                </div>
              </div>

              <div>
                <Label className="text-xs font-semibold text-stone-700">
                  Notes / Presentation Summary for Client
                </Label>
                <Textarea
                  placeholder="Add any specific questions or highlights for the homeowner to check..."
                  value={approvalSubmissionNotes}
                  onChange={(e) => setApprovalSubmissionNotes(e.target.value)}
                  className="text-xs mt-1 resize-none h-24"
                />
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsSubmitApprovalOpen(false)}
              className="text-xs"
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              className="bg-[#2A5C45] hover:bg-[#234c39] text-white text-xs"
              onClick={handleConfirmSubmitApproval}
            >
              <Send className="h-3 w-3 mr-1" />
              Confirm & Request Approval
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ========================================================================= */}
      {/* DIALOG: HIGH-RES INSPECT & DETAILS */}
      {/* ========================================================================= */}
      <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
        <DialogContent className="max-w-3xl">
          {activeDesign && (
            <div>
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <DialogTitle className="text-base font-bold text-stone-900 flex items-center gap-2">
                    {activeDesign.title}
                    <Badge className="font-mono text-[10px] bg-stone-100 text-stone-800 border-stone-300">
                      {activeDesign.version_number}
                    </Badge>
                  </DialogTitle>
                  <StatusBadge status={activeDesign.status} />
                </div>
                <DialogDescription className="text-xs text-stone-500">
                  Room: {rooms.find((r) => r.id === activeDesign.room_id)?.name} • Submitted: {formatDate(activeDesign.submitted_at)}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4 py-3">
                {/* Full-width image */}
                {activeDesign.preview_url && (
                  <div className="rounded-lg overflow-hidden border border-stone-200 max-h-96">
                    <img
                      src={activeDesign.preview_url}
                      alt={activeDesign.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1">
                    <span className="font-semibold text-stone-700 block">Design Description</span>
                    <p className="text-stone-600 leading-relaxed">{activeDesign.description}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="font-semibold text-stone-700 block">Revision Notes</span>
                    <p className="text-stone-600 italic">
                      {activeDesign.designer_notes || 'No revision notes entered for this release.'}
                    </p>
                  </div>
                </div>
              </div>

              <DialogFooter className="flex items-center justify-between">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsPreviewOpen(false)}
                  className="text-xs"
                >
                  Close
                </Button>

                {activeDesign.status === 'draft' && (
                  <Button
                    size="sm"
                    className="bg-[#2A5C45] hover:bg-[#234c39] text-white text-xs"
                    onClick={() => {
                      setIsPreviewOpen(false);
                      handleOpenSubmitApproval(activeDesign);
                    }}
                  >
                    Submit for Client Approval
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
