import { supabase, isSupabaseConfigured, isDemoMode } from '@/lib/supabase';
import { useDemoStore } from '@/stores/demoStore';
import { Client } from '@/types';

export const clientService = {
  async getClients(): Promise<Client[]> {
    if (isSupabaseConfigured && !isDemoMode && supabase) {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'client');
      if (!error && data) {
        return (data || []).map((p: any) => ({
          id: p.id,
          full_name: p.full_name,
          email: p.email,
          phone: p.phone || '',
          property_address: p.property_address || p.company_name || '',
          city: p.city || 'Hyderabad',
          notes: p.notes,
        }));
      }
    }
    return useDemoStore.getState().clients;
  },

  async createClient(client: Omit<Client, 'id' | 'created_at'>): Promise<Client> {
    return useDemoStore.getState().addClient(client);
  },

  async updateClient(id: string, updates: Partial<Client>): Promise<void> {
    useDemoStore.getState().updateClient(id, updates);
  },
};
