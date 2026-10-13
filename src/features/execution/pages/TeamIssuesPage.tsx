import React from 'react';
import { ScreenPlaceholder } from '@/components/shared/ScreenPlaceholder';
import { AlertOctagon, Plus, CheckCircle2 } from 'lucide-react';
import { useDemoStore } from '@/stores/demoStore';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';

export function TeamIssuesPage() {
  const { issues } = useDemoStore();

  return (
    <ScreenPlaceholder
      title="Snag List & Issue Tracker"
      subtitle="Defect identification, punch list tracking, severity assignments, and rectification verification."
      panelName="Project Team Panel"
      screenNumber="Screen 8 of 9"
      icon={AlertOctagon}
      breadcrumbs={[{ label: 'Project Team' }, { label: 'Issues & Snags' }]}
      headerActions={
        <Button size="sm">
          <Plus className="w-4 h-4 mr-1.5" /> Log Snag
        </Button>
      }
      plannedFeatures={[
        'Photo-annotated defect logging on architectural floor plans',
        'Severity ranking (Low, Medium, High, Critical blocker)',
        'Contractor liability tagging for rectification rework costs',
        'Client handover pre-inspection clearance sign-off',
      ]}
    >
      <div className="pt-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Issue Code</TableHead>
              <TableHead>Defect Description</TableHead>
              <TableHead>Severity</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {issues.map((i) => (
              <TableRow key={i.id}>
                <TableCell className="font-mono text-xs font-semibold">{i.issue_code}</TableCell>
                <TableCell className="text-xs">
                  <span className="font-medium text-stone-900 block">{i.title}</span>
                  <span className="text-stone-500 text-[11px]">{i.description}</span>
                </TableCell>
                <TableCell>
                  <StatusBadge status={i.severity} />
                </TableCell>
                <TableCell>
                  <StatusBadge status={i.status} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </ScreenPlaceholder>
  );
}
