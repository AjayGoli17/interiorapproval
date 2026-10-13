import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { useDemoStore } from '@/stores/demoStore';
import { Notification } from '@/types';

export const notificationService = {
  async getNotifications(userId: string): Promise<Notification[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Notification[];
    }
    return useDemoStore.getState().notifications.filter((n) => n.user_id === userId);
  },

  async markAsRead(id: string): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      await supabase.from('notifications').update({ is_read: true }).eq('id', id);
      return;
    }
    useDemoStore.getState().markNotificationRead(id);
  },
};
