import React, { useState } from 'react';
import {
  Palette,
  CheckCircle2,
  Check,
  RefreshCw,
  Sparkles,
  Info,
  Layers,
  Filter,
  ArrowRight,
  SlidersHorizontal,
  FileCheck2,
  AlertCircle,
  HelpCircle,
  ExternalLink,
} from 'lucide-react';
import { useDemoStore } from '@/stores/demoStore';
import { formatINR } from '@/lib/utils';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Material } from '@/types';

// Curated options for homeowner selection mockups
const MATERIAL_ALTERNATIVES: Record<
  string,
  Array<{ name: string; brand: string; rate: number; delta: string; image?: string }>
> = {
  'Calacatta Gold 20mm Engineered Quartz Slab': [
    {
      name: 'Calacatta Gold 20mm Engineered Quartz (Recommended)',
      brand: 'Caesarstone 5111 / Polished Double Bevel',
      rate: 550,
      delta: 'Included in allowance',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=400',
    },
    {
      name: 'Pure Statuario White Engineered Quartz',
      brand: 'KalingaStone Premier / Micro-Bevel Edge',
      rate: 490,
      delta: '-₹60/sqft saving',
      image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400',
    },
    {
      name: 'Jet Black Leathered Granite',
      brand: 'Chamrajnagar Black Granite / Flamed Matte',
      rate: 380,
      delta: '-₹170/sqft saving',
      image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=400',
    },
  ],
  'Velvet Luxury Emulsion Paint — Chalk White': [
    {
      name: 'Chalk White — Luxury Matt (Recommended)',
      brand: 'Asian Paints Royale Luxury Matt #L102',
      rate: 680,
      delta: 'Standard baseline',
    },
    {
      name: 'Warm Ecru — Velvet Touch',
      brand: 'Asian Paints Royale Glitz #L124',
      rate: 720,
      delta: '+₹40/litre premium',
    },
    {
      name: 'Morning Mist — Ultra Smooth',
      brand: 'Dulux Velvet Touch Diamond Glow',
      rate: 660,
      delta: '-₹20/litre saving',
    },
  ],
};

export function ClientMaterialsPage() {
  const { materials, rooms, projects, currentProjectId, selectMaterial } = useDemoStore();
  const project = projects.find((p) => p.id === currentProjectId) || projects[0];

  const projectMaterials = materials.filter((m) => m.project_id === project?.id);

  // Filters
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedRoomId, setSelectedRoomId] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Alternative Selection Modal State
  const [activeMaterialForOptions, setActiveMaterialForOptions] = useState<Material | null>(null);

  // Request Alternative Modal State
  const [customAlternativeMaterial, setCustomAlternativeMaterial] = useState<Material | null>(null);
  const [alternativeFeedback, setAlternativeFeedback] = useState('');

  // Toast Notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const projectRooms = rooms.filter((r) => r.project_id === project?.id);

  // Categories list
  const categories = [
    { id: 'all', label: 'All Categories' },
    { id: 'flooring', label: 'Flooring & Marble' },
    { id: 'woodwork', label: 'Veneers & Woodwork' },
    { id: 'hardware', label: 'Hardware & Countertops' },
    { id: 'electrical', label: 'Lighting & Smart Tech' },
    { id: 'paint', label: 'Paint & Finishes' },
  ];

  // Filtered materials
  const filteredMaterials = projectMaterials.filter((m) => {
    const matchesCategory = selectedCategory === 'all' || m.category === selectedCategory;
    const matchesRoom = selectedRoomId === 'all' || m.room_id === selectedRoomId;
    const matchesStatus =
      selectedStatus === 'all' ||
      (selectedStatus === 'pending' &&
        (m.selection_status === 'proposed' || m.approval_status === 'spec_draft')) ||
      (selectedStatus === 'selected' &&
        (m.selection_status === 'selected_by_client' || m.selection_status === 'approved'));
    return matchesCategory && matchesRoom && matchesStatus;
  });

  // Action handlers
  const handleConfirmSelection = (material: Material) => {
    selectMaterial(material.id, 'selected_by_client', 'Confirmed by client');
    showToast(`"${material.name}" selected and locked for procurement!`);
  };

  const handleSelectAlternativeOption = (
    material: Material,
    option: { name: string; brand: string; rate: number }
  ) => {
    selectMaterial(
      material.id,
      'selected_by_client',
      `Homeowner chose option: ${option.name} (${option.brand})`
    );
    showToast(`Saved preference: ${option.name}`);
    setActiveMaterialForOptions(null);
  };

  const handleOpenCustomAlternative = (material: Material) => {
    setCustomAlternativeMaterial(material);
    setAlternativeFeedback('');
  };

  const handleSubmitCustomAlternative = (e: React.FormEvent) => {
    e.preventDefault();
    if (!alternativeFeedback.trim()) return;

    if (customAlternativeMaterial) {
      selectMaterial(customAlternativeMaterial.id, 'rejected', alternativeFeedback.trim());
      showToast(
        `Alternative request sent for "${customAlternativeMaterial.name}". Designer notified.`
      );
      setCustomAlternativeMaterial(null);
      setAlternativeFeedback('');
    }
  };

  const pendingCount = projectMaterials.filter(
    (m) => m.selection_status === 'proposed' || m.approval_status === 'spec_draft'
  ).length;

  const selectedCount = projectMaterials.filter(
    (m) => m.selection_status === 'selected_by_client' || m.selection_status === 'approved'
  ).length;

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#2A5C45] text-white text-xs px-4 py-3 rounded-lg shadow-lg flex items-center gap-2 border border-emerald-600 animate-in fade-in slide-in-from-bottom-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-200 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-stone-900 tracking-tight flex items-center gap-2">
            <Palette className="w-5 h-5 sm:w-6 sm:h-6 text-[#2A5C45]" />
            Material Selection & Swatches
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Choose stone slabs, premium wood veneers, architectural hardware, and paint palettes for your home.
          </p>
        </div>

        {/* Counter Pills */}
        <div className="flex items-center gap-2 text-xs">
          <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200/80 font-medium">
            {pendingCount} Awaiting Selection
          </span>
          <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-900 border border-emerald-200/80 font-medium">
            {selectedCount} Confirmed & Locked
          </span>
        </div>
      </div>

      {/* Category & Room Filters Toolbar */}
      <div className="bg-white p-3.5 rounded-xl border border-stone-200/90 shadow-2xs space-y-3">
        {/* Category Filter */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1 text-xs">
          <span className="text-stone-500 font-medium shrink-0 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Category:
          </span>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat.id
                  ? 'bg-[#2A5C45] text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Room & Status Filter */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs border-t border-stone-100 pt-2.5">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
            <span className="text-stone-500 font-medium shrink-0">Room:</span>
            <button
              onClick={() => setSelectedRoomId('all')}
              className={`px-2.5 py-1 rounded text-xs font-medium ${
                selectedRoomId === 'all'
                  ? 'bg-stone-800 text-white'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              All Rooms
            </button>
            {projectRooms.map((room) => (
              <button
                key={room.id}
                onClick={() => setSelectedRoomId(room.id)}
                className={`px-2.5 py-1 rounded text-xs font-medium whitespace-nowrap ${
                  selectedRoomId === room.id
                    ? 'bg-stone-800 text-white'
                    : 'text-stone-600 hover:bg-stone-100'
                }`}
              >
                {room.name}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {[
              { id: 'all', label: 'All Items' },
              { id: 'pending', label: 'Awaiting Choice' },
              { id: 'selected', label: 'Selected' },
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => setSelectedStatus(st.id)}
                className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                  selectedStatus === st.id
                    ? 'bg-[#2A5C45] text-white'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Materials List / Cards */}
      {filteredMaterials.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredMaterials.map((material) => {
            const room = rooms.find((r) => r.id === material.room_id);
            const isSelected =
              material.selection_status === 'selected_by_client' ||
              material.selection_status === 'approved';
            const isProposed =
              material.selection_status === 'proposed' ||
              material.approval_status === 'spec_draft';
            const isAlternative = material.selection_status === 'rejected';

            const hasAlternatives = !!MATERIAL_ALTERNATIVES[material.name];

            return (
              <Card
                key={material.id}
                className={`overflow-hidden border-stone-200/90 bg-white shadow-2xs hover:shadow-sm transition-all flex flex-col justify-between ${
                  isSelected ? 'ring-1 ring-[#2A5C45]/20' : ''
                }`}
              >
                <div>
                  {/* Swatch / Thumbnail Header */}
                  <div className="relative h-36 w-full bg-stone-100 overflow-hidden">
                    {material.swatch_url ? (
                      <img
                        src={material.swatch_url}
                        alt={material.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-stone-400 text-xs">
                        <Palette className="w-6 h-6 mb-1 text-stone-300" />
                        <span>Physical Sample at Site</span>
                      </div>
                    )}

                    {/* Room Tag */}
                    <div className="absolute top-2.5 left-2.5 bg-black/60 backdrop-blur-xs text-white text-[10px] font-medium px-2 py-0.5 rounded">
                      {room?.name || 'Interior Area'}
                    </div>

                    {/* Category Tag */}
                    <div className="absolute top-2.5 right-2.5 bg-stone-900/80 backdrop-blur-xs text-stone-200 text-[10px] uppercase tracking-wider font-mono px-2 py-0.5 rounded">
                      {material.category}
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-4 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold text-stone-900 text-sm leading-snug">
                          {material.name}
                        </h3>
                        <span className="text-[11px] font-mono text-stone-500">
                          Code: {material.item_code}
                        </span>
                      </div>

                      {isSelected ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full shrink-0">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Selected
                        </span>
                      ) : isAlternative ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full shrink-0">
                          <RefreshCw className="w-3 h-3 text-amber-600" /> Alternate Requested
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-blue-50 text-blue-800 border border-blue-200 px-2 py-0.5 rounded-full shrink-0">
                          Proposed
                        </span>
                      )}
                    </div>

                    {/* Specs Table */}
                    <div className="space-y-1.5 text-xs bg-stone-50 p-2.5 rounded-lg border border-stone-200/70">
                      <div className="flex justify-between text-stone-600">
                        <span className="text-stone-500 text-[11px]">Brand / Spec:</span>
                        <span className="font-medium text-stone-800 text-right truncate max-w-[180px]">
                          {material.brand_spec || 'Architectural Grade'}
                        </span>
                      </div>
                      <div className="flex justify-between text-stone-600">
                        <span className="text-stone-500 text-[11px]">Quantity Required:</span>
                        <span className="font-medium text-stone-800">
                          {material.quantity} {material.unit}
                        </span>
                      </div>
                      <div className="flex justify-between text-stone-600">
                        <span className="text-stone-500 text-[11px]">Allowance Rate:</span>
                        <span className="font-semibold text-[#2A5C45]">
                          {formatINR(material.estimated_rate)} / {material.unit}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bottom Actions */}
                <div className="p-4 pt-0">
                  <div className="border-t border-stone-100 pt-3 flex flex-wrap items-center gap-2">
                    {isProposed ? (
                      <>
                        <Button
                          size="sm"
                          onClick={() => handleConfirmSelection(material)}
                          className="flex-1 text-xs h-8 bg-[#2A5C45] hover:bg-[#204E38] text-white"
                        >
                          <Check className="w-3.5 h-3.5 mr-1" /> Select Finish
                        </Button>

                        {hasAlternatives ? (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setActiveMaterialForOptions(material)}
                            className="text-xs h-8 border-stone-300 text-stone-700 hover:bg-stone-50"
                          >
                            <SlidersHorizontal className="w-3.5 h-3.5 mr-1 text-[#2A5C45]" />
                            Options
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleOpenCustomAlternative(material)}
                            className="text-xs h-8 border-stone-300 text-stone-700 hover:bg-stone-50"
                          >
                            <RefreshCw className="w-3.5 h-3.5 mr-1 text-amber-700" />
                            Alternative
                          </Button>
                        )}
                      </>
                    ) : isSelected ? (
                      <div className="w-full flex items-center justify-between text-xs text-emerald-800 bg-emerald-50 px-2.5 py-1.5 rounded">
                        <span className="flex items-center gap-1.5 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          Locked for Procurement
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenCustomAlternative(material)}
                          className="text-[11px] h-6 px-1.5 text-stone-500 hover:text-stone-800"
                        >
                          Change
                        </Button>
                      </div>
                    ) : (
                      <div className="w-full flex items-center justify-between text-xs text-amber-800 bg-amber-50 px-2.5 py-1.5 rounded">
                        <span className="flex items-center gap-1.5 font-medium">
                          <RefreshCw className="w-3.5 h-3.5 text-amber-600" />
                          Designer Preparing New Sample
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleConfirmSelection(material)}
                          className="text-[11px] h-6 px-1.5 text-stone-500 hover:text-stone-800"
                        >
                          Keep Original
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      ) : (
        <div className="p-12 text-center bg-white rounded-xl border border-stone-200">
          <Palette className="w-10 h-10 text-stone-300 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-stone-900">No materials match this filter</h3>
          <p className="text-xs text-stone-500 mt-1">
            Try resetting your category or room filter.
          </p>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setSelectedCategory('all');
              setSelectedRoomId('all');
              setSelectedStatus('all');
            }}
            className="text-xs mt-3 h-8"
          >
            Show All Materials
          </Button>
        </div>
      )}

      {/* Modal 1: Curated Material Alternatives Options */}
      <Dialog
        open={!!activeMaterialForOptions}
        onOpenChange={(open) => !open && setActiveMaterialForOptions(null)}
      >
        <DialogContent className="max-w-xl p-5">
          {activeMaterialForOptions && (
            <div className="space-y-4">
              <DialogHeader className="space-y-1">
                <DialogTitle className="text-base sm:text-lg font-bold text-stone-900">
                  Choose Material Option: {activeMaterialForOptions.name}
                </DialogTitle>
                <DialogDescription className="text-xs text-stone-500">
                  Select between the curated finishes proposed by Lead Designer Arjun Mehta.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-3 pt-1">
                {(MATERIAL_ALTERNATIVES[activeMaterialForOptions.name] || []).map((opt, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-lg border border-stone-200 bg-white hover:border-[#2A5C45] hover:shadow-2xs transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-stone-900">{opt.name}</span>
                      </div>
                      <p className="text-stone-500 text-[11px]">{opt.brand}</p>
                      <div className="flex items-center gap-3 pt-0.5">
                        <span className="font-bold text-[#2A5C45]">{formatINR(opt.rate)} / unit</span>
                        <span className="text-[11px] text-stone-500 font-mono">({opt.delta})</span>
                      </div>
                    </div>

                    <Button
                      size="sm"
                      onClick={() =>
                        handleSelectAlternativeOption(activeMaterialForOptions, opt)
                      }
                      className="text-xs h-8 bg-[#2A5C45] hover:bg-[#204E38] text-white shrink-0 self-start sm:self-center"
                    >
                      <Check className="w-3.5 h-3.5 mr-1" /> Choose Option
                    </Button>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const m = activeMaterialForOptions;
                    setActiveMaterialForOptions(null);
                    handleOpenCustomAlternative(m);
                  }}
                  className="text-xs text-amber-800 hover:text-amber-900"
                >
                  None of these? Request custom alternative
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActiveMaterialForOptions(null)}
                  className="text-xs h-8"
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Modal 2: Custom Alternative Request Modal */}
      <Dialog
        open={!!customAlternativeMaterial}
        onOpenChange={(open) => !open && setCustomAlternativeMaterial(null)}
      >
        <DialogContent className="max-w-md p-5">
          {customAlternativeMaterial && (
            <form onSubmit={handleSubmitCustomAlternative} className="space-y-4">
              <DialogHeader className="space-y-1">
                <DialogTitle className="text-base font-semibold text-stone-900">
                  Request Alternative Specification
                </DialogTitle>
                <DialogDescription className="text-xs text-stone-500">
                  Tell the design team what tone, texture, or brand you'd prefer for{' '}
                  <span className="font-semibold text-stone-700">
                    {customAlternativeMaterial.name}
                  </span>
                  .
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-2 text-xs">
                <label className="font-medium text-stone-700 block">
                  Your Preference or Feedback:
                </label>
                <textarea
                  value={alternativeFeedback}
                  onChange={(e) => setAlternativeFeedback(e.target.value)}
                  rows={4}
                  placeholder="e.g. We would prefer a lighter grey tone with subtle gold veining instead of heavy black veins, or please show us a satin matte alternative..."
                  className="w-full text-xs p-3 rounded-md border border-stone-300 focus:outline-none focus:ring-1 focus:ring-[#2A5C45] focus:border-[#2A5C45]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setCustomAlternativeMaterial(null)}
                  className="text-xs h-8"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={!alternativeFeedback.trim()}
                  className="text-xs h-8 bg-[#2A5C45] hover:bg-[#204E38] text-white"
                >
                  Submit Preference
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
