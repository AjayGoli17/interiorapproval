import { supabase, isSupabaseConfigured, isDemoMode } from '@/lib/supabase';
import { useDemoStore } from '@/stores/demoStore';
import { DesignVersion, Approval } from '@/types';

export const designService = {
  async getDesignVersions(projectId: string): Promise<DesignVersion[]> {
    if (isSupabaseConfigured && !isDemoMode && supabase) {
      const { data, error } = await supabase
        .from('design_versions')
        .select('*')
        .eq('project_id', projectId);
      if (!error && data) {
        return data as DesignVersion[];
      }
    }
    return useDemoStore.getState().designVersions.filter((d) => d.project_id === projectId);
  },

  async createDesignVersion(version: Omit<DesignVersion, 'id' | 'submitted_at'>): Promise<DesignVersion> {
    return useDemoStore.getState().addDesignVersion(version);
  },

  async updateDesignVersion(id: string, updates: Partial<DesignVersion>): Promise<void> {
    useDemoStore.getState().updateDesignVersion(id, updates);
  },

  async submitForApproval(designId: string, approvalTitle?: string, approvalNotes?: string): Promise<Approval> {
    return useDemoStore.getState().submitDesignForApproval(designId, approvalTitle, approvalNotes);
  },

  async reviewDesignVersion(designId: string, decision: 'approved' | 'revision_requested', feedback?: string): Promise<void> {
    useDemoStore.getState().reviewDesignVersion(designId, decision, feedback);
  },
};
