import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { useDemoStore } from '@/stores/demoStore';
import { Material, ProcurementOrder } from '@/types';

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

export const procurementService = {
  async getOrders(projectId: string): Promise<ProcurementOrder[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('procurement_orders')
        .select('*')
        .eq('project_id', projectId);
      if (error) throw error;
      return data as ProcurementOrder[];
    }
    return useDemoStore.getState().procurementOrders.filter((o) => o.project_id === projectId);
  },
};
