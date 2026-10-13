import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { useDemoStore } from '@/stores/demoStore';
import { Task, SiteUpdate, Issue } from '@/types';

export const executionService = {
  async getTasks(projectId: string): Promise<Task[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('project_id', projectId);
      if (error) throw error;
      return data as Task[];
    }
    return useDemoStore.getState().tasks.filter((t) => t.project_id === projectId);
  },

  async getSiteUpdates(projectId: string): Promise<SiteUpdate[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('site_updates')
        .select('*')
        .eq('project_id', projectId)
        .order('date', { ascending: false });
      if (error) throw error;
      return data as SiteUpdate[];
    }
    return useDemoStore.getState().siteUpdates.filter((u) => u.project_id === projectId);
  },

  async getIssues(projectId: string): Promise<Issue[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('issues')
        .select('*')
        .eq('project_id', projectId);
      if (error) throw error;
      return data as Issue[];
    }
    return useDemoStore.getState().issues.filter((i) => i.project_id === projectId);
  },
};
