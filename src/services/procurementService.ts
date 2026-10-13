import { supabase, isSupabaseConfigured, isDemoMode } from '@/lib/supabase';
import { useDemoStore } from '@/stores/demoStore';
import { ProcurementOrder } from '@/types';

export const procurementService = {
  async getOrders(projectId: string): Promise<ProcurementOrder[]> {
    if (isSupabaseConfigured && !isDemoMode && supabase) {
      const { data, error } = await supabase
        .from('procurement_orders')
        .select('*')
        .eq('project_id', projectId);
      if (!error && data) {
        return data as ProcurementOrder[];
      }
    }
    return useDemoStore.getState().procurementOrders.filter((o) => o.project_id === projectId);
  },

  async createOrder(order: Omit<ProcurementOrder, 'id' | 'created_at'>): Promise<ProcurementOrder> {
    return useDemoStore.getState().addProcurementOrder(order);
  },

  async updateOrder(id: string, updates: Partial<ProcurementOrder>): Promise<void> {
    useDemoStore.getState().updateProcurementOrder(id, updates);
  },
};
