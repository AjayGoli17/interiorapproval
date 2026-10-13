import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { useDemoStore } from '@/stores/demoStore';
import { Client } from '@/types';

export const clientService = {
  async getClients(): Promise<Client[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'client');
      if (error) throw error;
      return (data || []).map((p: any) => ({
        id: p.id,
        full_name: p.full_name,
        email: p.email,
        phone: p.phone || '',
        property_address: p.company_name || '',
        city: 'Hyderabad',
      }));
    }
    return useDemoStore.getState().clients;
  },

  async createClient(client: Omit<Client, 'id' | 'created_at'>): Promise<Client> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('profiles')
        .insert([{
          full_name: client.full_name,
          email: client.email,
          phone: client.phone,
          role: 'client',
          company_name: client.property_address,
        }])
        .select()
        .single();
      if (error) throw error;
    }
    return useDemoStore.getState().addClient(client);
  },

  async updateClient(id: string, updates: Partial<Client>): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      await supabase
        .from('profiles')
        .update({
          full_name: updates.full_name,
          email: updates.email,
          phone: updates.phone,
        })
        .eq('id', id);
    }
    useDemoStore.getState().updateClient(id, updates);
  },
};
