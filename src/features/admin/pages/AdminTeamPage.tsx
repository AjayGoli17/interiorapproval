import React, { useState } from 'react';
import {
  UserCheck,
  Plus,
  Search,
  Mail,
  Phone,
  Edit2,
  Building2,
  CheckCircle2,
  Briefcase,
  AlertCircle,
  X,
  Shield,
  Layers,
  HardHat,
} from 'lucide-react';
import { useDemoStore } from '@/stores/demoStore';
import { UserProfile, UserRole } from '@/types';
import { PageHeader } from '@/components/shared/PageHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { EmptyState } from '@/components/shared/EmptyState';

export function AdminTeamPage() {
  const {
    teamMembers,
    projects,
    addTeamMember,
    updateTeamMember,
    updateProject,
  } = useDemoStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<UserProfile | null>(null);

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    role: 'designer' as UserRole,
    specialization: '',
    status: 'available' as 'available' | 'busy' | 'on_leave',
    assigned_project_ids: [] as string[],
    avatar_url: '',
  });

  const [formError, setFormError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Filtering
  const filteredMembers = teamMembers.filter((m) => {
    const matchesSearch =
      m.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (m.specialization && m.specialization.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesRole = roleFilter === 'all' || m.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const handleOpenAddModal = () => {
    setEditingMember(null);
    setFormData({
      full_name: '',
      email: '',
      phone: '+91 ',
      role: 'designer',
      specialization: '',
      status: 'available',
      assigned_project_ids: [],
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    });
    setFormError('');
    setModalOpen(true);
  };

  const handleOpenEditModal = (m: UserProfile) => {
    setEditingMember(m);
    setFormData({
      full_name: m.full_name,
      email: m.email,
      phone: m.phone || '',
      role: m.role,
      specialization: m.specialization || '',
      status: m.status || 'available',
      assigned_project_ids: m.assigned_project_ids || [],
      avatar_url: m.avatar_url || '',
    });
    setFormError('');
    setModalOpen(true);
  };

  const toggleProjectAssignment = (projId: string) => {
    setFormData((prev) => {
      const exists = prev.assigned_project_ids.includes(projId);
      const updated = exists
        ? prev.assigned_project_ids.filter((id) => id !== projId)
        : [...prev.assigned_project_ids, projId];
      return { ...prev, assigned_project_ids: updated };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.full_name.trim()) {
      setFormError('Please enter the team member name');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setFormError('Please enter a valid work email address');
      return;
    }

    if (editingMember) {
      updateTeamMember(editingMember.id, formData);

      // Synchronize project leadership assignments
      projects.forEach((p) => {
        const isAssigned = formData.assigned_project_ids.includes(p.id);
        if (isAssigned) {
          if (formData.role === 'designer') {
            updateProject(p.id, { lead_designer_id: editingMember.id });
          } else if (formData.role === 'site_manager') {
            updateProject(p.id, { site_manager_id: editingMember.id });
          }
        }
      });

      setSuccessMsg(`Team member ${formData.full_name} updated successfully.`);
    } else {
      const created = addTeamMember({
        ...formData,
        company_name: 'StudioFlow Interiors',
      });

      // Synchronize assignments
      formData.assigned_project_ids.forEach((pId) => {
        if (formData.role === 'designer') {
          updateProject(pId, { lead_designer_id: created.id });
        } else if (formData.role === 'site_manager') {
          updateProject(pId, { site_manager_id: created.id });
        }
      });

      setSuccessMsg(`Team member ${created.full_name} added to the studio directory.`);
    }

    setModalOpen(false);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Team & Resource Allocation"
        subtitle="Manage interior designers, 3D visualizers, and site managers, workload balancing, and site staffing."
        breadcrumbs={[{ label: 'Admin' }, { label: 'Team' }]}
        actions={
          <Button onClick={handleOpenAddModal} size="sm" className="text-xs">
            <Plus className="w-3.5 h-3.5 mr-1.5" /> Add Team Member
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

      {/* Capacity Allocation Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Card className="p-3.5">
          <div className="flex items-center justify-between text-stone-500 mb-1">
            <span className="text-[11px] uppercase tracking-wider font-medium">Design Department</span>
            <Layers className="w-4 h-4 text-[#2A5C45]" />
          </div>
          <span className="text-xl font-bold text-stone-900 block">
            {teamMembers.filter((m) => m.role === 'designer').length} Designers
          </span>
          <span className="text-xs text-stone-500">
            CAD drafting, 3D visualization & client presentations
          </span>
        </Card>

        <Card className="p-3.5">
          <div className="flex items-center justify-between text-stone-500 mb-1">
            <span className="text-[11px] uppercase tracking-wider font-medium">Site Operations</span>
            <HardHat className="w-4 h-4 text-[#2A5C45]" />
          </div>
          <span className="text-xl font-bold text-stone-900 block">
            {teamMembers.filter((m) => m.role === 'site_manager').length} Site Managers
          </span>
          <span className="text-xs text-stone-500">
            Contractor supervision, daily logs & snag clearance
          </span>
        </Card>

        <Card className="p-3.5">
          <div className="flex items-center justify-between text-stone-500 mb-1">
            <span className="text-[11px] uppercase tracking-wider font-medium">Staffing Status</span>
            <UserCheck className="w-4 h-4 text-[#2A5C45]" />
          </div>
          <span className="text-xl font-bold text-[#204E38] block">
            {teamMembers.filter((m) => m.status === 'available').length} Available
          </span>
          <span className="text-xs text-stone-500">
            {teamMembers.filter((m) => m.status === 'busy').length} currently at full project capacity
          </span>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-lg border border-stone-200">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          <Input
            placeholder="Search by name, email, or skill specialization..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 text-xs h-9"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="w-44">
            <Select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="text-xs h-9"
            >
              <option value="all">All Roles ({teamMembers.length})</option>
              <option value="designer">Interior Designers</option>
              <option value="site_manager">Site Managers</option>
              <option value="admin">Studio Directors / Admin</option>
            </Select>
          </div>

          {(searchQuery || roleFilter !== 'all') && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery('');
                setRoleFilter('all');
              }}
              className="text-xs h-9 text-stone-500"
            >
              Reset
            </Button>
          )}
        </div>
      </div>

      {/* Team Directory Table */}
      {filteredMembers.length === 0 ? (
        <EmptyState
          icon={UserCheck}
          title="No team members found"
          description="No team members match your current filters."
          actionLabel="Add Team Member"
          onAction={handleOpenAddModal}
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Team Member</TableHead>
              <TableHead>Role & Specialization</TableHead>
              <TableHead>Contact Channels</TableHead>
              <TableHead>Assigned Projects</TableHead>
              <TableHead>Availability</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMembers.map((member) => {
              const assigned = projects.filter((p) =>
                (member.assigned_project_ids || []).includes(p.id) ||
                p.lead_designer_id === member.id ||
                p.site_manager_id === member.id
              );

              return (
                <TableRow key={member.id}>
                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      <img
                        src={member.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                        alt={member.full_name}
                        className="w-8 h-8 rounded-full object-cover border border-stone-200 shrink-0"
                      />
                      <div>
                        <span className="font-medium text-stone-900 text-xs block">
                          {member.full_name}
                        </span>
                        <span className="text-[11px] text-stone-400 capitalize">
                          {member.company_name || 'StudioFlow'}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs">
                    <span className="font-semibold text-stone-800 capitalize block">
                      {member.role.replace('_', ' ')}
                    </span>
                    <span className="text-[11px] text-stone-500">
                      {member.specialization || 'Architectural Planning'}
                    </span>
                  </TableCell>
                  <TableCell className="text-xs text-stone-600">
                    <div className="flex items-center gap-1.5 text-[11px]">
                      <Mail className="w-3 h-3 text-stone-400" />
                      <span>{member.email}</span>
                    </div>
                    {member.phone && (
                      <div className="flex items-center gap-1.5 text-[11px] text-stone-400 mt-0.5">
                        <Phone className="w-3 h-3" />
                        <span>{member.phone}</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {assigned.length === 0 ? (
                        <span className="text-[11px] text-stone-400 italic">No sites assigned</span>
                      ) : (
                        assigned.map((p) => (
                          <Badge
                            key={p.id}
                            variant="secondary"
                            className="text-[10px] font-normal border-stone-200"
                            title={p.title}
                          >
                            {p.project_code}
                          </Badge>
                        ))
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={member.status || 'available'} category="team" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenEditModal(member)}
                      className="h-7 text-xs px-2.5 text-stone-600 hover:text-stone-900"
                    >
                      <Edit2 className="w-3 h-3 mr-1" /> Edit Profile
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}

      {/* Add / Edit Team Member Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogHeader>
          <DialogTitle>
            {editingMember ? `Edit Team Member: ${editingMember.full_name}` : 'Add New Team Member'}
          </DialogTitle>
          <DialogDescription>
            Configure role permissions, specialized discipline, and assigned project responsibilities.
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
                Full Name *
              </label>
              <Input
                placeholder="e.g. Meera Krishnan"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                required
                className="text-xs"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-stone-700 block mb-1">
                Studio Role *
              </label>
              <Select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                className="text-xs"
              >
                <option value="designer">Interior Designer</option>
                <option value="site_manager">Site Execution Manager</option>
                <option value="admin">Studio Director / Admin</option>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-stone-700 block mb-1">
                Work Email *
              </label>
              <Input
                type="email"
                placeholder="meera@studioflow.design"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="text-xs"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-stone-700 block mb-1">
                Phone Number
              </label>
              <Input
                placeholder="+91 98490 12345"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-stone-700 block mb-1">
                Specialization / Discipline
              </label>
              <Input
                placeholder="e.g. 3D Lumion Rendering, Civil & MEP, Millwork"
                value={formData.specialization}
                onChange={(e) => setFormData({ ...formData, specialization: e.target.value })}
                className="text-xs"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-stone-700 block mb-1">
                Work Status / Availability
              </label>
              <Select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="text-xs"
              >
                <option value="available">Available (Open for new sites)</option>
                <option value="busy">Busy (Full capacity)</option>
                <option value="on_leave">On Leave</option>
              </Select>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-stone-700 block mb-1">
              Assigned Project Sites
            </label>
            <div className="p-2.5 rounded border border-stone-200 bg-stone-50/50 space-y-1.5 max-h-36 overflow-y-auto">
              {projects.map((p) => {
                const isSelected = formData.assigned_project_ids.includes(p.id);
                return (
                  <label
                    key={p.id}
                    className="flex items-center gap-2 p-1.5 rounded hover:bg-stone-100/70 cursor-pointer text-xs"
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleProjectAssignment(p.id)}
                      className="rounded border-stone-300 text-[#2A5C45] focus:ring-[#2A5C45]"
                    />
                    <span className="font-mono text-stone-500 text-[11px]">{p.project_code}</span>
                    <span className="font-medium text-stone-800 truncate">{p.title}</span>
                  </label>
                );
              })}
            </div>
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
              {editingMember ? 'Save Changes' : 'Confirm Team Member'}
            </Button>
          </DialogFooter>
        </form>
      </Dialog>
    </div>
  );
}
