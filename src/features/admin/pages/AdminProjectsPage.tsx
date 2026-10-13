import React from 'react';
import { ScreenPlaceholder } from '@/components/shared/ScreenPlaceholder';
import { FolderKanban, Plus } from 'lucide-react';
import { useDemoStore } from '@/stores/demoStore';
import { formatINR, formatDate } from '@/lib/utils';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';

export function AdminProjectsPage() {
  const { projects } = useDemoStore();

  return (
    <ScreenPlaceholder
      title="Projects Directory"
      subtitle="Complete portfolio of studio projects across lead, design, procurement, and execution phases."
      panelName="Admin Panel"
      screenNumber="Screen 2 of 8"
      icon={FolderKanban}
      breadcrumbs={[{ label: 'Admin' }, { label: 'Projects' }]}
      headerActions={
        <Button size="sm">
          <Plus className="w-4 h-4 mr-1.5" /> New Project
        </Button>
      }
      plannedFeatures={[
        'Comprehensive project list with status, budget, and phase filters',
        'Project onboarding wizard (client, budget, room specifications)',
        'Deadline & handover schedule tracking',
        'Direct links to project team workspace & client portal',
      ]}
    >
      <div className="pt-2">
        <span className="text-xs font-semibold text-stone-800 block mb-2">
          Registered Studio Projects ({projects.length})
        </span>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Project Title</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Total Budget</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Progress</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projects.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-mono text-xs">{p.project_code}</TableCell>
                <TableCell className="font-medium text-stone-900">{p.title}</TableCell>
                <TableCell className="text-stone-500 text-xs">{p.city}</TableCell>
                <TableCell className="font-medium">{formatINR(p.total_budget)}</TableCell>
                <TableCell>
                  <StatusBadge status={p.status} />
                </TableCell>
                <TableCell className="text-xs font-semibold">{p.progress_percentage}%</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </ScreenPlaceholder>
  );
}
