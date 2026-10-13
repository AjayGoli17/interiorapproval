import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Users,
  Plus,
  Search,
  Mail,
  Phone,
  Home,
  Building2,
  Edit2,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  X,
  CreditCard,
} from 'lucide-react';
import { useDemoStore } from '@/stores/demoStore';
import { Client } from '@/types';
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

export function AdminClientsPage() {
  const navigate = useNavigate();
  const {
    clients,
    projects,
    addClient,
    updateClient,
    updateProject,
    setCurrentProject,
  } = useDemoStore();

  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    property_address: '',
    city: 'Hyderabad',
    project_id: '',
    notes: '',
  });

  const [formError, setFormError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Filtering
  const filteredClients = clients.filter((c) => {
    const proj = projects.find((p) => p.id === c.project_id || p.client_id === c.id);
    const search = searchQuery.toLowerCase();
    return (
      c.full_name.toLowerCase().includes(search) ||
      c.email.toLowerCase().includes(search) ||
      c.phone.toLowerCase().includes(search) ||
      c.property_address.toLowerCase().includes(search) ||
      (proj && proj.title.toLowerCase().includes(search))
    );
  });

  const handleOpenAddModal = () => {
    setEditingClient(null);
    setFormData({
      full_name: '',
      email: '',
      phone: '+91 ',
      property_address: '',
      city: 'Hyderabad',
      project_id: projects[0]?.id || '',
      notes: '',
    });
    setFormError('');
    setModalOpen(true);
  };

  const handleOpenEditModal = (c: Client) => {
    setEditingClient(c);
    setFormData({
      full_name: c.full_name,
      email: c.email,
      phone: c.phone,
      property_address: c.property_address,
      city: c.city || 'Hyderabad',
      project_id: c.project_id || '',
      notes: c.notes || '',
    });
    setFormError('');
    setModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.full_name.trim()) {
      setFormError('Please enter the client full name');
      return;
    }
    if (!formData.email.trim() || !formData.email.includes('@')) {
      setFormError('Please enter a valid client email address');
      return;
    }
    if (!formData.property_address.trim()) {
      setFormError('Please specify the client property address');
      return;
    }

    if (editingClient) {
      updateClient(editingClient.id, formData);

      // Link to selected project
      if (formData.project_id) {
        updateProject(formData.project_id, { client_id: editingClient.id });
      }

      setSuccessMsg(`Client profile for "${formData.full_name}" updated.`);
    } else {
      const created = addClient({
        ...formData,
        avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      });

      // Link to selected project
      if (formData.project_id) {
        updateProject(formData.project_id, { client_id: created.id });
      }

      setSuccessMsg(`New client "${created.full_name}" onboarded and linked.`);
    }

    setModalOpen(false);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  const handleNavigateToProject = (projId: string) => {
    setCurrentProject(projId);
    navigate(`/admin/projects/${projId}`);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Client Accounts"
        subtitle="Manage homeowner relationships, contact details, linked apartment projects, and commercial agreements."
        breadcrumbs={[{ label: 'Admin' }, { label: 'Clients' }]}
        actions={
          <Button onClick={handleOpenAddModal} size="sm" className="text-xs">
            <Plus className="w-3.5 h-3.5 mr-1.5" /> Add Client Account
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

      {/* Search Bar */}
      <div className="flex items-center justify-between gap-3 bg-white p-3 rounded-lg border border-stone-200">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          <Input
            placeholder="Search by client name, email, phone, or apartment..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 text-xs h-9"
          />
        </div>

        {searchQuery && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSearchQuery('')}
            className="text-xs h-9 text-stone-500"
          >
            Clear
          </Button>
        )}
      </div>

      {/* Clients Table */}
      {filteredClients.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No client accounts found"
          description="No clients match your search query."
          actionLabel="Add Client Account"
          onAction={handleOpenAddModal}
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client Name</TableHead>
              <TableHead>Contact Channels</TableHead>
              <TableHead>Property / Residence</TableHead>
              <TableHead>Linked Project</TableHead>
              <TableHead>Project Budget</TableHead>
              <TableHead>Delivery Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredClients.map((client) => {
              const linkedProject = projects.find(
                (p) => p.client_id === client.id || p.id === client.project_id
              );

              return (
                <TableRow key={client.id}>
                  <TableCell>
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-stone-100 border border-stone-200 flex items-center justify-center font-semibold text-xs text-stone-700 shrink-0">
                        {client.full_name
                          .split(' ')
                          .map((n) => n[0])
                          .slice(0, 2)
                          .join('')}
                      </div>
                      <div>
                        <span className="font-medium text-stone-900 text-xs block">
                          {client.full_name}
                        </span>
                        <span className="text-[11px] text-stone-400">
                          {client.city || 'Hyderabad'}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-xs text-stone-600">
                    <div className="flex items-center gap-1.5 text-[11px]">
                      <Mail className="w-3 h-3 text-stone-400 shrink-0" />
                      <span>{client.email}</span>
                    </div>
                    {client.phone && (
                      <div className="flex items-center gap-1.5 text-[11px] text-stone-400 mt-0.5">
                        <Phone className="w-3 h-3 shrink-0" />
                        <span>{client.phone}</span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell className="text-xs text-stone-600 max-w-xs">
                    <span className="text-[11px] text-stone-500 line-clamp-1" title={client.property_address}>
                      {client.property_address}
                    </span>
                  </TableCell>
                  <TableCell>
                    {linkedProject ? (
                      <button
                        onClick={() => handleNavigateToProject(linkedProject.id)}
                        className="text-left group"
                      >
                        <span className="font-medium text-stone-800 text-xs group-hover:text-[#2A5C45] flex items-center gap-1">
                          {linkedProject.title}
                          <ExternalLink className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </span>
                        <span className="font-mono text-[10px] text-stone-400 block">
                          {linkedProject.project_code}
                        </span>
                      </button>
                    ) : (
                      <span className="text-[11px] text-stone-400 italic">No project linked</span>
                    )}
                  </TableCell>
                  <TableCell className="text-xs font-semibold text-stone-800">
                    {linkedProject ? formatINR(linkedProject.total_budget) : '—'}
                  </TableCell>
                  <TableCell>
                    {linkedProject ? (
                      <StatusBadge status={linkedProject.status} />
                    ) : (
                      <span className="text-[11px] text-stone-400">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenEditModal(client)}
                        className="h-7 w-7 p-0 text-stone-500 hover:text-stone-800"
                        title="Edit Client"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </Button>
                      {linkedProject && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleNavigateToProject(linkedProject.id)}
                          className="h-7 text-xs px-2 text-[#2A5C45] border-stone-200"
                        >
                          Workspace
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}

      {/* Add / Edit Client Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogHeader>
          <DialogTitle>
            {editingClient ? `Edit Client: ${editingClient.full_name}` : 'Onboard New Client Account'}
          </DialogTitle>
          <DialogDescription>
            Register client credentials, residence address, and connect with their turnkey interior project.
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
                placeholder="e.g. Ramesh Chandra"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                required
                className="text-xs"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-stone-700 block mb-1">
                Email Address *
              </label>
              <Input
                type="email"
                placeholder="ramesh@gmail.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-stone-700 block mb-1">
                Contact Phone
              </label>
              <Input
                placeholder="+91 98490 12345"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="text-xs"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-stone-700 block mb-1">
                City
              </label>
              <Input
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="text-xs"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-stone-700 block mb-1">
              Property / Site Address *
            </label>
            <Input
              placeholder="e.g. Flat 1204, Tower B, Aparna Sarovar Grande, Nallagandla"
              value={formData.property_address}
              onChange={(e) => setFormData({ ...formData, property_address: e.target.value })}
              required
              className="text-xs"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-stone-700 block mb-1">
              Link with Existing Project
            </label>
            <Select
              value={formData.project_id}
              onChange={(e) => setFormData({ ...formData, project_id: e.target.value })}
              className="text-xs"
            >
              <option value="">-- No project linked yet --</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title} ({p.project_code}) — {formatINR(p.total_budget)}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <label className="text-xs font-medium text-stone-700 block mb-1">
              Client Brief / Preference Notes
            </label>
            <Textarea
              placeholder="Specific client requirements, payment terms, or family preferences..."
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
              {editingClient ? 'Save Changes' : 'Confirm Client Account'}
            </Button>
          </DialogFooter>
        </form>
      </Dialog>
    </div>
  );
}
