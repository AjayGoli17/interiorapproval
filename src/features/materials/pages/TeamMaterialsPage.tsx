import React, { useState } from 'react';
import {
  Package,
  ShoppingCart,
  Plus,
  Search,
  Filter,
  DollarSign,
  Calendar,
  Truck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Edit,
  Send,
  ExternalLink,
} from 'lucide-react';
import { useDemoStore } from '@/stores/demoStore';
import { formatINR, formatDate } from '@/lib/utils';
import { PageHeader } from '@/components/shared/PageHeader';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { StatusBadge } from '@/components/shared/StatusBadge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Material, ProcurementOrder } from '@/types';

export function TeamMaterialsPage() {
  const {
    projects,
    currentProjectId,
    setCurrentProject,
    rooms,
    materials,
    procurementOrders,
    addMaterial,
    updateMaterial,
    deleteMaterial,
    addProcurementOrder,
    updateProcurementOrder,
  } = useDemoStore();

  const activeProject = projects.find((p) => p.id === currentProjectId) || projects[0];

  // Active Tab: 'boq' | 'procurement'
  const [activeTab, setActiveTab] = useState<'boq' | 'procurement'>('boq');

  // Filters for BOQ
  const [boqCategoryFilter, setBoqCategoryFilter] = useState('all');
  const [boqRoomFilter, setBoqRoomFilter] = useState('all');
  const [boqProcStatusFilter, setBoqProcStatusFilter] = useState('all');
  const [boqSearch, setBoqSearch] = useState('');

  // Filters for POs
  const [poStatusFilter, setPoStatusFilter] = useState('all');
  const [poSearch, setPoSearch] = useState('');

  // Dialog States
  const [isAddMaterialOpen, setIsAddMaterialOpen] = useState(false);
  const [isEditMaterialOpen, setIsEditMaterialOpen] = useState(false);
  const [isCreatePOOpen, setIsCreatePOOpen] = useState(false);
  const [isUpdateDeliveryOpen, setIsUpdateDeliveryOpen] = useState(false);

  // Selected Records
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [selectedPO, setSelectedPO] = useState<ProcurementOrder | null>(null);

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Form State: Add Material
  const [matFormData, setMatFormData] = useState({
    item_code: '',
    name: '',
    category: 'woodwork' as Material['category'],
    room_id: '',
    brand_spec: '',
    unit: 'sqft',
    quantity: 100,
    estimated_rate: 250,
    actual_rate: 240,
    proposed_price: 250,
    selection_status: 'proposed' as Material['selection_status'],
    approval_status: 'spec_draft' as Material['approval_status'],
    procurement_status: 'not_ordered' as Material['procurement_status'],
  });

  // Form State: Create PO
  const [poFormData, setPoFormData] = useState({
    material_id: '',
    po_number: '',
    vendor_name: '',
    vendor_contact: '',
    quantity: 100,
    unit: 'sqft',
    total_amount: 25000,
    order_date: new Date().toISOString().split('T')[0],
    expected_delivery_date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    notes: '',
  });

  // Form State: Delivery Status
  const [deliveryStatusData, setDeliveryStatusData] = useState({
    delivery_status: 'in_transit' as ProcurementOrder['delivery_status'],
    notes: '',
  });

  // Project scoped records
  const projectRooms = rooms.filter((r) => r.project_id === activeProject?.id);
  const projectMaterials = materials.filter((m) => m.project_id === activeProject?.id);
  const projectPOs = procurementOrders.filter((po) => po.project_id === activeProject?.id);

  // Filtered BOQ
  const filteredMaterials = projectMaterials.filter((m) => {
    const matchesCat = boqCategoryFilter === 'all' || m.category === boqCategoryFilter;
    const matchesRoom = boqRoomFilter === 'all' || m.room_id === boqRoomFilter;
    const matchesProc = boqProcStatusFilter === 'all' || m.procurement_status === boqProcStatusFilter;
    const matchesSearch =
      m.name.toLowerCase().includes(boqSearch.toLowerCase()) ||
      m.item_code.toLowerCase().includes(boqSearch.toLowerCase()) ||
      (m.brand_spec || '').toLowerCase().includes(boqSearch.toLowerCase());
    return matchesCat && matchesRoom && matchesProc && matchesSearch;
  });

  // Filtered POs
  const filteredPOs = projectPOs.filter((po) => {
    const matchesStatus = poStatusFilter === 'all' || po.delivery_status === poStatusFilter;
    const matchesSearch =
      po.po_number.toLowerCase().includes(poSearch.toLowerCase()) ||
      po.vendor_name.toLowerCase().includes(poSearch.toLowerCase()) ||
      (po.material_name || '').toLowerCase().includes(poSearch.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Metric aggregates
  const totalBOQValue = projectMaterials.reduce((acc, m) => acc + (m.actual_rate || m.estimated_rate) * m.quantity, 0);
  const totalDeliveredPOs = projectPOs.filter((po) => po.delivery_status === 'delivered').length;
  const totalInTransitPOs = projectPOs.filter((po) => po.delivery_status === 'in_transit').length;

  const handleCreateMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!matFormData.name || !activeProject) return;

    const code = matFormData.item_code || `MAT-00${projectMaterials.length + 1}`;
    addMaterial({
      project_id: activeProject.id,
      room_id: matFormData.room_id || projectRooms[0]?.id || '',
      item_code: code,
      name: matFormData.name,
      category: matFormData.category,
      brand_spec: matFormData.brand_spec,
      unit: matFormData.unit,
      quantity: Number(matFormData.quantity) || 1,
      estimated_rate: Number(matFormData.estimated_rate) || 0,
      actual_rate: Number(matFormData.actual_rate) || Number(matFormData.estimated_rate) || 0,
      proposed_price: Number(matFormData.proposed_price) || Number(matFormData.estimated_rate) || 0,
      selection_status: matFormData.selection_status,
      approval_status: matFormData.approval_status,
      procurement_status: matFormData.procurement_status,
    });

    setIsAddMaterialOpen(false);
    showToast(`Material item ${code} added to BOQ.`);
  };

  const handleEditMaterial = (material: Material) => {
    setSelectedMaterial(material);
    setMatFormData({
      item_code: material.item_code,
      name: material.name,
      category: material.category,
      room_id: material.room_id || '',
      brand_spec: material.brand_spec || '',
      unit: material.unit,
      quantity: material.quantity,
      estimated_rate: material.estimated_rate,
      actual_rate: material.actual_rate || material.estimated_rate,
      proposed_price: material.proposed_price || material.estimated_rate,
      selection_status: material.selection_status || 'proposed',
      approval_status: material.approval_status,
      procurement_status: material.procurement_status,
    });
    setIsEditMaterialOpen(true);
  };

  const handleUpdateMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMaterial) return;

    updateMaterial(selectedMaterial.id, {
      name: matFormData.name,
      category: matFormData.category,
      room_id: matFormData.room_id,
      brand_spec: matFormData.brand_spec,
      unit: matFormData.unit,
      quantity: Number(matFormData.quantity),
      estimated_rate: Number(matFormData.estimated_rate),
      actual_rate: Number(matFormData.actual_rate),
      proposed_price: Number(matFormData.proposed_price),
      selection_status: matFormData.selection_status,
      approval_status: matFormData.approval_status,
      procurement_status: matFormData.procurement_status,
    });

    setIsEditMaterialOpen(false);
    setSelectedMaterial(null);
    showToast(`Material ${selectedMaterial.item_code} updated.`);
  };

  const handleOpenCreatePO = (preselectedMaterial?: Material) => {
    const mat = preselectedMaterial || projectMaterials[0];
    const poNum = `PO-${new Date().getFullYear()}-00${projectPOs.length + 1}`;
    setPoFormData({
      material_id: mat?.id || '',
      po_number: poNum,
      vendor_name: 'Decorex Fine Finishes Depot',
      vendor_contact: '+91 98491 55667',
      quantity: mat ? mat.quantity : 50,
      unit: mat ? mat.unit : 'sqft',
      total_amount: mat ? (mat.actual_rate || mat.estimated_rate) * mat.quantity : 25000,
      order_date: new Date().toISOString().split('T')[0],
      expected_delivery_date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      notes: 'Please verify surface polish and corner edge protections upon site dispatch.',
    });
    setIsCreatePOOpen(true);
  };

  const handleCreatePO = (e: React.FormEvent) => {
    e.preventDefault();
    if (!poFormData.po_number || !activeProject) return;

    const linkedMaterial = projectMaterials.find((m) => m.id === poFormData.material_id);
    const materialName = linkedMaterial?.name || 'Bulk Material Consumables';

    addProcurementOrder({
      project_id: activeProject.id,
      material_id: poFormData.material_id,
      material_name: materialName,
      po_number: poFormData.po_number,
      vendor_name: poFormData.vendor_name,
      vendor_contact: poFormData.vendor_contact,
      quantity: Number(poFormData.quantity),
      unit: poFormData.unit,
      order_date: poFormData.order_date,
      expected_delivery_date: poFormData.expected_delivery_date,
      total_amount: Number(poFormData.total_amount),
      payment_status: 'pending',
      delivery_status: 'ordered',
      notes: poFormData.notes,
    });

    // Update material's procurement status to po_issued
    if (linkedMaterial) {
      updateMaterial(linkedMaterial.id, { procurement_status: 'po_issued' });
    }

    setIsCreatePOOpen(false);
    showToast(`Purchase Order ${poFormData.po_number} created and dispatched to vendor.`);
  };

  const handleOpenDeliveryModal = (po: ProcurementOrder) => {
    setSelectedPO(po);
    setDeliveryStatusData({
      delivery_status: po.delivery_status,
      notes: po.notes || '',
    });
    setIsUpdateDeliveryOpen(true);
  };

  const handleUpdateDeliveryStatus = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPO) return;

    const isNowDelivered = deliveryStatusData.delivery_status === 'delivered';
    updateProcurementOrder(selectedPO.id, {
      delivery_status: deliveryStatusData.delivery_status,
      actual_delivery_date: isNowDelivered ? new Date().toISOString().split('T')[0] : selectedPO.actual_delivery_date,
      notes: deliveryStatusData.notes,
    });

    // Reactive: if PO marked delivered, update linked material's status to delivered as well
    if (selectedPO.material_id && isNowDelivered) {
      updateMaterial(selectedPO.material_id, { procurement_status: 'delivered' });
    } else if (selectedPO.material_id && deliveryStatusData.delivery_status === 'in_transit') {
      updateMaterial(selectedPO.material_id, { procurement_status: 'in_transit' });
    }

    setIsUpdateDeliveryOpen(false);
    setSelectedPO(null);
    showToast(`Delivery status for ${selectedPO.po_number} updated to ${deliveryStatusData.delivery_status}.`);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs px-4 py-2.5 rounded-md flex items-center justify-between shadow-sm animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span>{toastMessage}</span>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-emerald-700 hover:text-emerald-900 font-bold ml-4"
          >
            ✕
          </button>
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold tracking-tight text-stone-900">
              Material BOQ & Procurement Control
            </h1>
            <Badge variant="outline" className="text-xs bg-stone-100 text-stone-700">
              {activeTab === 'boq' ? `${projectMaterials.length} Items` : `${projectPOs.length} Purchase Orders`}
            </Badge>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Bill of Quantities specifications, rate variances, client finish selections, and vendor order dispatches.
          </p>
        </div>

        {/* Project Selector & Actions */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 bg-white border border-stone-200 rounded-md px-2.5 py-1">
            <span className="text-[11px] text-stone-500 font-medium">Project:</span>
            <select
              value={activeProject?.id}
              onChange={(e) => setCurrentProject(e.target.value)}
              className="text-xs font-semibold text-stone-800 bg-transparent border-none focus:outline-none cursor-pointer"
            >
              {projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
          </div>

          {activeTab === 'boq' ? (
            <Button
              size="sm"
              className="bg-[#2A5C45] hover:bg-[#234c39] text-white text-xs"
              onClick={() => {
                setMatFormData({
                  item_code: `MAT-00${projectMaterials.length + 1}`,
                  name: '',
                  category: 'woodwork',
                  room_id: projectRooms[0]?.id || '',
                  brand_spec: '',
                  unit: 'sqft',
                  quantity: 100,
                  estimated_rate: 250,
                  actual_rate: 240,
                  proposed_price: 250,
                  selection_status: 'proposed',
                  approval_status: 'spec_draft',
                  procurement_status: 'not_ordered',
                });
                setIsAddMaterialOpen(true);
              }}
            >
              <Plus className="h-3.5 w-3.5 mr-1" />
              Add BOQ Item
            </Button>
          ) : (
            <Button
              size="sm"
              className="bg-[#2A5C45] hover:bg-[#234c39] text-white text-xs"
              onClick={() => handleOpenCreatePO()}
            >
              <ShoppingCart className="h-3.5 w-3.5 mr-1" />
              Generate Purchase Order
            </Button>
          )}
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex items-center gap-2 border-b border-stone-200">
        <button
          onClick={() => setActiveTab('boq')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors ${
            activeTab === 'boq'
              ? 'border-[#2A5C45] text-[#2A5C45]'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Package className="h-4 w-4" />
          Material BOQ Schedule ({projectMaterials.length})
        </button>

        <button
          onClick={() => setActiveTab('procurement')}
          className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-colors ${
            activeTab === 'procurement'
              ? 'border-[#2A5C45] text-[#2A5C45]'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <ShoppingCart className="h-4 w-4" />
          Purchase Orders & Vendor Delivery ({projectPOs.length})
        </button>
      </div>

      {/* ========================================================================= */}
      {/* TAB 1: MATERIAL BOQ */}
      {/* ========================================================================= */}
      {activeTab === 'boq' && (
        <div className="space-y-4">
          {/* Summary Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Card className="p-3 border-stone-200 shadow-none">
              <span className="text-[10px] text-stone-500 block uppercase font-mono">Total BOQ Value</span>
              <span className="text-xl font-bold text-stone-900">{formatINR(totalBOQValue)}</span>
            </Card>
            <Card className="p-3 border-stone-200 shadow-none">
              <span className="text-[10px] text-stone-500 block uppercase font-mono">Client Approved</span>
              <span className="text-xl font-bold text-emerald-700">
                {projectMaterials.filter(m => m.selection_status === 'approved' || m.approval_status === 'client_approved').length} Items
              </span>
            </Card>
            <Card className="p-3 border-stone-200 shadow-none">
              <span className="text-[10px] text-stone-500 block uppercase font-mono">Under PO / Transit</span>
              <span className="text-xl font-bold text-amber-700">
                {projectMaterials.filter(m => m.procurement_status === 'po_issued' || m.procurement_status === 'in_transit').length} Items
              </span>
            </Card>
            <Card className="p-3 border-stone-200 shadow-none">
              <span className="text-[10px] text-stone-500 block uppercase font-mono">Delivered to Site</span>
              <span className="text-xl font-bold text-stone-900">
                {projectMaterials.filter(m => m.procurement_status === 'delivered' || m.procurement_status === 'inspected').length} Items
              </span>
            </Card>
          </div>

          {/* Filter Toolbar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-lg border border-stone-200">
            <div className="flex items-center gap-2 w-full sm:w-72">
              <Search className="h-4 w-4 text-stone-400" />
              <Input
                placeholder="Search materials, codes, brands..."
                value={boqSearch}
                onChange={(e) => setBoqSearch(e.target.value)}
                className="h-8 text-xs border-stone-200"
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
              <select
                value={boqCategoryFilter}
                onChange={(e) => setBoqCategoryFilter(e.target.value)}
                className="h-8 text-xs border border-stone-200 rounded-md px-2 bg-white text-stone-700"
              >
                <option value="all">All Categories</option>
                <option value="flooring">Flooring</option>
                <option value="woodwork">Woodwork / Veneer</option>
                <option value="hardware">Hardware & Fittings</option>
                <option value="electrical">Electrical & Lighting</option>
                <option value="paint">Paint & Finishes</option>
                <option value="sanitary">Sanitary</option>
              </select>

              <select
                value={boqRoomFilter}
                onChange={(e) => setBoqRoomFilter(e.target.value)}
                className="h-8 text-xs border border-stone-200 rounded-md px-2 bg-white text-stone-700"
              >
                <option value="all">All Rooms</option>
                {projectRooms.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.name}
                  </option>
                ))}
              </select>

              <select
                value={boqProcStatusFilter}
                onChange={(e) => setBoqProcStatusFilter(e.target.value)}
                className="h-8 text-xs border border-stone-200 rounded-md px-2 bg-white text-stone-700"
              >
                <option value="all">All Delivery Stages</option>
                <option value="not_ordered">Not Ordered</option>
                <option value="po_issued">PO Issued</option>
                <option value="in_transit">In Transit</option>
                <option value="delivered">Delivered</option>
                <option value="installed">Installed</option>
              </select>
            </div>
          </div>

          {/* BOQ Table */}
          <Card className="border-stone-200 shadow-none overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-stone-50/70 border-b border-stone-200 text-[11px]">
                  <TableHead className="py-3 font-semibold text-stone-700">Code</TableHead>
                  <TableHead className="py-3 font-semibold text-stone-700">Material & Brand Specification</TableHead>
                  <TableHead className="py-3 font-semibold text-stone-700">Room</TableHead>
                  <TableHead className="py-3 font-semibold text-stone-700">Quantity</TableHead>
                  <TableHead className="py-3 font-semibold text-stone-700">Rate (Est / Act)</TableHead>
                  <TableHead className="py-3 font-semibold text-stone-700">Total Value</TableHead>
                  <TableHead className="py-3 font-semibold text-stone-700">Selection</TableHead>
                  <TableHead className="py-3 font-semibold text-stone-700">Delivery Status</TableHead>
                  <TableHead className="py-3 font-semibold text-stone-700 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMaterials.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-xs text-stone-500">
                      No materials match the filter criteria.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredMaterials.map((mat) => {
                    const room = rooms.find((r) => r.id === mat.room_id);
                    const rate = mat.actual_rate || mat.estimated_rate;
                    const total = rate * mat.quantity;

                    return (
                      <TableRow key={mat.id} className="hover:bg-stone-50/70 border-b border-stone-100 text-xs">
                        <TableCell className="py-3 font-mono font-bold text-stone-700 text-[11px]">
                          {mat.item_code}
                        </TableCell>
                        <TableCell className="py-3">
                          <div className="font-semibold text-stone-900">{mat.name}</div>
                          <div className="text-[11px] text-stone-500 mt-0.5">{mat.brand_spec || 'Standard spec'}</div>
                        </TableCell>
                        <TableCell className="py-3 text-stone-600">
                          {room?.name || 'Whole Site'}
                        </TableCell>
                        <TableCell className="py-3 font-medium text-stone-800">
                          {mat.quantity} {mat.unit}
                        </TableCell>
                        <TableCell className="py-3">
                          <span className="font-medium text-stone-900">{formatINR(rate)}</span>
                          {mat.actual_rate && mat.actual_rate !== mat.estimated_rate && (
                            <span className="text-[10px] text-stone-400 block line-through">
                              {formatINR(mat.estimated_rate)}
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="py-3 font-bold text-stone-900">
                          {formatINR(total)}
                        </TableCell>
                        <TableCell className="py-3">
                          <StatusBadge status={mat.selection_status || mat.approval_status} />
                        </TableCell>
                        <TableCell className="py-3">
                          <StatusBadge status={mat.procurement_status} />
                        </TableCell>
                        <TableCell className="py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-7 w-7 p-0 text-stone-500 hover:text-stone-900"
                              onClick={() => handleEditMaterial(mat)}
                              title="Edit Item"
                            >
                              <Edit className="h-3.5 w-3.5" />
                            </Button>
                            {mat.procurement_status === 'not_ordered' && (
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-7 text-[11px] px-2 border-stone-200 text-[#2A5C45]"
                                onClick={() => handleOpenCreatePO(mat)}
                              >
                                Create PO
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </Card>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TAB 2: PURCHASE ORDERS & DELIVERY TRACKING */}
      {/* ========================================================================= */}
      {activeTab === 'procurement' && (
        <div className="space-y-4">
          {/* Summary Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Card className="p-3 border-stone-200 shadow-none">
              <span className="text-[11px] text-stone-500 block uppercase font-mono">Total POs Issued</span>
              <span className="text-xl font-bold text-stone-900">{projectPOs.length} Orders</span>
            </Card>
            <Card className="p-3 border-stone-200 shadow-none">
              <span className="text-[11px] text-stone-500 block uppercase font-mono">In Transit / Dispatched</span>
              <span className="text-xl font-bold text-amber-700">{totalInTransitPOs} Shipments</span>
            </Card>
            <Card className="p-3 border-stone-200 shadow-none">
              <span className="text-[11px] text-stone-500 block uppercase font-mono">Delivered to Site</span>
              <span className="text-xl font-bold text-emerald-700">{totalDeliveredPOs} Orders Verified</span>
            </Card>
          </div>

          {/* Orders Table */}
          <Card className="border-stone-200 shadow-none overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-stone-50/70 border-b border-stone-200 text-[11px]">
                  <TableHead className="py-3 font-semibold text-stone-700">PO Number</TableHead>
                  <TableHead className="py-3 font-semibold text-stone-700">Material & Qty</TableHead>
                  <TableHead className="py-3 font-semibold text-stone-700">Vendor & Contact</TableHead>
                  <TableHead className="py-3 font-semibold text-stone-700">Order Date</TableHead>
                  <TableHead className="py-3 font-semibold text-stone-700">Expected Delivery</TableHead>
                  <TableHead className="py-3 font-semibold text-stone-700">Total Amount</TableHead>
                  <TableHead className="py-3 font-semibold text-stone-700">Delivery Status</TableHead>
                  <TableHead className="py-3 font-semibold text-stone-700 text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPOs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8 text-xs text-stone-500">
                      No purchase orders recorded for this project yet.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredPOs.map((po) => {
                    const isDelivered = po.delivery_status === 'delivered';
                    const isInTransit = po.delivery_status === 'in_transit';

                    return (
                      <TableRow key={po.id} className="hover:bg-stone-50/70 border-b border-stone-100 text-xs">
                        <TableCell className="py-3 font-mono font-bold text-stone-900">
                          {po.po_number}
                        </TableCell>
                        <TableCell className="py-3">
                          <div className="font-semibold text-stone-900">{po.material_name}</div>
                          <div className="text-[11px] text-stone-500">
                            {po.quantity} {po.unit}
                          </div>
                        </TableCell>
                        <TableCell className="py-3">
                          <div className="font-medium text-stone-800">{po.vendor_name}</div>
                          <div className="text-[11px] text-stone-500">{po.vendor_contact}</div>
                        </TableCell>
                        <TableCell className="py-3 text-stone-600">
                          {formatDate(po.order_date)}
                        </TableCell>
                        <TableCell className="py-3 text-stone-600">
                          {formatDate(po.expected_delivery_date)}
                        </TableCell>
                        <TableCell className="py-3 font-bold text-stone-900">
                          {formatINR(po.total_amount)}
                        </TableCell>
                        <TableCell className="py-3">
                          <StatusBadge status={po.delivery_status} />
                        </TableCell>
                        <TableCell className="py-3 text-right">
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-xs border-stone-200 text-stone-700 hover:bg-stone-50"
                            onClick={() => handleOpenDeliveryModal(po)}
                          >
                            Update Delivery
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </Card>
        </div>
      )}

      {/* ========================================================================= */}
      {/* DIALOG: ADD BOQ MATERIAL ITEM */}
      {/* ========================================================================= */}
      <Dialog open={isAddMaterialOpen} onOpenChange={setIsAddMaterialOpen}>
        <DialogContent className="max-w-md">
          <form onSubmit={handleCreateMaterial}>
            <DialogHeader>
              <DialogTitle className="text-base font-bold text-stone-900">
                Add Material to BOQ Schedule
              </DialogTitle>
              <DialogDescription className="text-xs text-stone-500">
                Specify unit quantities, estimated contractor rates, and room allocation.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs font-semibold text-stone-700">Item Code *</Label>
                  <Input
                    required
                    value={matFormData.item_code}
                    onChange={(e) => setMatFormData({ ...matFormData, item_code: e.target.value })}
                    className="h-8 text-xs mt-1 font-mono"
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold text-stone-700">Category</Label>
                  <select
                    value={matFormData.category}
                    onChange={(e) => setMatFormData({ ...matFormData, category: e.target.value as Material['category'] })}
                    className="h-8 text-xs border border-stone-200 rounded-md px-2 bg-white text-stone-800 w-full mt-1"
                  >
                    <option value="flooring">Flooring</option>
                    <option value="woodwork">Woodwork / Veneer</option>
                    <option value="hardware">Hardware & Fittings</option>
                    <option value="electrical">Electrical & Lighting</option>
                    <option value="paint">Paint</option>
                    <option value="sanitary">Sanitary</option>
                  </select>
                </div>
              </div>

              <div>
                <Label className="text-xs font-semibold text-stone-700">Material Name *</Label>
                <Input
                  required
                  placeholder="e.g. Botticino Italian Marble 18mm Slab"
                  value={matFormData.name}
                  onChange={(e) => setMatFormData({ ...matFormData, name: e.target.value })}
                  className="h-8 text-xs mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs font-semibold text-stone-700">Room Location</Label>
                  <select
                    value={matFormData.room_id}
                    onChange={(e) => setMatFormData({ ...matFormData, room_id: e.target.value })}
                    className="h-8 text-xs border border-stone-200 rounded-md px-2 bg-white text-stone-800 w-full mt-1"
                  >
                    {projectRooms.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label className="text-xs font-semibold text-stone-700">Brand / Grade Spec</Label>
                  <Input
                    placeholder="e.g. CenturyPly Club Prime 18mm"
                    value={matFormData.brand_spec}
                    onChange={(e) => setMatFormData({ ...matFormData, brand_spec: e.target.value })}
                    className="h-8 text-xs mt-1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Label className="text-xs font-semibold text-stone-700">Quantity</Label>
                  <Input
                    type="number"
                    value={matFormData.quantity}
                    onChange={(e) => setMatFormData({ ...matFormData, quantity: Number(e.target.value) })}
                    className="h-8 text-xs mt-1 font-mono"
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold text-stone-700">Unit</Label>
                  <Input
                    placeholder="sqft, pcs, sets"
                    value={matFormData.unit}
                    onChange={(e) => setMatFormData({ ...matFormData, unit: e.target.value })}
                    className="h-8 text-xs mt-1 font-mono"
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold text-stone-700">Estimated Rate (₹)</Label>
                  <Input
                    type="number"
                    value={matFormData.estimated_rate}
                    onChange={(e) => setMatFormData({ ...matFormData, estimated_rate: Number(e.target.value) })}
                    className="h-8 text-xs mt-1 font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs font-semibold text-stone-700">Client Selection Status</Label>
                  <select
                    value={matFormData.selection_status}
                    onChange={(e) => setMatFormData({ ...matFormData, selection_status: e.target.value as Material['selection_status'] })}
                    className="h-8 text-xs border border-stone-200 rounded-md px-2 bg-white text-stone-800 w-full mt-1"
                  >
                    <option value="proposed">Proposed to Client</option>
                    <option value="selected_by_client">Selected by Client</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
                <div>
                  <Label className="text-xs font-semibold text-stone-700">Delivery Stage</Label>
                  <select
                    value={matFormData.procurement_status}
                    onChange={(e) => setMatFormData({ ...matFormData, procurement_status: e.target.value as Material['procurement_status'] })}
                    className="h-8 text-xs border border-stone-200 rounded-md px-2 bg-white text-stone-800 w-full mt-1"
                  >
                    <option value="not_ordered">Not Ordered</option>
                    <option value="po_issued">PO Issued</option>
                    <option value="in_transit">In Transit</option>
                    <option value="delivered">Delivered</option>
                    <option value="installed">Installed</option>
                  </select>
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsAddMaterialOpen(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                className="bg-[#2A5C45] hover:bg-[#234c39] text-white text-xs"
              >
                Add to BOQ
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ========================================================================= */}
      {/* DIALOG: EDIT MATERIAL */}
      {/* ========================================================================= */}
      <Dialog open={isEditMaterialOpen} onOpenChange={setIsEditMaterialOpen}>
        <DialogContent className="max-w-md">
          <form onSubmit={handleUpdateMaterial}>
            <DialogHeader>
              <DialogTitle className="text-base font-bold text-stone-900">
                Edit BOQ Specification: {selectedMaterial?.item_code}
              </DialogTitle>
              <DialogDescription className="text-xs text-stone-500">
                Update actual supplier rates, quantities, and client selection approval.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-3">
              <div>
                <Label className="text-xs font-semibold text-stone-700">Material Name</Label>
                <Input
                  required
                  value={matFormData.name}
                  onChange={(e) => setMatFormData({ ...matFormData, name: e.target.value })}
                  className="h-8 text-xs mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs font-semibold text-stone-700">Brand / Spec</Label>
                  <Input
                    value={matFormData.brand_spec}
                    onChange={(e) => setMatFormData({ ...matFormData, brand_spec: e.target.value })}
                    className="h-8 text-xs mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold text-stone-700">Room</Label>
                  <select
                    value={matFormData.room_id}
                    onChange={(e) => setMatFormData({ ...matFormData, room_id: e.target.value })}
                    className="h-8 text-xs border border-stone-200 rounded-md px-2 bg-white text-stone-800 w-full mt-1"
                  >
                    {projectRooms.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Label className="text-xs font-semibold text-stone-700">Quantity</Label>
                  <Input
                    type="number"
                    value={matFormData.quantity}
                    onChange={(e) => setMatFormData({ ...matFormData, quantity: Number(e.target.value) })}
                    className="h-8 text-xs mt-1 font-mono"
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold text-stone-700">Est Rate (₹)</Label>
                  <Input
                    type="number"
                    value={matFormData.estimated_rate}
                    onChange={(e) => setMatFormData({ ...matFormData, estimated_rate: Number(e.target.value) })}
                    className="h-8 text-xs mt-1 font-mono"
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold text-stone-700">Actual Rate (₹)</Label>
                  <Input
                    type="number"
                    value={matFormData.actual_rate}
                    onChange={(e) => setMatFormData({ ...matFormData, actual_rate: Number(e.target.value) })}
                    className="h-8 text-xs mt-1 font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs font-semibold text-stone-700">Client Selection</Label>
                  <select
                    value={matFormData.selection_status}
                    onChange={(e) => setMatFormData({ ...matFormData, selection_status: e.target.value as Material['selection_status'] })}
                    className="h-8 text-xs border border-stone-200 rounded-md px-2 bg-white text-stone-800 w-full mt-1"
                  >
                    <option value="proposed">Proposed</option>
                    <option value="selected_by_client">Selected by Client</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                </div>
                <div>
                  <Label className="text-xs font-semibold text-stone-700">Procurement Status</Label>
                  <select
                    value={matFormData.procurement_status}
                    onChange={(e) => setMatFormData({ ...matFormData, procurement_status: e.target.value as Material['procurement_status'] })}
                    className="h-8 text-xs border border-stone-200 rounded-md px-2 bg-white text-stone-800 w-full mt-1"
                  >
                    <option value="not_ordered">Not Ordered</option>
                    <option value="po_issued">PO Issued</option>
                    <option value="in_transit">In Transit</option>
                    <option value="delivered">Delivered</option>
                    <option value="installed">Installed</option>
                  </select>
                </div>
              </div>
            </div>

            <DialogFooter className="flex items-center justify-between">
              <Button
                type="button"
                variant="destructive"
                size="sm"
                onClick={() => {
                  if (selectedMaterial && confirm(`Delete ${selectedMaterial.name}?`)) {
                    deleteMaterial(selectedMaterial.id);
                    setIsEditMaterialOpen(false);
                    showToast('Material deleted from BOQ.');
                  }
                }}
                className="text-xs mr-auto"
              >
                Delete Item
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditMaterialOpen(false)}
                  className="text-xs"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  className="bg-[#2A5C45] hover:bg-[#234c39] text-white text-xs"
                >
                  Save Changes
                </Button>
              </div>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ========================================================================= */}
      {/* DIALOG: CREATE PURCHASE ORDER */}
      {/* ========================================================================= */}
      <Dialog open={isCreatePOOpen} onOpenChange={setIsCreatePOOpen}>
        <DialogContent className="max-w-md">
          <form onSubmit={handleCreatePO}>
            <DialogHeader>
              <DialogTitle className="text-base font-bold text-stone-900">
                Issue Vendor Purchase Order
              </DialogTitle>
              <DialogDescription className="text-xs text-stone-500">
                Send formal PO to vendor and set expected site delivery schedule.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs font-semibold text-stone-700">PO Number *</Label>
                  <Input
                    required
                    value={poFormData.po_number}
                    onChange={(e) => setPoFormData({ ...poFormData, po_number: e.target.value })}
                    className="h-8 text-xs mt-1 font-mono font-bold"
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold text-stone-700">Link BOQ Material</Label>
                  <select
                    value={poFormData.material_id}
                    onChange={(e) => {
                      const mat = projectMaterials.find(m => m.id === e.target.value);
                      setPoFormData({
                        ...poFormData,
                        material_id: e.target.value,
                        quantity: mat ? mat.quantity : poFormData.quantity,
                        unit: mat ? mat.unit : poFormData.unit,
                        total_amount: mat ? (mat.actual_rate || mat.estimated_rate) * mat.quantity : poFormData.total_amount,
                      });
                    }}
                    className="h-8 text-xs border border-stone-200 rounded-md px-2 bg-white text-stone-800 w-full mt-1"
                  >
                    {projectMaterials.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.item_code} - {m.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <Label className="text-xs font-semibold text-stone-700">Vendor / Supplier Name *</Label>
                <Input
                  required
                  placeholder="e.g. Häfele Hardware Galleria, Jubilee Hills"
                  value={poFormData.vendor_name}
                  onChange={(e) => setPoFormData({ ...poFormData, vendor_name: e.target.value })}
                  className="h-8 text-xs mt-1"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs font-semibold text-stone-700">Vendor Contact</Label>
                  <Input
                    placeholder="+91 98490 ..."
                    value={poFormData.vendor_contact}
                    onChange={(e) => setPoFormData({ ...poFormData, vendor_contact: e.target.value })}
                    className="h-8 text-xs mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold text-stone-700">Total Amount (₹)</Label>
                  <Input
                    type="number"
                    value={poFormData.total_amount}
                    onChange={(e) => setPoFormData({ ...poFormData, total_amount: Number(e.target.value) })}
                    className="h-8 text-xs mt-1 font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs font-semibold text-stone-700">Order Date</Label>
                  <Input
                    type="date"
                    value={poFormData.order_date}
                    onChange={(e) => setPoFormData({ ...poFormData, order_date: e.target.value })}
                    className="h-8 text-xs mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs font-semibold text-stone-700">Expected Delivery</Label>
                  <Input
                    type="date"
                    value={poFormData.expected_delivery_date}
                    onChange={(e) => setPoFormData({ ...poFormData, expected_delivery_date: e.target.value })}
                    className="h-8 text-xs mt-1"
                  />
                </div>
              </div>

              <div>
                <Label className="text-xs font-semibold text-stone-700">Delivery Instructions / Tracking Notes</Label>
                <Textarea
                  placeholder="Site access timing, lift security pass requirement, unloading notes..."
                  value={poFormData.notes}
                  onChange={(e) => setPoFormData({ ...poFormData, notes: e.target.value })}
                  className="text-xs mt-1 resize-none h-16"
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsCreatePOOpen(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                className="bg-[#2A5C45] hover:bg-[#234c39] text-white text-xs"
              >
                Confirm & Issue PO
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ========================================================================= */}
      {/* DIALOG: UPDATE DELIVERY STATUS */}
      {/* ========================================================================= */}
      <Dialog open={isUpdateDeliveryOpen} onOpenChange={setIsUpdateDeliveryOpen}>
        <DialogContent className="max-w-md">
          <form onSubmit={handleUpdateDeliveryStatus}>
            <DialogHeader>
              <DialogTitle className="text-base font-bold text-stone-900">
                Update Delivery Status: {selectedPO?.po_number}
              </DialogTitle>
              <DialogDescription className="text-xs text-stone-500">
                Setting status to <strong>Delivered</strong> automatically marks the linked BOQ material as on-site.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-3">
              <div className="p-2.5 bg-stone-50 rounded border border-stone-200 text-xs">
                <span className="font-semibold text-stone-900 block">{selectedPO?.material_name}</span>
                <span className="text-stone-500 block text-[11px] mt-0.5">
                  Vendor: {selectedPO?.vendor_name} ({selectedPO?.vendor_contact})
                </span>
              </div>

              <div>
                <Label className="text-xs font-semibold text-stone-700">Delivery Status</Label>
                <select
                  value={deliveryStatusData.delivery_status}
                  onChange={(e) => setDeliveryStatusData({ ...deliveryStatusData, delivery_status: e.target.value as ProcurementOrder['delivery_status'] })}
                  className="h-8 text-xs border border-stone-200 rounded-md px-2 bg-white text-stone-800 w-full mt-1"
                >
                  <option value="ordered">Ordered (Dispatched from Vendor)</option>
                  <option value="in_transit">In Transit (Courier tracking active)</option>
                  <option value="delivered">Delivered to Site (Verified OK)</option>
                </select>
              </div>

              <div>
                <Label className="text-xs font-semibold text-stone-700">Site Unloading & Inspection Notes</Label>
                <Textarea
                  placeholder="Damage inspection notes, lot verification, invoice copy reference..."
                  value={deliveryStatusData.notes}
                  onChange={(e) => setDeliveryStatusData({ ...deliveryStatusData, notes: e.target.value })}
                  className="text-xs mt-1 resize-none h-20"
                />
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setIsUpdateDeliveryOpen(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                className="bg-[#2A5C45] hover:bg-[#234c39] text-white text-xs"
              >
                Update Delivery
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
