import React, { useState } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  UserCheck,
  CircleDollarSign,
  ShoppingCart,
  FileSignature,
  Settings,
  Compass,
  CheckSquare,
  Package,
  HardHat,
  CalendarCheck,
  AlertOctagon,
  Receipt,
  Menu,
  ChevronLeft,
  ChevronRight,
  Bell,
  Layers,
  ArrowRightLeft,
} from 'lucide-react';
import { DemoBanner } from '@/components/shared/DemoBanner';
import { ProjectSelector } from '@/components/shared/ProjectSelector';
import { useDemoStore } from '@/stores/demoStore';
import { Button } from '@/components/ui/button';

export function InternalLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, notifications, markNotificationRead } = useDemoStore();

  const isAdminSection = location.pathname.startsWith('/admin');

  // Admin Navigation Grouping
  const adminNavGroups = [
    {
      group: 'Overview',
      items: [
        { label: 'Executive Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
      ],
    },
    {
      group: 'Operations',
      items: [
        { label: 'Projects Directory', path: '/admin/projects', icon: FolderKanban },
        { label: 'Client Accounts', path: '/admin/clients', icon: Users },
        { label: 'Team Allocation', path: '/admin/team', icon: UserCheck },
      ],
    },
    {
      group: 'Commercials',
      items: [
        { label: 'Financial Overview & P&L', path: '/admin/finance', icon: CircleDollarSign },
        { label: 'Procurement Master', path: '/admin/procurement', icon: ShoppingCart },
        { label: 'Change Requests', path: '/admin/change-requests', icon: FileSignature },
      ],
    },
    {
      group: 'System',
      items: [
        { label: 'Studio Settings', path: '/admin/settings', icon: Settings },
      ],
    },
  ];

  // Project Team Navigation Grouping (Combined Designer + Site Manager)
  const teamNavGroups = [
    {
      group: 'Workspace',
      items: [
        { label: 'Team Dashboard', path: '/team/dashboard', icon: LayoutDashboard },
        { label: 'Project Specs & Rooms', path: '/team/project-overview', icon: FolderKanban },
      ],
    },
    {
      group: 'Design & Sign-off',
      items: [
        { label: 'Design Studio & Renders', path: '/team/designs', icon: Layers },
        { label: 'Client Approvals', path: '/team/approvals', icon: CheckSquare },
        { label: 'Material BOQ', path: '/team/materials', icon: Package },
      ],
    },
    {
      group: 'Site & Execution',
      items: [
        { label: 'Daily Logs & Photos', path: '/team/execution', icon: HardHat },
        { label: 'Tasks & Schedule', path: '/team/tasks', icon: CalendarCheck },
        { label: 'Snags & Issues', path: '/team/issues', icon: AlertOctagon },
        { label: 'Site Expenses', path: '/team/expenses', icon: Receipt },
      ],
    },
  ];

  const currentNavGroups = isAdminSection ? adminNavGroups : teamNavGroups;
  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF9]">
      {/* Demo Banner */}
      <DemoBanner />

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar */}
        <aside
          className={`bg-white border-r border-stone-200/80 flex flex-col transition-all duration-200 z-30 ${
            collapsed ? 'w-16' : 'w-64'
          } hidden md:flex`}
        >
          {/* Logo & Application Name */}
          <div className="h-14 px-4 flex items-center justify-between border-b border-stone-200/80">
            {!collapsed ? (
              <div className="flex items-center gap-2.5">
                <div className="h-8 w-8 rounded-md bg-[#2A5C45] text-white flex items-center justify-center font-bold text-sm tracking-tighter">
                  SF
                </div>
                <div>
                  <span className="font-semibold text-sm tracking-tight text-stone-900 block leading-tight">
                    StudioFlow
                  </span>
                  <span className="text-[10px] text-stone-600 block uppercase font-mono tracking-wider">
                    {isAdminSection ? 'Admin Control' : 'Project Team'}
                  </span>
                </div>
              </div>
            ) : (
              <div className="h-8 w-8 mx-auto rounded-md bg-[#2A5C45] text-white flex items-center justify-center font-bold text-sm">
                SF
              </div>
            )}

            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-1 rounded-md text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
              title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {collapsed ? (
                <ChevronRight className="w-4 h-4" />
              ) : (
                <ChevronLeft className="w-4 h-4" />
              )}
            </button>
          </div>

          {/* Quick Panel Toggle Switch (Admin <-> Team) */}
          <div className="p-2 border-b border-stone-100">
            <div className="flex rounded-md bg-stone-100 p-0.5 text-xs">
              <button
                onClick={() => navigate('/admin/dashboard')}
                className={`flex-1 py-1 rounded text-center transition-colors font-medium ${
                  isAdminSection
                    ? 'bg-white text-stone-900 shadow-sm'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {collapsed ? 'Adm' : 'Admin'}
              </button>
              <button
                onClick={() => navigate('/team/dashboard')}
                className={`flex-1 py-1 rounded text-center transition-colors font-medium ${
                  !isAdminSection
                    ? 'bg-white text-stone-900 shadow-sm'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {collapsed ? 'Team' : 'Project Team'}
              </button>
            </div>
          </div>

          {/* Nav Items */}
          <div className="flex-1 overflow-y-auto py-3 px-2 space-y-4">
            {currentNavGroups.map((group) => (
              <div key={group.group} className="space-y-1">
                {!collapsed && (
                  <p className="px-2 text-[10px] font-semibold uppercase tracking-wider text-stone-600 mb-1">
                    {group.group}
                  </p>
                )}
                {group.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      title={collapsed ? item.label : undefined}
                      className={({ isActive }) =>
                        `flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-colors ${
                          isActive
                            ? 'bg-[#2A5C45]/10 text-[#2A5C45] font-semibold'
                            : 'text-stone-600 hover:bg-stone-100/80 hover:text-stone-900'
                        } ${collapsed ? 'justify-center px-0' : ''}`
                      }
                    >
                      <Icon className="w-4 h-4 shrink-0" />
                      {!collapsed && <span className="truncate">{item.label}</span>}
                    </NavLink>
                  );
                })}
              </div>
            ))}
          </div>

          {/* User profile footer */}
          <div className="p-3 border-t border-stone-200/80 bg-stone-50/50">
            <div className="flex items-center gap-2.5">
              <img
                src={currentUser.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                alt={currentUser.full_name}
                className="w-7 h-7 rounded-full object-cover border border-stone-200"
              />
              {!collapsed && (
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-stone-900 truncate leading-none">
                    {currentUser.full_name}
                  </p>
                  <p className="text-[10px] text-stone-600 truncate mt-0.5 capitalize">
                    {currentUser.role}
                  </p>
                </div>
              )}
            </div>
          </div>
        </aside>

        {/* Mobile Sidebar Backdrop & Drawer */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-40 md:hidden flex">
            <div
              className="fixed inset-0 bg-stone-900/40"
              onClick={() => setMobileMenuOpen(false)}
            />
            <div className="relative w-64 bg-white flex flex-col z-50 h-full border-r border-stone-200">
              <div className="h-14 px-4 flex items-center justify-between border-b border-stone-200">
                <span className="font-semibold text-sm text-stone-900">StudioFlow</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1 rounded text-stone-400"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
              </div>

              <div className="p-2 border-b border-stone-100">
                <div className="flex rounded-md bg-stone-100 p-0.5 text-xs">
                  <button
                    onClick={() => {
                      navigate('/admin/dashboard');
                      setMobileMenuOpen(false);
                    }}
                    className={`flex-1 py-1 rounded text-center ${
                      isAdminSection ? 'bg-white text-stone-900 font-medium' : 'text-stone-500'
                    }`}
                  >
                    Admin
                  </button>
                  <button
                    onClick={() => {
                      navigate('/team/dashboard');
                      setMobileMenuOpen(false);
                    }}
                    className={`flex-1 py-1 rounded text-center ${
                      !isAdminSection ? 'bg-white text-stone-900 font-medium' : 'text-stone-500'
                    }`}
                  >
                    Team
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto py-3 px-2 space-y-4">
                {currentNavGroups.map((group) => (
                  <div key={group.group} className="space-y-1">
                    <p className="px-2 text-[10px] font-semibold uppercase text-stone-600">
                      {group.group}
                    </p>
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      return (
                        <NavLink
                          key={item.path}
                          to={item.path}
                          onClick={() => setMobileMenuOpen(false)}
                          className={({ isActive }) =>
                            `flex items-center gap-2.5 px-2.5 py-1.5 rounded-md text-xs font-medium ${
                              isActive
                                ? 'bg-[#2A5C45]/10 text-[#2A5C45] font-semibold'
                                : 'text-stone-600'
                            }`
                          }
                        >
                          <Icon className="w-4 h-4" />
                          <span>{item.label}</span>
                        </NavLink>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Top Bar */}
          <header className="h-14 bg-white border-b border-stone-200/80 px-4 flex items-center justify-between gap-4 shrink-0">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="md:hidden p-1.5 rounded-md text-stone-500 hover:bg-stone-100"
              >
                <Menu className="w-5 h-5" />
              </button>
              <div className="hidden sm:block">
                <ProjectSelector />
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="relative p-1.5 rounded-md text-stone-500 hover:text-stone-800 hover:bg-stone-100 transition-colors"
                  aria-label="Notifications"
                >
                  <Bell className="w-4 h-4" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-amber-500 rounded-full" />
                  )}
                </button>

                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 rounded-lg border border-stone-200 bg-white shadow-lg p-3 z-50 animate-in fade-in-0">
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-stone-100">
                      <span className="text-xs font-semibold text-stone-900">
                        Notifications ({unreadCount} new)
                      </span>
                      <button
                        onClick={() => setNotificationsOpen(false)}
                        className="text-[11px] text-stone-400 hover:text-stone-600"
                      >
                        Close
                      </button>
                    </div>
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {notifications.map((n) => (
                        <div
                          key={n.id}
                          onClick={() => {
                            markNotificationRead(n.id);
                            if (n.link) navigate(n.link);
                            setNotificationsOpen(false);
                          }}
                          className={`p-2 rounded cursor-pointer text-xs transition-colors ${
                            n.is_read
                              ? 'bg-stone-50/50 text-stone-600'
                              : 'bg-stone-50 text-stone-900 font-medium border-l-2 border-[#2A5C45]'
                          }`}
                        >
                          <p className="text-[11px] font-semibold text-stone-800">
                            {n.title}
                          </p>
                          <p className="text-[11px] text-stone-500 mt-0.5 leading-snug">
                            {n.message}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Portal link to client mode */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/client/dashboard')}
                className="hidden lg:inline-flex text-xs h-8"
              >
                <ArrowRightLeft className="w-3.5 h-3.5 mr-1.5 text-stone-500" />
                View as Client
              </Button>
            </div>
          </header>

          {/* Page Viewport */}
          <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
