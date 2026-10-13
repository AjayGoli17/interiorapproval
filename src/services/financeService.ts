import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { useDemoStore } from '@/stores/demoStore';
import { Expense, PaymentMilestone } from '@/types';

export const financeService = {
  async getExpenses(projectId: string): Promise<Expense[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .eq('project_id', projectId);
      if (error) throw error;
      return data as Expense[];
    }
    return useDemoStore.getState().expenses.filter((e) => e.project_id === projectId);
  },

  async getMilestones(projectId: string): Promise<PaymentMilestone[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('payment_milestones')
        .select('*')
        .eq('project_id', projectId)
        .order('milestone_code', { ascending: true });
      if (error) throw error;
      return data as PaymentMilestone[];
    }
    return useDemoStore.getState().paymentMilestones.filter((m) => m.project_id === projectId);
  },
};
