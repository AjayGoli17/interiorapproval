import React from 'react';
import { ScreenPlaceholder } from '@/components/shared/ScreenPlaceholder';
import { Receipt, Plus } from 'lucide-react';
import { useDemoStore } from '@/stores/demoStore';
import { formatINR } from '@/lib/utils';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';

export function TeamExpensesPage() {
  const { expenses } = useDemoStore();
  const totalSiteSpent = expenses.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <ScreenPlaceholder
      title="Project Expenses & Site Measurements"
      subtitle="On-site petty cash records, emergency local hardware purchases, and contractor advances."
      panelName="Project Team Panel"
      screenNumber="Screen 9 of 9"
      icon={Receipt}
      breadcrumbs={[{ label: 'Project Team' }, { label: 'Site Expenses' }]}
      headerActions={
        <Button size="sm">
          <Plus className="w-4 h-4 mr-1.5" /> Log Petty Cash
        </Button>
      }
      plannedFeatures={[
        'UPI / Cash receipt photo capture from mobile site visits',
        'Contractor weekly cash advance debit register',
        'As-built site measurement vs CAD drawing variance reconciliation',
        'Automatic verification workflow by Studio Director',
      ]}
    >
      <div className="pt-2 space-y-3">
        <div className="p-3 rounded border border-stone-200 bg-stone-50/50 flex items-center justify-between">
          <span className="text-xs text-stone-600">Total Site Petty Cash Recorded:</span>
          <span className="text-sm font-bold text-stone-900">{formatINR(totalSiteSpent)}</span>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Paid To</TableHead>
              <TableHead>Mode</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {expenses.map((e) => (
              <TableRow key={e.id}>
                <TableCell className="text-xs text-stone-500">{e.incurred_on}</TableCell>
                <TableCell className="text-xs uppercase font-mono text-stone-600">{e.category}</TableCell>
                <TableCell className="text-xs font-medium text-stone-900">{e.paid_to}</TableCell>
                <TableCell className="text-xs uppercase font-mono text-stone-500">{e.payment_mode}</TableCell>
                <TableCell className="text-xs font-semibold">{formatINR(e.amount)}</TableCell>
                <TableCell>
                  <StatusBadge status={e.status} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </ScreenPlaceholder>
  );
}
