import React from 'react';
import { ScreenPlaceholder } from '@/components/shared/ScreenPlaceholder';
import { FolderKanban, MapPin, Ruler, CheckCircle2 } from 'lucide-react';
import { useDemoStore } from '@/stores/demoStore';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { StatusBadge } from '@/components/shared/StatusBadge';

export function TeamProjectOverviewPage() {
  const { projects, currentProjectId, rooms } = useDemoStore();
  const currentProject = projects.find((p) => p.id === currentProjectId) || projects[0];
  const projectRooms = rooms.filter((r) => r.project_id === currentProject?.id);

  return (
    <ScreenPlaceholder
      title="Project Overview & Room Specs"
      subtitle="Architectural scope breakdown, room dimensions, design statuses, and site constraints."
      panelName="Project Team Panel"
      screenNumber="Screen 2 of 9"
      icon={FolderKanban}
      breadcrumbs={[{ label: 'Project Team' }, { label: 'Project Overview' }]}
      plannedFeatures={[
        'Room-by-room architectural breakdown (carpet area, ceiling height, coordinates)',
        'Key milestone deadlines and handover timeline',
        'Site access rules (gate pass, debris disposal, noisy work hours)',
        'Assigned contractors and technical consultant contacts',
      ]}
    >
      <div className="pt-2 space-y-4">
        <div className="p-3.5 rounded border border-stone-200 bg-stone-50/50 text-xs flex flex-wrap gap-6">
          <div>
            <span className="text-stone-400 block text-[11px]">Location</span>
            <span className="font-semibold text-stone-800">{currentProject.location}</span>
          </div>
          <div>
            <span className="text-stone-400 block text-[11px]">Carpet Area</span>
            <span className="font-semibold text-stone-800">{currentProject.carpet_area_sqft} sqft</span>
          </div>
          <div>
            <span className="text-stone-400 block text-[11px]">Property Type</span>
            <span className="font-semibold text-stone-800">{currentProject.property_type}</span>
          </div>
          <div>
            <span className="text-stone-400 block text-[11px]">Target Handover</span>
            <span className="font-semibold text-stone-800">{currentProject.target_handover_date}</span>
          </div>
        </div>

        <div>
          <span className="text-xs font-semibold text-stone-800 block mb-2">
            Configured Rooms ({projectRooms.length})
          </span>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Room Name</TableHead>
                <TableHead>Floor</TableHead>
                <TableHead>Dimensions</TableHead>
                <TableHead>Area (sqft)</TableHead>
                <TableHead>Current Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projectRooms.map((r) => (
                <TableRow key={r.id}>
                  <TableCell className="font-medium text-stone-900">{r.name}</TableCell>
                  <TableCell className="text-xs text-stone-500">{r.floor}</TableCell>
                  <TableCell className="text-xs text-stone-600 font-mono">{r.dimensions}</TableCell>
                  <TableCell className="text-xs font-semibold">{r.area_sqft} sqft</TableCell>
                  <TableCell>
                    <StatusBadge status={r.status} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </ScreenPlaceholder>
  );
}
