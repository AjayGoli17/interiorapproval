import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  FolderKanban,
  Search,
  Filter,
  Plus,
  ArrowRight,
  ArrowLeft,
  Calendar,
  Building2,
  Users,
  Ruler,
  CheckCircle2,
  Clock,
  Layers,
  Package,
  HardHat,
  AlertOctagon,
  Edit,
  Sliders,
  FileText,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { useDemoStore } from '@/stores/demoStore';
import { formatINR, formatINRCompact, formatDate } from '@/lib/utils';
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
import { Room } from '@/types';

export function TeamProjectOverviewPage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const {
    currentUser,
    projects,
    clients,
    teamMembers,
    rooms,
    designVersions,
    approvals,
    materials,
    tasks,
    issues,
    currentProjectId,
    setCurrentProject,
    addRoom,
    updateRoom,
    deleteRoom,
  } = useDemoStore();

  // Mode: 'directory' or 'workspace'
  const initialMode = searchParams.get('mode') === 'directory' ? 'directory' : 'workspace';
  const [viewMode, setViewMode] = useState<'directory' | 'workspace'>(initialMode);

  // Filters for Directory
  const [searchQuery, setSearchQuery] = useState('');
  const [stageFilter, setStageFilter] = useState('all');

  // Active Project for Workspace
  const activeProject = projects.find((p) => p.id === currentProjectId) || projects[0];
  const activeClient = clients.find((c) => c.project_id === activeProject?.id);
  const activeDesigner = teamMembers.find((m) => m.id === activeProject?.lead_designer_id);
  const activeSiteManager = teamMembers.find((m) => m.id === activeProject?.site_manager_id);

  // Workspace sub-tabs
  const [workspaceTab, setWorkspaceTab] = useState<'rooms' | 'designs' | 'materials' | 'execution' | 'schedule'>('rooms');

  // Dialog States
  const [isAddRoomOpen, setIsAddRoomOpen] = useState(false);
  const [isEditRoomOpen, setIsEditRoomOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  // Form states for Add/Edit Room
  const [roomFormData, setRoomFormData] = useState({
    name: '',
    floor: '12th Floor',
    dimensions: '',
    area_sqft: 200,
    status: 'in_design' as Room['status'],
    progress_percentage: 0,
    specifications: '',
  });

  // Filtered projects for Directory
  const assignedProjects = projects.filter((p) => {
    if (currentUser.role === 'designer') {
      return p.lead_designer_id === currentUser.id || !p.lead_designer_id;
    }
    if (currentUser.role === 'site_manager') {
      return p.site_manager_id === currentUser.id || !p.site_manager_id;
    }
    return true;
  });

  const filteredProjects = assignedProjects.filter((p) => {
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (clients.find((c) => c.project_id === p.id)?.full_name || '')
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
    const matchesStage = stageFilter === 'all' || p.status === stageFilter;
    return matchesSearch && matchesStage;
  });

  // Related items for active project
  const projectRooms = rooms.filter((r) => r.project_id === activeProject?.id);
  const projectDesigns = designVersions.filter((d) => d.project_id === activeProject?.id);
  const projectApprovals = approvals.filter((a) => a.project_id === activeProject?.id);
  const projectMaterials = materials.filter((m) => m.project_id === activeProject?.id);
  const projectTasks = tasks.filter((t) => t.project_id === activeProject?.id);
  const projectIssues = issues.filter((i) => i.project_id === activeProject?.id);

  const handleSelectProject = (projectId: string) => {
    setCurrentProject(projectId);
    setViewMode('workspace');
    setSearchParams({ mode: 'workspace' });
  };

  const openAddRoom = () => {
    setRoomFormData({
      name: '',
      floor: activeProject?.property_type === 'Villa' ? 'Ground Floor' : '12th Floor',
      dimensions: '16 ft x 14 ft',
      area_sqft: 224,
      status: 'in_design',
      progress_percentage: 0,
      specifications: '',
    });
    setIsAddRoomOpen(true);
  };

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomFormData.name || !activeProject) return;

    addRoom({
      project_id: activeProject.id,
      name: roomFormData.name,
      floor: roomFormData.floor,
      dimensions: roomFormData.dimensions,
      area_sqft: Number(roomFormData.area_sqft) || 150,
      status: roomFormData.status,
      progress_percentage: Number(roomFormData.progress_percentage) || 0,
      specifications: roomFormData.specifications,
    });

    setIsAddRoomOpen(false);
  };

  const openEditRoom = (room: Room) => {
    setSelectedRoom(room);
    setRoomFormData({
      name: room.name,
      floor: room.floor || '12th Floor',
      dimensions: room.dimensions || '',
      area_sqft: room.area_sqft || 150,
      status: room.status,
      progress_percentage: room.progress_percentage || 0,
      specifications: room.specifications || '',
    });
    setIsEditRoomOpen(true);
  };

  const handleUpdateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoom) return;

    updateRoom(selectedRoom.id, {
      name: roomFormData.name,
      floor: roomFormData.floor,
      dimensions: roomFormData.dimensions,
      area_sqft: Number(roomFormData.area_sqft) || 150,
      status: roomFormData.status,
      progress_percentage: Number(roomFormData.progress_percentage) || 0,
      specifications: roomFormData.specifications,
    });

    setIsEditRoomOpen(false);
    setSelectedRoom(null);
  };

  return (
    <div className="space-y-6">
      {/* Top Bar Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-stone-900">
              {viewMode === 'workspace' ? activeProject?.title : 'Assigned Projects Directory'}
            </h1>
            <Badge variant="outline" className="text-xs bg-stone-100 text-stone-700">
              {viewMode === 'workspace' ? 'Project Workspace' : `${filteredProjects.length} Projects`}
            </Badge>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            {viewMode === 'workspace'
              ? `${activeProject?.location} • Architectural room schedule, design revisions, and trade management.`
              : 'Browse all active design & site execution projects assigned to your team.'}
          </p>
        </div>

        {/* View Switcher Controls */}
        <div className="flex items-center gap-2">
          {viewMode === 'workspace' ? (
            <>
              {/* Project Quick Dropdown Selector */}
              <div className="flex items-center gap-1.5 bg-white border border-stone-200 rounded-md px-2 py-1">
                <span className="text-[11px] text-stone-500 font-medium">Project:</span>
                <select
                  value={activeProject?.id}
                  onChange={(e) => handleSelectProject(e.target.value)}
                  className="text-xs font-semibold text-stone-800 bg-transparent border-none focus:outline-none cursor-pointer"
                >
                  {assignedProjects.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.title}
                    </option>
                  ))}
                </select>
              </div>

              <Button
                size="sm"
                variant="outline"
                className="text-xs border-stone-200 text-stone-700 hover:bg-stone-50"
                onClick={() => {
                  setViewMode('directory');
                  setSearchParams({ mode: 'directory' });
                }}
              >
                <ArrowLeft className="h-3.5 w-3.5 mr-1" />
                All Projects
              </Button>
            </>
          ) : (
            <Button
              size="sm"
              variant="default"
              className="text-xs bg-[#2A5C45] hover:bg-[#234c39] text-white"
              onClick={() => {
                setViewMode('workspace');
                setSearchParams({ mode: 'workspace' });
              }}
            >
              Open Active Workspace <ArrowRight className="h-3.5 w-3.5 ml-1" />
            </Button>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. DIRECTORY VIEW (SCREEN 2) */}
      {/* ========================================================================= */}
      {viewMode === 'directory' && (
        <div className="space-y-4">
          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-lg border border-stone-200">
            <div className="flex items-center gap-2 w-full sm:w-80">
              <Search className="h-4 w-4 text-stone-400" />
              <Input
                placeholder="Search by project, client, or property..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-8 text-xs border-stone-200"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs text-stone-500 whitespace-nowrap">Filter Stage:</span>
              <select
                value={stageFilter}
                onChange={(e) => setStageFilter(e.target.value)}
                className="h-8 text-xs border border-stone-200 rounded-md px-2 bg-white text-stone-700"
              >
                <option value="all">All Stages</option>
                <option value="lead">Lead</option>
                <option value="design_phase">Design Phase</option>
                <option value="procurement">Procurement</option>
                <option value="execution">Execution</option>
                <option value="handover">Handover</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Projects Table */}
          <Card className="border-stone-200 shadow-none overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-stone-50/70 border-b border-stone-200 text-[11px]">
                  <TableHead className="py-3 font-semibold text-stone-700">Project Name & Code</TableHead>
                  <TableHead className="py-3 font-semibold text-stone-700">Client & Property</TableHead>
                  <TableHead className="py-3 font-semibold text-stone-700">Stage</TableHead>
                  <TableHead className="py-3 font-semibold text-stone-700">Overall Progress</TableHead>
                  <TableHead className="py-3 font-semibold text-stone-700">Budget</TableHead>
                  <TableHead className="py-3 font-semibold text-stone-700">Target Handover</TableHead>
                  <TableHead className="py-3 font-semibold text-stone-700 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProjects.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-xs text-stone-500">
                      No assigned projects match the selected filter.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProjects.map((proj) => {
                    const client = clients.find((c) => c.project_id === proj.id);
                    const projRooms = rooms.filter((r) => r.project_id === proj.id);
                    const projApprovals = approvals.filter((a) => a.project_id === proj.id && a.status === 'pending');
                    const projTasks = tasks.filter((t) => t.project_id === proj.id && t.status !== 'completed');

                    return (
                      <TableRow
                        key={proj.id}
                        className="hover:bg-stone-50/70 transition-colors border-b border-stone-100"
                      >
                        <TableCell className="py-3">
                          <div className="font-semibold text-xs text-stone-900">{proj.title}</div>
                          <div className="text-[11px] text-stone-500 font-mono mt-0.5">
                            {proj.property_type} • {projRooms.length} Rooms
                          </div>
                        </TableCell>
                        <TableCell className="py-3">
                          <div className="text-xs text-stone-800 font-medium">{client?.full_name}</div>
                          <div className="text-[11px] text-stone-500 truncate max-w-xs">{proj.location}</div>
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
                                className="h-full bg-[#2A5C45] rounded-full"
                                style={{ width: `${proj.progress_percentage}%` }}
                              />
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="py-3 text-xs font-semibold text-stone-900">
                          {formatINR(proj.total_budget)}
                        </TableCell>
                        <TableCell className="py-3 text-xs text-stone-600">
                          {formatDate(proj.target_handover_date)}
                        </TableCell>
                        <TableCell className="py-3 text-right">
                          <Button
                            size="sm"
                            variant="default"
                            className="h-7 text-xs bg-[#2A5C45] hover:bg-[#234c39] text-white px-2.5"
                            onClick={() => handleSelectProject(proj.id)}
                          >
                            Enter Workspace
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
      {/* 2. PROJECT WORKSPACE (SCREEN 3 & SCREEN 4: ROOM MANAGEMENT) */}
      {/* ========================================================================= */}
      {viewMode === 'workspace' && activeProject && (
        <div className="space-y-6">
          {/* Project Summary Header Card */}
          <Card className="border-stone-200 shadow-none bg-white p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Col 1: Overview */}
              <div className="space-y-1 md:border-r border-stone-200/80 pr-4">
                <span className="text-[10px] text-stone-400 font-mono uppercase tracking-wider block">
                  Project Details
                </span>
                <div className="text-sm font-bold text-stone-900">{activeProject.title}</div>
                <div className="text-xs text-stone-600">{activeProject.location}</div>
                <div className="flex items-center gap-2 pt-1.5">
                  <StatusBadge status={activeProject.status} />
                  <span className="text-xs text-stone-500 font-mono">
                    {activeProject.carpet_area_sqft} sqft
                  </span>
                </div>
              </div>

              {/* Col 2: Client & Contacts */}
              <div className="space-y-1 md:border-r border-stone-200/80 pr-4">
                <span className="text-[10px] text-stone-400 font-mono uppercase tracking-wider block">
                  Client & Team Contacts
                </span>
                <div className="text-xs font-semibold text-stone-900">
                  Client: {activeClient?.full_name || 'Rahul Sharma'}
                </div>
                <div className="text-[11px] text-stone-500">
                  Phone: {activeClient?.phone}
                </div>
                <div className="text-[11px] text-stone-600 pt-1">
                  Lead Designer: <strong>{activeDesigner?.full_name || 'Arjun Mehta'}</strong>
                </div>
                <div className="text-[11px] text-stone-600">
                  Site Manager: <strong>{activeSiteManager?.full_name || 'Suresh Rao'}</strong>
                </div>
              </div>

              {/* Col 3: Financial & Deadlines */}
              <div className="space-y-1 md:border-r border-stone-200/80 pr-4">
                <span className="text-[10px] text-stone-400 font-mono uppercase tracking-wider block">
                  Timeline & Commercials
                </span>
                <div className="text-xs text-stone-600">
                  Contract Budget: <strong className="text-stone-900">{formatINR(activeProject.total_budget)}</strong>
                </div>
                <div className="text-xs text-stone-600">
                  Estimated Start: {formatDate(activeProject.estimated_start_date)}
                </div>
                <div className="text-xs text-stone-600">
                  Target Handover: <strong className="text-stone-900">{formatDate(activeProject.target_handover_date)}</strong>
                </div>
                <div className="text-[11px] text-[#2A5C45] font-medium pt-0.5">
                  Handover on schedule
                </div>
              </div>

              {/* Col 4: Overall Progress */}
              <div className="space-y-1.5 flex flex-col justify-center">
                <span className="text-[10px] text-stone-400 font-mono uppercase tracking-wider block">
                  Site Progress Meter
                </span>
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-bold text-stone-900">
                    {activeProject.progress_percentage}%
                  </span>
                  <span className="text-xs text-stone-500">Overall Completion</span>
                </div>
                <div className="h-2 w-full bg-stone-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#2A5C45] rounded-full transition-all duration-300"
                    style={{ width: `${activeProject.progress_percentage}%` }}
                  />
                </div>
                <div className="text-[10px] text-stone-400">
                  Calculated from room-level stage completions
                </div>
              </div>
            </div>
          </Card>

          {/* Workspace Tabs Navigation */}
          <div className="flex items-center gap-1 border-b border-stone-200">
            <button
              onClick={() => setWorkspaceTab('rooms')}
              className={`px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
                workspaceTab === 'rooms'
                  ? 'border-[#2A5C45] text-[#2A5C45]'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              Rooms & Specifications ({projectRooms.length})
            </button>
            <button
              onClick={() => setWorkspaceTab('designs')}
              className={`px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
                workspaceTab === 'designs'
                  ? 'border-[#2A5C45] text-[#2A5C45]'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              Designs & CAD ({projectDesigns.length})
            </button>
            <button
              onClick={() => setWorkspaceTab('materials')}
              className={`px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
                workspaceTab === 'materials'
                  ? 'border-[#2A5C45] text-[#2A5C45]'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              Materials & Procurement ({projectMaterials.length})
            </button>
            <button
              onClick={() => setWorkspaceTab('execution')}
              className={`px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
                workspaceTab === 'execution'
                  ? 'border-[#2A5C45] text-[#2A5C45]'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              Tasks & Issues ({projectTasks.length + projectIssues.length})
            </button>
            <button
              onClick={() => setWorkspaceTab('schedule')}
              className={`px-3 py-2 text-xs font-medium border-b-2 transition-colors ${
                workspaceTab === 'schedule'
                  ? 'border-[#2A5C45] text-[#2A5C45]'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              Milestone Schedule
            </button>
          </div>

          {/* ========================================================================= */}
          {/* TAB 1: ROOM BREAKDOWN & MANAGEMENT (SCREEN 4) */}
          {/* ========================================================================= */}
          {workspaceTab === 'rooms' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-semibold text-stone-900">
                    Room-by-Room Schedule & Stage Tracking
                  </h2>
                  <p className="text-xs text-stone-500">
                    Define room areas, specifications, and live execution progress. Changes reactively update overall project health.
                  </p>
                </div>
                <Button
                  size="sm"
                  className="bg-[#2A5C45] hover:bg-[#234c39] text-white text-xs"
                  onClick={openAddRoom}
                >
                  <Plus className="h-3.5 w-3.5 mr-1" />
                  Add Room
                </Button>
              </div>

              {/* Room Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {projectRooms.map((room) => {
                  const roomDesigns = designVersions.filter((d) => d.room_id === room.id);
                  const roomMaterials = materials.filter((m) => m.room_id === room.id);
                  const roomTasks = tasks.filter((t) => t.room_id === room.id);
                  const roomIssues = issues.filter((i) => i.room_id === room.id);

                  return (
                    <Card key={room.id} className="border-stone-200 shadow-none hover:border-stone-300 transition-colors">
                      <CardHeader className="py-3 px-4 border-b border-stone-100 flex flex-row items-start justify-between">
                        <div>
                          <div className="flex items-center gap-2">
                            <CardTitle className="text-sm font-bold text-stone-900">
                              {room.name}
                            </CardTitle>
                            <Badge variant="outline" className="text-[10px] text-stone-500">
                              {room.floor}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-3 text-[11px] text-stone-500 mt-1 font-mono">
                            <span>📐 {room.dimensions || 'N/A'}</span>
                            <span>•</span>
                            <span>{room.area_sqft} sqft</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <StatusBadge status={room.status} />
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-7 w-7 p-0 text-stone-400 hover:text-stone-800"
                            onClick={() => openEditRoom(room)}
                            title="Edit Room Details"
                          >
                            <Edit className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </CardHeader>

                      <CardContent className="p-4 space-y-3">
                        {/* Progress meter */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-stone-500">Execution Progress</span>
                            <span className="font-semibold text-stone-900">
                              {room.progress_percentage || 0}%
                            </span>
                          </div>
                          <div className="h-1.5 w-full bg-stone-100 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#2A5C45] rounded-full transition-all"
                              style={{ width: `${room.progress_percentage || 0}%` }}
                            />
                          </div>
                        </div>

                        {/* Specifications note */}
                        <div className="bg-stone-50 p-2.5 rounded border border-stone-100 text-xs text-stone-700">
                          <span className="text-[10px] uppercase font-mono font-semibold text-stone-400 block mb-0.5">
                            Specifications & Finishes
                          </span>
                          <p className="line-clamp-2 text-[11px] leading-relaxed">
                            {room.specifications || 'No specific specifications entered yet. Click edit to add notes.'}
                          </p>
                        </div>

                        {/* Linked Artifacts Badges & Shortcuts */}
                        <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => navigate('/team/designs')}
                              className="text-[10px] bg-stone-100 hover:bg-stone-200 text-stone-700 px-2 py-0.5 rounded flex items-center gap-1 transition-colors"
                              title="View related drawings"
                            >
                              <Layers className="h-2.5 w-2.5" />
                              {roomDesigns.length} Renders
                            </button>
                            <button
                              onClick={() => navigate('/team/materials')}
                              className="text-[10px] bg-stone-100 hover:bg-stone-200 text-stone-700 px-2 py-0.5 rounded flex items-center gap-1 transition-colors"
                              title="View related materials"
                            >
                              <Package className="h-2.5 w-2.5" />
                              {roomMaterials.length} BOQ Items
                            </button>
                            <button
                              onClick={() => navigate('/team/tasks')}
                              className="text-[10px] bg-stone-100 hover:bg-stone-200 text-stone-700 px-2 py-0.5 rounded flex items-center gap-1 transition-colors"
                              title="View trade tasks"
                            >
                              <CheckCircle2 className="h-2.5 w-2.5" />
                              {roomTasks.length} Tasks
                            </button>
                          </div>

                          <Button
                            size="sm"
                            variant="link"
                            className="h-auto p-0 text-xs text-[#2A5C45]"
                            onClick={() => openEditRoom(room)}
                          >
                            Update Progress →
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 2: DESIGNS & CAD IN WORKSPACE */}
          {/* ========================================================================= */}
          {workspaceTab === 'designs' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-semibold text-stone-900">
                    Design Deliverables for {activeProject.title}
                  </h2>
                  <p className="text-xs text-stone-500">
                    CAD drawings, 3D renders, and client sign-off versions.
                  </p>
                </div>
                <Button
                  size="sm"
                  className="bg-[#2A5C45] hover:bg-[#234c39] text-white text-xs"
                  onClick={() => navigate('/team/designs')}
                >
                  <Layers className="h-3.5 w-3.5 mr-1" />
                  Open Full Design Studio
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {projectDesigns.map((d) => {
                  const room = rooms.find((r) => r.id === d.room_id);
                  return (
                    <Card key={d.id} className="border-stone-200 shadow-none overflow-hidden">
                      <div className="h-32 bg-stone-100 relative overflow-hidden">
                        {d.preview_url ? (
                          <img
                            src={d.preview_url}
                            alt={d.title}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-stone-400">
                            <Layers className="h-8 w-8" />
                          </div>
                        )}
                        <span className="absolute top-2 right-2 bg-stone-900/80 text-white text-[10px] font-mono px-1.5 py-0.5 rounded">
                          {d.version_number}
                        </span>
                      </div>
                      <div className="p-3 space-y-1.5">
                        <div className="flex items-start justify-between gap-1">
                          <span className="text-xs font-semibold text-stone-900 leading-snug">
                            {d.title}
                          </span>
                          <StatusBadge status={d.status} />
                        </div>
                        <div className="text-[11px] text-stone-500">{room?.name}</div>
                        <p className="text-[11px] text-stone-600 line-clamp-2">{d.description}</p>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 3: MATERIALS & PROCUREMENT IN WORKSPACE */}
          {/* ========================================================================= */}
          {workspaceTab === 'materials' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-sm font-semibold text-stone-900">
                    Project BOQ & Procurement Status
                  </h2>
                  <p className="text-xs text-stone-500">
                    Finishes and fittings linked to this property.
                  </p>
                </div>
                <Button
                  size="sm"
                  className="bg-[#2A5C45] hover:bg-[#234c39] text-white text-xs"
                  onClick={() => navigate('/team/materials')}
                >
                  <Package className="h-3.5 w-3.5 mr-1" />
                  Open Material BOQ Master
                </Button>
              </div>

              <Card className="border-stone-200 shadow-none overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-stone-50/70 border-b border-stone-200 text-[11px]">
                      <TableHead className="py-2.5">Item Code</TableHead>
                      <TableHead className="py-2.5">Material & Spec</TableHead>
                      <TableHead className="py-2.5">Room</TableHead>
                      <TableHead className="py-2.5">Quantity</TableHead>
                      <TableHead className="py-2.5">Rate</TableHead>
                      <TableHead className="py-2.5">Client Status</TableHead>
                      <TableHead className="py-2.5">Delivery</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {projectMaterials.map((mat) => {
                      const room = rooms.find((r) => r.id === mat.room_id);
                      return (
                        <TableRow key={mat.id} className="text-xs border-b border-stone-100">
                          <TableCell className="font-mono text-stone-600 text-[11px]">
                            {mat.item_code}
                          </TableCell>
                          <TableCell>
                            <div className="font-medium text-stone-900">{mat.name}</div>
                            <div className="text-[10px] text-stone-500">{mat.brand_spec}</div>
                          </TableCell>
                          <TableCell className="text-stone-600">{room?.name || 'General'}</TableCell>
                          <TableCell className="font-medium text-stone-800">
                            {mat.quantity} {mat.unit}
                          </TableCell>
                          <TableCell className="text-stone-900 font-semibold">
                            {formatINR(mat.actual_rate || mat.estimated_rate)}
                          </TableCell>
                          <TableCell>
                            <StatusBadge status={mat.selection_status || mat.approval_status} />
                          </TableCell>
                          <TableCell>
                            <StatusBadge status={mat.procurement_status} />
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </Card>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 4: EXECUTION & SNAGS IN WORKSPACE */}
          {/* ========================================================================= */}
          {workspaceTab === 'execution' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Active Tasks */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-semibold text-stone-900 uppercase tracking-wider">
                    Site Tasks ({projectTasks.length})
                  </h3>
                  <Button
                    size="sm"
                    variant="link"
                    className="h-auto p-0 text-xs text-[#2A5C45]"
                    onClick={() => navigate('/team/tasks')}
                  >
                    View All Tasks →
                  </Button>
                </div>
                <div className="divide-y divide-stone-100 border border-stone-200 rounded-lg bg-white overflow-hidden">
                  {projectTasks.map((t) => (
                    <div key={t.id} className="p-3 text-xs space-y-1 hover:bg-stone-50/50">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-stone-900">{t.title}</span>
                        <StatusBadge status={t.status} />
                      </div>
                      <div className="text-[11px] text-stone-500 flex justify-between">
                        <span>Due: {formatDate(t.due_date)}</span>
                        <span>{t.progress_percent}% done</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Open Snags */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-semibold text-stone-900 uppercase tracking-wider">
                    Open Defect Snags ({projectIssues.length})
                  </h3>
                  <Button
                    size="sm"
                    variant="link"
                    className="h-auto p-0 text-xs text-rose-600"
                    onClick={() => navigate('/team/issues')}
                  >
                    Open Snag Tracker →
                  </Button>
                </div>
                <div className="divide-y divide-stone-100 border border-stone-200 rounded-lg bg-white overflow-hidden">
                  {projectIssues.length === 0 ? (
                    <div className="p-4 text-center text-xs text-stone-500">
                      No unresolved snags logged for this project.
                    </div>
                  ) : (
                    projectIssues.map((iss) => (
                      <div key={iss.id} className="p-3 text-xs space-y-1 hover:bg-stone-50/50">
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[11px] font-semibold text-rose-700">
                            {iss.issue_code}
                          </span>
                          <StatusBadge status={iss.severity} />
                        </div>
                        <div className="font-medium text-stone-900">{iss.title}</div>
                        <div className="text-[11px] text-stone-500">{iss.description}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ========================================================================= */}
          {/* TAB 5: MILESTONE SCHEDULE IN WORKSPACE */}
          {/* ========================================================================= */}
          {workspaceTab === 'schedule' && (
            <div className="space-y-4">
              <h2 className="text-sm font-semibold text-stone-900">
                Turnkey Stage Milestones & Possession Handover
              </h2>
              <div className="space-y-3">
                <div className="p-3 rounded border border-stone-200 bg-stone-50/50 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-stone-900">Stage 1: Booking & Concept Sign-off</span>
                    <span className="text-stone-500 block text-[11px]">Agreement signed, concept renders approved</span>
                  </div>
                  <Badge className="bg-emerald-100 text-emerald-800 border-none">Completed</Badge>
                </div>
                <div className="p-3 rounded border border-stone-200 bg-stone-50/50 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-stone-900">Stage 2: Civil & False Ceiling Handover</span>
                    <span className="text-stone-500 block text-[11px]">Masonry, electrical conduits, gypsum ceiling complete</span>
                  </div>
                  <Badge className="bg-emerald-100 text-emerald-800 border-none">Completed</Badge>
                </div>
                <div className="p-3 rounded border border-amber-200 bg-amber-50/40 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-amber-900">Stage 3: Modular Carcass & Factory Assembly</span>
                    <span className="text-amber-700 block text-[11px]">On-site assembly, wardrobe frames, drawer runners</span>
                  </div>
                  <Badge className="bg-amber-100 text-amber-800 border-none">In Execution</Badge>
                </div>
                <div className="p-3 rounded border border-stone-200 bg-white flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-stone-800">Stage 4: Countertops, Painting & Fixtures</span>
                    <span className="text-stone-500 block text-[11px]">Quartz installation, final coat paint, electrical fittings</span>
                  </div>
                  <Badge variant="outline" className="text-stone-500">Scheduled</Badge>
                </div>
                <div className="p-3 rounded border border-stone-200 bg-white flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-stone-800">Stage 5: Final Snag Resolution & Key Handover</span>
                    <span className="text-stone-500 block text-[11px]">Client walkthrough snag closure & possession</span>
                  </div>
                  <Badge variant="outline" className="text-stone-500">Scheduled (Target: {formatDate(activeProject.target_handover_date)})</Badge>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* DIALOG: ADD ROOM */}
      {/* ========================================================================= */}
      <Dialog open={isAddRoomOpen} onOpenChange={setIsAddRoomOpen}>
        <DialogContent className="max-w-md">
          <form onSubmit={handleCreateRoom}>
            <DialogHeader>
              <DialogTitle className="text-base font-bold text-stone-900">
                Add Room to Schedule
              </DialogTitle>
              <DialogDescription className="text-xs text-stone-500">
                Enter architectural dimensions and initial specifications for this room.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-3">
              <div>
                <Label className="text-xs font-semibold text-stone-700">Room Name *</Label>
                <Input
                  required
                  placeholder="e.g. Master Bedroom, Pooja Room, Balcony Lounge"
                  value={roomFormData.name}
                  onChange={(e) => setRoomFormData({ ...roomFormData, name: e.target.value })}
                  className="h-8 text-xs mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs font-semibold text-stone-700">Floor Level</Label>
                  <Input
                    value={roomFormData.floor}
                    onChange={(e) => setRoomFormData({ ...roomFormData, floor: e.target.value })}
                    className="h-8 text-xs mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold text-stone-700">Dimensions</Label>
                  <Input
                    placeholder="e.g. 16 ft x 14 ft"
                    value={roomFormData.dimensions}
                    onChange={(e) => setRoomFormData({ ...roomFormData, dimensions: e.target.value })}
                    className="h-8 text-xs mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs font-semibold text-stone-700">Area (sqft)</Label>
                  <Input
                    type="number"
                    value={roomFormData.area_sqft}
                    onChange={(e) => setRoomFormData({ ...roomFormData, area_sqft: Number(e.target.value) })}
                    className="h-8 text-xs mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold text-stone-700">Initial Stage</Label>
                  <select
                    value={roomFormData.status}
                    onChange={(e) => setRoomFormData({ ...roomFormData, status: e.target.value as Room['status'] })}
                    className="h-8 text-xs border border-stone-200 rounded-md px-2 bg-white text-stone-800 w-full mt-1"
                  >
                    <option value="pending">Pending</option>
                    <option value="in_design">In Design</option>
                    <option value="client_review">Client Review</option>
                    <option value="approved">Approved</option>
                    <option value="in_execution">In Execution</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              <div>
                <Label className="text-xs font-semibold text-stone-700">Specifications & Finish Notes</Label>
                <Textarea
                  placeholder="Flooring details, false ceiling notes, millwork finish specifications..."
                  value={roomFormData.specifications}
                  onChange={(e) => setRoomFormData({ ...roomFormData, specifications: e.target.value })}
                  className="text-xs mt-1 resize-none h-20"
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsAddRoomOpen(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                className="bg-[#2A5C45] hover:bg-[#234c39] text-white text-xs"
              >
                Create Room
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ========================================================================= */}
      {/* DIALOG: EDIT ROOM & PROGRESS SLIDER */}
      {/* ========================================================================= */}
      <Dialog open={isEditRoomOpen} onOpenChange={setIsEditRoomOpen}>
        <DialogContent className="max-w-md">
          <form onSubmit={handleUpdateRoom}>
            <DialogHeader>
              <DialogTitle className="text-base font-bold text-stone-900">
                Edit Room & Stage Progress
              </DialogTitle>
              <DialogDescription className="text-xs text-stone-500">
                Updating stage progress here automatically recalculates the project's overall completion percentage.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-3">
              <div>
                <Label className="text-xs font-semibold text-stone-700">Room Name</Label>
                <Input
                  required
                  value={roomFormData.name}
                  onChange={(e) => setRoomFormData({ ...roomFormData, name: e.target.value })}
                  className="h-8 text-xs mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs font-semibold text-stone-700">Dimensions</Label>
                  <Input
                    value={roomFormData.dimensions}
                    onChange={(e) => setRoomFormData({ ...roomFormData, dimensions: e.target.value })}
                    className="h-8 text-xs mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold text-stone-700">Execution Stage</Label>
                  <select
                    value={roomFormData.status}
                    onChange={(e) => setRoomFormData({ ...roomFormData, status: e.target.value as Room['status'] })}
                    className="h-8 text-xs border border-stone-200 rounded-md px-2 bg-white text-stone-800 w-full mt-1"
                  >
                    <option value="pending">Pending</option>
                    <option value="in_design">In Design</option>
                    <option value="client_review">Client Review</option>
                    <option value="approved">Approved</option>
                    <option value="in_execution">In Execution</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              {/* Progress Slider */}
              <div className="space-y-1.5 p-3 rounded bg-stone-50 border border-stone-200">
                <div className="flex justify-between items-center text-xs">
                  <Label className="font-semibold text-stone-800">
                    Room Completion: {roomFormData.progress_percentage}%
                  </Label>
                  <span className="text-[11px] text-stone-500">
                    {roomFormData.progress_percentage === 100
                      ? 'Handover Ready'
                      : roomFormData.progress_percentage > 50
                      ? 'Fitout in progress'
                      : 'Early roughing'}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={roomFormData.progress_percentage}
                  onChange={(e) => setRoomFormData({ ...roomFormData, progress_percentage: Number(e.target.value) })}
                  className="w-full accent-[#2A5C45] cursor-pointer"
                />
              </div>

              <div>
                <Label className="text-xs font-semibold text-stone-700">Specifications & Finish Notes</Label>
                <Textarea
                  value={roomFormData.specifications}
                  onChange={(e) => setRoomFormData({ ...roomFormData, specifications: e.target.value })}
                  className="text-xs mt-1 resize-none h-20"
                />
              </div>
            </div>

            <DialogFooter className="flex items-center justify-between">
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => {
                  if (selectedRoom && confirm(`Are you sure you want to remove ${selectedRoom.name}?`)) {
                    deleteRoom(selectedRoom.id);
                    setIsEditRoomOpen(false);
                  }
                }}
                className="text-xs mr-auto"
              >
                Delete Room
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditRoomOpen(false)}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="bg-[#2A5C45] hover:bg-[#234c39] text-white text-xs"
                >
                  Save Changes
                </Button>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
