import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDemoStore } from '@/stores/demoStore';
import { UserRole } from '@/types';
import { ShieldCheck, UserCheck, Sparkles, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function DemoBanner() {
  const navigate = useNavigate();
  const { currentUser, switchRole, resetDemoData } = useDemoStore();

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
          <Sparkles className="w-3 h-3" /> Demo Mode Active
        </span>
        <span className="hidden sm:inline text-stone-400">Viewing as:</span>
        <span className="font-medium text-white flex items-center gap-1">
          <UserCheck className="w-3.5 h-3.5 text-stone-400" />
          {currentUser.full_name}
          <span className="text-[11px] text-stone-400">({currentUser.role})</span>
        </span>
      </div>

      <div className="flex items-center gap-1.5">
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
      </div>
    </div>
  );
}
