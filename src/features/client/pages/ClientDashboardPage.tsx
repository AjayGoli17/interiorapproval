import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Home,
  Layers,
  Palette,
  HardHat,
  CreditCard,
  Calendar,
  Clock,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Phone,
  MessageSquare,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  ChevronRight,
  Building2,
  UserCheck,
} from 'lucide-react';
import { useDemoStore } from '@/stores/demoStore';
import { formatINR } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { ClientContactModal } from '@/features/client/components/ClientContactModal';

export function ClientDashboardPage() {
  const navigate = useNavigate();
  const {
    projects,
    currentProjectId,
    designVersions,
    materials,
    changeRequests,
    siteUpdates,
    paymentMilestones,
    teamMembers,
    clients,
  } = useDemoStore();

  const [contactOpen, setContactOpen] = useState(false);
  const [contactSubject, setContactSubject] = useState<string | undefined>(undefined);

  const project = projects.find((p) => p.id === currentProjectId) || projects[0];
  const client = clients.find((c) => c.project_id === project?.id) || clients[0];

  const leadDesigner = teamMembers.find((m) => m.id === project?.lead_designer_id) || {
    full_name: 'Arjun Mehta',
    phone: '+91 98490 23456',
    email: 'arjun.mehta@studioflow.design',
    specialization: 'Senior Interior Designer & Millwork Lead',
  };

  const siteManager = teamMembers.find((m) => m.id === project?.site_manager_id) || {
    full_name: 'Suresh Rao',
    phone: '+91 98490 44556',
    email: 'suresh.rao@studioflow.design',
    specialization: 'Senior Site Execution Engineer',
  };

  // Pending homeowner action items
  const pendingDesigns = designVersions.filter(
    (d) => d.project_id === project?.id && d.status === 'under_review'
  );

  const pendingMaterials = materials.filter(
    (m) =>
      m.project_id === project?.id &&
      (m.selection_status === 'proposed' || m.approval_status === 'spec_draft')
  );

  const pendingChangeRequests = changeRequests.filter(
    (cr) =>
      cr.project_id === project?.id &&
      (cr.status === 'quoted' || cr.status === 'under_review' || cr.client_decision === 'pending')
  );

  const totalPendingActions =
    pendingDesigns.length + pendingMaterials.length + pendingChangeRequests.length;

  // Latest client visible update
  const clientVisibleUpdates = siteUpdates
    .filter((u) => u.project_id === project?.id && u.is_client_visible !== false)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const latestUpdate = clientVisibleUpdates[0];

  // Upcoming milestone
  const upcomingMilestone = paymentMilestones
    .filter((m) => m.project_id === project?.id && m.status !== 'payment_received')
    .sort((a, b) => (a.due_date || '').localeCompare(b.due_date || ''))[0];

  // Financial summary quick numbers
  const totalPaid = paymentMilestones
    .filter((m) => m.project_id === project?.id && m.status === 'payment_received')
    .reduce((acc, m) => acc + m.amount, 0);

  const approvedCRTotal = changeRequests
    .filter((cr) => cr.project_id === project?.id && cr.status === 'approved')
    .reduce((acc, cr) => acc + cr.cost_impact, 0);

  const revisedBudget = project.total_budget;

  return (
    <div className="space-y-6">
      {/* 1. Welcome Hero Banner */}
      <div className="rounded-xl border border-stone-200/90 bg-white p-5 sm:p-7 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/60 text-[#2A5C45] text-xs font-medium">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Execution Phase In Progress</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-900">
              Welcome back, {client?.full_name || 'Rahul'}
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Your home transformation at <span className="font-semibold text-stone-800">{project.location}</span>{' '}
              is progressing steadily. Here is your executive summary for this week.
            </p>
          </div>

          {/* Quick Metrics Header Card */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-stone-50/80 p-3.5 rounded-lg border border-stone-200/80 shrink-0">
            <div>
              <span className="text-[11px] font-medium text-stone-500 block">Overall Progress</span>
              <span className="text-lg font-bold text-stone-900">{project.progress_percentage}%</span>
            </div>
            <div>
              <span className="text-[11px] font-medium text-stone-500 block">Agreed Budget</span>
              <span className="text-lg font-bold text-[#2A5C45]">{formatINR(revisedBudget)}</span>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <span className="text-[11px] font-medium text-stone-500 block">Target Handover</span>
              <span className="text-sm sm:text-base font-semibold text-stone-900">
                {project.target_handover_date || '30 Nov 2026'}
              </span>
            </div>
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div className="mt-6 pt-5 border-t border-stone-100">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-medium text-stone-700 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#2A5C45]" />
              Phase 3 of 5: Modular Woodwork Carcass & Surface Finishing
            </span>
            <span className="font-semibold text-stone-900">{project.progress_percentage}% Completed</span>
          </div>
          <div className="w-full bg-stone-100 rounded-full h-2.5 overflow-hidden">
            <div
              className="bg-[#2A5C45] h-full rounded-full transition-all duration-700"
              style={{ width: `${project.progress_percentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* 2. Needs Your Attention (Action Queue) */}
      {totalPendingActions > 0 ? (
        <Card className="border-amber-200/90 bg-amber-50/40 shadow-xs">
          <CardHeader className="p-4 sm:p-5 pb-3 flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-amber-100 text-amber-900 flex items-center justify-center shrink-0">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <CardTitle className="text-sm font-semibold text-stone-900">
                  Awaiting Your Input ({totalPendingActions} {totalPendingActions === 1 ? 'item' : 'items'})
                </CardTitle>
                <p className="text-xs text-stone-600">
                  Please review these selections so on-site work stays on schedule without delays.
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-4 sm:p-5 pt-0 space-y-2.5">
            {/* Pending Designs */}
            {pendingDesigns.map((design) => (
              <div
                key={design.id}
                className="p-3 bg-white rounded-lg border border-amber-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-2xs"
              >
                <div className="flex items-start gap-2.5">
                  <Layers className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-stone-900 block">
                      3D Design Review: {design.title}
                    </span>
                    <span className="text-stone-500 text-[11px]">
                      Version {design.version_number} • Ready for your sign-off or change request
                    </span>
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() => navigate('/client/designs')}
                  className="h-7 text-xs bg-[#2A5C45] hover:bg-[#204E38] text-white shrink-0 self-start sm:self-center"
                >
                  Review 3D Design <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              </div>
            ))}

            {/* Pending Materials */}
            {pendingMaterials.slice(0, 2).map((material) => (
              <div
                key={material.id}
                className="p-3 bg-white rounded-lg border border-amber-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-2xs"
              >
                <div className="flex items-start gap-2.5">
                  <Palette className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-stone-900 block">
                      Material Specification: {material.name}
                    </span>
                    <span className="text-stone-500 text-[11px]">
                      Brand: {material.brand_spec || 'Standard'} • Rate: {formatINR(material.estimated_rate)}/{material.unit}
                    </span>
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() => navigate('/client/materials')}
                  className="h-7 text-xs bg-[#2A5C45] hover:bg-[#204E38] text-white shrink-0 self-start sm:self-center"
                >
                  Select Finish <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              </div>
            ))}

            {/* Pending Change Requests */}
            {pendingChangeRequests.map((cr) => (
              <div
                key={cr.id}
                className="p-3 bg-white rounded-lg border border-amber-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs shadow-2xs"
              >
                <div className="flex items-start gap-2.5">
                  <CreditCard className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-stone-900 block">
                      Variation Order Quote: {cr.title}
                    </span>
                    <span className="text-stone-500 text-[11px]">
                      Cost Impact: +{formatINR(cr.cost_impact)} • Code: {cr.request_code}
                    </span>
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() => navigate('/client/payments')}
                  className="h-7 text-xs bg-[#2A5C45] hover:bg-[#204E38] text-white shrink-0 self-start sm:self-center"
                >
                  Review Quote <ArrowRight className="w-3 h-3 ml-1" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : (
        <div className="p-4 rounded-xl border border-emerald-200/80 bg-emerald-50/50 flex items-center justify-between text-xs text-emerald-900">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span className="font-medium">
              You are all caught up! No designs or material approvals are pending your review.
            </span>
          </div>
          <span className="text-[11px] text-emerald-700 font-mono hidden sm:inline">All clear</span>
        </div>
      )}

      {/* 3. Two-Column Live Activity & Milestones */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Latest Site Progress Highlight */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-stone-200 bg-white shadow-xs">
            <CardHeader className="p-4 sm:p-5 pb-3 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-semibold text-stone-900">
                  Latest Site Update
                </CardTitle>
                <span className="text-xs text-stone-500">
                  Verified field report from Site Supervisor {siteManager.full_name}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/client/progress')}
                className="text-xs text-[#2A5C45] hover:text-[#204E38] h-8 font-medium"
              >
                View Full Timeline <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </Button>
            </CardHeader>
            <CardContent className="p-4 sm:p-5 pt-0">
              {latestUpdate ? (
                <div className="space-y-3.5">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-100 pb-2.5">
                    <span className="font-medium text-stone-900 text-xs sm:text-sm">
                      {latestUpdate.title}
                    </span>
                    <span className="text-[11px] text-stone-500 flex items-center gap-1 font-mono">
                      <Calendar className="w-3.5 h-3.5" />
                      {latestUpdate.date}
                    </span>
                  </div>

                  <p className="text-xs text-stone-600 leading-relaxed">
                    {latestUpdate.description}
                  </p>

                  {latestUpdate.work_completed_summary && (
                    <div className="p-2.5 rounded-md bg-stone-50 border border-stone-200/70 text-xs">
                      <span className="font-medium text-stone-800 block text-[11px] mb-0.5">
                        Work Completed:
                      </span>
                      <span className="text-stone-600">{latestUpdate.work_completed_summary}</span>
                    </div>
                  )}

                  {latestUpdate.photo_urls && latestUpdate.photo_urls.length > 0 && (
                    <div className="grid grid-cols-2 gap-2.5 pt-1">
                      {latestUpdate.photo_urls.map((url, idx) => (
                        <div
                          key={idx}
                          onClick={() => navigate('/client/progress')}
                          className="relative aspect-video rounded-md overflow-hidden border border-stone-200 bg-stone-100 cursor-pointer group"
                        >
                          <img
                            src={url}
                            alt="Site progress update"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-stone-900/10 group-hover:bg-stone-900/20 transition-colors" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-xs text-stone-500 py-4 text-center">
                  No site updates posted yet.
                </p>
              )}
            </CardContent>
          </Card>

          {/* 4 Quick Jump Portal Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button
              onClick={() => navigate('/client/designs')}
              className="p-3.5 rounded-lg border border-stone-200 bg-white hover:border-[#2A5C45] hover:shadow-xs transition-all text-left group"
            >
              <div className="w-8 h-8 rounded-md bg-stone-100 group-hover:bg-emerald-50 text-stone-700 group-hover:text-[#2A5C45] flex items-center justify-center mb-2.5 transition-colors">
                <Layers className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-stone-900 block">3D Designs</span>
              <span className="text-[11px] text-stone-500">Renders & CADs</span>
            </button>

            <button
              onClick={() => navigate('/client/materials')}
              className="p-3.5 rounded-lg border border-stone-200 bg-white hover:border-[#2A5C45] hover:shadow-xs transition-all text-left group"
            >
              <div className="w-8 h-8 rounded-md bg-stone-100 group-hover:bg-emerald-50 text-stone-700 group-hover:text-[#2A5C45] flex items-center justify-center mb-2.5 transition-colors">
                <Palette className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-stone-900 block">Materials</span>
              <span className="text-[11px] text-stone-500">Swatches & Specs</span>
            </button>

            <button
              onClick={() => navigate('/client/progress')}
              className="p-3.5 rounded-lg border border-stone-200 bg-white hover:border-[#2A5C45] hover:shadow-xs transition-all text-left group"
            >
              <div className="w-8 h-8 rounded-md bg-stone-100 group-hover:bg-emerald-50 text-stone-700 group-hover:text-[#2A5C45] flex items-center justify-center mb-2.5 transition-colors">
                <HardHat className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-stone-900 block">Site Progress</span>
              <span className="text-[11px] text-stone-500">Photos & Logs</span>
            </button>

            <button
              onClick={() => navigate('/client/payments')}
              className="p-3.5 rounded-lg border border-stone-200 bg-white hover:border-[#2A5C45] hover:shadow-xs transition-all text-left group"
            >
              <div className="w-8 h-8 rounded-md bg-stone-100 group-hover:bg-emerald-50 text-stone-700 group-hover:text-[#2A5C45] flex items-center justify-center mb-2.5 transition-colors">
                <CreditCard className="w-4 h-4" />
              </div>
              <span className="text-xs font-semibold text-stone-900 block">Payments</span>
              <span className="text-[11px] text-stone-500">Invoices & Dues</span>
            </button>
          </div>
        </div>

        {/* Right 1 Col: Milestone Next Up & Assigned Team */}
        <div className="space-y-6">
          {/* Next Milestone Box */}
          <Card className="border-stone-200 bg-white shadow-xs">
            <CardHeader className="p-4 sm:p-5 pb-3">
              <CardTitle className="text-sm font-semibold text-stone-900 flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[#2A5C45]" />
                Next Payment Trigger
              </CardTitle>
            </CardHeader>
            <CardContent className="p-4 sm:p-5 pt-0 space-y-3">
              {upcomingMilestone ? (
                <div className="space-y-2.5">
                  <div className="p-3 rounded-lg bg-stone-50 border border-stone-200/80">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="font-semibold text-stone-900">
                        {upcomingMilestone.name}
                      </span>
                      <StatusBadge status={upcomingMilestone.status} />
                    </div>
                    <p className="text-[11px] text-stone-500 leading-normal mb-2">
                      Trigger: {upcomingMilestone.stage_trigger}
                    </p>
                    <div className="flex items-center justify-between text-xs pt-1 border-t border-stone-200/60">
                      <span className="text-stone-600">Amount Due:</span>
                      <span className="font-bold text-stone-900">
                        {formatINR(upcomingMilestone.amount)}
                      </span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => navigate('/client/payments')}
                    className="w-full text-xs h-8"
                  >
                    View All 5 Milestones <ChevronRight className="w-3.5 h-3.5 ml-1" />
                  </Button>
                </div>
              ) : (
                <p className="text-xs text-stone-500">All milestones completed.</p>
              )}
            </CardContent>
          </Card>

          {/* Dedicated Team Card */}
          <Card className="border-stone-200 bg-white shadow-xs">
            <CardHeader className="p-4 sm:p-5 pb-3 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-semibold text-stone-900">
                  Your Project Team
                </CardTitle>
                <span className="text-xs text-stone-500">Dedicated studio leads</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setContactOpen(true)}
                className="h-7 text-xs text-[#2A5C45] hover:text-[#204E38]"
              >
                Contact
              </Button>
            </CardHeader>
            <CardContent className="p-4 sm:p-5 pt-0 space-y-3.5">
              {/* Designer */}
              <div className="flex items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-emerald-100 text-[#2A5C45] flex items-center justify-center font-semibold text-xs shrink-0">
                    AM
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-stone-900 truncate">
                      {leadDesigner.full_name}
                    </p>
                    <p className="text-[11px] text-stone-500 truncate">Lead Interior Designer</p>
                  </div>
                </div>
                <a
                  href={`tel:${leadDesigner.phone}`}
                  className="px-2 py-1 rounded border border-stone-200 text-stone-700 hover:text-[#2A5C45] text-[11px] font-medium flex items-center gap-1 shrink-0"
                >
                  <Phone className="w-3 h-3" /> Call
                </a>
              </div>

              {/* Site Manager */}
              <div className="flex items-center justify-between gap-3 text-xs border-t border-stone-100 pt-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center font-semibold text-xs shrink-0">
                    SR
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-stone-900 truncate">
                      {siteManager.full_name}
                    </p>
                    <p className="text-[11px] text-stone-500 truncate">Site Execution Lead</p>
                  </div>
                </div>
                <a
                  href={`tel:${siteManager.phone}`}
                  className="px-2 py-1 rounded border border-stone-200 text-stone-700 hover:text-[#2A5C45] text-[11px] font-medium flex items-center gap-1 shrink-0"
                >
                  <Phone className="w-3 h-3" /> Call
                </a>
              </div>

              <div className="pt-2">
                <Button
                  size="sm"
                  className="w-full text-xs h-8 bg-stone-50 hover:bg-stone-100 text-stone-700 border border-stone-200"
                  onClick={() => setContactOpen(true)}
                >
                  <MessageSquare className="w-3.5 h-3.5 mr-1.5 text-[#2A5C45]" />
                  Message Studio Team
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Shared Contact Modal */}
      <ClientContactModal
        open={contactOpen}
        onOpenChange={setContactOpen}
        prefillSubject={contactSubject}
      />
    </div>
  );
}
