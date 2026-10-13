import { supabase, isSupabaseConfigured, isDemoMode } from '@/lib/supabase';
import { useDemoStore } from '@/stores/demoStore';
import { Project, Room } from '@/types';

export const projectService = {
  async getProjects(): Promise<Project[]> {
    if (isSupabaseConfigured && !isDemoMode && supabase) {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
      if (!error && data) {
        return data as Project[];
      }
    }
    return useDemoStore.getState().projects;
  },

  async getProjectById(id: string): Promise<Project | undefined> {
    if (isSupabaseConfigured && !isDemoMode && supabase) {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();
      if (!error && data) {
        return data as Project;
      }
    }
    return useDemoStore.getState().projects.find((p) => p.id === id);
  },

  async getRooms(projectId: string): Promise<Room[]> {
    if (isSupabaseConfigured && !isDemoMode && supabase) {
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .eq('project_id', projectId);
      if (!error && data) {
        return data as Room[];
      }
    }
    return useDemoStore.getState().rooms.filter((r) => r.project_id === projectId);
  },

  async createRoom(room: Omit<Room, 'id'>): Promise<Room> {
    return useDemoStore.getState().addRoom(room);
  },

  async updateRoom(id: string, updates: Partial<Room>): Promise<void> {
    useDemoStore.getState().updateRoom(id, updates);
  },

  async deleteRoom(id: string): Promise<void> {
    useDemoStore.getState().deleteRoom(id);
  },

  async createProject(project: Omit<Project, 'id' | 'created_at' | 'updated_at'>): Promise<Project> {
    return useDemoStore.getState().addProject(project);
  },

  async updateProject(id: string, updates: Partial<Project>): Promise<void> {
    useDemoStore.getState().updateProject(id, updates);
  },

  async deleteProject(id: string): Promise<void> {
    useDemoStore.getState().deleteProject(id);
  },
};
