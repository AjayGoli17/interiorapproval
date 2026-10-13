import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { useDemoStore } from '@/stores/demoStore';
import { ProcurementOrder } from '@/types';

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

  async createOrder(order: Omit<ProcurementOrder, 'id' | 'created_at'>): Promise<ProcurementOrder> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('procurement_orders')
        .insert([order])
        .select()
        .single();
      if (error) throw error;
      return data as ProcurementOrder;
    }
    return useDemoStore.getState().addProcurementOrder(order);
  },

  async updateOrder(id: string, updates: Partial<ProcurementOrder>): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      await supabase
        .from('procurement_orders')
        .update(updates)
        .eq('id', id);
    }
    useDemoStore.getState().updateProcurementOrder(id, updates);
  },
};
