import React from 'react';
import { ScreenPlaceholder } from '@/components/shared/ScreenPlaceholder';
import { Settings, Shield, Sliders, FileText } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export function AdminSettingsPage() {
  return (
    <ScreenPlaceholder
      title="Studio Settings & Rate Cards"
      subtitle="Firm profile, taxation rules (GST), standard material rate benchmarks, and user access policies."
      panelName="Admin Panel"
      screenNumber="Screen 8 of 8"
      icon={Settings}
      breadcrumbs={[{ label: 'Admin' }, { label: 'Settings' }]}
      plannedFeatures={[
        'Studio details: Legal entity name, GSTIN, registered office, logo',
        'Standard rate card templates (sqft design fees, 3D render charges)',
        'Payment milestone templates (e.g. 10%-25%-35%-20%-10% standard schedule)',
        'Database connection credentials & Supabase RLS security config',
      ]}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        <div className="p-3.5 rounded border border-stone-200 bg-stone-50/50 text-xs">
          <span className="font-semibold text-stone-800 block mb-1">Company Profile</span>
          <p className="text-stone-500">StudioFlow Interiors Pvt Ltd</p>
          <p className="text-stone-500">GSTIN: 36AAACS1429B1Z8 • Jubilee Hills, Hyderabad</p>
        </div>
        <div className="p-3.5 rounded border border-stone-200 bg-stone-50/50 text-xs">
          <span className="font-semibold text-stone-800 block mb-1">Standard Payment Terms</span>
          <p className="text-stone-500">Default 5-stage milestone release schedule</p>
          <p className="text-stone-500">Net 7 days invoice clearance window</p>
        </div>
      </div>
    </ScreenPlaceholder>
  );
}
