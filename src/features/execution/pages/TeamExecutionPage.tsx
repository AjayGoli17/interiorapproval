import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  HardHat,
  Camera,
  Plus,
  Users,
  Calendar,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Sun,
  Layers,
  ArrowRight,
  Maximize2,
  Eye,
  Building2,
  Activity,
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
import { SiteUpdate } from '@/types';

const SITE_PHOTO_PRESETS = [
  'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?w=600&auto=format&fit=crop&q=80',
];

export function TeamExecutionPage() {
  const navigate = useNavigate();
  const {
    projects,
    currentProjectId,
    setCurrentProject,
    rooms,
    siteUpdates,
    tasks,
    issues,
    addSiteUpdate,
  } = useDemoStore();

  const activeProject = projects.find((p) => p.id === currentProjectId) || projects[0];

  // Modals
  const [isAddLogOpen, setIsAddLogOpen] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  // Form State
  const [logFormData, setLogFormData] = useState({
    title: '',
    room_id: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    work_completed_summary: '',
    next_planned_activity: '',
    workforce_count: 6,
    weather_conditions: 'Sunny 30°C',
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
  const projectUpdates = siteUpdates.filter((u) => u.project_id === activeProject?.id);
  const projectTasks = tasks.filter((t) => t.project_id === activeProject?.id);

  // Trade stage statistics calculated dynamically from tasks
  const trades = [
    { key: 'civil', label: 'Civil & Masonry', category: 'civil' },
    { key: 'electrical', label: 'Electrical & MEP', category: 'electrical' },
    { key: 'false_ceiling', label: 'False Ceiling & Gypsum', category: 'false_ceiling' },
    { key: 'flooring', label: 'Marble & Flooring', category: 'flooring' },
    { key: 'carpentry', label: 'Modular Carpentry', category: 'carpentry' },
    { key: 'painting', label: 'Painting & Polishing', category: 'painting' },
  ];

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
    showToast(`Daily Site Log "${logFormData.title}" published.`);
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
              Site Execution & Daily Trade Progress
            </h1>
            <Badge variant="outline" className="text-xs bg-stone-100 text-stone-700">
              {projectUpdates.length} Daily Logs
            </Badge>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Real-time on-site labor tracking, trade milestones, daily supervisor photo feeds, and contractor handovers.
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
            onClick={() => {
              setLogFormData({
                title: '',
                room_id: projectRooms[0]?.id || '',
                description: '',
                date: new Date().toISOString().split('T')[0],
                work_completed_summary: '',
                next_planned_activity: '',
                workforce_count: 6,
                weather_conditions: 'Sunny 30°C',
                delay_flag: false,
                is_client_visible: true,
                photo_urls: [SITE_PHOTO_PRESETS[0], SITE_PHOTO_PRESETS[1]],
              });
              setIsAddLogOpen(true);
            }}
          >
            <Camera className="h-3.5 w-3.5 mr-1" />
            Post Daily Site Log
          </Button>
        </div>
      </div>

      {/* Trade Phase Meters Strip */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-stone-900 uppercase tracking-wider">
            Trade Phase Execution Meters
          </span>
          <Button
            size="sm"
            variant="link"
            className="h-auto p-0 text-xs text-[#2A5C45]"
            onClick={() => navigate('/team/tasks')}
          >
            Manage Detailed Task Checklist →
          </Button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {trades.map((trade) => {
            const tradeTasks = projectTasks.filter((t) => t.category === trade.category);
            const completedCount = tradeTasks.filter((t) => t.status === 'completed').length;
            const progress = tradeTasks.length > 0
              ? Math.round(
                  tradeTasks.reduce((acc, t) => acc + t.progress_percent, 0) / tradeTasks.length
                )
              : 0;

            return (
              <Card key={trade.key} className="p-3 border-stone-200 shadow-none">
                <span className="text-[10px] text-stone-500 font-mono block uppercase">
                  {trade.label}
                </span>
                <div className="text-lg font-bold text-stone-900 mt-1">{progress}%</div>
                <div className="h-1.5 w-full bg-stone-100 rounded-full overflow-hidden mt-1.5 mb-1">
                  <div
                    className="h-full bg-[#2A5C45] rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <div className="text-[10px] text-stone-400">
                  {completedCount}/{tradeTasks.length} tasks closed
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Daily Logs Timeline Feed */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-stone-900">
            Site Supervisor Daily Logs & Photo Feed ({projectUpdates.length})
          </h2>
          <span className="text-xs text-stone-500">
            Chronological site diary for quality audit and client transparency
          </span>
        </div>

        {projectUpdates.length === 0 ? (
          <Card className="p-8 text-center border-stone-200 text-xs text-stone-500">
            No daily logs recorded for this project yet. Click "Post Daily Site Log" above to record progress.
          </Card>
        ) : (
          <div className="space-y-4">
            {projectUpdates.map((log) => {
              const room = rooms.find((r) => r.id === log.room_id);

              return (
                <Card key={log.id} className="border-stone-200 shadow-none hover:border-stone-300 transition-colors overflow-hidden">
                  <CardHeader className="py-3 px-4 bg-stone-50/50 border-b border-stone-100 flex flex-row items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-sm font-bold text-stone-900">
                          {log.title}
                        </CardTitle>
                        {room && (
                          <Badge variant="outline" className="text-[10px] text-stone-600 bg-white">
                            {room.name}
                          </Badge>
                        )}
                        {log.is_client_visible ? (
                          <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]">
                            Client Visible
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-[10px] text-stone-400">
                            Internal Team Only
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-xs text-stone-500 mt-1">
                        <span>📅 Log Date: <strong>{formatDate(log.date)}</strong></span>
                        <span>•</span>
                        <span>👷 Workforce on Site: <strong>{log.workforce_count} personnel</strong></span>
                        <span>•</span>
                        <span>🌤️ Weather: <strong>{log.weather_conditions}</strong></span>
                      </div>
                    </div>

                    {log.delay_flag ? (
                      <Badge className="bg-rose-50 text-rose-700 border-rose-200 text-xs flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" /> Delay Flagged
                      </Badge>
                    ) : (
                      <Badge className="bg-emerald-50 text-emerald-800 border-emerald-200 text-xs flex items-center gap-1">
                        <CheckCircle2 className="h-3 w-3" /> On Track
                      </Badge>
                    )}
                  </CardHeader>

                  <CardContent className="p-4 space-y-3">
                    <p className="text-xs text-stone-700 leading-relaxed">
                      {log.description}
                    </p>

                    {/* Progress Detail Banners */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      {log.work_completed_summary && (
                        <div className="p-2.5 rounded bg-stone-50 border border-stone-100 space-y-0.5">
                          <span className="text-[10px] font-mono uppercase font-semibold text-stone-500 block">
                            Milestone Completed:
                          </span>
                          <p className="text-[11px] text-stone-800 font-medium">
                            {log.work_completed_summary}
                          </p>
                        </div>
                      )}

                      {log.next_planned_activity && (
                        <div className="p-2.5 rounded bg-emerald-50/50 border border-emerald-100 space-y-0.5">
                          <span className="text-[10px] font-mono uppercase font-semibold text-emerald-800 block">
                            Next Planned Trade Activity:
                          </span>
                          <p className="text-[11px] text-emerald-900 font-medium">
                            {log.next_planned_activity}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Photos Gallery */}
                    {log.photo_urls && log.photo_urls.length > 0 && (
                      <div>
                        <span className="text-[10px] font-mono uppercase font-semibold text-stone-400 block mb-1.5">
                          On-Site Inspection Photos ({log.photo_urls.length})
                        </span>
                        <div className="flex gap-3 overflow-x-auto pb-1">
                          {log.photo_urls.map((photo, i) => (
                            <div
                              key={i}
                              className="relative h-24 w-36 rounded-md overflow-hidden border border-stone-200 group cursor-pointer flex-shrink-0"
                              onClick={() => setSelectedPhoto(photo)}
                            >
                              <img
                                src={photo}
                                alt={`Site log ${i}`}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                              />
                              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Maximize2 className="h-4 w-4 text-white" />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* DIALOG: POST DAILY SITE LOG */}
      {/* ========================================================================= */}
      <Dialog open={isAddLogOpen} onOpenChange={setIsAddLogOpen}>
        <DialogContent className="max-w-lg">
          <form onSubmit={handleCreateLog}>
            <DialogHeader>
              <DialogTitle className="text-base font-bold text-stone-900">
                Post Daily Site Log & Photos
              </DialogTitle>
              <DialogDescription className="text-xs text-stone-500">
                Log on-site trade progress, contractor workforce attendance, and inspection photos.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-3">
              <div>
                <Label className="text-xs font-semibold text-stone-700">Log Title *</Label>
                <Input
                  required
                  placeholder="e.g. False Ceiling Gypsum Boarding & Cove Channel Inspection"
                  value={logFormData.title}
                  onChange={(e) => setLogFormData({ ...logFormData, title: e.target.value })}
                  className="h-8 text-xs mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs font-semibold text-stone-700">Room Location</Label>
                  <select
                    value={logFormData.room_id}
                    onChange={(e) => setLogFormData({ ...logFormData, room_id: e.target.value })}
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
                  <Label className="text-xs font-semibold text-stone-700">Date</Label>
                  <Input
                    type="date"
                    value={logFormData.date}
                    onChange={(e) => setLogFormData({ ...logFormData, date: e.target.value })}
                    className="h-8 text-xs mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs font-semibold text-stone-700">Workforce On Site (Count)</Label>
                  <Input
                    type="number"
                    value={logFormData.workforce_count}
                    onChange={(e) => setLogFormData({ ...logFormData, workforce_count: Number(e.target.value) })}
                    className="h-8 text-xs mt-1 font-mono"
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold text-stone-700">Weather & Site Conditions</Label>
                  <Input
                    value={logFormData.weather_conditions}
                    onChange={(e) => setLogFormData({ ...logFormData, weather_conditions: e.target.value })}
                    className="h-8 text-xs mt-1"
                  />
                </div>
              </div>

              <div>
                <Label className="text-xs font-semibold text-stone-700">Work Execution Summary</Label>
                <Textarea
                  required
                  placeholder="Describe trade activities completed today in detail..."
                  value={logFormData.description}
                  onChange={(e) => setLogFormData({ ...logFormData, description: e.target.value })}
                  className="text-xs mt-1 resize-none h-16"
                />
              </div>

              <div>
                <Label className="text-xs font-semibold text-stone-700">Next Planned Activity</Label>
                <Input
                  placeholder="e.g. Electrical wire pulling and acoustic panel anchoring tomorrow"
                  value={logFormData.next_planned_activity}
                  onChange={(e) => setLogFormData({ ...logFormData, next_planned_activity: e.target.value })}
                  className="h-8 text-xs mt-1"
                />
              </div>

              <div className="flex items-center justify-between p-2.5 rounded bg-stone-50 border border-stone-200">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="clientVisibleCheck"
                    checked={logFormData.is_client_visible}
                    onChange={(e) => setLogFormData({ ...logFormData, is_client_visible: e.target.checked })}
                    className="accent-[#2A5C45] h-4 w-4 rounded"
                  />
                  <Label htmlFor="clientVisibleCheck" className="text-xs text-stone-800 cursor-pointer">
                    Publish to Client Portal progress timeline
                  </Label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="delayFlagCheck"
                    checked={logFormData.delay_flag}
                    onChange={(e) => setLogFormData({ ...logFormData, delay_flag: e.target.checked })}
                    className="accent-rose-600 h-4 w-4 rounded"
                  />
                  <Label htmlFor="delayFlagCheck" className="text-xs text-rose-700 cursor-pointer font-medium">
                    Flag Site Delay
                  </Label>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsAddLogOpen(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                className="bg-[#2A5C45] hover:bg-[#234c39] text-white text-xs"
              >
                Publish Site Log
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ========================================================================= */}
      {/* DIALOG: PHOTO ZOOM MODAL */}
      {/* ========================================================================= */}
      <Dialog open={!!selectedPhoto} onOpenChange={() => setSelectedPhoto(null)}>
        <DialogContent className="max-w-3xl p-2 bg-black/90 border-stone-800">
          {selectedPhoto && (
            <div className="rounded overflow-hidden">
              <img
                src={selectedPhoto}
                alt="High-res site photo"
                className="w-full h-auto max-h-[80vh] object-contain mx-auto"
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
