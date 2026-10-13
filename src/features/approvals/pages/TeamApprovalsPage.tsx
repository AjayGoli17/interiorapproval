import React from 'react';
import { ScreenPlaceholder } from '@/components/shared/ScreenPlaceholder';
import { CheckSquare, Plus, Clock, MessageSquare } from 'lucide-react';
import { useDemoStore } from '@/stores/demoStore';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';

export function TeamApprovalsPage() {
  const { approvals } = useDemoStore();

  return (
    <ScreenPlaceholder
      title="Client Approvals Tracker"
      subtitle="Formal decision queue tracking client sign-offs on floor plans, laminate codes, and countertop stones."
      panelName="Project Team Panel"
      screenNumber="Screen 4 of 9"
      icon={CheckSquare}
      breadcrumbs={[{ label: 'Project Team' }, { label: 'Approvals' }]}
      headerActions={
        <Button size="sm">
          <Plus className="w-4 h-4 mr-1.5" /> Request New Sign-off
        </Button>
      }
      plannedFeatures={[
        'Granular sign-off tracking for finishes, sanitary fixtures, and layout changes',
        'Auto-alerts sent to client email & portal',
        'Revision feedback response thread between homeowner & designer',
        'Digital sign-off timestamp lock preventing out-of-scope revisions',
      ]}
    >
      <div className="pt-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Approval Item</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Client Feedback</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {approvals.map((a) => (
              <TableRow key={a.id}>
                <TableCell className="font-medium text-stone-900 text-xs">{a.title}</TableCell>
                <TableCell className="text-xs uppercase font-mono text-stone-500">{a.category}</TableCell>
                <TableCell className="text-xs text-stone-500">{a.due_date || '—'}</TableCell>
                <TableCell className="text-xs text-stone-600 italic max-w-xs truncate">
                  {a.client_comments ? `"${a.client_comments}"` : '—'}
                </TableCell>
                <TableCell>
                  <StatusBadge status={a.status} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </ScreenPlaceholder>
  );
}
