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

  async createApproval(approval: Omit<Approval, 'id' | 'created_at'>): Promise<Approval> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('approvals').insert([approval]).select().single();
      if (error) throw error;
      return data as Approval;
    }
    return useDemoStore.getState().addApproval(approval);
  },

  async updateApprovalRecord(id: string, updates: Partial<Approval>): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      await supabase.from('approvals').update(updates).eq('id', id);
    }
    useDemoStore.getState().updateApproval(id, updates);
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

  async createChangeRequest(cr: Omit<ChangeRequest, 'id' | 'created_at'>): Promise<ChangeRequest> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('change_requests').insert([cr]).select().single();
      if (error) throw error;
      return data as ChangeRequest;
    }
    return useDemoStore.getState().addChangeRequest(cr);
  },

  async updateChangeRequest(id: string, updates: Partial<ChangeRequest>): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      await supabase.from('change_requests').update(updates).eq('id', id);
    }
    useDemoStore.getState().updateChangeRequest(id, updates);
  },
};
