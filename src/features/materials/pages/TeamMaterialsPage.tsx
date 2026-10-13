import React from 'react';
import { ScreenPlaceholder } from '@/components/shared/ScreenPlaceholder';
import { Package, Plus } from 'lucide-react';
import { useDemoStore } from '@/stores/demoStore';
import { formatINR } from '@/lib/utils';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';

export function TeamMaterialsPage() {
  const { materials } = useDemoStore();

  return (
    <ScreenPlaceholder
      title="Material Specifications & BOQ"
      subtitle="Bill of Quantities (BOQ), material brands, laminate shade codes, unit quantities, and sample approvals."
      panelName="Project Team Panel"
      screenNumber="Screen 5 of 9"
      icon={Package}
      breadcrumbs={[{ label: 'Project Team' }, { label: 'Materials' }]}
      headerActions={
        <Button size="sm">
          <Plus className="w-4 h-4 mr-1.5" /> Add BOQ Item
        </Button>
      }
      plannedFeatures={[
        'Room-wise material schedule and finish schedules',
        'Physical sample submission & client physical swatch approval status',
        'Budget rate vs actual procurement quote variance checker',
        'Direct conversion from approved BOQ item to Purchase Order (PO)',
      ]}
    >
      <div className="pt-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Code</TableHead>
              <TableHead>Material / Item</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Brand & Spec</TableHead>
              <TableHead>Qty & Unit</TableHead>
              <TableHead>Est Rate</TableHead>
              <TableHead>Approval</TableHead>
              <TableHead>Procurement</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {materials.map((m) => (
              <TableRow key={m.id}>
                <TableCell className="font-mono text-xs font-semibold">{m.item_code}</TableCell>
                <TableCell className="text-xs font-medium text-stone-900">{m.name}</TableCell>
                <TableCell className="text-xs uppercase font-mono text-stone-500">{m.category}</TableCell>
                <TableCell className="text-xs text-stone-600 max-w-xs truncate">{m.brand_spec || '—'}</TableCell>
                <TableCell className="text-xs">{m.quantity} {m.unit}</TableCell>
                <TableCell className="text-xs font-semibold">{formatINR(m.estimated_rate)}</TableCell>
                <TableCell>
                  <StatusBadge status={m.approval_status} />
                </TableCell>
                <TableCell>
                  <StatusBadge status={m.procurement_status} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </ScreenPlaceholder>
  );
}
