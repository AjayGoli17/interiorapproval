import { supabase, isSupabaseConfigured, isDemoMode } from '@/lib/supabase';
import { useDemoStore } from '@/stores/demoStore';
import { Approval, ChangeRequest } from '@/types';

export const approvalService = {
  async getApprovals(projectId: string): Promise<Approval[]> {
    if (isSupabaseConfigured && !isDemoMode && supabase) {
      const { data, error } = await supabase
        .from('approvals')
        .select('*')
        .eq('project_id', projectId);
      if (!error && data) {
        return data as Approval[];
      }
    }
    return useDemoStore.getState().approvals.filter((a) => a.project_id === projectId);
  },

  async createApproval(approval: Omit<Approval, 'id' | 'created_at'>): Promise<Approval> {
    return useDemoStore.getState().addApproval(approval);
  },

  async updateApprovalRecord(id: string, updates: Partial<Approval>): Promise<void> {
    useDemoStore.getState().updateApproval(id, updates);
  },

  async updateApproval(
    id: string,
    status: 'approved' | 'rejected' | 'revision_requested',
    comments?: string
  ): Promise<void> {
    useDemoStore.getState().updateApprovalStatus(id, status, comments);
  },

  async getChangeRequests(projectId: string): Promise<ChangeRequest[]> {
    if (isSupabaseConfigured && !isDemoMode && supabase) {
      const { data, error } = await supabase
        .from('change_requests')
        .select('*')
        .eq('project_id', projectId);
      if (!error && data) {
        return data as ChangeRequest[];
      }
    }
    return useDemoStore.getState().changeRequests.filter((c) => c.project_id === projectId);
  },

  async createChangeRequest(cr: Omit<ChangeRequest, 'id' | 'created_at'>): Promise<ChangeRequest> {
    return useDemoStore.getState().addChangeRequest(cr);
  },

  async updateChangeRequest(id: string, updates: Partial<ChangeRequest>): Promise<void> {
    useDemoStore.getState().updateChangeRequest(id, updates);
  },
};
