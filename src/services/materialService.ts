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
};
