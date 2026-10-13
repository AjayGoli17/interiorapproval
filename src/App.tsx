import React, { useEffect } from 'react';
import { Providers } from './app/providers';
import { useDemoStore } from './stores/demoStore';
import { isSupabaseConfigured, isDemoMode } from './lib/supabase';
import { subscribeToRealtime } from './lib/supabaseSync';

export function App() {
  useEffect(() => {
    if (isSupabaseConfigured && !isDemoMode) {
      useDemoStore.getState().syncWithSupabase();
      const unsubscribe = subscribeToRealtime(() => {
        useDemoStore.getState().syncWithSupabase();
      });
      return () => {
        unsubscribe();
      };
    }
  }, []);

  return <Providers />;
}

export default App;
