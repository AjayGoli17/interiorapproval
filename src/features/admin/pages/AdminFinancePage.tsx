import React from 'react';
import { ScreenPlaceholder } from '@/components/shared/ScreenPlaceholder';
import { CircleDollarSign, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { useDemoStore } from '@/stores/demoStore';
import { formatINR } from '@/lib/utils';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { StatusBadge } from '@/components/shared/StatusBadge';

export function AdminFinancePage() {
  const { paymentMilestones, expenses } = useDemoStore();
  const totalInvoiced = paymentMilestones
    .filter((m) => m.status === 'payment_received' || m.status === 'invoice_raised')
    .reduce((acc, curr) => acc + curr.amount, 0);
  const totalCollected = paymentMilestones
    .filter((m) => m.status === 'payment_received')
    .reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <ScreenPlaceholder
      title="Financial Overview & P&L"
      subtitle="Studio cash flow, receivables from milestone triggers, vendor payables, and gross margins."
      panelName="Admin Panel"
      screenNumber="Screen 5 of 8"
      icon={CircleDollarSign}
      breadcrumbs={[{ label: 'Admin' }, { label: 'Finance' }]}
      plannedFeatures={[
        'Real-time cash flow & billing milestones across all active contracts',
        'Gross margin & profit breakdown per project',
        'Milestone aging & overdue accounts tracking',
        'Vendor disbursements and payment clearance schedules',
      ]}
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
        <div className="p-3 rounded border border-stone-200 bg-stone-50/50">
          <span className="text-[11px] text-stone-500 block">Total Collected (Cash In)</span>
          <span className="text-base font-semibold text-[#204E38]">{formatINR(totalCollected)}</span>
        </div>
        <div className="p-3 rounded border border-stone-200 bg-stone-50/50">
          <span className="text-[11px] text-stone-500 block">Invoiced Pending</span>
          <span className="text-base font-semibold text-amber-700">{formatINR(totalInvoiced - totalCollected)}</span>
        </div>
        <div className="p-3 rounded border border-stone-200 bg-stone-50/50">
          <span className="text-[11px] text-stone-500 block">Active Contract Value</span>
          <span className="text-base font-semibold text-stone-900">{formatINR(1800000)}</span>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Milestone</TableHead>
            <TableHead>Stage Trigger</TableHead>
            <TableHead>%</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {paymentMilestones.map((m) => (
            <TableRow key={m.id}>
              <TableCell className="font-mono text-xs font-semibold">{m.milestone_code}</TableCell>
              <TableCell className="text-xs text-stone-800">{m.name}</TableCell>
              <TableCell className="text-xs">{m.percentage}%</TableCell>
              <TableCell className="text-xs font-semibold">{formatINR(m.amount)}</TableCell>
              <TableCell>
                <StatusBadge status={m.status} />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScreenPlaceholder>
  );
}
