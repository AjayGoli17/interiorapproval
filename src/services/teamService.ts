import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { useDemoStore } from '@/stores/demoStore';
import { UserProfile } from '@/types';

export const teamService = {
  async getTeamMembers(): Promise<UserProfile[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .in('role', ['admin', 'designer', 'site_manager']);
      if (error) throw error;
      return data as UserProfile[];
    }
    return useDemoStore.getState().teamMembers;
  },

  async createTeamMember(member: Omit<UserProfile, 'id' | 'created_at'>): Promise<UserProfile> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('profiles')
        .insert([member])
        .select()
        .single();
      if (error) throw error;
      return data as UserProfile;
    }
    return useDemoStore.getState().addTeamMember(member);
  },

  async updateTeamMember(id: string, updates: Partial<UserProfile>): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      await supabase.from('profiles').update(updates).eq('id', id);
    }
    useDemoStore.getState().updateTeamMember(id, updates);
  },
};
