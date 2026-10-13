import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Users,
  Home,
  CheckCircle2,
  ArrowRight,
  Database,
  Building2,
  Layers,
  Sparkles,
  Info,
} from 'lucide-react';
import { useDemoStore, DEMO_USERS } from '@/stores/demoStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { isSupabaseConfigured } from '@/lib/supabase';
import { formatINR } from '@/lib/utils';

export function DemoLandingPage() {
  const navigate = useNavigate();
  const { switchRole, projects, currentProjectId } = useDemoStore();
  const seedProject = projects.find((p) => p.id === currentProjectId) || projects[0];

  const handleLaunchRole = (role: 'admin' | 'designer' | 'client', path: string) => {
    switchRole(role);
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-[#FAFAF9] flex flex-col justify-between selection:bg-[#2A5C45]/20 selection:text-[#1A3319]">
      {/* Header */}
      <header className="border-b border-stone-200/80 bg-white">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded bg-[#2A5C45] text-white flex items-center justify-center font-bold text-sm tracking-tight">
              SF
            </div>
            <div>
              <span className="font-semibold text-stone-900 text-sm tracking-tight block">
                StudioFlow
              </span>
              <span className="text-[10px] text-stone-500 block uppercase tracking-wider font-mono">
                Interior Project Control System
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="text-[11px] font-mono border-stone-300 text-stone-700 bg-stone-50"
            >
              Demo Access Mode
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-12 flex-1 w-full">
        {/* Hero Title */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#EAF2ED] text-[#204E38] text-xs font-medium mb-3 border border-[#CDE1D4]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Multi-Panel System Demo</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight text-stone-900 mb-3">
            Interior Project Control System
          </h1>
          <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
            A minimal, unified operations platform for interior design firms. Select a
            role below to explore the corresponding workspace.
          </p>
        </div>

        {/* 3 Panel Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* 1. Admin Panel */}
          <Card className="flex flex-col justify-between hover:border-stone-300 hover:shadow-md transition-all border-stone-200/90 bg-white">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between mb-2">
                <div className="w-9 h-9 rounded-md bg-stone-100 text-stone-800 flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-[#2A5C45]" />
                </div>
                <Badge variant="secondary" className="text-[10px] font-mono">
                  8 Screens
                </Badge>
              </div>
              <CardTitle className="text-lg font-semibold text-stone-900">
                Admin Panel
              </CardTitle>
              <CardDescription className="text-xs text-stone-500">
                Firm owners and studio directors overseeing all projects, studio P&L,
                team allocation, and procurement standards.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 rounded-md bg-stone-50 border border-stone-200/70 text-xs space-y-1">
                <div className="text-stone-500 font-medium text-[11px] uppercase tracking-wider">
                  Demo Identity
                </div>
                <div className="font-semibold text-stone-900">Priya Nair</div>
                <div className="text-stone-500">Studio Director • Admin Access</div>
              </div>

              <div className="space-y-1 text-xs text-stone-600">
                <div className="font-medium text-stone-800 text-[11px]">Key Scope:</div>
                <ul className="list-disc list-inside space-y-0.5 text-stone-500 text-[11px]">
                  <li>Executive Dashboard & KPIs</li>
                  <li>Studio-wide P&L & Cashflow</li>
                  <li>Procurement & Vendor Directory</li>
                  <li>Change Orders & Margin Control</li>
                </ul>
              </div>

              <Button
                className="w-full text-xs h-9"
                onClick={() => handleLaunchRole('admin', '/admin/dashboard')}
              >
                Launch Admin Panel <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </CardContent>
          </Card>

          {/* 2. Project Team Panel */}
          <Card className="flex flex-col justify-between hover:border-stone-300 hover:shadow-md transition-all border-stone-200/90 bg-white">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between mb-2">
                <div className="w-9 h-9 rounded-md bg-stone-100 text-stone-800 flex items-center justify-center">
                  <Users className="w-5 h-5 text-[#2A5C45]" />
                </div>
                <Badge variant="secondary" className="text-[10px] font-mono">
                  9 Screens
                </Badge>
              </div>
              <CardTitle className="text-lg font-semibold text-stone-900">
                Project Team Panel
              </CardTitle>
              <CardDescription className="text-xs text-stone-500">
                Combined workspace for Interior Designers and Site Managers to manage 3D
                revisions, BOQ, daily site logs, and snags.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 rounded-md bg-stone-50 border border-stone-200/70 text-xs space-y-1">
                <div className="text-stone-500 font-medium text-[11px] uppercase tracking-wider">
                  Demo Identity
                </div>
                <div className="font-semibold text-stone-900">Arjun Mehta</div>
                <div className="text-stone-500">Lead Designer & Site Lead</div>
              </div>

              <div className="space-y-1 text-xs text-stone-600">
                <div className="font-medium text-stone-800 text-[11px]">Key Scope:</div>
                <ul className="list-disc list-inside space-y-0.5 text-stone-500 text-[11px]">
                  <li>Design Studio & 3D Render Review</li>
                  <li>Client Approval Matrix & History</li>
                  <li>Material BOQ & Specification Sheets</li>
                  <li>Daily Site Logs & Defect Snagging</li>
                </ul>
              </div>

              <Button
                className="w-full text-xs h-9"
                onClick={() => handleLaunchRole('designer', '/team/dashboard')}
              >
                Launch Project Team <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </CardContent>
          </Card>

          {/* 3. Client Panel */}
          <Card className="flex flex-col justify-between hover:border-stone-300 hover:shadow-md transition-all border-stone-200/90 bg-white">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between mb-2">
                <div className="w-9 h-9 rounded-md bg-stone-100 text-stone-800 flex items-center justify-center">
                  <Home className="w-5 h-5 text-[#2A5C45]" />
                </div>
                <Badge variant="secondary" className="text-[10px] font-mono">
                  5 Screens
                </Badge>
              </div>
              <CardTitle className="text-lg font-semibold text-stone-900">
                Client Portal
              </CardTitle>
              <CardDescription className="text-xs text-stone-500">
                Simplified, distraction-free portal for clients to approve designs, review
                site progress photos, and manage payments.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-3 rounded-md bg-stone-50 border border-stone-200/70 text-xs space-y-1">
                <div className="text-stone-500 font-medium text-[11px] uppercase tracking-wider">
                  Demo Identity
                </div>
                <div className="font-semibold text-stone-900">Rahul Sharma</div>
                <div className="text-stone-500">Homeowner • 3BHK Apartment</div>
              </div>

              <div className="space-y-1 text-xs text-stone-600">
                <div className="font-medium text-stone-800 text-[11px]">Key Scope:</div>
                <ul className="list-disc list-inside space-y-0.5 text-stone-500 text-[11px]">
                  <li>Project Progress Overview (45%)</li>
                  <li>Interactive 3D Design Presentation</li>
                  <li>Decisions & Sign-off Requests</li>
                  <li>Milestone Invoices & Receipts</li>
                </ul>
              </div>

              <Button
                className="w-full text-xs h-9"
                onClick={() => handleLaunchRole('client', '/client/dashboard')}
              >
                Launch Client Portal <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Seed Project Snapshot */}
        <div className="rounded-lg border border-stone-200 bg-white p-6 shadow-xs mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-stone-100">
            <div>
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-[#2A5C45]" />
                <h2 className="text-base font-semibold text-stone-900">
                  Pre-Seeded Demo Project
                </h2>
                <Badge className="bg-[#EAF2ED] text-[#204E38] border-[#CDE1D4] text-[11px]">
                  Execution Phase (45%)
                </Badge>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                {seedProject.title} • {seedProject.location}
              </p>
            </div>
            <div className="text-left sm:text-right">
              <span className="text-xs text-stone-500 block">Total Project Budget</span>
              <span className="text-lg font-bold text-stone-900">
                {formatINR(seedProject.total_budget)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 text-xs">
            <div>
              <span className="text-stone-400 block text-[11px]">Property Type</span>
              <span className="font-medium text-stone-800">
                {seedProject.property_type} ({seedProject.carpet_area_sqft} sqft)
              </span>
            </div>
            <div>
              <span className="text-stone-400 block text-[11px]">Configured Rooms</span>
              <span className="font-medium text-stone-800">
                5 Rooms (Living, Kitchen, Master, 2 Beds)
              </span>
            </div>
            <div>
              <span className="text-stone-400 block text-[11px]">Lead Designer</span>
              <span className="font-medium text-stone-800">Arjun Mehta</span>
            </div>
            <div>
              <span className="text-stone-400 block text-[11px]">Database Adapter</span>
              <span className="font-medium text-stone-800">
                {isSupabaseConfigured ? 'Supabase Connected' : 'Local Demo Store'}
              </span>
            </div>
          </div>
        </div>

        {/* System & Architecture Info */}
        <div className="rounded-lg bg-stone-100/70 border border-stone-200/70 p-4 text-xs text-stone-600 flex items-start gap-3">
          <Info className="w-4 h-4 text-stone-500 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-medium text-stone-800 block">
              Prompt 1 Architecture Foundation Complete
            </span>
            <p className="text-[11px] text-stone-500 leading-relaxed">
              Total 22 planned screens structured across Admin (8), Project Team (9), and
              Client (5) panels. Shared layouts, Zustand demo store, TypeScript domain
              models, and Supabase SQL schema migrations (
              <code className="bg-stone-200 px-1 py-0.5 rounded text-stone-800 font-mono">
                supabase/migrations/01_initial_schema.sql
              </code>
              ) are active.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-200 bg-white py-4 text-center text-xs text-stone-400">
        StudioFlow Interior Project Control System • Foundation & UI Scaffold
      </footer>
    </div>
  );
}
