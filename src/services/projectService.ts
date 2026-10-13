import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { useDemoStore } from '@/stores/demoStore';
import { Project, Room } from '@/types';

export const projectService = {
  async getProjects(): Promise<Project[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Project[];
    }
    return useDemoStore.getState().projects;
  },

  async getProjectById(id: string): Promise<Project | undefined> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data as Project;
    }
    return useDemoStore.getState().projects.find((p) => p.id === id);
  },

  async getRooms(projectId: string): Promise<Room[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .eq('project_id', projectId);
      if (error) throw error;
      return data as Room[];
    }
    return useDemoStore.getState().rooms.filter((r) => r.project_id === projectId);
  },
};
