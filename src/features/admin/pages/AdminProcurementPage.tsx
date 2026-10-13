import React from 'react';
import { ScreenPlaceholder } from '@/components/shared/ScreenPlaceholder';
import { ShoppingCart, Truck, CheckCheck } from 'lucide-react';
import { useDemoStore } from '@/stores/demoStore';
import { formatINR } from '@/lib/utils';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { StatusBadge } from '@/components/shared/StatusBadge';

export function AdminProcurementPage() {
  const { procurementOrders } = useDemoStore();

  return (
    <ScreenPlaceholder
      title="Procurement & Vendor Master"
      subtitle="Centralized purchase orders, vendor rate contracts, delivery timelines, and payment terms."
      panelName="Admin Panel"
      screenNumber="Screen 6 of 8"
      icon={ShoppingCart}
      breadcrumbs={[{ label: 'Admin' }, { label: 'Procurement' }]}
      plannedFeatures={[
        'Centralized purchase order (PO) generation & director sign-off',
        'Vendor directory with negotiated discount tiers and payment terms',
        'Material dispatch & on-site transit logistics tracking',
        'Defective material return and credit note management',
      ]}
    >
      <div className="pt-2">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>PO Number</TableHead>
              <TableHead>Supplier / Vendor</TableHead>
              <TableHead>Order Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Delivery Status</TableHead>
              <TableHead>Payment</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {procurementOrders.map((o) => (
              <TableRow key={o.id}>
                <TableCell className="font-mono text-xs font-semibold">{o.po_number}</TableCell>
                <TableCell className="text-xs font-medium text-stone-900">{o.vendor_name}</TableCell>
                <TableCell className="text-xs text-stone-500">{o.order_date}</TableCell>
                <TableCell className="text-xs font-semibold">{formatINR(o.total_amount)}</TableCell>
                <TableCell>
                  <StatusBadge status={o.delivery_status} />
                </TableCell>
                <TableCell>
                  <StatusBadge status={o.payment_status} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </ScreenPlaceholder>
  );
}
