import { supabase, isSupabaseConfigured, isDemoMode } from '@/lib/supabase';
import { useDemoStore } from '@/stores/demoStore';
import { Expense, PaymentMilestone } from '@/types';

export const financeService = {
  async getExpenses(projectId: string): Promise<Expense[]> {
    if (isSupabaseConfigured && !isDemoMode && supabase) {
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .eq('project_id', projectId);
      if (!error && data) {
        return data as Expense[];
      }
    }
    return useDemoStore.getState().expenses.filter((e) => e.project_id === projectId);
  },

  async createExpense(expense: Omit<Expense, 'id' | 'created_at'>): Promise<Expense> {
    return useDemoStore.getState().addExpense(expense);
  },

  async updateExpense(id: string, updates: Partial<Expense>): Promise<void> {
    useDemoStore.getState().updateExpense(id, updates);
  },

  async getMilestones(projectId: string): Promise<PaymentMilestone[]> {
    if (isSupabaseConfigured && !isDemoMode && supabase) {
      const { data, error } = await supabase
        .from('payment_milestones')
        .select('*')
        .eq('project_id', projectId)
        .order('milestone_code', { ascending: true });
      if (!error && data) {
        return data as PaymentMilestone[];
      }
    }
    return useDemoStore.getState().paymentMilestones.filter((m) => m.project_id === projectId);
  },

  async updatePaymentMilestone(id: string, updates: Partial<PaymentMilestone>): Promise<void> {
    useDemoStore.getState().updatePaymentMilestone(id, updates);
  },
};
