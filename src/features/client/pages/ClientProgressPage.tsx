import React from 'react';
import { ScreenPlaceholder } from '@/components/shared/ScreenPlaceholder';
import { HardHat, Camera, Calendar, CheckCircle2 } from 'lucide-react';
import { useDemoStore } from '@/stores/demoStore';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';

export function ClientProgressPage() {
  const { siteUpdates } = useDemoStore();

  return (
    <ScreenPlaceholder
      title="Live Site Progress"
      subtitle="Follow real-time construction progress, weekly supervisor photo updates, and milestone stages."
      panelName="Client Portal"
      screenNumber="Screen 4 of 5"
      icon={HardHat}
      plannedFeatures={[
        'Chronological site photo timeline with date stamps',
        'Stage progress tracker (Demolition -> Civil -> Carpentry -> Painting -> Handover)',
        'Weekly video walkthrough uploads from site manager',
        'Direct "Ask a Question about this update" messaging drawer',
      ]}
    >
      <div className="space-y-4 pt-2">
        {siteUpdates.map((update) => (
          <Card key={update.id} className="border-stone-200">
            <CardHeader className="p-4 pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold text-stone-900">
                  {update.title}
                </CardTitle>
                <span className="text-xs text-stone-500 font-medium">
                  {update.date}
                </span>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-2 text-xs text-stone-600 space-y-3">
              <p>{update.description}</p>
              {update.photo_urls && update.photo_urls.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  {update.photo_urls.map((photo, i) => (
                    <img
                      key={i}
                      src={photo}
                      alt="Site progress"
                      className="w-full h-48 object-cover rounded-md border border-stone-200"
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
