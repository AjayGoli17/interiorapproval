import React from 'react';
import { ScreenPlaceholder } from '@/components/shared/ScreenPlaceholder';
import { CreditCard, Download, CheckCircle2, Clock } from 'lucide-react';
import { useDemoStore } from '@/stores/demoStore';
import { formatINR } from '@/lib/utils';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';

export function ClientPaymentsPage() {
  const { paymentMilestones, projects, currentProjectId } = useDemoStore();
  const project = projects.find((p) => p.id === currentProjectId) || projects[0];

  const totalPaid = paymentMilestones
    .filter((m) => m.status === 'payment_received')
    .reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <ScreenPlaceholder
      title="Quotation & Payment Schedule"
      subtitle="Milestone payment schedule, GST tax invoices, payment receipts, and balance dues."
      panelName="Client Portal"
      screenNumber="Screen 5 of 5"
      icon={CreditCard}
      plannedFeatures={[
        'Interactive milestone release schedule tied to verified site progress triggers',
        'Download official GST invoice PDFs & receipt confirmations',
        'Online bank transfer / RTGS / UPI remittance instructions',
        'Transparent variation order cost adjustments breakdown',
      ]}
    >
      <div className="space-y-4 pt-2">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3.5 rounded border border-stone-200 bg-stone-50/50">
            <span className="text-[11px] text-stone-500 block">Total Agreed Budget</span>
            <span className="text-base font-semibold text-stone-900">{formatINR(project.total_budget)}</span>
          </div>
          <div className="p-3.5 rounded border border-stone-200 bg-stone-50/50">
            <span className="text-[11px] text-stone-500 block">Total Paid to Date</span>
            <span className="text-base font-semibold text-[#204E38]">{formatINR(totalPaid)}</span>
          </div>
          <div className="p-3.5 rounded border border-stone-200 bg-stone-50/50">
            <span className="text-[11px] text-stone-500 block">Remaining Balance</span>
            <span className="text-base font-semibold text-stone-800">
              {formatINR(project.total_budget - totalPaid)}
            </span>
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Milestone</TableHead>
              <TableHead>Deliverable Stage</TableHead>
              <TableHead>%</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Invoice</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paymentMilestones.map((m) => (
              <TableRow key={m.id}>
                <TableCell className="font-mono text-xs font-semibold">{m.milestone_code}</TableCell>
                <TableCell className="text-xs">
                  <span className="font-medium text-stone-900 block">{m.name}</span>
                  <span className="text-stone-500 text-[11px]">{m.stage_trigger}</span>
                </TableCell>
                <TableCell className="text-xs">{m.percentage}%</TableCell>
                <TableCell className="text-xs font-semibold">{formatINR(m.amount)}</TableCell>
                <TableCell>
                  <StatusBadge status={m.status} />
                </TableCell>
                <TableCell className="text-xs font-mono text-stone-600">
                  {m.invoice_number ? (
                    <span className="inline-flex items-center gap-1 text-[#2A5C45] hover:underline cursor-pointer">
                      <Download className="w-3 h-3" /> {m.invoice_number}
                    </span>
                  ) : (
                    '—'
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </ScreenPlaceholder>
  );
}
