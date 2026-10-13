import { supabase, isSupabaseConfigured, isDemoMode } from '@/lib/supabase';
import { useDemoStore } from '@/stores/demoStore';
import { Notification } from '@/types';

export const notificationService = {
  async getNotifications(userId: string): Promise<Notification[]> {
    if (isSupabaseConfigured && !isDemoMode && supabase) {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (!error && data) {
        return data as Notification[];
      }
    }
    return useDemoStore.getState().notifications.filter((n) => n.user_id === userId);
  },

  async markAsRead(id: string): Promise<void> {
    useDemoStore.getState().markNotificationRead(id);
  },
};
