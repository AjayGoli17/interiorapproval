import React, { useState } from 'react';
import {
  CalendarCheck,
  Plus,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Search,
  Filter,
  CheckSquare,
  AlertOctagon,
  Calendar,
  Layers,
  Edit,
  Trash2,
  Lock,
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
import { Task } from '@/types';

export function TeamTasksPage() {
  const {
    projects,
    currentProjectId,
    setCurrentProject,
    rooms,
    tasks,
    addTask,
    updateTask,
    deleteTask,
  } = useDemoStore();

  const activeProject = projects.find((p) => p.id === currentProjectId) || projects[0];
  const todayStr = new Date().toISOString().split('T')[0];

  // Filters
  const [tradeFilter, setTradeFilter] = useState('all');
  const [roomFilter, setRoomFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Dialog States
  const [isAddTaskOpen, setIsAddTaskOpen] = useState(false);
  const [isEditTaskOpen, setIsEditTaskOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  // Form State: Add / Edit
  const [taskFormData, setTaskFormData] = useState({
    title: '',
    room_id: '',
    category: 'carpentry' as Task['category'],
    start_date: todayStr,
    due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    priority: 'medium' as Task['priority'],
    status: 'todo' as Task['status'],
    progress_percent: 0,
    blocker_notes: '',
    dependencies: '',
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const projectRooms = rooms.filter((r) => r.project_id === activeProject?.id);
  const projectTasks = tasks.filter((t) => t.project_id === activeProject?.id);

  const filteredTasks = projectTasks.filter((t) => {
    const matchesTrade = tradeFilter === 'all' || t.category === tradeFilter;
    const matchesRoom = roomFilter === 'all' || t.room_id === roomFilter;
    const matchesStatus = statusFilter === 'all' || t.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || t.priority === priorityFilter;
    const matchesSearch =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.blocker_notes || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTrade && matchesRoom && matchesStatus && matchesPriority && matchesSearch;
  });

  // KPI Metrics
  const totalTasks = projectTasks.length;
  const completedTasks = projectTasks.filter((t) => t.status === 'completed').length;
  const inProgressTasks = projectTasks.filter((t) => t.status === 'in_progress').length;
  const overdueTasks = projectTasks.filter(
    (t) => t.status !== 'completed' && t.due_date && t.due_date < todayStr
  ).length;

  const handleToggleTask = (task: Task) => {
    const isNowCompleted = task.status !== 'completed';
    updateTask(task.id, {
      status: isNowCompleted ? 'completed' : 'in_progress',
      progress_percent: isNowCompleted ? 100 : 50,
    });
    showToast(isNowCompleted ? `Task "${task.title}" marked completed!` : `Task "${task.title}" set to in progress.`);
  };

  const handleOpenAdd = () => {
    setTaskFormData({
      title: '',
      room_id: projectRooms[0]?.id || '',
      category: 'carpentry',
      start_date: todayStr,
      due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      priority: 'medium',
      status: 'todo',
      progress_percent: 0,
      blocker_notes: '',
      dependencies: '',
    });
    setIsAddTaskOpen(true);
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!taskFormData.title || !activeProject) return;

    addTask({
      project_id: activeProject.id,
      room_id: taskFormData.room_id || projectRooms[0]?.id || '',
      title: taskFormData.title,
      category: taskFormData.category,
      start_date: taskFormData.start_date,
      due_date: taskFormData.due_date,
      priority: taskFormData.priority,
      status: taskFormData.status,
      progress_percent: Number(taskFormData.progress_percent) || 0,
      blocker_notes: taskFormData.blocker_notes,
      dependencies: taskFormData.dependencies,
    });

    setIsAddTaskOpen(false);
    showToast(`Task "${taskFormData.title}" created.`);
  };

  const handleOpenEdit = (task: Task) => {
    setSelectedTask(task);
    setTaskFormData({
      title: task.title,
      room_id: task.room_id || '',
      category: task.category,
      start_date: task.start_date || todayStr,
      due_date: task.due_date || todayStr,
      priority: task.priority,
      status: task.status,
      progress_percent: task.progress_percent,
      blocker_notes: task.blocker_notes || '',
      dependencies: task.dependencies || '',
    });
    setIsEditTaskOpen(true);
  };

  const handleUpdateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTask) return;

    updateTask(selectedTask.id, {
      title: taskFormData.title,
      room_id: taskFormData.room_id,
      category: taskFormData.category,
      start_date: taskFormData.start_date,
      due_date: taskFormData.due_date,
      priority: taskFormData.priority,
      status: taskFormData.status,
      progress_percent: Number(taskFormData.progress_percent),
      blocker_notes: taskFormData.blocker_notes,
      dependencies: taskFormData.dependencies,
    });

    setIsEditTaskOpen(false);
    setSelectedTask(null);
    showToast(`Task "${taskFormData.title}" updated.`);
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
              Trade Execution Tasks & Schedule
            </h1>
            <Badge variant="outline" className="text-xs bg-stone-100 text-stone-700">
              {filteredTasks.length} Tasks
            </Badge>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Site task schedule across Civil, Electrical, False Ceiling, Flooring, Modular Carpentry, and Painting.
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
            onClick={handleOpenAdd}
          >
            <Plus className="h-3.5 w-3.5 mr-1" />
            New Site Task
          </Button>
        </div>
      </div>

      {/* KPI Counters Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="p-3 border-stone-200 shadow-none">
          <span className="text-[10px] text-stone-500 block uppercase font-mono">Total Tasks</span>
          <span className="text-xl font-bold text-stone-900">{totalTasks} Tasks</span>
        </Card>
        <Card className="p-3 border-stone-200 shadow-none">
          <span className="text-[10px] text-stone-500 block uppercase font-mono">In Progress</span>
          <span className="text-xl font-bold text-amber-700">{inProgressTasks} Active</span>
        </Card>
        <Card className="p-3 border-stone-200 shadow-none">
          <span className="text-[10px] text-stone-500 block uppercase font-mono">Overdue</span>
          <span className="text-xl font-bold text-rose-600 flex items-baseline gap-1">
            {overdueTasks}
            {overdueTasks > 0 && <span className="text-xs text-rose-500 font-normal">Need attention</span>}
          </span>
        </Card>
        <Card className="p-3 border-stone-200 shadow-none">
          <span className="text-[10px] text-stone-500 block uppercase font-mono">Completed</span>
          <span className="text-xl font-bold text-emerald-700">{completedTasks} Closed</span>
        </Card>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-lg border border-stone-200">
        <div className="flex items-center gap-2 w-full sm:w-72">
          <Search className="h-4 w-4 text-stone-400" />
          <Input
            placeholder="Search tasks or blockers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-8 text-xs border-stone-200"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
          {/* Trade Filter */}
          <select
            value={tradeFilter}
            onChange={(e) => setTradeFilter(e.target.value)}
            className="h-8 text-xs border border-stone-200 rounded-md px-2 bg-white text-stone-700"
          >
            <option value="all">All Trades</option>
            <option value="civil">Civil & Masonry</option>
            <option value="electrical">Electrical & MEP</option>
            <option value="false_ceiling">False Ceiling</option>
            <option value="flooring">Flooring & Marble</option>
            <option value="carpentry">Modular Carpentry</option>
            <option value="painting">Painting</option>
          </select>

          {/* Room Filter */}
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

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-8 text-xs border border-stone-200 rounded-md px-2 bg-white text-stone-700"
          >
            <option value="all">All Statuses</option>
            <option value="todo">To Do</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="blocked">Blocked</option>
          </select>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="h-8 text-xs border border-stone-200 rounded-md px-2 bg-white text-stone-700"
          >
            <option value="all">All Priorities</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Tasks Table */}
      <Card className="border-stone-200 shadow-none overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-stone-50/70 border-b border-stone-200 text-[11px]">
              <TableHead className="w-10 py-3 text-center">Done</TableHead>
              <TableHead className="py-3 font-semibold text-stone-700">Task Title & Details</TableHead>
              <TableHead className="py-3 font-semibold text-stone-700">Room</TableHead>
              <TableHead className="py-3 font-semibold text-stone-700">Trade</TableHead>
              <TableHead className="py-3 font-semibold text-stone-700">Due Date</TableHead>
              <TableHead className="py-3 font-semibold text-stone-700">Priority</TableHead>
              <TableHead className="py-3 font-semibold text-stone-700">Progress</TableHead>
              <TableHead className="py-3 font-semibold text-stone-700 text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTasks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-xs text-stone-500">
                  No site tasks match the current filter selection.
                </TableCell>
              </TableRow>
            ) : (
              filteredTasks.map((t) => {
                const room = rooms.find((r) => r.id === t.room_id);
                const isOverdue = t.status !== 'completed' && t.due_date && t.due_date < todayStr;
                const isCompleted = t.status === 'completed';

                return (
                  <TableRow
                    key={t.id}
                    className={`hover:bg-stone-50/70 border-b border-stone-100 text-xs ${
                      isCompleted ? 'bg-stone-50/40 text-stone-400' : ''
                    }`}
                  >
                    <TableCell className="py-3 text-center">
                      <button
                        onClick={() => handleToggleTask(t)}
                        className={`h-4 w-4 rounded border mx-auto flex items-center justify-center transition-colors ${
                          isCompleted
                            ? 'bg-[#2A5C45] border-[#2A5C45] text-white'
                            : 'border-stone-300 hover:border-[#2A5C45] text-transparent'
                        }`}
                        title={isCompleted ? 'Mark In Progress' : 'Mark Completed'}
                      >
                        <CheckCircle2 className="h-3.5 w-3.5 fill-current" />
                      </button>
                    </TableCell>

                    <TableCell className="py-3 max-w-sm">
                      <div
                        className={`font-semibold ${
                          isCompleted ? 'line-through text-stone-400' : 'text-stone-900'
                        }`}
                      >
                        {t.title}
                      </div>

                      {/* Blocker Notes / Dependencies */}
                      <div className="flex items-center gap-2 mt-1">
                        {t.blocker_notes && (
                          <span className="text-[10px] text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded font-medium flex items-center gap-1 border border-rose-100">
                            <AlertTriangle className="h-3 w-3" /> Blocker: {t.blocker_notes}
                          </span>
                        )}
                        {t.dependencies && (
                          <span className="text-[10px] text-stone-500 font-mono">
                            Dep: {t.dependencies}
                          </span>
                        )}
                      </div>
                    </TableCell>

                    <TableCell className="py-3 text-stone-600">
                      {room?.name || 'Whole Site'}
                    </TableCell>

                    <TableCell className="py-3">
                      <Badge variant="outline" className="text-[10px] uppercase font-mono text-stone-600">
                        {t.category.replace('_', ' ')}
                      </Badge>
                    </TableCell>

                    <TableCell className="py-3">
                      <span className={isOverdue ? 'text-rose-600 font-semibold' : 'text-stone-600'}>
                        {formatDate(t.due_date)}
                      </span>
                      {isOverdue && (
                        <span className="block text-[10px] text-rose-600 font-bold uppercase tracking-wider">
                          Overdue
                        </span>
                      )}
                    </TableCell>

                    <TableCell className="py-3">
                      <StatusBadge status={t.priority} />
                    </TableCell>

                    <TableCell className="py-3">
                      <div className="w-24 space-y-1">
                        <div className="flex justify-between text-[10px] font-semibold text-stone-700">
                          <span>{t.progress_percent}%</span>
                          <StatusBadge status={t.status} />
                        </div>
                        <div className="h-1.5 w-full bg-stone-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#2A5C45] rounded-full transition-all"
                            style={{ width: `${t.progress_percent}%` }}
                          />
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-7 w-7 p-0 text-stone-500 hover:text-stone-900"
                          onClick={() => handleOpenEdit(t)}
                          title="Edit Task"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </Card>

      {/* ========================================================================= */}
      {/* DIALOG: ADD NEW TASK */}
      {/* ========================================================================= */}
      <Dialog open={isAddTaskOpen} onOpenChange={setIsAddTaskOpen}>
        <DialogContent className="max-w-md">
          <form onSubmit={handleCreateTask}>
            <DialogHeader>
              <DialogTitle className="text-base font-bold text-stone-900">
                Create Site Execution Task
              </DialogTitle>
              <DialogDescription className="text-xs text-stone-500">
                Assign trade task to room schedule with deadlines and dependency constraints.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-3">
              <div>
                <Label className="text-xs font-semibold text-stone-700">Task Title *</Label>
                <Input
                  required
                  placeholder="e.g. Master Bedroom acoustic louver batten anchoring"
                  value={taskFormData.title}
                  onChange={(e) => setTaskFormData({ ...taskFormData, title: e.target.value })}
                  className="h-8 text-xs mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs font-semibold text-stone-700">Room Location</Label>
                  <select
                    value={taskFormData.room_id}
                    onChange={(e) => setTaskFormData({ ...taskFormData, room_id: e.target.value })}
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
                  <Label className="text-xs font-semibold text-stone-700">Trade Category</Label>
                  <select
                    value={taskFormData.category}
                    onChange={(e) => setTaskFormData({ ...taskFormData, category: e.target.value as Task['category'] })}
                    className="h-8 text-xs border border-stone-200 rounded-md px-2 bg-white text-stone-800 w-full mt-1"
                  >
                    <option value="civil">Civil & Masonry</option>
                    <option value="electrical">Electrical & MEP</option>
                    <option value="false_ceiling">False Ceiling</option>
                    <option value="flooring">Flooring & Marble</option>
                    <option value="carpentry">Modular Carpentry</option>
                    <option value="painting">Painting</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs font-semibold text-stone-700">Start Date</Label>
                  <Input
                    type="date"
                    value={taskFormData.start_date}
                    onChange={(e) => setTaskFormData({ ...taskFormData, start_date: e.target.value })}
                    className="h-8 text-xs mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold text-stone-700">Due Date</Label>
                  <Input
                    type="date"
                    value={taskFormData.due_date}
                    onChange={(e) => setTaskFormData({ ...taskFormData, due_date: e.target.value })}
                    className="h-8 text-xs mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs font-semibold text-stone-700">Priority Level</Label>
                  <select
                    value={taskFormData.priority}
                    onChange={(e) => setTaskFormData({ ...taskFormData, priority: e.target.value as Task['priority'] })}
                    className="h-8 text-xs border border-stone-200 rounded-md px-2 bg-white text-stone-800 w-full mt-1"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
                <div>
                  <Label className="text-xs font-semibold text-stone-700">Status</Label>
                  <select
                    value={taskFormData.status}
                    onChange={(e) => setTaskFormData({ ...taskFormData, status: e.target.value as Task['status'] })}
                    className="h-8 text-xs border border-stone-200 rounded-md px-2 bg-white text-stone-800 w-full mt-1"
                  >
                    <option value="todo">To Do</option>
                    <option value="in_progress">In Progress</option>
                    <option value="blocked">Blocked</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              <div>
                <Label className="text-xs font-semibold text-stone-700">Dependencies (Optional)</Label>
                <Input
                  placeholder="e.g. After marble slurry cleanup & primer coat"
                  value={taskFormData.dependencies}
                  onChange={(e) => setTaskFormData({ ...taskFormData, dependencies: e.target.value })}
                  className="h-8 text-xs mt-1"
                />
              </div>

              <div>
                <Label className="text-xs font-semibold text-stone-700">Blocker Notes (Optional)</Label>
                <Input
                  placeholder="e.g. Awaiting client decision on change request CR-002"
                  value={taskFormData.blocker_notes}
                  onChange={(e) => setTaskFormData({ ...taskFormData, blocker_notes: e.target.value })}
                  className="h-8 text-xs mt-1 text-rose-700"
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsAddTaskOpen(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                className="bg-[#2A5C45] hover:bg-[#234c39] text-white text-xs"
              >
                Create Task
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ========================================================================= */}
      {/* DIALOG: EDIT TASK & PROGRESS SLIDER */}
      {/* ========================================================================= */}
      <Dialog open={isEditTaskOpen} onOpenChange={setIsEditTaskOpen}>
        <DialogContent className="max-w-md">
          <form onSubmit={handleUpdateTask}>
            <DialogHeader>
              <DialogTitle className="text-base font-bold text-stone-900">
                Update Task Execution
              </DialogTitle>
              <DialogDescription className="text-xs text-stone-500">
                Adjust progress percentage, resolve blockers, or update schedule.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-3">
              <div>
                <Label className="text-xs font-semibold text-stone-700">Task Title</Label>
                <Input
                  required
                  value={taskFormData.title}
                  onChange={(e) => setTaskFormData({ ...taskFormData, title: e.target.value })}
                  className="h-8 text-xs mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs font-semibold text-stone-700">Trade Category</Label>
                  <select
                    value={taskFormData.category}
                    onChange={(e) => setTaskFormData({ ...taskFormData, category: e.target.value as Task['category'] })}
                    className="h-8 text-xs border border-stone-200 rounded-md px-2 bg-white text-stone-800 w-full mt-1"
                  >
                    <option value="civil">Civil & Masonry</option>
                    <option value="electrical">Electrical & MEP</option>
                    <option value="false_ceiling">False Ceiling</option>
                    <option value="flooring">Flooring & Marble</option>
                    <option value="carpentry">Modular Carpentry</option>
                    <option value="painting">Painting</option>
                  </select>
                </div>
                <div>
                  <Label className="text-xs font-semibold text-stone-700">Status</Label>
                  <select
                    value={taskFormData.status}
                    onChange={(e) => {
                      const newStatus = e.target.value as Task['status'];
                      const newProgress = newStatus === 'completed' ? 100 : newStatus === 'todo' ? 0 : taskFormData.progress_percent;
                      setTaskFormData({ ...taskFormData, status: newStatus, progress_percent: newProgress });
                    }}
                    className="h-8 text-xs border border-stone-200 rounded-md px-2 bg-white text-stone-800 w-full mt-1"
                  >
                    <option value="todo">To Do</option>
                    <option value="in_progress">In Progress</option>
                    <option value="blocked">Blocked</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>

              {/* Progress Slider */}
              <div className="space-y-1.5 p-3 rounded bg-stone-50 border border-stone-200">
                <div className="flex justify-between items-center text-xs">
                  <Label className="font-semibold text-stone-800">
                    Execution Progress: {taskFormData.progress_percent}%
                  </Label>
                  <span className="text-[11px] text-stone-500">
                    {taskFormData.progress_percent === 100 ? 'Closed' : 'Active'}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={taskFormData.progress_percent}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    const newStatus = val === 100 ? 'completed' : val === 0 ? 'todo' : 'in_progress';
                    setTaskFormData({ ...taskFormData, progress_percent: val, status: newStatus });
                  }}
                  className="w-full accent-[#2A5C45] cursor-pointer"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs font-semibold text-stone-700">Due Date</Label>
                  <Input
                    type="date"
                    value={taskFormData.due_date}
                    onChange={(e) => setTaskFormData({ ...taskFormData, due_date: e.target.value })}
                    className="h-8 text-xs mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold text-stone-700">Priority</Label>
                  <select
                    value={taskFormData.priority}
                    onChange={(e) => setTaskFormData({ ...taskFormData, priority: e.target.value as Task['priority'] })}
                    className="h-8 text-xs border border-stone-200 rounded-md px-2 bg-white text-stone-800 w-full mt-1"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
              </div>

              <div>
                <Label className="text-xs font-semibold text-stone-700">Blocker Notes</Label>
                <Input
                  placeholder="Clear this field to remove blocker status"
                  value={taskFormData.blocker_notes}
                  onChange={(e) => setTaskFormData({ ...taskFormData, blocker_notes: e.target.value })}
                  className="h-8 text-xs mt-1 text-rose-700"
                />
              </div>
            </div>

            <DialogFooter className="flex items-center justify-between">
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => {
                  if (selectedTask && confirm(`Delete task "${selectedTask.title}"?`)) {
                    deleteTask(selectedTask.id);
                    setIsEditTaskOpen(false);
                    showToast('Task deleted.');
                  }
                }}
                className="text-xs mr-auto"
              >
                Delete
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditTaskOpen(false)}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="bg-[#2A5C45] hover:bg-[#234c39] text-white text-xs"
                >
                  Save Task
                </Button>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
