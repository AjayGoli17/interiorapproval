import React from 'react';
import { ScreenPlaceholder } from '@/components/shared/ScreenPlaceholder';
import { Users, Mail, Phone, ExternalLink } from 'lucide-react';
import { useDemoStore } from '@/stores/demoStore';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';

export function AdminClientsPage() {
  const { projects } = useDemoStore();

  return (
    <ScreenPlaceholder
      title="Client Accounts"
      subtitle="Directory of client relationships, contact channels, and active project assignments."
      panelName="Admin Panel"
      screenNumber="Screen 3 of 8"
      icon={Users}
      breadcrumbs={[{ label: 'Admin' }, { label: 'Clients' }]}
      plannedFeatures={[
        'Client profile management & contact cards',
        'Direct magic link access to Client Portal view',
        'Communication preferences & agreement histories',
        'Payment compliance status indicators',
      ]}
    >
      <div className="pt-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client Name</TableHead>
              <TableHead>Contact Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Associated Project</TableHead>
              <TableHead>City</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium text-stone-900">Rahul Sharma</TableCell>
              <TableCell className="text-stone-600 text-xs">rahul.sharma@gmail.com</TableCell>
              <TableCell className="text-stone-600 text-xs">+91 98490 34567</TableCell>
              <TableCell className="text-stone-800 text-xs font-medium">3BHK Apartment (PRJ-HYD-2401)</TableCell>
              <TableCell className="text-stone-500 text-xs">Hyderabad</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium text-stone-900">Ananya Reddy</TableCell>
              <TableCell className="text-stone-600 text-xs">ananya.reddy@gmail.com</TableCell>
              <TableCell className="text-stone-600 text-xs">+91 98490 99887</TableCell>
              <TableCell className="text-stone-800 text-xs font-medium">4BHK Villa (PRJ-HYD-2402)</TableCell>
              <TableCell className="text-stone-500 text-xs">Hyderabad</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </ScreenPlaceholder>
  );
}
