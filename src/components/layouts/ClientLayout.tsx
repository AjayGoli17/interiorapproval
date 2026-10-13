import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
  Home,
  Layers,
  Palette,
  HardHat,
  CreditCard,
  Phone,
  ArrowRightLeft,
  MessageSquare,
  Sparkles,
  ChevronDown,
  UserCheck,
} from 'lucide-react';
import { DemoBanner } from '@/components/shared/DemoBanner';
import { useDemoStore } from '@/stores/demoStore';
import { Button } from '@/components/ui/button';
import { ClientContactModal } from '@/features/client/components/ClientContactModal';

export function ClientLayout() {
  const navigate = useNavigate();
  const { approvals, projects, currentProjectId, designVersions, materials, changeRequests } =
    useDemoStore();
  const project = projects.find((p) => p.id === currentProjectId) || projects[0];

  const [contactOpen, setContactOpen] = useState(false);

  // Badge calculations for homeowner attention
  const pendingDesignsCount = designVersions.filter(
    (d) => d.project_id === project?.id && d.status === 'under_review'
  ).length;

  const pendingMaterialsCount = materials.filter(
    (m) =>
      m.project_id === project?.id &&
      (m.selection_status === 'proposed' || m.approval_status === 'spec_draft')
  ).length;

  const pendingChangesCount = changeRequests.filter(
    (cr) =>
      cr.project_id === project?.id &&
      (cr.status === 'quoted' || cr.status === 'under_review' || cr.client_decision === 'pending')
  ).length;

  const clientNavLinks = [
    { label: 'My Project', path: '/client/dashboard', icon: Home },
    {
      label: 'Designs & Approvals',
      path: '/client/designs',
      icon: Layers,
      badge: pendingDesignsCount > 0 ? pendingDesignsCount : undefined,
    },
    {
      label: 'Material Selection',
      path: '/client/materials',
      icon: Palette,
      badge: pendingMaterialsCount > 0 ? pendingMaterialsCount : undefined,
    },
    { label: 'Site Progress', path: '/client/progress', icon: HardHat },
    {
      label: 'Budget, Payments & Changes',
      path: '/client/payments',
      icon: CreditCard,
      badge: pendingChangesCount > 0 ? pendingChangesCount : undefined,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF9] text-stone-900">
      {/* Demo Top Switcher Banner */}
      <DemoBanner />

      {/* Client Header */}
      <header className="bg-white border-b border-stone-200/80 sticky top-0 z-30 shadow-xs">
        {/* Brand Bar */}
        <div className="max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 py-3 flex flex-wrap items-center justify-between gap-3">
          {/* Logo & Project Title */}
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-md bg-[#2A5C45] text-white flex items-center justify-center font-bold text-sm tracking-tight shrink-0 shadow-xs">
              SF
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-stone-900 text-sm tracking-tight">
                  StudioFlow Client Portal
                </span>
                <span className="text-[11px] bg-stone-100 text-stone-600 px-2 py-0.5 rounded font-mono border border-stone-200/60 hidden xs:inline-block">
                  {project?.project_code}
                </span>
              </div>
              <p className="text-xs text-stone-500 truncate max-w-[220px] sm:max-w-md">
                {project?.title} • {project?.property_type}
              </p>
            </div>
          </div>

          {/* Homeowner Context & Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Direct Contact Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => setContactOpen(true)}
              className="text-xs h-8 bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-700"
            >
              <Phone className="w-3.5 h-3.5 mr-1.5 text-[#2A5C45]" />
              <span className="hidden sm:inline">Contact Team</span>
              <span className="sm:hidden">Team</span>
            </Button>

            {/* Role switch / Admin Quick Jump */}
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/admin/dashboard')}
              className="text-xs h-8 border-stone-200 text-stone-600 hover:text-stone-900"
            >
              <ArrowRightLeft className="w-3.5 h-3.5 mr-1.5 text-stone-400" />
              <span className="hidden sm:inline">Admin Mode</span>
              <span className="sm:hidden">Admin</span>
            </Button>
          </div>
        </div>

        {/* 5 Navigation Tabs (Mobile-Friendly Horizontal Scroll) */}
        <nav
          aria-label="Client Navigation"
          className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 flex overflow-x-auto border-t border-stone-100 no-scrollbar gap-1 sm:gap-2"
        >
          {clientNavLinks.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 sm:gap-2 py-2.5 sm:py-3 px-2.5 sm:px-3 text-xs sm:text-sm font-medium border-b-2 whitespace-nowrap transition-colors select-none ${
                    isActive
                      ? 'border-[#2A5C45] text-[#2A5C45] font-semibold'
                      : 'border-transparent text-stone-600 hover:text-stone-900 hover:border-stone-200'
                  }`
                }
              >
                <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                <span>{item.label}</span>
                {item.badge !== undefined && (
                  <span className="inline-flex items-center justify-center px-1.5 py-0.2 text-[10px] sm:text-[11px] font-semibold bg-amber-100 text-amber-800 rounded-full shrink-0">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-3.5 sm:p-6 lg:p-8">
        <Outlet />
      </main>

      {/* Reassuring Footer */}
      <footer className="border-t border-stone-200 bg-white py-4 px-4 text-center text-xs text-stone-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>StudioFlow Interiors • Client Transparency Portal</span>
          <span className="text-[11px] text-stone-400">
            Homeowner: Rahul Sharma • Dedicated Lead: Arjun Mehta
          </span>
        </div>
      </footer>

      {/* Shared Contact Modal */}
      <ClientContactModal open={contactOpen} onOpenChange={setContactOpen} />
    </div>
  );
}
