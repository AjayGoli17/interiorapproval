import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { useDemoStore } from '@/stores/demoStore';
import { Approval, ChangeRequest } from '@/types';

export const approvalService = {
  async getApprovals(projectId: string): Promise<Approval[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('approvals')
        .select('*')
        .eq('project_id', projectId);
      if (error) throw error;
      return data as Approval[];
    }
    return useDemoStore.getState().approvals.filter((a) => a.project_id === projectId);
  },

  async updateApproval(
    id: string,
    status: 'approved' | 'rejected' | 'revision_requested',
    comments?: string
  ): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase
        .from('approvals')
        .update({
          status,
          client_comments: comments,
          approved_at: status === 'approved' ? new Date().toISOString() : null,
        })
        .eq('id', id);
      if (error) throw error;
      return;
    }
    useDemoStore.getState().updateApprovalStatus(id, status, comments);
  },

  async getChangeRequests(projectId: string): Promise<ChangeRequest[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('change_requests')
        .select('*')
        .eq('project_id', projectId);
      if (error) throw error;
      return data as ChangeRequest[];
    }
    return useDemoStore.getState().changeRequests.filter((c) => c.project_id === projectId);
  },
};
