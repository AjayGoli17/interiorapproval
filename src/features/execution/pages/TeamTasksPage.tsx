import React from 'react';
import { ScreenPlaceholder } from '@/components/shared/ScreenPlaceholder';
import { CalendarCheck, Plus, CheckCircle2 } from 'lucide-react';
import { useDemoStore } from '@/stores/demoStore';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';

export function TeamTasksPage() {
  const { tasks } = useDemoStore();

  return (
    <ScreenPlaceholder
      title="Task & Schedule Management"
      subtitle="Trade schedule checklist across civil, electrical, plumbing, carpentry, false ceiling, and painting."
      panelName="Project Team Panel"
      screenNumber="Screen 7 of 9"
      icon={CalendarCheck}
      breadcrumbs={[{ label: 'Project Team' }, { label: 'Tasks' }]}
      headerActions={
        <Button size="sm">
          <Plus className="w-4 h-4 mr-1.5" /> New Task
        </Button>
      }
      plannedFeatures={[
        'Gantt chart and sequential trade dependency mapping',
        'Milestone trigger synchronization with client billing events',
        'Overdue task notification to Site Manager',
        'Trade contractor handover acceptance checklist',
      ]}
    >
      <div className="pt-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Task Title</TableHead>
              <TableHead>Trade</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Progress</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.map((t) => (
              <TableRow key={t.id}>
                <TableCell className="font-medium text-stone-900 text-xs">{t.title}</TableCell>
                <TableCell className="text-xs uppercase font-mono text-stone-500">{t.category}</TableCell>
                <TableCell className="text-xs text-stone-500">{t.due_date || '—'}</TableCell>
                <TableCell>
                  <StatusBadge status={t.priority} />
                </TableCell>
                <TableCell>
                  <StatusBadge status={t.status} />
                </TableCell>
                <TableCell className="text-xs font-semibold">{t.progress_percent}%</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </ScreenPlaceholder>
  );
}
