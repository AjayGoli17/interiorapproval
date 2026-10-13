import { supabase, isSupabaseConfigured, isDemoMode } from '@/lib/supabase';
import { useDemoStore } from '@/stores/demoStore';
import { Task, SiteUpdate, Issue } from '@/types';

export const executionService = {
  async getTasks(projectId: string): Promise<Task[]> {
    if (isSupabaseConfigured && !isDemoMode && supabase) {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('project_id', projectId);
      if (!error && data) {
        return data as Task[];
      }
    }
    return useDemoStore.getState().tasks.filter((t) => t.project_id === projectId);
  },

  async createTask(task: Omit<Task, 'id'>): Promise<Task> {
    return useDemoStore.getState().addTask(task);
  },

  async updateTask(id: string, updates: Partial<Task>): Promise<void> {
    useDemoStore.getState().updateTask(id, updates);
  },

  async deleteTask(id: string): Promise<void> {
    useDemoStore.getState().deleteTask(id);
  },

  async getSiteUpdates(projectId: string): Promise<SiteUpdate[]> {
    if (isSupabaseConfigured && !isDemoMode && supabase) {
      const { data, error } = await supabase
        .from('site_updates')
        .select('*')
        .eq('project_id', projectId)
        .order('date', { ascending: false });
      if (!error && data) {
        return data as SiteUpdate[];
      }
    }
    return useDemoStore.getState().siteUpdates.filter((u) => u.project_id === projectId);
  },

  async createSiteUpdate(update: Omit<SiteUpdate, 'id'>): Promise<SiteUpdate> {
    return useDemoStore.getState().addSiteUpdate(update);
  },

  async updateSiteUpdate(id: string, updates: Partial<SiteUpdate>): Promise<void> {
    useDemoStore.getState().updateSiteUpdate(id, updates);
  },

  async deleteSiteUpdate(id: string): Promise<void> {
    useDemoStore.getState().deleteSiteUpdate(id);
  },

  async getIssues(projectId: string): Promise<Issue[]> {
    if (isSupabaseConfigured && !isDemoMode && supabase) {
      const { data, error } = await supabase
        .from('issues')
        .select('*')
        .eq('project_id', projectId);
      if (!error && data) {
        return data as Issue[];
      }
    }
    return useDemoStore.getState().issues.filter((i) => i.project_id === projectId);
  },

  async createIssue(issue: Omit<Issue, 'id'>): Promise<Issue> {
    return useDemoStore.getState().addIssue(issue);
  },

  async updateIssue(id: string, updates: Partial<Issue>): Promise<void> {
    useDemoStore.getState().updateIssue(id, updates);
  },

  async deleteIssue(id: string): Promise<void> {
    useDemoStore.getState().deleteIssue(id);
  },
};
