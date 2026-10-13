import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  Home,
  Layers,
  CheckCircle2,
  HardHat,
  CreditCard,
  Phone,
  ArrowRightLeft,
  Sparkles,
  AlertCircle,
} from 'lucide-react';
import { DemoBanner } from '@/components/shared/DemoBanner';
import { useDemoStore } from '@/stores/demoStore';
import { Button } from '@/components/ui/button';
import { formatINR } from '@/lib/utils';

export function ClientLayout() {
  const navigate = useNavigate();
  const { approvals, projects, currentProjectId } = useDemoStore();
  const project = projects.find((p) => p.id === currentProjectId) || projects[0];

  const pendingApprovalsCount = approvals.filter(
    (a) => a.project_id === project?.id && a.status === 'pending'
  ).length;

  const clientNavLinks = [
    { label: 'Overview', path: '/client/dashboard', icon: Home },
    { label: 'Designs & 3D Views', path: '/client/designs', icon: Layers },
    {
      label: 'Approvals & Decisions',
      path: '/client/approvals',
      icon: CheckCircle2,
      badge: pendingApprovalsCount > 0 ? pendingApprovalsCount : undefined,
    },
    { label: 'Live Site Progress', path: '/client/progress', icon: HardHat },
    { label: 'Quotes & Payments', path: '/client/payments', icon: CreditCard },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF9]">
      {/* Demo Banner */}
      <DemoBanner />

      {/* Client Header */}
      <header className="bg-white border-b border-stone-200/80 sticky top-0 z-30 shadow-xs">
        {/* Upper Brand & Project Bar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-md bg-[#2A5C45] text-white flex items-center justify-center font-bold text-sm tracking-tight shadow-xs">
              SF
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-stone-900 text-sm">
                  StudioFlow Client Portal
                </span>
                <span className="text-[11px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded font-mono">
                  {project?.project_code}
                </span>
              </div>
              <p className="text-xs text-stone-500">
                {project?.title} • {project?.location}
              </p>
            </div>
          </div>

          {/* Right Action: Lead Designer Info & Return to Admin */}
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2.5 px-3 py-1.5 rounded-md bg-stone-50 border border-stone-200 text-xs">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-stone-500">Lead Designer:</span>
              <span className="font-medium text-stone-800">Arjun Mehta</span>
              <a
                href="tel:+919849023456"
                className="text-[#2A5C45] hover:text-[#214A37] flex items-center gap-1 ml-1 font-medium"
              >
                <Phone className="w-3 h-3" /> Call
              </a>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/admin/dashboard')}
              className="text-xs h-8"
            >
              <ArrowRightLeft className="w-3.5 h-3.5 mr-1.5 text-stone-500" />
              Internal Admin
            </Button>
          </div>
        </div>

        {/* Client Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex overflow-x-auto border-t border-stone-100 gap-1 sm:gap-2">
          {clientNavLinks.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-2 py-3 px-3 text-xs sm:text-sm font-medium border-b-2 whitespace-nowrap transition-colors ${
                    isActive
                      ? 'border-[#2A5C45] text-[#2A5C45] font-semibold'
                      : 'border-transparent text-stone-600 hover:text-stone-900 hover:border-stone-200'
                  }`
                }
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
                {item.badge !== undefined && (
                  <span className="inline-flex items-center justify-center px-1.5 py-0.5 text-[11px] font-semibold bg-amber-100 text-amber-800 rounded-full">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>
      </header>

      {/* Main Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>

      {/* Clean Client Footer */}
      <footer className="border-t border-stone-200 bg-white py-4 text-center text-xs text-stone-400">
        StudioFlow Client Portal • Protected client access for {project?.title} • Hyderabad
      </footer>
    </div>
  );
}
