import { supabase, isSupabaseConfigured, isDemoMode } from '@/lib/supabase';
import { useDemoStore } from '@/stores/demoStore';
import { Material } from '@/types';

export const materialService = {
  async getMaterials(projectId: string): Promise<Material[]> {
    if (isSupabaseConfigured && !isDemoMode && supabase) {
      const { data, error } = await supabase
        .from('materials')
        .select('*')
        .eq('project_id', projectId);
      if (!error && data) {
        return data as Material[];
      }
    }
    return useDemoStore.getState().materials.filter((m) => m.project_id === projectId);
  },

  async createMaterial(material: Omit<Material, 'id'>): Promise<Material> {
    return useDemoStore.getState().addMaterial(material);
  },

  async updateMaterial(id: string, updates: Partial<Material>): Promise<void> {
    useDemoStore.getState().updateMaterial(id, updates);
  },

  async selectMaterial(
    materialId: string,
    selectionStatus: 'selected_by_client' | 'approved' | 'rejected',
    notes?: string
  ): Promise<void> {
    useDemoStore.getState().selectMaterial(materialId, selectionStatus, notes);
  },

  async deleteMaterial(id: string): Promise<void> {
    useDemoStore.getState().deleteMaterial(id);
  },
};
