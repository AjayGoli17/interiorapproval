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

  async createRoom(room: Omit<Room, 'id'>): Promise<Room> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.from('rooms').insert([room]).select().single();
      if (error) throw error;
      return data as Room;
    }
    return useDemoStore.getState().addRoom(room);
  },

  async updateRoom(id: string, updates: Partial<Room>): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      await supabase.from('rooms').update(updates).eq('id', id);
    }
    useDemoStore.getState().updateRoom(id, updates);
  },

  async deleteRoom(id: string): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      await supabase.from('rooms').delete().eq('id', id);
    }
    useDemoStore.getState().deleteRoom(id);
  },

  async createProject(project: Omit<Project, 'id' | 'created_at' | 'updated_at'>): Promise<Project> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('projects')
        .insert([project])
        .select()
        .single();
      if (error) throw error;
      return data as Project;
    }
    return useDemoStore.getState().addProject(project);
  },

  async updateProject(id: string, updates: Partial<Project>): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', id);
      if (error) throw error;
    }
    useDemoStore.getState().updateProject(id, updates);
  },
};
