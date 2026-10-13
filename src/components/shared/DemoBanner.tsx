import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDemoStore, DEMO_USERS } from '@/stores/demoStore';
import { UserRole } from '@/types';
import { UserCheck, Sparkles, Lock, ExternalLink } from 'lucide-react';
import { getActivePanel, getPanelLabel } from '@/lib/panelConfig';

export function DemoBanner() {
  const navigate = useNavigate();
  const { currentUser, switchRole, isSupabaseConnected, isSyncing, syncWithSupabase } = useDemoStore();
  const activePanel = getActivePanel();

  // Automatically align demo identity to the locked panel on dedicated links
  useEffect(() => {
    if (activePanel === 'client' && currentUser.role !== 'client') {
      switchRole('client');
    } else if (activePanel === 'admin' && currentUser.role !== 'admin') {
      switchRole('admin');
    } else if (
      activePanel === 'team' &&
      currentUser.role !== 'designer' &&
      currentUser.role !== 'site_manager'
    ) {
      switchRole('designer');
    }
  }, [activePanel, currentUser.role, switchRole]);

  const handleRoleChange = (role: UserRole) => {
    switchRole(role);
    if (role === 'admin') navigate('/admin');
    else if (role === 'designer' || role === 'site_manager') navigate('/team');
    else if (role === 'client') navigate('/client');
  };

  return (
    <div className="bg-[#1C2421] text-stone-300 text-xs px-4 py-1.5 flex flex-wrap items-center justify-between gap-2 border-b border-stone-800">
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center gap-1 font-semibold text-[#82C39B] tracking-wide uppercase text-[10px] bg-[#2A5C45]/40 px-2 py-0.5 rounded border border-[#2A5C45]/50">
          <Sparkles className="w-3 h-3" /> Demo Active
        </span>

        {/* Database Status Indicator */}
        {isSupabaseConnected ? (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-950/80 text-emerald-300 border border-emerald-700/60" title="Connected to Supabase PostgreSQL database">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Supabase Live
            <button
              onClick={() => syncWithSupabase()}
              disabled={isSyncing}
              className="hover:text-white transition-opacity disabled:opacity-50 ml-0.5"
              title="Refresh database sync"
            >
              <span className={`text-[10px] ${isSyncing ? 'animate-spin inline-block' : ''}`}>↻</span>
            </button>
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-medium bg-amber-950/60 text-amber-300/90 border border-amber-700/40" title="Operating with pre-seeded local storage dataset">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            Local Demo Store
          </span>
        )}

        {activePanel ? (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-stone-800 text-stone-200 border border-stone-700">
            <Lock className="w-3 h-3 text-[#82C39B]" /> {getPanelLabel(activePanel)}
          </span>
        ) : (
          <span className="hidden sm:inline text-stone-400">Viewing as:</span>
        )}

        <span className="font-medium text-white flex items-center gap-1">
          <UserCheck className="w-3.5 h-3.5 text-stone-400" />
          {currentUser.full_name}
          <span className="text-[11px] text-stone-400">({currentUser.role})</span>
        </span>
      </div>

      <div className="flex items-center gap-1.5">
        {activePanel ? (
          // Dedicated link mode: panel is isolated, no cross-panel switching
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-stone-400 font-mono hidden md:inline">
              Dedicated Panel Link
            </span>
            <button
              onClick={() => {
                // Return to unconstrained Demo Hub
                window.location.assign('/');
              }}
              className="text-stone-400 hover:text-white text-[11px] px-2 py-0.5 rounded hover:bg-stone-800 flex items-center gap-1"
              title="Open full studio overview with all panels"
            >
              <ExternalLink className="w-3 h-3" /> All Panels Hub
            </button>
          </div>
        ) : (
          // Multi-panel overview mode (localhost / Demo Landing)
          <>
            <span className="text-stone-400 text-[11px] mr-1 hidden md:inline">Quick Switch:</span>
            <button
              onClick={() => handleRoleChange('admin')}
              className={`px-2 py-0.5 rounded text-[11px] transition-colors ${
                currentUser.role === 'admin'
                  ? 'bg-[#2A5C45] text-white font-medium'
                  : 'hover:bg-stone-800 text-stone-400 hover:text-white'
              }`}
            >
              Admin
            </button>
            <button
              onClick={() => handleRoleChange('designer')}
              className={`px-2 py-0.5 rounded text-[11px] transition-colors ${
                currentUser.role === 'designer' || currentUser.role === 'site_manager'
                  ? 'bg-[#2A5C45] text-white font-medium'
                  : 'hover:bg-stone-800 text-stone-400 hover:text-white'
              }`}
            >
              Project Team
            </button>
            <button
              onClick={() => handleRoleChange('client')}
              className={`px-2 py-0.5 rounded text-[11px] transition-colors ${
                currentUser.role === 'client'
                  ? 'bg-[#2A5C45] text-white font-medium'
                  : 'hover:bg-stone-800 text-stone-400 hover:text-white'
              }`}
            >
              Client
            </button>

            <div className="h-3 w-px bg-stone-700 mx-1 hidden sm:block" />

            <button
              onClick={() => navigate('/')}
              className="text-stone-400 hover:text-white text-[11px] px-1.5 py-0.5 hover:underline"
            >
              Demo Hub
            </button>
          </>
        )}
      </div>
    </div>
  );
}
