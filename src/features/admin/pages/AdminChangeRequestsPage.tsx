import React from 'react';
import { ScreenPlaceholder } from '@/components/shared/ScreenPlaceholder';
import { FileSignature, AlertCircle, Clock } from 'lucide-react';
import { useDemoStore } from '@/stores/demoStore';
import { formatINR } from '@/lib/utils';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { StatusBadge } from '@/components/shared/StatusBadge';

export function AdminChangeRequestsPage() {
  const { changeRequests } = useDemoStore();

  return (
    <ScreenPlaceholder
      title="Change Requests & Margin Control"
      subtitle="Studio-wide variation orders, cost escalations, schedule shifts, and client commercial approvals."
      panelName="Admin Panel"
      screenNumber="Screen 7 of 8"
      icon={FileSignature}
      breadcrumbs={[{ label: 'Admin' }, { label: 'Change Requests' }]}
      plannedFeatures={[
        'Formal change order approval workflow with cost & timeline impact calculator',
        'Direct synchronization with client decision queue',
        'Automatic revision of project baseline budget and delivery target dates',
        'Audit trail of client digital signatures and designer revision justifications',
      ]}
    >
      <div className="pt-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>CR Code</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Cost Impact</TableHead>
              <TableHead>Timeline Shift</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {changeRequests.map((cr) => (
              <TableRow key={cr.id}>
                <TableCell className="font-mono text-xs font-semibold">{cr.request_code}</TableCell>
                <TableCell className="text-xs font-medium text-stone-900">{cr.title}</TableCell>
                <TableCell className="text-xs font-semibold text-emerald-800">
                  +{formatINR(cr.cost_impact)}
                </TableCell>
                <TableCell className="text-xs text-stone-600">+{cr.timeline_impact_days} days</TableCell>
                <TableCell>
                  <StatusBadge status={cr.status} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </ScreenPlaceholder>
  );
}
