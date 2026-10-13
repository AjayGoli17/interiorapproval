import React, { useState } from 'react';
import {
  Receipt,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  DollarSign,
  Calendar,
  Wallet,
  Building2,
  Tag,
  CreditCard,
} from 'lucide-react';
import { useDemoStore } from '@/stores/demoStore';
import { formatINR, formatDate } from '@/lib/utils';
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
import { Expense } from '@/types';

export function TeamExpensesPage() {
  const {
    projects,
    currentProjectId,
    setCurrentProject,
    rooms,
    expenses,
    addExpense,
    updateExpense,
  } = useDemoStore();

  const activeProject = projects.find((p) => p.id === currentProjectId) || projects[0];
  const todayStr = new Date().toISOString().split('T')[0];

  // Filters
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    room_id: '',
    category: 'material_local' as Expense['category'],
    amount: 5000,
    payment_mode: 'upi' as Expense['payment_mode'],
    paid_to: '',
    incurred_on: todayStr,
    notes: '',
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const projectRooms = rooms.filter((r) => r.project_id === activeProject?.id);
  const projectExpenses = expenses.filter((e) => e.project_id === activeProject?.id);

  const filteredExpenses = projectExpenses.filter((e) => {
    const matchesCat = categoryFilter === 'all' || e.category === categoryFilter;
    const matchesSearch =
      e.paid_to.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.notes || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const totalSpent = projectExpenses.reduce((acc, curr) => acc + curr.amount, 0);
  const contractorAdvances = projectExpenses
    .filter((e) => e.category === 'contractor_advance')
    .reduce((acc, curr) => acc + curr.amount, 0);
  const localHardware = projectExpenses
    .filter((e) => e.category === 'material_local')
    .reduce((acc, curr) => acc + curr.amount, 0);

  const handleCreateExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.paid_to || !activeProject) return;

    addExpense({
      project_id: activeProject.id,
      room_id: formData.room_id || undefined,
      category: formData.category,
      amount: Number(formData.amount) || 0,
      payment_mode: formData.payment_mode,
      paid_to: formData.paid_to,
      status: 'approved',
      incurred_on: formData.incurred_on,
      notes: formData.notes,
    });

    setIsAddExpenseOpen(false);
    showToast(`Petty cash expense of ${formatINR(formData.amount)} to ${formData.paid_to} recorded.`);
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
              Site Petty Cash & Local Expenses
            </h1>
            <Badge variant="outline" className="text-xs bg-stone-100 text-stone-700">
              {projectExpenses.length} Records
            </Badge>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Log on-site petty cash vouchers, contractor labor advances, local fastener purchases, and transport debris passes.
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
              setFormData({
                room_id: projectRooms[0]?.id || '',
                category: 'material_local',
                amount: 3500,
                payment_mode: 'upi',
                paid_to: '',
                incurred_on: todayStr,
                notes: '',
              });
              setIsAddExpenseOpen(true);
            }}
          >
            <Plus className="h-3.5 w-3.5 mr-1" />
            Log Site Expense
          </Button>
        </div>
      </div>

      {/* Metric Counters Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Card className="p-3 border-stone-200 shadow-none">
          <span className="text-[10px] text-stone-500 block uppercase font-mono">Total Site Petty Cash</span>
          <span className="text-xl font-bold text-stone-900">{formatINR(totalSpent)}</span>
        </Card>
        <Card className="p-3 border-stone-200 shadow-none">
          <span className="text-[10px] text-stone-500 block uppercase font-mono">Contractor Advances</span>
          <span className="text-xl font-bold text-stone-900">{formatINR(contractorAdvances)}</span>
        </Card>
        <Card className="p-3 border-stone-200 shadow-none">
          <span className="text-[10px] text-stone-500 block uppercase font-mono">Local Hardware & Fasteners</span>
          <span className="text-xl font-bold text-stone-900">{formatINR(localHardware)}</span>
        </Card>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-lg border border-stone-200">
        <div className="flex items-center gap-2 w-full sm:w-72">
          <Search className="h-4 w-4 text-stone-400" />
          <Input
            placeholder="Search payee or notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-8 text-xs border-stone-200"
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="h-8 text-xs border border-stone-200 rounded-md px-2 bg-white text-stone-700"
          >
            <option value="all">All Categories</option>
            <option value="contractor_advance">Contractor Advance</option>
            <option value="material_local">Local Material & Hardware</option>
            <option value="transport">Tempo / Transport</option>
            <option value="permit_fee">Society Permit / Debris</option>
          </select>
        </div>
      </div>

      {/* Expenses Table */}
      <Card className="border-stone-200 shadow-none overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-stone-50/70 border-b border-stone-200 text-[11px]">
              <TableHead className="py-3 font-semibold text-stone-700">Date</TableHead>
              <TableHead className="py-3 font-semibold text-stone-700">Category</TableHead>
              <TableHead className="py-3 font-semibold text-stone-700">Paid To (Payee)</TableHead>
              <TableHead className="py-3 font-semibold text-stone-700">Payment Mode</TableHead>
              <TableHead className="py-3 font-semibold text-stone-700">Amount</TableHead>
              <TableHead className="py-3 font-semibold text-stone-700">Notes / Purpose</TableHead>
              <TableHead className="py-3 font-semibold text-stone-700">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredExpenses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-xs text-stone-500">
                  No site expenses match the filter.
                </TableCell>
              </TableRow>
            ) : (
              filteredExpenses.map((exp) => (
                <TableRow key={exp.id} className="hover:bg-stone-50/70 border-b border-stone-100 text-xs">
                  <TableCell className="py-3 text-stone-600">
                    {formatDate(exp.incurred_on)}
                  </TableCell>
                  <TableCell className="py-3">
                    <Badge variant="outline" className="text-[10px] uppercase font-mono text-stone-600">
                      {exp.category.replace('_', ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-3 font-semibold text-stone-900">
                    {exp.paid_to}
                  </TableCell>
                  <TableCell className="py-3">
                    <Badge className="bg-stone-100 text-stone-700 border-none uppercase font-mono text-[10px]">
                      {exp.payment_mode}
                    </Badge>
                  </TableCell>
                  <TableCell className="py-3 font-bold text-stone-900">
                    {formatINR(exp.amount)}
                  </TableCell>
                  <TableCell className="py-3 text-stone-600 max-w-xs truncate">
                    {exp.notes || '—'}
                  </TableCell>
                  <TableCell className="py-3">
                    <StatusBadge status={exp.status} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Card>

      {/* ========================================================================= */}
      {/* DIALOG: LOG PETTY CASH */}
      {/* ========================================================================= */}
      <Dialog open={isAddExpenseOpen} onOpenChange={setIsAddExpenseOpen}>
        <DialogContent className="max-w-md">
          <form onSubmit={handleCreateExpense}>
            <DialogHeader>
              <DialogTitle className="text-base font-bold text-stone-900">
                Log Site Petty Cash Voucher
              </DialogTitle>
              <DialogDescription className="text-xs text-stone-500">
                Record on-site purchases, labor advances, or transport charges.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-3">
              <div>
                <Label className="text-xs font-semibold text-stone-700">Paid To (Payee / Vendor) *</Label>
                <Input
                  required
                  placeholder="e.g. Sri Balaji Hardware & Fasteners"
                  value={formData.paid_to}
                  onChange={(e) => setFormData({ ...formData, paid_to: e.target.value })}
                  className="h-8 text-xs mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs font-semibold text-stone-700">Amount (₹) *</Label>
                  <Input
                    type="number"
                    required
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: Number(e.target.value) })}
                    className="h-8 text-xs mt-1 font-mono font-bold"
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold text-stone-700">Payment Mode</Label>
                  <select
                    value={formData.payment_mode}
                    onChange={(e) => setFormData({ ...formData, payment_mode: e.target.value as Expense['payment_mode'] })}
                    className="h-8 text-xs border border-stone-200 rounded-md px-2 bg-white text-stone-800 w-full mt-1"
                  >
                    <option value="upi">UPI / GPay</option>
                    <option value="cash">Cash</option>
                    <option value="bank_transfer">Bank Transfer / NEFT</option>
                    <option value="credit_card">Card</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs font-semibold text-stone-700">Category</Label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as Expense['category'] })}
                    className="h-8 text-xs border border-stone-200 rounded-md px-2 bg-white text-stone-800 w-full mt-1"
                  >
                    <option value="material_local">Local Material & Hardware</option>
                    <option value="contractor_advance">Contractor Advance</option>
                    <option value="transport">Tempo / Transport</option>
                    <option value="permit_fee">Society Permit / Debris</option>
                  </select>
                </div>
                <div>
                  <Label className="text-xs font-semibold text-stone-700">Date Incurred</Label>
                  <Input
                    type="date"
                    value={formData.incurred_on}
                    onChange={(e) => setFormData({ ...formData, incurred_on: e.target.value })}
                    className="h-8 text-xs mt-1"
                  />
                </div>
              </div>

              <div>
                <Label className="text-xs font-semibold text-stone-700">Purpose & Notes</Label>
                <Textarea
                  placeholder="Urgent SS screws, expansion rawl plugs, and Fevicol adhesive..."
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="text-xs mt-1 resize-none h-16"
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsAddExpenseOpen(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                className="bg-[#2A5C45] hover:bg-[#234c39] text-white text-xs"
              >
                Save Expense Voucher
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
