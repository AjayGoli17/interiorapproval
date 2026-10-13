import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { useDemoStore } from '@/stores/demoStore';
import { Material } from '@/types';

export const materialService = {
  async getMaterials(projectId: string): Promise<Material[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('materials')
        .select('*')
        .eq('project_id', projectId);
      if (error) throw error;
      return data as Material[];
    }
    return useDemoStore.getState().materials.filter((m) => m.project_id === projectId);
  },

  async createMaterial(material: Omit<Material, 'id'>): Promise<Material> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('materials').insert([material]).select().single();
      if (error) throw error;
      return data as Material;
    }
    return useDemoStore.getState().addMaterial(material);
  },

  async updateMaterial(id: string, updates: Partial<Material>): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      await supabase.from('materials').update(updates).eq('id', id);
    }
    useDemoStore.getState().updateMaterial(id, updates);
  },

  async deleteMaterial(id: string): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      await supabase.from('materials').delete().eq('id', id);
    }
    useDemoStore.getState().deleteMaterial(id);
  },
};
