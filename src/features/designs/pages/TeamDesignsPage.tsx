import React from 'react';
import { ScreenPlaceholder } from '@/components/shared/ScreenPlaceholder';
import { Layers, Plus, Eye, History } from 'lucide-react';
import { useDemoStore } from '@/stores/demoStore';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';

export function TeamDesignsPage() {
  const { designVersions, rooms } = useDemoStore();

  return (
    <ScreenPlaceholder
      title="Design Studio & Version Control"
      subtitle="2D CAD layouts, 3D photorealistic renders, moodboards, and version revision history."
      panelName="Project Team Panel"
      screenNumber="Screen 3 of 9"
      icon={Layers}
      breadcrumbs={[{ label: 'Project Team' }, { label: 'Designs' }]}
      headerActions={
        <Button size="sm">
          <Plus className="w-4 h-4 mr-1.5" /> Upload New Render
        </Button>
      }
      plannedFeatures={[
        'Room-wise design package versioning (v1.0 -> v2.1 revision tracking)',
        'Side-by-side 3D render diff inspection tool',
        'Direct link to client review feedback & designer response notes',
        'High-resolution drawing and CAD file attachment repository',
      ]}
    >
      <div className="pt-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Version</TableHead>
              <TableHead>Package Title</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Designer Notes</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {designVersions.map((d) => (
              <TableRow key={d.id}>
                <TableCell className="font-mono text-xs font-semibold text-[#2A5C45]">{d.version_number}</TableCell>
                <TableCell className="font-medium text-stone-900 text-xs">{d.title}</TableCell>
                <TableCell className="text-xs uppercase font-mono text-stone-500">{d.render_type}</TableCell>
                <TableCell className="text-xs text-stone-500 max-w-xs truncate">{d.designer_notes || '—'}</TableCell>
                <TableCell>
                  <StatusBadge status={d.status} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </ScreenPlaceholder>
  );
}
