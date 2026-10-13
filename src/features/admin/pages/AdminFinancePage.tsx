import React, { useState } from 'react';
import {
  CircleDollarSign,
  Plus,
  ArrowUpRight,
  Receipt,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Calendar,
  X,
  AlertCircle,
  TrendingDown,
  Filter,
} from 'lucide-react';
import { useDemoStore } from '@/stores/demoStore';
import { formatINR, formatINRCompact, formatDate } from '@/lib/utils';
import { Expense } from '@/types';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';

export function AdminFinancePage() {
  const {
    projects,
    rooms,
    expenses,
    paymentMilestones,
    addExpense,
    updatePaymentMilestone,
  } = useDemoStore();

  // Financial Computations strictly from live store
  const totalContractValue = projects.reduce((sum, p) => sum + p.total_budget, 0);

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

  const totalClientPaid = paymentMilestones
    .filter((m) => m.status === 'payment_received')
    .reduce((sum, m) => sum + m.amount, 0);

  const outstandingReceivables = paymentMilestones
    .filter((m) => m.status === 'invoice_raised' || m.status === 'overdue')
    .reduce((sum, m) => sum + m.amount, 0);

  const netGrossMarginRemaining = totalContractValue - totalExpenses;

  // Filter state for Expenses Ledger
  const [expenseProjectFilter, setExpenseProjectFilter] = useState('all');
  const [expenseCategoryFilter, setExpenseCategoryFilter] = useState('all');

  // Modal State for Recording Expense
  const [modalOpen, setModalOpen] = useState(false);
  const [expenseForm, setExpenseForm] = useState({
    project_id: projects[0]?.id || '',
    room_id: '',
    category: 'petty_cash' as any,
    amount: 5000,
    payment_mode: 'upi' as any,
    paid_to: '',
    incurred_on: new Date().toISOString().split('T')[0],
    notes: '',
  });

  const [formError, setFormError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Selected project rooms for modal
  const selectedProjectRooms = rooms.filter(
    (r) => r.project_id === expenseForm.project_id
  );

  const filteredExpenses = expenses.filter((e) => {
    const matchProj = expenseProjectFilter === 'all' || e.project_id === expenseProjectFilter;
    const matchCat = expenseCategoryFilter === 'all' || e.category === expenseCategoryFilter;
    return matchProj && matchCat;
  });

  const handleOpenExpenseModal = () => {
    setExpenseForm({
      project_id: projects[0]?.id || '',
      room_id: '',
      category: 'petty_cash',
      amount: 5000,
      payment_mode: 'upi',
      paid_to: '',
      incurred_on: new Date().toISOString().split('T')[0],
      notes: '',
    });
    setFormError('');
    setModalOpen(true);
  };

  const handleExpenseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!expenseForm.paid_to.trim()) {
      setFormError('Please enter recipient / vendor name');
      return;
    }
    if (expenseForm.amount <= 0) {
      setFormError('Please enter a valid expense amount greater than 0');
      return;
    }

    addExpense({
      ...expenseForm,
      status: 'approved',
    });

    setSuccessMsg(`Expense voucher of ${formatINR(expenseForm.amount)} recorded.`);
    setModalOpen(false);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Financial Overview & P&L"
        subtitle="Studio cashflow, milestone payment collections, verified site expenses, and project budget margins."
        breadcrumbs={[{ label: 'Admin' }, { label: 'Finance' }]}
        actions={
          <Button onClick={handleOpenExpenseModal} size="sm" className="text-xs">
            <Plus className="w-3.5 h-3.5 mr-1.5" /> Record Site Expense
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

      {/* Financial Structure Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Total Contracted Project Value */}
        <Card className="p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-stone-500 mb-1">
              <span className="text-[11px] uppercase tracking-wider font-medium">Total Contracted Value</span>
              <Building2 className="w-4 h-4 text-stone-500" />
            </div>
            <span className="text-2xl font-bold text-stone-900 block" title={formatINR(totalContractValue)}>
              {formatINR(totalContractValue)}
            </span>
          </div>
          <p className="text-[11px] text-stone-500 mt-2">
            Sum of agreed budgets across {projects.length} signed contracts
          </p>
        </Card>

        {/* Client Collections */}
        <Card className="p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-stone-500 mb-1">
              <span className="text-[11px] uppercase tracking-wider font-medium">Funds Collected to Date</span>
              <CheckCircle2 className="w-4 h-4 text-[#2A5C45]" />
            </div>
            <span className="text-2xl font-bold text-[#204E38] block" title={formatINR(totalClientPaid)}>
              {formatINR(totalClientPaid)}
            </span>
          </div>
          <p className="text-[11px] text-stone-500 mt-2">
            {totalContractValue > 0
              ? Math.round((totalClientPaid / totalContractValue) * 100)
              : 0}
            % of total contracted value received in bank
          </p>
        </Card>

        {/* Total Recorded Expenses */}
        <Card className="p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-stone-500 mb-1">
              <span className="text-[11px] uppercase tracking-wider font-medium">Total Recorded Expenses</span>
              <Receipt className="w-4 h-4 text-stone-600" />
            </div>
            <span className="text-2xl font-bold text-stone-900 block" title={formatINR(totalExpenses)}>
              {formatINR(totalExpenses)}
            </span>
          </div>
          <p className="text-[11px] text-stone-500 mt-2">
            Petty cash, contractor advances & site purchases
          </p>
        </Card>

        {/* Outstanding Receivables */}
        <Card className="p-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-stone-500 mb-1">
              <span className="text-[11px] uppercase tracking-wider font-medium">Outstanding Receivables</span>
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <span className="text-2xl font-bold text-amber-800 block" title={formatINR(outstandingReceivables)}>
              {formatINR(outstandingReceivables)}
            </span>
          </div>
          <p className="text-[11px] text-amber-700 mt-2 font-medium">
            Raised invoices awaiting homeowner payment
          </p>
        </Card>
      </div>

      {/* Planned vs Actual Cost Analysis Table per Project */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-stone-900">Project-wise Budget vs Expense Health</h2>
            <p className="text-xs text-stone-500">
              Monitoring budget variances, contractor disbursements, and remaining financial cushions.
            </p>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Project</TableHead>
              <TableHead>Agreed Contract Budget</TableHead>
              <TableHead>Expenses Logged</TableHead>
              <TableHead>Budget Remaining</TableHead>
              <TableHead>Client Invoiced</TableHead>
              <TableHead>Amount Paid</TableHead>
              <TableHead>Cost Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((p) => {
              const projExpenses = expenses
                .filter((e) => e.project_id === p.id)
                .reduce((sum, e) => sum + e.amount, 0);

              const projMilestones = paymentMilestones.filter((m) => m.project_id === p.id);
              const paidByClient = projMilestones
                .filter((m) => m.status === 'payment_received')
                .reduce((sum, m) => sum + m.amount, 0);

              const invoicedTotal = projMilestones
                .filter((m) => m.status === 'payment_received' || m.status === 'invoice_raised')
                .reduce((sum, m) => sum + m.amount, 0);

              const remaining = p.total_budget - projExpenses;
              const isOverBudget = remaining < 0;

              return (
                <TableRow key={p.id}>
                  <TableCell>
                    <div className="font-medium text-stone-900 text-xs">{p.title}</div>
                    <span className="font-mono text-[10px] text-stone-400">{p.project_code}</span>
                  </TableCell>
                  <TableCell className="text-xs font-semibold text-stone-900">
                    {formatINR(p.total_budget)}
                  </TableCell>
                  <TableCell className="text-xs font-medium text-stone-800">
                    {formatINR(projExpenses)}
                  </TableCell>
                  <TableCell className={`text-xs font-semibold ${isOverBudget ? 'text-rose-600' : 'text-[#204E38]'}`}>
                    {formatINR(remaining)}
                  </TableCell>
                  <TableCell className="text-xs text-stone-700">
                    {formatINR(invoicedTotal)}
                  </TableCell>
                  <TableCell className="text-xs font-medium text-[#204E38]">
                    {formatINR(paidByClient)}
                  </TableCell>
                  <TableCell>
                    {isOverBudget ? (
                      <Badge className="bg-rose-50 text-rose-700 border-rose-200 text-[10px]">Over Budget</Badge>
                    ) : (
                      <Badge className="bg-[#EAF2ED] text-[#204E38] border-[#CDE1D4] text-[10px]">Within Budget</Badge>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Two Column Section: Expenses Ledger & Payment Milestones */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Expenses Ledger */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-sm font-semibold text-stone-900">Recorded Site Expenses Ledger</h2>
              <p className="text-xs text-stone-500">Itemized disbursements and petty cash receipts.</p>
            </div>
            <div className="flex items-center gap-1.5">
              <Select
                value={expenseCategoryFilter}
                onChange={(e) => setExpenseCategoryFilter(e.target.value)}
                className="text-xs h-8 w-36"
              >
                <option value="all">All Categories</option>
                <option value="petty_cash">Petty Cash</option>
                <option value="contractor_advance">Contractor Advance</option>
                <option value="material_local">Local Material</option>
                <option value="permit_fee">Permit Fee</option>
                <option value="transport">Transport</option>
              </Select>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Paid To / Vendor</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Mode</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredExpenses.map((exp) => (
                <TableRow key={exp.id}>
                  <TableCell className="text-xs text-stone-500 font-mono">
                    {formatDate(exp.incurred_on)}
                  </TableCell>
                  <TableCell className="text-xs">
                    <span className="font-medium text-stone-900 block">{exp.paid_to}</span>
                    {exp.notes && (
                      <span className="text-[11px] text-stone-400 line-clamp-1">{exp.notes}</span>
                    )}
                  </TableCell>
                  <TableCell className="text-xs uppercase font-mono text-stone-600">
                    {exp.category.replace('_', ' ')}
                  </TableCell>
                  <TableCell className="text-xs uppercase font-mono text-stone-500">
                    {exp.payment_mode}
                  </TableCell>
                  <TableCell className="text-right text-xs font-semibold text-stone-900">
                    {formatINR(exp.amount)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Milestone Invoicing Schedule */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-stone-900">Client Milestone Receivables</h2>
              <p className="text-xs text-stone-500">Stage deliverables and settlement statuses.</p>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Milestone Trigger</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paymentMilestones.map((ms) => (
                <TableRow key={ms.id}>
                  <TableCell className="font-mono text-xs font-semibold text-stone-700">
                    {ms.milestone_code}
                  </TableCell>
                  <TableCell className="text-xs">
                    <span className="font-medium text-stone-900 block">{ms.name}</span>
                    <span className="text-[11px] text-stone-400">{ms.stage_trigger}</span>
                  </TableCell>
                  <TableCell className="text-xs text-stone-500 font-mono">
                    {formatDate(ms.due_date)}
                  </TableCell>
                  <TableCell className="text-xs font-semibold text-stone-900">
                    {formatINR(ms.amount)}
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={ms.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    {ms.status === 'scheduled' ? (
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-6 text-[11px] px-2 border-stone-200 text-stone-700 hover:bg-stone-50"
                        onClick={() => {
                          const invNum = `INV-2026-0${Math.floor(Math.random() * 50 + 40)}`;
                          updatePaymentMilestone(ms.id, {
                            status: 'invoice_raised',
                            invoice_number: invNum,
                          });
                          setSuccessMsg(`Invoice ${invNum} raised for ${ms.name}.`);
                          setTimeout(() => setSuccessMsg(''), 4000);
                        }}
                      >
                        Raise Invoice
                      </Button>
                    ) : ms.status === 'invoice_raised' || ms.status === 'overdue' ? (
                      <Button
                        size="sm"
                        className="h-6 text-[11px] px-2 bg-[#2A5C45] hover:bg-[#204E38] text-white"
                        onClick={() => {
                          updatePaymentMilestone(ms.id, {
                            status: 'payment_received',
                            paid_at: new Date().toISOString(),
                          });
                          setSuccessMsg(`Payment of ${formatINR(ms.amount)} for ${ms.name} marked received.`);
                          setTimeout(() => setSuccessMsg(''), 4000);
                        }}
                      >
                        Record Payment
                      </Button>
                    ) : (
                      <span className="text-[11px] text-emerald-700 font-medium inline-flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Paid
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Record Expense Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogHeader>
          <DialogTitle>Record Project Expense</DialogTitle>
          <DialogDescription>
            Log petty cash vouchers, contractor advances, and direct site expenditures.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleExpenseSubmit} className="space-y-4">
          {formError && (
            <div className="p-2.5 rounded bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-stone-700 block mb-1">
                Project *
              </label>
              <Select
                value={expenseForm.project_id}
                onChange={(e) => setExpenseForm({ ...expenseForm, project_id: e.target.value, room_id: '' })}
                className="text-xs"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title} ({p.project_code})
                  </option>
                ))}
              </Select>
            </div>
            <div>
              <label className="text-xs font-medium text-stone-700 block mb-1">
                Room / Space (Optional)
              </label>
              <Select
                value={expenseForm.room_id}
                onChange={(e) => setExpenseForm({ ...expenseForm, room_id: e.target.value })}
                className="text-xs"
              >
                <option value="">-- General Project Cost --</option>
                {selectedProjectRooms.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-stone-700 block mb-1">
                Expense Category *
              </label>
              <Select
                value={expenseForm.category}
                onChange={(e) => setExpenseForm({ ...expenseForm, category: e.target.value as any })}
                className="text-xs"
              >
                <option value="petty_cash">Petty Cash Voucher</option>
                <option value="contractor_advance">Contractor Cash Advance</option>
                <option value="material_local">Local Hardware / Material</option>
                <option value="permit_fee">Permit / Association Fee</option>
                <option value="transport">Freight & Transport</option>
              </Select>
            </div>
            <div>
              <label className="text-xs font-medium text-stone-700 block mb-1">
                Amount (₹) *
              </label>
              <Input
                type="number"
                step="100"
                value={expenseForm.amount}
                onChange={(e) => setExpenseForm({ ...expenseForm, amount: Number(e.target.value) })}
                required
                className="text-xs font-semibold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-stone-700 block mb-1">
                Paid To (Recipient / Vendor) *
              </label>
              <Input
                placeholder="e.g. Ramesh Carpentry / Sri Balaji Hardware"
                value={expenseForm.paid_to}
                onChange={(e) => setExpenseForm({ ...expenseForm, paid_to: e.target.value })}
                required
                className="text-xs"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-stone-700 block mb-1">
                Payment Mode
              </label>
              <Select
                value={expenseForm.payment_mode}
                onChange={(e) => setExpenseForm({ ...expenseForm, payment_mode: e.target.value as any })}
                className="text-xs"
              >
                <option value="upi">UPI (GPay / PhonePe / Paytm)</option>
                <option value="bank_transfer">NEFT / RTGS Bank Transfer</option>
                <option value="cash">Site Cash</option>
                <option value="cheque">Cheque</option>
              </Select>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-stone-700 block mb-1">
              Date Incurred *
            </label>
            <Input
              type="date"
              value={expenseForm.incurred_on}
              onChange={(e) => setExpenseForm({ ...expenseForm, incurred_on: e.target.value })}
              required
              className="text-xs"
            />
          </div>

          <div>
            <label className="text-xs font-medium text-stone-700 block mb-1">
              Voucher Notes / Explanation
            </label>
            <Textarea
              placeholder="e.g. Purchased 4 boxes of Hettich screws, 2 cans of adhesive for kitchen carcass..."
              value={expenseForm.notes}
              onChange={(e) => setExpenseForm({ ...expenseForm, notes: e.target.value })}
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
              Confirm & Save Voucher
            </Button>
          </DialogFooter>
        </form>
      </Dialog>
    </div>
  );
}
