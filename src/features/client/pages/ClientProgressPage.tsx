import React, { useState } from 'react';
import {
  HardHat,
  Calendar,
  CheckCircle2,
  Clock,
  Camera,
  Maximize2,
  Users,
  Sun,
  ArrowRight,
  Filter,
  MessageSquare,
  ShieldCheck,
  Sparkles,
  ChevronRight,
} from 'lucide-react';
import { useDemoStore } from '@/stores/demoStore';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { ClientContactModal } from '@/features/client/components/ClientContactModal';
import { SiteUpdate } from '@/types';

// Standard 6 residential interior execution milestones
const EXECUTION_STAGES = [
  {
    id: 1,
    name: 'Demolition & Civil',
    status: 'completed',
    date: 'Aug 15 – Aug 28',
    description: 'Wall modifications, tile hacking & debris removal completed.',
  },
  {
    id: 2,
    name: 'Electrical & MEP Conduits',
    status: 'completed',
    date: 'Aug 29 – Sep 12',
    description: 'Switch box alignments, copper wiring raceways & plumbing pressure tests passed.',
  },
  {
    id: 3,
    name: 'False Ceiling & Framing',
    status: 'completed',
    date: 'Sep 13 – Sep 30',
    description: 'Saint-Gobain channel perimeter grids, gypsum sheets & cove profiles installed.',
  },
  {
    id: 4,
    name: 'Modular Woodwork & Carcass',
    status: 'in_progress',
    progress: 65,
    date: 'Oct 01 – Oct 28',
    description: 'Precision factory-pressed ply carcasses, Blum hardware & veneer lamination.',
  },
  {
    id: 5,
    name: 'Countertops & Painting',
    status: 'upcoming',
    date: 'Oct 29 – Nov 18',
    description: 'Caesarstone quartz installation, undercoat primer & Royale luxury emulsion.',
  },
  {
    id: 6,
    name: 'Final Snagging & Handover',
    status: 'upcoming',
    date: 'Nov 19 – Nov 30',
    description: 'Deep machine cleaning, hardware alignment check & ceremonial key handover.',
  },
];

export function ClientProgressPage() {
  const { siteUpdates, rooms, projects, currentProjectId, teamMembers } = useDemoStore();
  const project = projects.find((p) => p.id === currentProjectId) || projects[0];

  const siteManager = teamMembers.find((m) => m.id === project?.site_manager_id) || {
    full_name: 'Suresh Rao',
    phone: '+91 98490 44556',
  };

  // Only client-visible updates, ordered newest first
  const clientUpdates = siteUpdates
    .filter((u) => u.project_id === project?.id && u.is_client_visible !== false)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Room filter
  const [selectedRoomId, setSelectedRoomId] = useState<string>('all');

  // Photo Lightbox modal state
  const [lightboxPhoto, setLightboxPhoto] = useState<{ url: string; title: string; date: string } | null>(
    null
  );

  // Ask Question modal state
  const [inquiryModalOpen, setInquiryModalOpen] = useState(false);
  const [inquirySubject, setInquirySubject] = useState<string | undefined>(undefined);

  const projectRooms = rooms.filter((r) => r.project_id === project?.id);

  const filteredUpdates = clientUpdates.filter((u) => {
    return selectedRoomId === 'all' || u.room_id === selectedRoomId;
  });

  const handleAskQuestion = (updateTitle: string) => {
    setInquirySubject(`Site Update: "${updateTitle}"`);
    setInquiryModalOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight flex items-center gap-2">
            <HardHat className="w-5 h-5 sm:w-6 sm:h-6 text-[#2A5C45]" />
            Live Site Execution & Progress
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Follow verified on-site construction milestones, supervisor photo updates, and weekly trade logs.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            setInquirySubject(undefined);
            setInquiryModalOpen(true);
          }}
          className="text-xs h-8 bg-white border-stone-200 text-stone-700 hover:bg-stone-50 shrink-0 self-start sm:self-center"
        >
          <MessageSquare className="w-3.5 h-3.5 mr-1.5 text-[#2A5C45]" />
          Ask Site Supervisor
        </Button>
      </div>

      {/* 1. Milestone Progression Tracker */}
      <Card className="border-stone-200/90 bg-white shadow-xs overflow-hidden">
        <CardHeader className="p-4 sm:p-5 pb-3 border-b border-stone-100">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <CardTitle className="text-sm font-semibold text-stone-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#2A5C45]" />
              Trade Milestone Progression
            </CardTitle>
            <span className="text-xs font-mono text-[#2A5C45] bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200/70 font-semibold">
              Currently in Stage 4: Modular Woodwork
            </span>
          </div>
        </CardHeader>

        <CardContent className="p-4 sm:p-5">
          {/* Horizontal / Stacked Milestone Steps */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {EXECUTION_STAGES.map((stage) => {
              const isDone = stage.status === 'completed';
              const isCurrent = stage.status === 'in_progress';

              return (
                <div
                  key={stage.id}
                  className={`p-3 rounded-lg border text-xs flex flex-col justify-between transition-all ${
                    isCurrent
                      ? 'border-[#2A5C45] bg-emerald-50/40 shadow-2xs ring-1 ring-[#2A5C45]/20'
                      : isDone
                      ? 'border-stone-200 bg-stone-50/60'
                      : 'border-stone-200/60 bg-white opacity-70'
                  }`}
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-semibold uppercase text-stone-400">
                        Step 0{stage.id}
                      </span>
                      {isDone ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      ) : isCurrent ? (
                        <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-semibold bg-[#2A5C45] text-white">
                          Active
                        </span>
                      ) : (
                        <Clock className="w-3.5 h-3.5 text-stone-300 shrink-0" />
                      )}
                    </div>

                    <h4 className="font-semibold text-stone-900 leading-tight">
                      {stage.name}
                    </h4>

                    <span className="text-[11px] text-stone-500 font-mono block">
                      {stage.date}
                    </span>
                  </div>

                  {isCurrent && stage.progress && (
                    <div className="mt-3 pt-2 border-t border-emerald-200/60">
                      <div className="flex justify-between text-[11px] text-stone-600 mb-1">
                        <span>Stage Progress</span>
                        <span className="font-bold text-[#2A5C45]">{stage.progress}%</span>
                      </div>
                      <div className="w-full bg-emerald-100 rounded-full h-1.5">
                        <div
                          className="bg-[#2A5C45] h-1.5 rounded-full"
                          style={{ width: `${stage.progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* 2. Room Filter Toolbar */}
      <div className="bg-white p-3 rounded-xl border border-stone-200/90 shadow-2xs flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          <span className="text-stone-500 font-medium shrink-0 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Filter by Area:
          </span>
          <button
            onClick={() => setSelectedRoomId('all')}
            className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              selectedRoomId === 'all'
                ? 'bg-[#2A5C45] text-white'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            All Updates ({clientUpdates.length})
          </button>
          {projectRooms.map((room) => {
            const count = clientUpdates.filter((u) => u.room_id === room.id).length;
            if (count === 0) return null;
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
                {room.name} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Chronological Site Updates Feed */}
      <div className="space-y-5">
        {filteredUpdates.map((update) => {
          const room = rooms.find((r) => r.id === update.room_id);

          return (
            <Card
              key={update.id}
              className="border-stone-200/90 bg-white shadow-2xs overflow-hidden"
            >
              <CardHeader className="p-4 sm:p-5 pb-3 border-b border-stone-100">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200/70 px-2 py-0.5 rounded uppercase tracking-wider">
                        {room?.name || 'Interior Area'}
                      </span>
                      <span className="text-xs text-stone-500 font-mono flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-stone-400" />
                        {new Date(update.date).toLocaleDateString('en-IN', {
                          weekday: 'short',
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </div>

                    <CardTitle className="text-sm sm:text-base font-bold text-stone-900">
                      {update.title}
                    </CardTitle>
                  </div>

                  {/* Site conditions & workforce tags */}
                  <div className="flex items-center gap-2 text-[11px] text-stone-500 shrink-0">
                    {update.weather_conditions && (
                      <span className="flex items-center gap-1 bg-stone-50 px-2 py-1 rounded border border-stone-200/60">
                        <Sun className="w-3 h-3 text-amber-500" />
                        {update.weather_conditions}
                      </span>
                    )}
                    <span className="flex items-center gap-1 bg-stone-50 px-2 py-1 rounded border border-stone-200/60 font-mono">
                      <Users className="w-3 h-3 text-stone-400" />
                      {update.workforce_count} Artisans on Site
                    </span>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="p-4 sm:p-5 space-y-4">
                <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
                  {update.description}
                </p>

                {/* Work completed and Next activity callouts */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  {update.work_completed_summary && (
                    <div className="p-3 rounded-lg bg-emerald-50/50 border border-emerald-200/60 space-y-1">
                      <span className="font-semibold text-emerald-900 block flex items-center gap-1.5 text-[11px]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        Quality Verified Milestones:
                      </span>
                      <p className="text-emerald-800 leading-normal text-xs">
                        {update.work_completed_summary}
                      </p>
                    </div>
                  )}

                  {update.next_planned_activity && (
                    <div className="p-3 rounded-lg bg-stone-50 border border-stone-200/80 space-y-1">
                      <span className="font-semibold text-stone-800 block flex items-center gap-1.5 text-[11px]">
                        <Sparkles className="w-3.5 h-3.5 text-[#2A5C45]" />
                        Next Planned Activity:
                      </span>
                      <p className="text-stone-600 leading-normal text-xs">
                        {update.next_planned_activity}
                      </p>
                    </div>
                  )}
                </div>

                {/* Photo Gallery Grid */}
                {update.photo_urls && update.photo_urls.length > 0 && (
                  <div className="space-y-2 pt-1">
                    <span className="text-[11px] font-semibold text-stone-500 block uppercase tracking-wider">
                      On-Site Visual Documentation ({update.photo_urls.length}{' '}
                      {update.photo_urls.length === 1 ? 'Photo' : 'Photos'}):
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {update.photo_urls.map((photoUrl, idx) => (
                        <div
                          key={idx}
                          onClick={() =>
                            setLightboxPhoto({
                              url: photoUrl,
                              title: `${update.title} (Photo ${idx + 1})`,
                              date: update.date,
                            })
                          }
                          className="relative aspect-video rounded-lg overflow-hidden border border-stone-200 bg-stone-100 cursor-pointer group shadow-2xs"
                        >
                          <img
                            src={photoUrl}
                            alt="Site inspection photo"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-stone-900/0 group-hover:bg-stone-900/20 transition-colors flex items-center justify-center">
                            <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-black/70 text-white text-[11px] font-medium px-2 py-1 rounded flex items-center gap-1">
                              <Maximize2 className="w-3 h-3" /> Expand
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Footer Action */}
                <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                  <span className="text-stone-400 text-[11px]">
                    Verified by Supervisor Suresh Rao • Quality standard ISO 9001
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleAskQuestion(update.title)}
                    className="text-xs h-7 text-[#2A5C45] hover:text-[#204E38] font-medium"
                  >
                    <MessageSquare className="w-3 h-3 mr-1" />
                    Ask a Question
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Lightbox Modal */}
      <Dialog open={!!lightboxPhoto} onOpenChange={(open) => !open && setLightboxPhoto(null)}>
        <DialogContent className="max-w-3xl p-5">
          {lightboxPhoto && (
            <div className="space-y-3">
              <DialogHeader className="space-y-0.5">
                <DialogTitle className="text-base font-semibold text-stone-900">
                  {lightboxPhoto.title}
                </DialogTitle>
                <DialogDescription className="text-xs text-stone-500 font-mono">
                  Captured on site: {lightboxPhoto.date}
                </DialogDescription>
              </DialogHeader>

              <div className="relative aspect-video w-full rounded-lg overflow-hidden border border-stone-200 bg-stone-900 flex items-center justify-center">
                <img
                  src={lightboxPhoto.url}
                  alt={lightboxPhoto.title}
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="flex items-center justify-between pt-1 text-xs">
                <span className="text-stone-500 text-[11px]">
                  StudioFlow Site Verification Log • Apartment 1204
                </span>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setLightboxPhoto(null)}
                  className="text-xs h-7"
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Shared Contact Modal for questions */}
      <ClientContactModal
        open={inquiryModalOpen}
        onOpenChange={setInquiryModalOpen}
        prefillSubject={inquirySubject}
      />
    </div>
  );
}
