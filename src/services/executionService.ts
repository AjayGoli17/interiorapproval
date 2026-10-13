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

  async createTask(task: Omit<Task, 'id'>): Promise<Task> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('tasks').insert([task]).select().single();
      if (error) throw error;
      return data as Task;
    }
    return useDemoStore.getState().addTask(task);
  },

  async updateTask(id: string, updates: Partial<Task>): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      await supabase.from('tasks').update(updates).eq('id', id);
    }
    useDemoStore.getState().updateTask(id, updates);
  },

  async deleteTask(id: string): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      await supabase.from('tasks').delete().eq('id', id);
    }
    useDemoStore.getState().deleteTask(id);
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

  async createSiteUpdate(update: Omit<SiteUpdate, 'id'>): Promise<SiteUpdate> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('site_updates').insert([update]).select().single();
      if (error) throw error;
      return data as SiteUpdate;
    }
    return useDemoStore.getState().addSiteUpdate(update);
  },

  async updateSiteUpdate(id: string, updates: Partial<SiteUpdate>): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      await supabase.from('site_updates').update(updates).eq('id', id);
    }
    useDemoStore.getState().updateSiteUpdate(id, updates);
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

  async createIssue(issue: Omit<Issue, 'id'>): Promise<Issue> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('issues').insert([issue]).select().single();
      if (error) throw error;
      return data as Issue;
    }
    return useDemoStore.getState().addIssue(issue);
  },

  async updateIssue(id: string, updates: Partial<Issue>): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      await supabase.from('issues').update(updates).eq('id', id);
    }
    useDemoStore.getState().updateIssue(id, updates);
  },
};
