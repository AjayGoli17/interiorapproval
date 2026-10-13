import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FolderKanban,
  Plus,
  Search,
  Filter,
  Edit2,
  ExternalLink,
  Building2,
  Calendar,
  CheckCircle2,
  X,
  UserCheck,
  AlertCircle,
} from 'lucide-react';
import { useDemoStore } from '@/stores/demoStore';
import { Project, ProjectStatus } from '@/types';
import { formatINR, formatDate } from '@/lib/utils';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { EmptyState } from '@/components/shared/EmptyState';
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

export function AdminProjectsPage() {
  const navigate = useNavigate();
  const {
    projects,
    clients,
    teamMembers,
    addProject,
    updateProject,
    setCurrentProject,
  } = useDemoStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Modal State for Create / Edit
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);

  // Form Fields
  const [formData, setFormData] = useState({
    project_code: '',
    title: '',
    client_id: '',
    lead_designer_id: '',
    site_manager_id: '',
    location: '',
    city: 'Hyderabad',
    property_type: '3BHK Apartment',
    carpet_area_sqft: 1800,
    total_budget: 1800000,
    estimated_start_date: new Date().toISOString().split('T')[0],
    target_handover_date: new Date(Date.now() + 90 * 86400000).toISOString().split('T')[0],
    status: 'lead' as ProjectStatus,
    progress_percentage: 10,
    notes: '',
  });
  const [formError, setFormError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Filtering
  const filteredProjects = projects.filter((p) => {
    const client = clients.find((c) => c.id === p.client_id);
    const matchesSearch =
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.project_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (client && client.full_name.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus =
      statusFilter === 'all' || p.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleOpenCreateModal = () => {
    setEditingProject(null);
    const codeNum = projects.length + 1;
    setFormData({
      project_code: `PRJ-HYD-240${codeNum}`,
      title: '',
      client_id: clients[0]?.id || '',
      lead_designer_id: teamMembers.find((m) => m.role === 'designer')?.id || '',
      site_manager_id: teamMembers.find((m) => m.role === 'site_manager')?.id || '',
      location: '',
      city: 'Hyderabad',
      property_type: '3BHK Apartment',
      carpet_area_sqft: 1850,
      total_budget: 1800000,
      estimated_start_date: new Date().toISOString().split('T')[0],
      target_handover_date: new Date(Date.now() + 100 * 86400000).toISOString().split('T')[0],
      status: 'lead',
      progress_percentage: 10,
      notes: '',
    });
    setFormError('');
    setModalOpen(true);
  };

  const handleOpenEditModal = (p: Project, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingProject(p);
    setFormData({
      project_code: p.project_code,
      title: p.title,
      client_id: p.client_id || '',
      lead_designer_id: p.lead_designer_id || '',
      site_manager_id: p.site_manager_id || '',
      location: p.location,
      city: p.city,
      property_type: p.property_type,
      carpet_area_sqft: p.carpet_area_sqft,
      total_budget: p.total_budget,
      estimated_start_date: p.estimated_start_date,
      target_handover_date: p.target_handover_date,
      status: p.status,
      progress_percentage: p.progress_percentage,
      notes: p.notes || '',
    });
    setFormError('');
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      setFormError('Please enter a project title');
      return;
    }
    if (!formData.location.trim()) {
      setFormError('Please enter the site location/address');
      return;
    }
    if (formData.total_budget <= 0) {
      setFormError('Please enter a valid project budget');
      return;
    }

    if (editingProject) {
      updateProject(editingProject.id, formData);
      setSuccessMsg(`Project "${formData.title}" updated successfully.`);
    } else {
      const created = addProject(formData);
      setSuccessMsg(`New project "${created.title}" successfully onboarded!`);
    }

    setModalOpen(false);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleRowClick = (projId: string) => {
    setCurrentProject(projId);
    navigate(`/admin/projects/${projId}`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Projects Management"
        subtitle="Complete master directory of studio interior architecture projects, budgets, assigned leads, and delivery timelines."
        breadcrumbs={[{ label: 'Admin' }, { label: 'Projects' }]}
        actions={
          <Button onClick={handleOpenCreateModal} size="sm" className="text-xs">
            <Plus className="w-3.5 h-3.5 mr-1.5" /> Onboard New Project
          </Button>
        }
      />

      {/* Success notification banner */}
      {successMsg && (
        <div className="p-3 rounded-md bg-[#EAF2ED] border border-[#CDE1D4] text-[#204E38] text-xs flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-[#2A5C45]" />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg('')} className="text-stone-500 hover:text-stone-800">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-lg border border-stone-200">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          <Input
            placeholder="Search by project name, code, client, or location..."
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
              <option value="all">All Stages ({projects.length})</option>
              <option value="lead">Lead / Proposal</option>
              <option value="design_phase">Design Phase</option>
              <option value="procurement">Procurement</option>
              <option value="execution">Site Execution</option>
              <option value="snagging">Snagging / Finishing</option>
              <option value="completed">Handed Over / Completed</option>
              <option value="on_hold">On Hold</option>
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

      {/* Projects Table */}
      {filteredProjects.length === 0 ? (
        <EmptyState
          icon={FolderKanban}
          title="No projects found"
          description={
            searchQuery || statusFilter !== 'all'
              ? 'No projects match your current search and filter criteria. Try resetting the filters.'
              : 'No projects registered in the studio portfolio yet.'
          }
          actionLabel="Onboard New Project"
          onAction={handleOpenCreateModal}
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Project Title</TableHead>
              <TableHead>Client & Property</TableHead>
              <TableHead>Budget</TableHead>
              <TableHead>Start & Handover</TableHead>
              <TableHead>Design & Site Leads</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProjects.map((p) => {
              const client = clients.find((c) => c.id === p.client_id);
              const designer = teamMembers.find((m) => m.id === p.lead_designer_id);
              const siteLead = teamMembers.find((m) => m.id === p.site_manager_id);

              return (
                <TableRow
                  key={p.id}
                  className="cursor-pointer hover:bg-stone-50/70 transition-colors"
                  onClick={() => handleRowClick(p.id)}
                >
                  <TableCell className="font-mono text-xs font-semibold text-stone-700">
                    {p.project_code}
                  </TableCell>
                  <TableCell>
                    <div className="font-medium text-stone-900 text-xs">{p.title}</div>
                    <div className="text-[11px] text-stone-400">{p.property_type} • {p.carpet_area_sqft} sqft</div>
                  </TableCell>
                  <TableCell className="text-xs">
                    <span className="font-medium text-stone-800 block">
                      {client?.full_name || 'Assigned Client'}
                    </span>
                    <span className="text-[11px] text-stone-500 truncate max-w-[200px] block" title={p.location}>
                      {p.location}
                    </span>
                  </TableCell>
                  <TableCell className="font-semibold text-xs text-stone-900 whitespace-nowrap">
                    {formatINR(p.total_budget)}
                  </TableCell>
                  <TableCell className="text-xs text-stone-600 whitespace-nowrap">
                    <div>Start: {formatDate(p.estimated_start_date)}</div>
                    <div className="text-[11px] text-stone-400">Target: {formatDate(p.target_handover_date)}</div>
                  </TableCell>
                  <TableCell className="text-xs">
                    <div className="text-stone-800">
                      <span className="text-stone-400 text-[11px]">Designer: </span>
                      {designer?.full_name || 'Unassigned'}
                    </div>
                    <div className="text-stone-600 text-[11px]">
                      <span className="text-stone-400">Site: </span>
                      {siteLead?.full_name || 'Unassigned'}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-stone-200 h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-[#2A5C45] h-full"
                          style={{ width: `${p.progress_percentage}%` }}
                        />
                      </div>
                      <span className="text-xs font-mono font-medium text-stone-700">
                        {p.progress_percentage}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={p.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1.5" onClick={(e) => e.stopPropagation()}>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => handleOpenEditModal(p, e)}
                        className="h-7 w-7 p-0 text-stone-500 hover:text-stone-800"
                        title="Edit Project Details"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRowClick(p.id)}
                        className="h-7 text-xs px-2 text-[#2A5C45] border-stone-200"
                      >
                        Details
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}

      {/* Create / Edit Project Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogHeader>
          <DialogTitle>
            {editingProject ? `Edit Project: ${editingProject.project_code}` : 'Onboard New Studio Project'}
          </DialogTitle>
          <DialogDescription>
            {editingProject
              ? 'Update project scope, budgets, assigned leadership, and delivery milestones.'
              : 'Create a new turnkey interior project with budget and assigned team members.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {formError && (
            <div className="p-2.5 rounded bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-stone-700 block mb-1">
                Project Code *
              </label>
              <Input
                value={formData.project_code}
                onChange={(e) => setFormData({ ...formData, project_code: e.target.value })}
                required
                className="font-mono text-xs"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-stone-700 block mb-1">
                Project Title *
              </label>
              <Input
                placeholder="e.g. Rahul Sharma — 3BHK Apartment"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-stone-700 block mb-1">
                Associated Client *
              </label>
              <Select
                value={formData.client_id}
                onChange={(e) => setFormData({ ...formData, client_id: e.target.value })}
                className="text-xs"
              >
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.full_name} ({c.email})
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <label className="text-xs font-medium text-stone-700 block mb-1">
                Property Type
              </label>
              <Input
                placeholder="e.g. 3BHK Apartment / 4BHK Villa"
                value={formData.property_type}
                onChange={(e) => setFormData({ ...formData, property_type: e.target.value })}
                className="text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-stone-700 block mb-1">
                Carpet Area (sqft)
              </label>
              <Input
                type="number"
                value={formData.carpet_area_sqft}
                onChange={(e) => setFormData({ ...formData, carpet_area_sqft: Number(e.target.value) })}
                className="text-xs"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-stone-700 block mb-1">
                Total Contract Budget (₹) *
              </label>
              <Input
                type="number"
                step="10000"
                value={formData.total_budget}
                onChange={(e) => setFormData({ ...formData, total_budget: Number(e.target.value) })}
                required
                className="text-xs font-semibold"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-stone-700 block mb-1">
              Location Address *
            </label>
            <Input
              placeholder="e.g. Flat 1204, Tower B, Aparna Sarovar Grande, Nallagandla"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              required
              className="text-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-stone-700 block mb-1">
                Lead Designer
              </label>
              <Select
                value={formData.lead_designer_id}
                onChange={(e) => setFormData({ ...formData, lead_designer_id: e.target.value })}
                className="text-xs"
              >
                <option value="">Select Designer</option>
                {teamMembers
                  .filter((m) => m.role === 'designer' || m.role === 'admin')
                  .map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.full_name} ({m.specialization || m.role})
                    </option>
                  ))}
              </Select>
            </div>
            <div>
              <label className="text-xs font-medium text-stone-700 block mb-1">
                Site Execution Lead
              </label>
              <Select
                value={formData.site_manager_id}
                onChange={(e) => setFormData({ ...formData, site_manager_id: e.target.value })}
                className="text-xs"
              >
                <option value="">Select Site Manager</option>
                {teamMembers
                  .filter((m) => m.role === 'site_manager' || m.role === 'designer')
                  .map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.full_name} ({m.specialization || m.role})
                    </option>
                  ))}
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-medium text-stone-700 block mb-1">
                Estimated Start
              </label>
              <Input
                type="date"
                value={formData.estimated_start_date}
                onChange={(e) => setFormData({ ...formData, estimated_start_date: e.target.value })}
                className="text-xs"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-stone-700 block mb-1">
                Target Handover
              </label>
              <Input
                type="date"
                value={formData.target_handover_date}
                onChange={(e) => setFormData({ ...formData, target_handover_date: e.target.value })}
                className="text-xs"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-stone-700 block mb-1">
                Initial Stage
              </label>
              <Select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as ProjectStatus })}
                className="text-xs"
              >
                <option value="lead">Lead / Proposal</option>
                <option value="design_phase">Design Phase</option>
                <option value="procurement">Procurement</option>
                <option value="execution">Execution</option>
                <option value="snagging">Snagging</option>
                <option value="completed">Completed</option>
              </Select>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-stone-700 block mb-1">
              Project Notes / Scope Specifications
            </label>
            <Textarea
              placeholder="e.g. Turnkey interior transformation with bespoke oak veneer cabinetry, quartz countertops, concealed warm lighting..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="text-xs"
              rows={2}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm">
              {editingProject ? 'Save Changes' : 'Confirm Onboarding'}
            </Button>
          </DialogFooter>
        </form>
      </Dialog>
    </div>
  );
}
