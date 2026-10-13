import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { useDemoStore } from '@/stores/demoStore';
import { DesignVersion } from '@/types';

export const designService = {
  async getDesignVersions(projectId: string): Promise<DesignVersion[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('design_versions')
        .select('*')
        .eq('project_id', projectId);
      if (error) throw error;
      return data as DesignVersion[];
    }
    return useDemoStore.getState().designVersions.filter((d) => d.project_id === projectId);
  },
};
