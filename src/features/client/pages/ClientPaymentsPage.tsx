import React, { useState } from 'react';
import {
  CreditCard,
  Download,
  CheckCircle2,
  Clock,
  FileText,
  AlertCircle,
  HelpCircle,
  ShieldCheck,
  TrendingUp,
  ArrowRight,
  Check,
  X,
  Printer,
  Sparkles,
} from 'lucide-react';
import { useDemoStore } from '@/stores/demoStore';
import { formatINR } from '@/lib/utils';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { ChangeRequest, PaymentMilestone } from '@/types';

export function ClientPaymentsPage() {
  const {
    paymentMilestones,
    changeRequests,
    projects,
    currentProjectId,
    updateChangeRequest,
    clients,
    studioSettings,
  } = useDemoStore();

  const project = projects.find((p) => p.id === currentProjectId) || projects[0];
  const client = clients.find((c) => c.project_id === project?.id) || clients[0];

  // Project Milestones
  const projectMilestones = paymentMilestones.filter((m) => m.project_id === project?.id);

  // Project Change Requests
  const projectCRs = changeRequests.filter((cr) => cr.project_id === project?.id);

  // Calculations strictly adhering to Prompt 4 financial integrity rules:
  // 1. Approved Change Requests
  const approvedCRs = projectCRs.filter((cr) => cr.status === 'approved');
  const approvedVariationTotal = approvedCRs.reduce((acc, cr) => acc + cr.cost_impact, 0);

  // 2. Baseline Budget vs Revised Contract Total
  // The store project.total_budget already incorporates approved change requests.
  // Therefore, baseline budget = current total_budget - approvedVariationTotal.
  const baselineBudget = project.total_budget - approvedVariationTotal;
  const revisedContractTotal = project.total_budget;

  // 3. Total Paid strictly from payment_received milestones
  const totalPaid = projectMilestones
    .filter((m) => m.status === 'payment_received')
    .reduce((acc, curr) => acc + curr.amount, 0);

  // 4. Remaining Balance
  const remainingBalance = revisedContractTotal - totalPaid;
  const percentPaid = Math.round((totalPaid / revisedContractTotal) * 100);

  // Pending Change Requests awaiting client decision
  const pendingCRs = projectCRs.filter(
    (cr) =>
      cr.status === 'quoted' ||
      cr.status === 'under_review' ||
      cr.client_decision === 'pending'
  );

  // Dialog State: Change Request Approval Confirmation
  const [approvingCR, setApprovingCR] = useState<ChangeRequest | null>(null);

  // Dialog State: Change Request Rejection
  const [rejectingCR, setRejectingCR] = useState<ChangeRequest | null>(null);
  const [rejectionNotes, setRejectionNotes] = useState('');

  // Dialog State: Tax Invoice Receipt Viewer
  const [activeInvoice, setActiveInvoice] = useState<PaymentMilestone | null>(null);

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Actions
  const handleConfirmApproval = (cr: ChangeRequest) => {
    updateChangeRequest(cr.id, {
      status: 'approved',
      client_decision: 'approved',
      client_decision_notes: 'Approved by homeowner Rahul Sharma via Client Portal',
      approved_at: new Date().toISOString(),
    });
    setApprovingCR(null);
    showToast(`Variation Order ${cr.request_code} approved! Budget updated by +${formatINR(cr.cost_impact)}.`);
  };

  const handleConfirmRejection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectingCR) return;

    updateChangeRequest(rejectingCR.id, {
      status: 'rejected',
      client_decision: 'rejected',
      client_decision_notes: rejectionNotes.trim() || 'Declined by homeowner',
    });
    setRejectingCR(null);
    setRejectionNotes('');
    showToast(`Variation Order ${rejectingCR.request_code} declined. Project budget remains unchanged.`);
  };

  return (
    <div className="space-y-6">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#2A5C45] text-white text-xs px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 border border-emerald-600 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-200 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight flex items-center gap-2">
          <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 text-[#2A5C45]" />
          Budget, Milestone Payments & Variation Orders
        </h1>
        <p className="text-xs sm:text-sm text-stone-600 mt-1">
          Complete commercial transparency: agreed baseline contract, approved variations, GST receipts, and stage triggers.
        </p>
      </div>

      {/* 1. Transparent Financial Summary Card Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        <div className="p-3.5 rounded-xl border border-stone-200/90 bg-white shadow-2xs">
          <span className="text-[11px] font-medium text-stone-500 block">Agreed Baseline</span>
          <span className="text-base sm:text-lg font-bold text-stone-900">
            {formatINR(baselineBudget)}
          </span>
          <span className="text-[10px] text-stone-400 block mt-0.5">Initial contract sum</span>
        </div>

        <div className="p-3.5 rounded-xl border border-stone-200/90 bg-white shadow-2xs">
          <span className="text-[11px] font-medium text-stone-500 block">Approved Variations</span>
          <span className="text-base sm:text-lg font-bold text-amber-900">
            +{formatINR(approvedVariationTotal)}
          </span>
          <span className="text-[10px] text-stone-400 block mt-0.5">
            {approvedCRs.length} scope revision{approvedCRs.length === 1 ? '' : 's'}
          </span>
        </div>

        <div className="p-3.5 rounded-xl border border-[#2A5C45]/30 bg-emerald-50/30 shadow-2xs">
          <span className="text-[11px] font-medium text-emerald-900 block">Revised Contract Total</span>
          <span className="text-base sm:text-lg font-bold text-[#2A5C45]">
            {formatINR(revisedContractTotal)}
          </span>
          <span className="text-[10px] text-emerald-700 block mt-0.5">Active contract value</span>
        </div>

        <div className="p-3.5 rounded-xl border border-stone-200/90 bg-white shadow-2xs">
          <span className="text-[11px] font-medium text-stone-500 block">Total Paid to Date</span>
          <span className="text-base sm:text-lg font-bold text-emerald-700">
            {formatINR(totalPaid)}
          </span>
          <span className="text-[10px] text-stone-400 block mt-0.5">
            {percentPaid}% of contract paid
          </span>
        </div>

        <div className="p-3.5 rounded-xl border border-stone-200/90 bg-white shadow-2xs col-span-2 lg:col-span-1">
          <span className="text-[11px] font-medium text-stone-500 block">Remaining Balance</span>
          <span className="text-base sm:text-lg font-bold text-stone-900">
            {formatINR(remainingBalance)}
          </span>
          <span className="text-[10px] text-stone-400 block mt-0.5">Tied to future stages</span>
        </div>
      </div>

      {/* Payment Progress Bar */}
      <div className="p-4 rounded-xl border border-stone-200/90 bg-white shadow-2xs space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium text-stone-700">
            Contract Financial Settlement Status
          </span>
          <span className="font-semibold text-stone-900">
            {formatINR(totalPaid)} paid of {formatINR(revisedContractTotal)} ({percentPaid}%)
          </span>
        </div>
        <div className="w-full bg-stone-100 rounded-full h-2.5 overflow-hidden">
          <div
            className="bg-[#2A5C45] h-full rounded-full transition-all duration-700"
            style={{ width: `${percentPaid}%` }}
          />
        </div>
      </div>

      {/* 2. Variation Orders / Scope Revisions (Change Requests) Section */}
      <Card className="border-stone-200/90 bg-white shadow-2xs overflow-hidden">
        <CardHeader className="p-4 sm:p-5 pb-3 border-b border-stone-100">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <CardTitle className="text-sm font-semibold text-stone-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#2A5C45]" />
                Variation Orders & Scope Revisions
              </CardTitle>
              <p className="text-xs text-stone-500 mt-0.5">
                Transparent client sign-off on additions or specifications requested during execution.
              </p>
            </div>
            {pendingCRs.length > 0 && (
              <span className="px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200 font-medium text-xs self-start sm:self-center">
                {pendingCRs.length} Awaiting Your Decision
              </span>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-4 sm:p-5 space-y-3">
          {projectCRs.length > 0 ? (
            projectCRs.map((cr) => {
              const isPending =
                cr.status === 'quoted' ||
                cr.status === 'under_review' ||
                cr.client_decision === 'pending';
              const isApproved = cr.status === 'approved';
              const isRejected = cr.status === 'rejected';

              return (
                <div
                  key={cr.id}
                  className={`p-3.5 rounded-lg border text-xs transition-all space-y-2.5 ${
                    isPending
                      ? 'border-amber-200 bg-amber-50/40'
                      : isApproved
                      ? 'border-emerald-200 bg-emerald-50/20'
                      : 'border-stone-200 bg-stone-50/50'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] font-semibold text-stone-600 bg-white px-2 py-0.5 rounded border border-stone-200">
                          {cr.request_code}
                        </span>
                        <h4 className="font-semibold text-stone-900 text-sm">{cr.title}</h4>
                      </div>
                      <p className="text-stone-600 text-xs">{cr.description}</p>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <span className="font-bold text-sm text-stone-900 block">
                          +{formatINR(cr.cost_impact)}
                        </span>
                        <span className="text-[10px] text-stone-500 font-mono">
                          Timeline: +{cr.timeline_impact_days} days
                        </span>
                      </div>
                      <StatusBadge status={cr.status} />
                    </div>
                  </div>

                  {/* Specification Breakdown */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] bg-white p-2.5 rounded border border-stone-200/70">
                    <div>
                      <span className="text-stone-400 block font-medium">Original Baseline:</span>
                      <span className="text-stone-700">{cr.original_spec || 'Standard provision'}</span>
                    </div>
                    <div>
                      <span className="text-stone-400 block font-medium">Requested Variation:</span>
                      <span className="text-stone-800 font-medium">{cr.requested_change || cr.description}</span>
                    </div>
                  </div>

                  {/* Client Decision Notes (if approved or rejected) */}
                  {cr.client_decision_notes && (
                    <p className="text-[11px] italic text-stone-500">
                      Note: "{cr.client_decision_notes}"
                    </p>
                  )}

                  {/* Action Buttons */}
                  {isPending && (
                    <div className="pt-2 border-t border-amber-200/80 flex items-center justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setRejectingCR(cr)}
                        className="text-xs h-7 text-stone-600 hover:text-stone-900 border-stone-300"
                      >
                        <X className="w-3.5 h-3.5 mr-1 text-rose-600" /> Decline
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => setApprovingCR(cr)}
                        className="text-xs h-7 bg-[#2A5C45] hover:bg-[#204E38] text-white"
                      >
                        <Check className="w-3.5 h-3.5 mr-1" /> Approve & Add to Contract
                      </Button>
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <p className="text-xs text-stone-500 py-3 text-center">
              No variation orders requested. Project is tracking strictly to baseline specifications.
            </p>
          )}
        </CardContent>
      </Card>

      {/* 3. Milestone Payment Schedule Table */}
      <Card className="border-stone-200/90 bg-white shadow-2xs overflow-hidden">
        <CardHeader className="p-4 sm:p-5 pb-3 border-b border-stone-100">
          <CardTitle className="text-sm font-semibold text-stone-900">
            Milestone Payment Release Schedule
          </CardTitle>
          <p className="text-xs text-stone-500">
            Payments are released strictly against verified site deliverables and quality checks.
          </p>
        </CardHeader>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-stone-50/70">
                <TableHead className="w-20">Code</TableHead>
                <TableHead>Milestone & Deliverable Trigger</TableHead>
                <TableHead className="text-center">%</TableHead>
                <TableHead className="text-right">Amount</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">GST Invoice</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projectMilestones.map((m) => {
                const isPaid = m.status === 'payment_received';
                const isDue = m.status === 'invoice_raised';

                return (
                  <TableRow key={m.id} className="text-xs">
                    <TableCell className="font-mono font-semibold text-stone-700">
                      {m.milestone_code}
                    </TableCell>

                    <TableCell>
                      <span className="font-semibold text-stone-900 block">{m.name}</span>
                      <span className="text-stone-500 text-[11px] block mt-0.5">
                        Trigger: {m.stage_trigger}
                      </span>
                    </TableCell>

                    <TableCell className="text-center font-mono font-medium">
                      {m.percentage}%
                    </TableCell>

                    <TableCell className="text-right font-bold text-stone-900">
                      {formatINR(m.amount)}
                    </TableCell>

                    <TableCell>
                      <StatusBadge status={m.status} />
                    </TableCell>

                    <TableCell className="text-right">
                      {m.invoice_number ? (
                        <button
                          onClick={() => setActiveInvoice(m)}
                          className="inline-flex items-center gap-1 text-[#2A5C45] hover:text-[#204E38] font-mono font-medium hover:underline cursor-pointer"
                        >
                          <Download className="w-3.5 h-3.5" /> {m.invoice_number}
                        </button>
                      ) : (
                        <span className="text-stone-300">—</span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* 4. Bank Transfer / Remittance Details Accordion */}
      <div className="p-4 rounded-xl border border-stone-200/80 bg-white text-xs text-stone-600 space-y-2">
        <div className="flex items-center justify-between">
          <span className="font-semibold text-stone-900 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-[#2A5C45]" />
            Official StudioFlow Banking & Remittance Details
          </span>
          <span className="text-[11px] font-mono text-stone-400">GST: {studioSettings.gstin}</span>
        </div>
        <p className="text-stone-500 leading-relaxed text-[11px]">
          All payments should be remitted via RTGS / NEFT / IMPS to the designated client escrow account:
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2 pt-1 font-mono text-[11px] bg-stone-50 p-2.5 rounded border border-stone-200/60">
          <div>
            <span className="text-stone-400 block text-[10px]">Beneficiary:</span>
            <span className="font-semibold text-stone-800">{studioSettings.legal_name}</span>
          </div>
          <div>
            <span className="text-stone-400 block text-[10px]">Bank & Branch:</span>
            <span className="font-semibold text-stone-800">HDFC Bank, Jubilee Hills</span>
          </div>
          <div>
            <span className="text-stone-400 block text-[10px]">Account Number:</span>
            <span className="font-semibold text-stone-800">5020 0048 9123 01</span>
          </div>
          <div>
            <span className="text-stone-400 block text-[10px]">IFSC Code:</span>
            <span className="font-semibold text-stone-800">HDFC0000542</span>
          </div>
        </div>
      </div>

      {/* Modal 1: Approve Variation Order Confirmation */}
      <Dialog open={!!approvingCR} onOpenChange={(open) => !open && setApprovingCR(null)}>
        <DialogContent className="max-w-md p-5">
          {approvingCR && (
            <div className="space-y-4">
              <DialogHeader className="space-y-1">
                <DialogTitle className="text-base font-semibold text-stone-900">
                  Confirm Variation Order Approval
                </DialogTitle>
                <DialogDescription className="text-xs text-stone-500">
                  Approving this variation will update your agreed project contract.
                </DialogDescription>
              </DialogHeader>

              <div className="p-3 rounded-lg bg-stone-50 border border-stone-200 space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-stone-500">Request:</span>
                  <span className="font-semibold text-stone-900">{approvingCR.title}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Cost Addition:</span>
                  <span className="font-bold text-[#2A5C45]">+{formatINR(approvingCR.cost_impact)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Timeline Impact:</span>
                  <span className="font-medium text-stone-800">+{approvingCR.timeline_impact_days} days</span>
                </div>
                <div className="pt-2 border-t border-stone-200 flex justify-between">
                  <span className="font-medium text-stone-700">New Revised Contract Sum:</span>
                  <span className="font-bold text-stone-900">
                    {formatINR(revisedContractTotal + approvingCR.cost_impact)}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setApprovingCR(null)}
                  className="text-xs h-8"
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={() => handleConfirmApproval(approvingCR)}
                  className="text-xs h-8 bg-[#2A5C45] hover:bg-[#204E38] text-white"
                >
                  Confirm & Sign Off
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal 2: Reject Variation Order */}
      <Dialog open={!!rejectingCR} onOpenChange={(open) => !open && setRejectingCR(null)}>
        <DialogContent className="max-w-md p-5">
          {rejectingCR && (
            <form onSubmit={handleConfirmRejection} className="space-y-4">
              <DialogHeader className="space-y-1">
                <DialogTitle className="text-base font-semibold text-stone-900">
                  Decline Variation Order {rejectingCR.request_code}
                </DialogTitle>
                <DialogDescription className="text-xs text-stone-500">
                  The original baseline specification will be retained without any budget adjustment.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-2 text-xs">
                <label className="font-medium text-stone-700 block">
                  Optional reason or note for the studio:
                </label>
                <textarea
                  value={rejectionNotes}
                  onChange={(e) => setRejectionNotes(e.target.value)}
                  rows={3}
                  placeholder="e.g. Prefer manual curtain tracks; proceed with baseline quotation..."
                  className="w-full text-xs p-2.5 rounded-md border border-stone-300 focus:outline-none focus:ring-1 focus:ring-[#2A5C45] focus:border-[#2A5C45]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setRejectingCR(null)}
                  className="text-xs h-8"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="text-xs h-8 bg-rose-700 hover:bg-rose-800 text-white"
                >
                  Decline Variation
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal 3: Tax Invoice Receipt Viewer */}
      <Dialog open={!!activeInvoice} onOpenChange={(open) => !open && setActiveInvoice(null)}>
        <DialogContent className="max-w-lg p-6">
          {activeInvoice && (
            <div className="space-y-4 text-xs">
              <div className="flex items-start justify-between border-b border-stone-200 pb-3">
                <div>
                  <h3 className="font-bold text-base text-stone-900">TAX INVOICE</h3>
                  <p className="text-[11px] font-mono text-stone-500">
                    Invoice No: {activeInvoice.invoice_number}
                  </p>
                  <p className="text-[11px] text-stone-500">Date: {activeInvoice.due_date}</p>
                </div>
                <div className="text-right">
                  <span className="font-bold text-stone-900 block">{studioSettings.company_name}</span>
                  <span className="text-[10px] text-stone-400 block font-mono">
                    GSTIN: {studioSettings.gstin}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 bg-stone-50 p-3 rounded border border-stone-200/80">
                <div>
                  <span className="text-[10px] font-semibold text-stone-400 block uppercase">
                    Billed To:
                  </span>
                  <p className="font-semibold text-stone-900">{client?.full_name}</p>
                  <p className="text-stone-500 text-[11px]">{project.location}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-semibold text-stone-400 block uppercase">
                    Status:
                  </span>
                  <StatusBadge status={activeInvoice.status} />
                </div>
              </div>

              <div className="border border-stone-200 rounded overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-stone-50/50">
                      <TableHead>Deliverable Milestone</TableHead>
                      <TableHead className="text-right">Amount (₹)</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <span className="font-semibold block">{activeInvoice.name}</span>
                        <span className="text-stone-500 text-[11px]">
                          {activeInvoice.stage_trigger}
                        </span>
                      </TableCell>
                      <TableCell className="text-right font-mono font-semibold">
                        {formatINR(activeInvoice.amount)}
                      </TableCell>
                    </TableRow>
                    <TableRow className="bg-stone-50/30">
                      <TableCell className="font-semibold">Total Amount Payable</TableCell>
                      <TableCell className="text-right font-mono font-bold text-sm text-[#2A5C45]">
                        {formatINR(activeInvoice.amount)}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-stone-100">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    showToast(`Receipt for ${activeInvoice.invoice_number} saved to downloads.`);
                    setActiveInvoice(null);
                  }}
                  className="text-xs h-8"
                >
                  <Download className="w-3.5 h-3.5 mr-1.5" /> Download PDF Receipt
                </Button>
                <Button
                  size="sm"
                  onClick={() => setActiveInvoice(null)}
                  className="text-xs h-8 bg-stone-900 hover:bg-stone-800 text-white"
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
