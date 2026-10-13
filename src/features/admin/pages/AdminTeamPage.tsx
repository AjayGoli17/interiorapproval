import React from 'react';
import { ScreenPlaceholder } from '@/components/shared/ScreenPlaceholder';
import { UserCheck, ShieldCheck, Briefcase } from 'lucide-react';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

export function AdminTeamPage() {
  return (
    <ScreenPlaceholder
      title="Team & Resource Allocation"
      subtitle="Workload balancing, project staffing, and roles across designers, 3D visualizers, and site managers."
      panelName="Admin Panel"
      screenNumber="Screen 4 of 8"
      icon={UserCheck}
      breadcrumbs={[{ label: 'Admin' }, { label: 'Team' }]}
      plannedFeatures={[
        'Designer and site engineer workload capacity trackers',
        'Multi-project assignment matrix',
        'Performance metrics: turn-around times on 3D renders & snag closures',
        'Sub-contractor and trade lead directory',
      ]}
    >
      <div className="pt-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Team Member</TableHead>
              <TableHead>Primary Role</TableHead>
              <TableHead>Assigned Projects</TableHead>
              <TableHead>Active Load</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium text-stone-900">Arjun Mehta</TableCell>
              <TableCell className="text-stone-600 text-xs">Senior Designer & Site Lead</TableCell>
              <TableCell className="text-stone-800 text-xs">Rahul Sharma 3BHK, Palm Meadows</TableCell>
              <TableCell className="text-stone-700 text-xs font-medium">85% Capacity</TableCell>
              <TableCell>
                <Badge className="bg-[#EAF2ED] text-[#204E38] text-[10px]">Active</Badge>
              </TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium text-stone-900">Priya Nair</TableCell>
              <TableCell className="text-stone-600 text-xs">Studio Director</TableCell>
              <TableCell className="text-stone-800 text-xs">Studio Oversight (All)</TableCell>
              <TableCell className="text-stone-700 text-xs font-medium">Full</TableCell>
              <TableCell>
                <Badge className="bg-[#EAF2ED] text-[#204E38] text-[10px]">Active</Badge>
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </ScreenPlaceholder>
  );
}
