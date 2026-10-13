import React, { useState } from 'react';
import {
  Settings,
  Building,
  CreditCard,
  FileText,
  Sliders,
  CheckCircle2,
  Database,
  Shield,
  Save,
  RotateCcw,
  Sparkles,
  Info,
} from 'lucide-react';
import { useDemoStore } from '@/stores/demoStore';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { isSupabaseConfigured } from '@/lib/supabase';

export function AdminSettingsPage() {
  const { studioSettings, updateStudioSettings, resetDemoData } = useDemoStore();

  const [form, setForm] = useState({ ...studioSettings });
  const [savedMsg, setSavedMsg] = useState(false);
  const [resetConfirm, setResetConfirm] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateStudioSettings(form);
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 3500);
  };

  const handleReset = () => {
    resetDemoData();
    setResetConfirm(false);
    window.location.reload();
  };

  return (
    <div className="space-y-6 max-w-5xl">
      <PageHeader
        title="Studio Settings & System Master"
        subtitle="Configure firm profile credentials, standard GST taxation, contract defaults, and demo database state."
        breadcrumbs={[{ label: 'Admin' }, { label: 'Settings' }]}
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setResetConfirm(true)}
              className="text-xs text-rose-700 border-rose-200 hover:bg-rose-50"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1" /> Reset Demo Data
            </Button>
            <Button onClick={handleSave} size="sm" className="text-xs">
              <Save className="w-3.5 h-3.5 mr-1" /> Save Studio Settings
            </Button>
          </div>
        }
      />

      {savedMsg && (
        <div className="p-3 rounded-md bg-[#EAF2ED] border border-[#CDE1D4] text-[#204E38] text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-[#2A5C45]" />
          <span>Studio settings successfully saved to active store.</span>
        </div>
      )}

      {resetConfirm && (
        <div className="p-4 rounded-md bg-amber-50 border border-amber-200 text-xs text-amber-900 space-y-2">
          <div className="font-semibold flex items-center gap-1.5">
            <Info className="w-4 h-4 text-amber-700" />
            <span>Reset Demo Store to Initial Factory State?</span>
          </div>
          <p className="text-amber-800">
            This will reset all projects, recorded expenses, team allocations, and variation orders back to the initial Rahul Sharma 3BHK dataset.
          </p>
          <div className="flex gap-2 pt-1">
            <Button
              size="sm"
              variant="destructive"
              onClick={handleReset}
              className="text-xs h-7"
            >
              Yes, Reset Everything
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setResetConfirm(false)}
              className="text-xs h-7"
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Section 1: Firm Legal Entity & Identity */}
        <Card>
          <CardHeader className="pb-3 border-b border-stone-100 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-semibold flex items-center gap-1.5">
                <Building className="w-4 h-4 text-[#2A5C45]" />
                Firm Entity & Legal Credentials
              </CardTitle>
              <p className="text-xs text-stone-500">
                Printed on formal client milestone invoices, tax receipts, and purchase orders.
              </p>
            </div>
            <Badge className="bg-[#EAF2ED] text-[#204E38] border-[#CDE1D4] text-[10px]">
              Persisted in Store
            </Badge>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium text-stone-700 block mb-1">
                  Brand / Studio Display Name *
                </label>
                <Input
                  value={form.company_name}
                  onChange={(e) => setForm({ ...form, company_name: e.target.value })}
                  className="text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-stone-700 block mb-1">
                  Registered Legal Entity Name *
                </label>
                <Input
                  value={form.legal_name}
                  onChange={(e) => setForm({ ...form, legal_name: e.target.value })}
                  className="text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-medium text-stone-700 block mb-1">
                  GSTIN Tax Registration Number *
                </label>
                <Input
                  value={form.gstin}
                  onChange={(e) => setForm({ ...form, gstin: e.target.value })}
                  className="font-mono text-xs uppercase"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-stone-700 block mb-1">
                  Official Communication Email *
                </label>
                <Input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-stone-700 block mb-1">
                  Official Contact Phone *
                </label>
                <Input
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="text-xs"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-stone-700 block mb-1">
                Studio Registered Office Address *
              </label>
              <Input
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="text-xs"
              />
            </div>
          </CardContent>
        </Card>

        {/* Section 2: Financial Defaults & Contract Standards */}
        <Card>
          <CardHeader className="pb-3 border-b border-stone-100 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-semibold flex items-center gap-1.5">
                <CreditCard className="w-4 h-4 text-[#2A5C45]" />
                Financial & Commercial Defaults
              </CardTitle>
              <p className="text-xs text-stone-500">
                Default rates applied when generating new turnkey project estimates.
              </p>
            </div>
            <Badge className="bg-[#EAF2ED] text-[#204E38] border-[#CDE1D4] text-[10px]">
              Persisted in Store
            </Badge>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
              <div>
                <label className="text-xs font-medium text-stone-700 block mb-1">
                  Currency Symbol
                </label>
                <Input
                  value={form.currency_symbol}
                  onChange={(e) => setForm({ ...form, currency_symbol: e.target.value })}
                  className="font-mono text-xs"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-stone-700 block mb-1">
                  Default GST Rate (%)
                </label>
                <Input
                  type="number"
                  value={form.default_gst_percentage}
                  onChange={(e) => setForm({ ...form, default_gst_percentage: Number(e.target.value) })}
                  className="text-xs font-semibold"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-stone-700 block mb-1">
                  Standard Timeline (Weeks)
                </label>
                <Input
                  type="number"
                  value={form.standard_timeline_weeks}
                  onChange={(e) => setForm({ ...form, standard_timeline_weeks: Number(e.target.value) })}
                  className="text-xs font-semibold"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-stone-700 block mb-1">
                  Design Fee (₹ / sqft)
                </label>
                <Input
                  type="number"
                  value={form.standard_design_fee_sqft}
                  onChange={(e) => setForm({ ...form, standard_design_fee_sqft: Number(e.target.value) })}
                  className="text-xs font-semibold"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Section 3: Database & Security Architecture Reference */}
        <Card className="border-stone-200 bg-stone-50/40">
          <CardHeader className="pb-3 border-b border-stone-200/60 flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-sm font-semibold flex items-center gap-1.5 text-stone-800">
                <Database className="w-4 h-4 text-stone-600" />
                Backend & Database Architecture
              </CardTitle>
              <p className="text-xs text-stone-500">
                Infrastructure status and Row Level Security (RLS) enforcement.
              </p>
            </div>
            <Badge variant="outline" className="text-[10px] font-mono border-stone-300">
              System Info
            </Badge>
          </CardHeader>
          <CardContent className="p-4 space-y-3 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded bg-white border border-stone-200">
                <span className="text-stone-400 text-[11px] block">Active Storage Engine</span>
                <span className="font-semibold text-stone-900 block mt-0.5">
                  {isSupabaseConfigured ? 'Supabase PostgreSQL Cloud' : 'Local In-Memory / LocalStorage Store'}
                </span>
                <p className="text-[11px] text-stone-500 mt-1">
                  Configured via <code className="font-mono bg-stone-100 px-1 py-0.5 rounded">.env</code>
                </p>
              </div>

              <div className="p-3 rounded bg-white border border-stone-200">
                <span className="text-stone-400 text-[11px] block">Security Policies</span>
                <span className="font-semibold text-stone-900 block mt-0.5">
                  Row Level Security (RLS) Initial Policies Active
                </span>
                <p className="text-[11px] text-stone-500 mt-1">
                  File: <code className="font-mono bg-stone-100 px-1 py-0.5 rounded">supabase/migrations/01_initial_schema.sql</code>
                </p>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <Button type="submit" size="sm" className="text-xs">
                <Save className="w-3.5 h-3.5 mr-1" /> Save All Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
