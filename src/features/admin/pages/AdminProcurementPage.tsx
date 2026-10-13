import React, { useState } from 'react';
import {
  ShoppingCart,
  Plus,
  Search,
  Truck,
  CheckCircle2,
  Clock,
  Phone,
  Package,
  Calendar,
  AlertCircle,
  X,
  Edit2,
  Filter,
} from 'lucide-react';
import { useDemoStore } from '@/stores/demoStore';
import { ProcurementOrder, ProcurementDeliveryStatus } from '@/types';
import { formatINR, formatDate } from '@/lib/utils';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { EmptyState } from '@/components/shared/EmptyState';
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

export function AdminProcurementPage() {
  const {
    procurementOrders,
    projects,
    materials,
    addProcurementOrder,
    updateProcurementOrder,
  } = useDemoStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Modal State
  const [modalOpen, setModalOpen] = useState(false);
  const [editingOrder, setEditingOrder] = useState<ProcurementOrder | null>(null);

  const [formData, setFormData] = useState({
    po_number: '',
    project_id: projects[0]?.id || '',
    vendor_name: '',
    vendor_contact: '',
    material_name: '',
    quantity: 1,
    unit: 'sets',
    total_amount: 50000,
    order_date: new Date().toISOString().split('T')[0],
    expected_delivery_date: new Date(Date.now() + 10 * 86400000).toISOString().split('T')[0],
    delivery_status: 'ordered' as ProcurementDeliveryStatus,
    payment_status: 'pending' as 'pending' | 'partially_paid' | 'paid',
    notes: '',
  });

  const [formError, setFormError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Status Change Dialog
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [orderForStatus, setOrderForStatus] = useState<ProcurementOrder | null>(null);
  const [newStatus, setNewStatus] = useState<ProcurementDeliveryStatus>('ordered');
  const [newPaymentStatus, setNewPaymentStatus] = useState<'pending' | 'partially_paid' | 'paid'>('pending');

  // Filtering
  const filteredOrders = procurementOrders.filter((o) => {
    const proj = projects.find((p) => p.id === o.project_id);
    const search = searchQuery.toLowerCase();
    const matchesSearch =
      o.po_number.toLowerCase().includes(search) ||
      o.vendor_name.toLowerCase().includes(search) ||
      (o.material_name && o.material_name.toLowerCase().includes(search)) ||
      (proj && proj.title.toLowerCase().includes(search));

    const matchesStatus = statusFilter === 'all' || o.delivery_status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalProcuredAmount = procurementOrders.reduce((sum, o) => sum + o.total_amount, 0);
  const inTransitCount = procurementOrders.filter((o) => o.delivery_status === 'in_transit' || o.delivery_status === 'ordered').length;
  const deliveredCount = procurementOrders.filter((o) => o.delivery_status === 'delivered' || o.delivery_status === 'installed').length;

  const handleOpenCreateModal = () => {
    setEditingOrder(null);
    const count = procurementOrders.length + 1;
    setFormData({
      po_number: `PO-2024-00${count}`,
      project_id: projects[0]?.id || '',
      vendor_name: '',
      vendor_contact: '+91 ',
      material_name: '',
      quantity: 10,
      unit: 'sqft',
      total_amount: 45000,
      order_date: new Date().toISOString().split('T')[0],
      expected_delivery_date: new Date(Date.now() + 10 * 86400000).toISOString().split('T')[0],
      delivery_status: 'approved',
      payment_status: 'pending',
      notes: '',
    });
    setFormError('');
    setModalOpen(true);
  };

  const handleOpenEditModal = (order: ProcurementOrder) => {
    setEditingOrder(order);
    setFormData({
      po_number: order.po_number,
      project_id: order.project_id,
      vendor_name: order.vendor_name,
      vendor_contact: order.vendor_contact || '',
      material_name: order.material_name || '',
      quantity: order.quantity || 1,
      unit: order.unit || 'units',
      total_amount: order.total_amount,
      order_date: order.order_date,
      expected_delivery_date: order.expected_delivery_date || '',
      delivery_status: order.delivery_status,
      payment_status: order.payment_status,
      notes: order.notes || '',
    });
    setFormError('');
    setModalOpen(true);
  };

  const handleOpenQuickStatus = (order: ProcurementOrder) => {
    setOrderForStatus(order);
    setNewStatus(order.delivery_status);
    setNewPaymentStatus(order.payment_status);
    setStatusModalOpen(true);
  };

  const handleSaveQuickStatus = () => {
    if (orderForStatus) {
      updateProcurementOrder(orderForStatus.id, {
        delivery_status: newStatus,
        payment_status: newPaymentStatus,
      });
      setSuccessMsg(`Order ${orderForStatus.po_number} status updated to "${newStatus}".`);
      setStatusModalOpen(false);
      setTimeout(() => setSuccessMsg(''), 4000);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.vendor_name.trim()) {
      setFormError('Please enter supplier / vendor name');
      return;
    }
    if (!formData.material_name.trim()) {
      setFormError('Please enter the material / item specifications');
      return;
    }
    if (formData.total_amount <= 0) {
      setFormError('Please enter a valid purchase order amount');
      return;
    }

    if (editingOrder) {
      updateProcurementOrder(editingOrder.id, formData);
      setSuccessMsg(`Purchase order ${formData.po_number} updated.`);
    } else {
      const created = addProcurementOrder(formData);
      setSuccessMsg(`Purchase order ${created.po_number} issued to ${created.vendor_name}.`);
    }

    setModalOpen(false);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Procurement & Vendor Master"
        subtitle="Manage supplier purchase orders, material consignments, logistics status, and trade payment settlement."
        breadcrumbs={[{ label: 'Admin' }, { label: 'Procurement' }]}
        actions={
          <Button onClick={handleOpenCreateModal} size="sm" className="text-xs">
            <Plus className="w-3.5 h-3.5 mr-1.5" /> Issue Purchase Order (PO)
          </Button>
        }
      />

      {/* Success Notification */}
      {successMsg && (
        <div className="p-3 rounded-md bg-[#EAF2ED] border border-[#CDE1D4] text-[#204E38] text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-[#2A5C45]" />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg('')} className="text-stone-500 hover:text-stone-800">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Procurement KPI Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Card className="p-3.5">
          <div className="flex items-center justify-between text-stone-500 mb-1">
            <span className="text-[11px] uppercase tracking-wider font-medium">Total Committed POs</span>
            <ShoppingCart className="w-4 h-4 text-[#2A5C45]" />
          </div>
          <span className="text-xl font-bold text-stone-900 block">
            {formatINR(totalProcuredAmount)}
          </span>
          <span className="text-xs text-stone-500">
            Across {procurementOrders.length} supplier orders
          </span>
        </Card>

        <Card className="p-3.5">
          <div className="flex items-center justify-between text-stone-500 mb-1">
            <span className="text-[11px] uppercase tracking-wider font-medium">In Transit / Dispatch</span>
            <Truck className="w-4 h-4 text-amber-600" />
          </div>
          <span className="text-xl font-bold text-amber-800 block">
            {inTransitCount} Consignments
          </span>
          <span className="text-xs text-stone-500">
            Active vendor fulfillment & freight
          </span>
        </Card>

        <Card className="p-3.5">
          <div className="flex items-center justify-between text-stone-500 mb-1">
            <span className="text-[11px] uppercase tracking-wider font-medium">Delivered & Installed</span>
            <CheckCircle2 className="w-4 h-4 text-[#2A5C45]" />
          </div>
          <span className="text-xl font-bold text-[#204E38] block">
            {deliveredCount} Inspected
          </span>
          <span className="text-xs text-stone-500">
            Received and checked by site supervisors
          </span>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3 rounded-lg border border-stone-200">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          <Input
            placeholder="Search by PO number, supplier, or material spec..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 text-xs h-9"
          />
        </div>

        <div className="flex items-center gap-2">
          <div className="w-44">
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs h-9"
            >
              <option value="all">All Delivery Statuses</option>
              <option value="approved">Approved</option>
              <option value="ordered">Ordered</option>
              <option value="in_transit">In Transit</option>
              <option value="delivered">Delivered</option>
              <option value="installed">Installed</option>
              <option value="delayed">Delayed</option>
            </Select>
          </div>

          {(searchQuery || statusFilter !== 'all') && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery('');
                setStatusFilter('all');
              }}
              className="text-xs h-9 text-stone-500"
            >
              Reset
            </Button>
          )}
        </div>
      </div>

      {/* Orders Table */}
      {filteredOrders.length === 0 ? (
        <EmptyState
          icon={ShoppingCart}
          title="No purchase orders found"
          description="No purchase orders match your search criteria."
          actionLabel="Issue Purchase Order"
          onAction={handleOpenCreateModal}
        />
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>PO Number</TableHead>
              <TableHead>Material / Specification</TableHead>
              <TableHead>Vendor & Contact</TableHead>
              <TableHead>Project</TableHead>
              <TableHead>Amount & Qty</TableHead>
              <TableHead>Expected Delivery</TableHead>
              <TableHead>Delivery Status</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map((order) => {
              const proj = projects.find((p) => p.id === order.project_id);

              return (
                <TableRow key={order.id}>
                  <TableCell className="font-mono text-xs font-semibold text-stone-800">
                    {order.po_number}
                  </TableCell>
                  <TableCell className="text-xs">
                    <span className="font-medium text-stone-900 block">
                      {order.material_name || 'Specified Material'}
                    </span>
                    {order.quantity && (
                      <span className="text-[11px] text-stone-400">
                        Qty: {order.quantity} {order.unit || 'units'}
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-xs text-stone-600">
                    <span className="font-medium text-stone-800 block">{order.vendor_name}</span>
                    {order.vendor_contact && (
                      <span className="text-[11px] text-stone-400">{order.vendor_contact}</span>
                    )}
                  </TableCell>
                  <TableCell className="text-xs text-stone-500">
                    {proj?.project_code || 'General'}
                  </TableCell>
                  <TableCell className="text-xs font-semibold text-stone-900 whitespace-nowrap">
                    {formatINR(order.total_amount)}
                  </TableCell>
                  <TableCell className="text-xs text-stone-600 whitespace-nowrap font-mono">
                    {formatDate(order.expected_delivery_date)}
                  </TableCell>
                  <TableCell>
                    <button
                      onClick={() => handleOpenQuickStatus(order)}
                      className="cursor-pointer group flex items-center gap-1"
                      title="Click to update delivery status"
                    >
                      <StatusBadge status={order.delivery_status} />
                    </button>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={order.payment_status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenQuickStatus(order)}
                        className="h-7 text-xs px-2 text-stone-600"
                        title="Update Status"
                      >
                        Status
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenEditModal(order)}
                        className="h-7 w-7 p-0 text-stone-500 hover:text-stone-800"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}

      {/* Add / Edit Order Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogHeader>
          <DialogTitle>
            {editingOrder ? `Edit Purchase Order: ${editingOrder.po_number}` : 'Issue Master Purchase Order (PO)'}
          </DialogTitle>
          <DialogDescription>
            Generate vendor purchase agreements with agreed prices, delivery schedules, and payment terms.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {formError && (
            <div className="p-2.5 rounded bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-stone-700 block mb-1">
                PO Number *
              </label>
              <Input
                value={formData.po_number}
                onChange={(e) => setFormData({ ...formData, po_number: e.target.value })}
                required
                className="font-mono text-xs"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-stone-700 block mb-1">
                Project *
              </label>
              <Select
                value={formData.project_id}
                onChange={(e) => setFormData({ ...formData, project_id: e.target.value })}
                className="text-xs"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title} ({p.project_code})
                  </option>
                ))}
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-stone-700 block mb-1">
                Vendor / Supplier Name *
              </label>
              <Input
                placeholder="e.g. Häfele & Blum Hardware Galleria"
                value={formData.vendor_name}
                onChange={(e) => setFormData({ ...formData, vendor_name: e.target.value })}
                required
                className="text-xs"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-stone-700 block mb-1">
                Vendor Contact / Phone
              </label>
              <Input
                placeholder="+91 98492 33445"
                value={formData.vendor_contact}
                onChange={(e) => setFormData({ ...formData, vendor_contact: e.target.value })}
                className="text-xs"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-stone-700 block mb-1">
              Material Specification / Line Item *
            </label>
            <Input
              placeholder="e.g. Blum Tandembox Antaro 30kg Soft-Close Drawer Sets"
              value={formData.material_name}
              onChange={(e) => setFormData({ ...formData, material_name: e.target.value })}
              required
              className="text-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs font-medium text-stone-700 block mb-1">
                Quantity
              </label>
              <Input
                type="number"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: Number(e.target.value) })}
                className="text-xs"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-stone-700 block mb-1">
                Unit
              </label>
              <Input
                placeholder="sqft / sets / pcs"
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                className="text-xs"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-stone-700 block mb-1">
                Total PO Amount (₹) *
              </label>
              <Input
                type="number"
                step="500"
                value={formData.total_amount}
                onChange={(e) => setFormData({ ...formData, total_amount: Number(e.target.value) })}
                required
                className="text-xs font-semibold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-stone-700 block mb-1">
                Order Date
              </label>
              <Input
                type="date"
                value={formData.order_date}
                onChange={(e) => setFormData({ ...formData, order_date: e.target.value })}
                className="text-xs"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-stone-700 block mb-1">
                Expected Site Delivery
              </label>
              <Input
                type="date"
                value={formData.expected_delivery_date}
                onChange={(e) => setFormData({ ...formData, expected_delivery_date: e.target.value })}
                className="text-xs"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-medium text-stone-700 block mb-1">
                Delivery Status
              </label>
              <Select
                value={formData.delivery_status}
                onChange={(e) => setFormData({ ...formData, delivery_status: e.target.value as any })}
                className="text-xs"
              >
                <option value="approved">Approved (Awaiting Dispatch)</option>
                <option value="ordered">Ordered</option>
                <option value="in_transit">In Transit</option>
                <option value="delivered">Delivered on Site</option>
                <option value="installed">Installed</option>
                <option value="delayed">Delayed</option>
              </Select>
            </div>
            <div>
              <label className="text-xs font-medium text-stone-700 block mb-1">
                Vendor Payment Status
              </label>
              <Select
                value={formData.payment_status}
                onChange={(e) => setFormData({ ...formData, payment_status: e.target.value as any })}
                className="text-xs"
              >
                <option value="pending">Pending</option>
                <option value="partially_paid">Partially Paid</option>
                <option value="paid">Fully Settled</option>
              </Select>
            </div>
          </div>

          <div>
            <label className="text-xs font-medium text-stone-700 block mb-1">
              Order Notes & Freight Tracking
            </label>
            <Textarea
              placeholder="e.g. Bluedart Air cargo docket number, inspection guidelines for site supervisor..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="text-xs"
              rows={2}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" size="sm">
              {editingOrder ? 'Save Order Changes' : 'Issue Purchase Order'}
            </Button>
          </DialogFooter>
        </form>
      </Dialog>

      {/* Quick Status Update Modal */}
      <Dialog open={statusModalOpen} onOpenChange={setStatusModalOpen}>
        <DialogHeader>
          <DialogTitle>Update Order Status: {orderForStatus?.po_number}</DialogTitle>
          <DialogDescription>
            Update logistics delivery and vendor disbursement status for {orderForStatus?.vendor_name}.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div>
            <label className="text-xs font-medium text-stone-700 block mb-1">
              Delivery Logistics Status
            </label>
            <Select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value as ProcurementDeliveryStatus)}
              className="text-xs"
            >
              <option value="approved">Approved</option>
              <option value="ordered">Ordered</option>
              <option value="in_transit">In Transit (Dispatched)</option>
              <option value="delivered">Delivered on Site</option>
              <option value="installed">Installed</option>
              <option value="delayed">Delayed</option>
            </Select>
          </div>

          <div>
            <label className="text-xs font-medium text-stone-700 block mb-1">
              Vendor Payment Settlement
            </label>
            <Select
              value={newPaymentStatus}
              onChange={(e) => setNewPaymentStatus(e.target.value as any)}
              className="text-xs"
            >
              <option value="pending">Pending</option>
              <option value="partially_paid">Partially Paid</option>
              <option value="paid">Fully Paid</option>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setStatusModalOpen(false)}
          >
            Cancel
          </Button>
          <Button size="sm" onClick={handleSaveQuickStatus}>
            Save Status
          </Button>
        </DialogFooter>
      </Dialog>
    </div>
  );
}
