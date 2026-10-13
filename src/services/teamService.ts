import { supabase, isSupabaseConfigured, isDemoMode } from '@/lib/supabase';
import { useDemoStore } from '@/stores/demoStore';
import { UserProfile } from '@/types';

export const teamService = {
  async getTeamMembers(): Promise<UserProfile[]> {
    if (isSupabaseConfigured && !isDemoMode && supabase) {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .in('role', ['admin', 'designer', 'site_manager']);
      if (!error && data) {
        return data as UserProfile[];
      }
    }
    return useDemoStore.getState().teamMembers;
  },

  async createTeamMember(member: Omit<UserProfile, 'id' | 'created_at'>): Promise<UserProfile> {
    return useDemoStore.getState().addTeamMember(member);
  },

  async updateTeamMember(id: string, updates: Partial<UserProfile>): Promise<void> {
    useDemoStore.getState().updateTeamMember(id, updates);
  },
};
