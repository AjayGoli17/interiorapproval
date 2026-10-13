import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';

// Layouts
import { InternalLayout } from '@/components/layouts/InternalLayout';
import { ClientLayout } from '@/components/layouts/ClientLayout';

// Demo Hub
import { DemoLandingPage } from '@/features/demo/DemoLandingPage';

// Admin Panel (8 screens)
import { AdminDashboardPage } from '@/features/admin/pages/AdminDashboardPage';
import { AdminProjectsPage } from '@/features/admin/pages/AdminProjectsPage';
import { AdminProjectDetailsPage } from '@/features/admin/pages/AdminProjectDetailsPage';
import { AdminClientsPage } from '@/features/admin/pages/AdminClientsPage';
import { AdminTeamPage } from '@/features/admin/pages/AdminTeamPage';
import { AdminFinancePage } from '@/features/admin/pages/AdminFinancePage';
import { AdminProcurementPage } from '@/features/admin/pages/AdminProcurementPage';
import { AdminChangeRequestsPage } from '@/features/admin/pages/AdminChangeRequestsPage';
import { AdminSettingsPage } from '@/features/admin/pages/AdminSettingsPage';

// Project Team Panel (9 screens)
import { TeamDashboardPage } from '@/features/projects/pages/TeamDashboardPage';
import { TeamProjectOverviewPage } from '@/features/projects/pages/TeamProjectOverviewPage';
import { TeamDesignsPage } from '@/features/designs/pages/TeamDesignsPage';
import { TeamApprovalsPage } from '@/features/approvals/pages/TeamApprovalsPage';
import { TeamMaterialsPage } from '@/features/materials/pages/TeamMaterialsPage';
import { TeamExecutionPage } from '@/features/execution/pages/TeamExecutionPage';
import { TeamTasksPage } from '@/features/execution/pages/TeamTasksPage';
import { TeamIssuesPage } from '@/features/execution/pages/TeamIssuesPage';
import { TeamExpensesPage } from '@/features/finance/pages/TeamExpensesPage';

// Client Panel (5 screens)
import { ClientDashboardPage } from '@/features/client/pages/ClientDashboardPage';
import { ClientDesignsPage } from '@/features/client/pages/ClientDesignsPage';
import { ClientMaterialsPage } from '@/features/client/pages/ClientMaterialsPage';
import { ClientApprovalsPage } from '@/features/client/pages/ClientApprovalsPage';
import { ClientProgressPage } from '@/features/client/pages/ClientProgressPage';
import { ClientPaymentsPage } from '@/features/client/pages/ClientPaymentsPage';

// Error Page
import { ErrorState } from '@/components/shared/ErrorState';

export const router = createBrowserRouter([
  // Demo Portal Entry
  {
    path: '/',
    element: <DemoLandingPage />,
    errorElement: (
      <div className="p-8 max-w-lg mx-auto">
        <ErrorState
          title="Navigation Error"
          description="The requested page could not be located."
          onRetry={() => window.location.assign('/')}
        />
      </div>
    ),
  },

  // 1. Admin Panel Routes (8 Screens)
  {
    path: '/admin',
    element: <InternalLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/admin/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <AdminDashboardPage />,
      },
      {
        path: 'projects',
        element: <AdminProjectsPage />,
      },
      {
        path: 'projects/:projectId',
        element: <AdminProjectDetailsPage />,
      },
      {
        path: 'clients',
        element: <AdminClientsPage />,
      },
      {
        path: 'team',
        element: <AdminTeamPage />,
      },
      {
        path: 'finance',
        element: <AdminFinancePage />,
      },
      {
        path: 'procurement',
        element: <AdminProcurementPage />,
      },
      {
        path: 'change-requests',
        element: <AdminChangeRequestsPage />,
      },
      {
        path: 'settings',
        element: <AdminSettingsPage />,
      },
    ],
  },

  // 2. Project Team Panel Routes (9 Screens)
  {
    path: '/team',
    element: <InternalLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/team/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <TeamDashboardPage />,
      },
      {
        path: 'project-overview',
        element: <TeamProjectOverviewPage />,
      },
      {
        path: 'designs',
        element: <TeamDesignsPage />,
      },
      {
        path: 'approvals',
        element: <TeamApprovalsPage />,
      },
      {
        path: 'materials',
        element: <TeamMaterialsPage />,
      },
      {
        path: 'execution',
        element: <TeamExecutionPage />,
      },
      {
        path: 'tasks',
        element: <TeamTasksPage />,
      },
      {
        path: 'issues',
        element: <TeamIssuesPage />,
      },
      {
        path: 'expenses',
        element: <TeamExpensesPage />,
      },
    ],
  },

  // 3. Client Portal Routes (5 Screens)
  {
    path: '/client',
    element: <ClientLayout />,
    children: [
      {
        index: true,
        element: <Navigate to="/client/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <ClientDashboardPage />,
      },
      {
        path: 'designs',
        element: <ClientDesignsPage />,
      },
      {
        path: 'materials',
        element: <ClientMaterialsPage />,
      },
      {
        path: 'approvals',
        element: <ClientApprovalsPage />,
      },
      {
        path: 'progress',
        element: <ClientProgressPage />,
      },
      {
        path: 'payments',
        element: <ClientPaymentsPage />,
      },
    ],
  },

  // Catch-all
  {
    path: '*',
    element: <Navigate to="/" replace />,
  },
]);
