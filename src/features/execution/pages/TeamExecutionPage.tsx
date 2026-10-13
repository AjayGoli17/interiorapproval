import React from 'react';
import { ScreenPlaceholder } from '@/components/shared/ScreenPlaceholder';
import { HardHat, Camera, Plus, Users } from 'lucide-react';
import { useDemoStore } from '@/stores/demoStore';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export function TeamExecutionPage() {
  const { siteUpdates } = useDemoStore();

  return (
    <ScreenPlaceholder
      title="Site Execution & Daily Logs"
      subtitle="Daily contractor check-ins, labor counts, trade progress logs, and high-res site inspection photos."
      panelName="Project Team Panel"
      screenNumber="Screen 6 of 9"
      icon={HardHat}
      breadcrumbs={[{ label: 'Project Team' }, { label: 'Execution Logs' }]}
      headerActions={
        <Button size="sm">
          <Plus className="w-4 h-4 mr-1.5" /> Post Daily Log
        </Button>
      }
      plannedFeatures={[
        'Daily contractor attendance & labor count breakdown',
        'Direct multi-photo upload from mobile camera at site',
        'Weather conditions, site power/water status, and blocker logging',
        'Client-visible vs internal technical log privacy selector',
      ]}
    >
      <div className="space-y-4 pt-2">
        {siteUpdates.map((update) => (
          <Card key={update.id} className="border-stone-200">
            <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-semibold text-stone-900">
                  {update.title}
                </CardTitle>
                <span className="text-xs text-stone-400">
                  Log Date: {update.date} • Workforce: {update.workforce_count} carpenters & technicians
                </span>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-2 text-xs text-stone-600 space-y-3">
              <p>{update.description}</p>
              {update.work_completed_summary && (
                <div className="p-2.5 rounded bg-stone-50 border border-stone-200/60 font-mono text-[11px] text-stone-700">
                  {update.work_completed_summary}
                </div>
              )}
              {update.photo_urls && update.photo_urls.length > 0 && (
                <div className="flex gap-2 overflow-x-auto pt-1">
                  {update.photo_urls.map((photo, i) => (
                    <img
                      key={i}
                      src={photo}
                      alt="Site log"
                      className="w-28 h-20 object-cover rounded border border-stone-200"
                    />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </ScreenPlaceholder>
  );
}
