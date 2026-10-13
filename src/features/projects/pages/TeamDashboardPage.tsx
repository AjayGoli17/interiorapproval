import React from 'react';
import { ScreenPlaceholder } from '@/components/shared/ScreenPlaceholder';
import { LayoutDashboard, CheckSquare, HardHat, AlertOctagon, Clock } from 'lucide-react';
import { useDemoStore } from '@/stores/demoStore';
import { StatusBadge } from '@/components/shared/StatusBadge';

export function TeamDashboardPage() {
  const { tasks, approvals, issues } = useDemoStore();
  const pendingTasks = tasks.filter((t) => t.status !== 'completed').length;
  const pendingApprovals = approvals.filter((a) => a.status === 'pending').length;
  const activeIssues = issues.filter((i) => i.status !== 'resolved' && i.status !== 'verified_closed').length;

  return (
    <ScreenPlaceholder
      title="Team Workspace Dashboard"
      subtitle="Operational hub for Designers and Site Managers: daily priorities, pending client decisions, and site blockers."
      panelName="Project Team Panel"
      screenNumber="Screen 1 of 9"
      icon={LayoutDashboard}
      breadcrumbs={[{ label: 'Project Team' }, { label: 'Dashboard' }]}
      plannedFeatures={[
        'Daily priority feed for active site activities and drawing reviews',
        'Direct alerts on revisions requested by clients',
        'Active snag & issue tally requiring contractor coordination',
        'Quick links to upload site photos, daily logs, and new CAD revisions',
      ]}
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
        <div className="p-3 rounded border border-stone-200 bg-stone-50/50">
          <span className="text-[11px] text-stone-500 block">Pending Site Tasks</span>
          <span className="text-base font-semibold text-stone-900">{pendingTasks} Active</span>
        </div>
        <div className="p-3 rounded border border-stone-200 bg-stone-50/50">
          <span className="text-[11px] text-stone-500 block">Awaiting Client Approval</span>
          <span className="text-base font-semibold text-amber-700">{pendingApprovals} Items</span>
        </div>
        <div className="p-3 rounded border border-stone-200 bg-stone-50/50">
          <span className="text-[11px] text-stone-500 block">Open Snags / Defect Tickets</span>
          <span className="text-base font-semibold text-rose-700">{activeIssues} Tickets</span>
        </div>
      </div>
    </ScreenPlaceholder>
  );
}
