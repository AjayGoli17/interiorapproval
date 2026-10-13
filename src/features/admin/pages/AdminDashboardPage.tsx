import React from 'react';
import { ScreenPlaceholder } from '@/components/shared/ScreenPlaceholder';
import { LayoutDashboard, TrendingUp, AlertTriangle, CheckCircle2, Clock } from 'lucide-react';
import { useDemoStore } from '@/stores/demoStore';
import { formatINR } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';

export function AdminDashboardPage() {
  const { projects, approvals, tasks } = useDemoStore();
  const activeCount = projects.filter((p) => p.status === 'execution').length;
  const pendingApprovalsCount = approvals.filter((a) => a.status === 'pending').length;

  return (
    <ScreenPlaceholder
      title="Executive Dashboard"
      subtitle="Studio-wide operational KPIs, active project stages, and financial health."
      panelName="Admin Panel"
      screenNumber="Screen 1 of 8"
      icon={LayoutDashboard}
      breadcrumbs={[{ label: 'Admin' }, { label: 'Dashboard' }]}
      plannedFeatures={[
        'Studio-wide active project distribution & stage funnel',
        'Pipeline revenue vs actual collections',
        'Critical bottleneck and site delay alerts',
        'High-level team workload and capacity overview',
      ]}
    >
      {/* Seed metric preview */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
        <div className="p-3 rounded border border-stone-200 bg-stone-50/50">
          <span className="text-[11px] text-stone-500 block">Active Projects</span>
          <span className="text-lg font-semibold text-stone-900">{activeCount} Sites</span>
        </div>
        <div className="p-3 rounded border border-stone-200 bg-stone-50/50">
          <span className="text-[11px] text-stone-500 block">Active Budget Pool</span>
          <span className="text-lg font-semibold text-stone-900">{formatINR(1800000)}</span>
        </div>
        <div className="p-3 rounded border border-stone-200 bg-stone-50/50">
          <span className="text-[11px] text-stone-500 block">Pending Sign-offs</span>
          <span className="text-lg font-semibold text-amber-700">{pendingApprovalsCount} Items</span>
        </div>
        <div className="p-3 rounded border border-stone-200 bg-stone-50/50">
          <span className="text-[11px] text-stone-500 block">Site Delivery Health</span>
          <span className="text-lg font-semibold text-[#204E38]">On Track</span>
        </div>
      </div>
    </ScreenPlaceholder>
  );
}
