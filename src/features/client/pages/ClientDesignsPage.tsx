import React from 'react';
import { ScreenPlaceholder } from '@/components/shared/ScreenPlaceholder';
import { Layers, Eye, Maximize2 } from 'lucide-react';
import { useDemoStore } from '@/stores/demoStore';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Card, CardContent } from '@/components/ui/card';

export function ClientDesignsPage() {
  const { designVersions } = useDemoStore();

  return (
    <ScreenPlaceholder
      title="Design Presentation & 3D Views"
      subtitle="Explore realistic 3D photorealistic renderings, room elevations, and curated moodboards."
      panelName="Client Portal"
      screenNumber="Screen 2 of 5"
      icon={Layers}
      plannedFeatures={[
        'Full-screen high-resolution 3D walkthrough viewer',
        'Room-by-room filter tabs (Living Room, Kitchen, Master Bedroom, etc.)',
        'Designer notes explaining lighting choices and material textures',
        'Direct "Request Revision" or "Approve Design" interaction buttons',
      ]}
    >
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
        {designVersions.map((design) => (
          <Card key={design.id} className="overflow-hidden border-stone-200">
            {design.preview_url ? (
              <img
                src={design.preview_url}
                alt={design.title}
                className="w-full h-40 object-cover"
              />
            ) : (
              <div className="w-full h-40 bg-stone-100 flex items-center justify-center text-stone-400">
                Preview Pending
              </div>
            )}
            <CardContent className="p-3 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-stone-900 truncate">
                  {design.title}
                </span>
                <span className="font-mono text-[11px] text-[#2A5C45] font-semibold">
                  {design.version_number}
                </span>
              </div>
              <p className="text-stone-500 text-[11px] line-clamp-2">
                {design.description}
              </p>
              <div className="pt-1 flex items-center justify-between">
                <StatusBadge status={design.status} />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </ScreenPlaceholder>
  );
}
