import React from 'react';
import { useDemoStore } from '@/stores/demoStore';
import { Building2, ChevronDown } from 'lucide-react';

export function ProjectSelector() {
  const { projects, currentProjectId, setCurrentProject } = useDemoStore();
  const current = projects.find((p) => p.id === currentProjectId) || projects[0];

  return (
    <div className="relative inline-flex items-center">
      <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-md border border-stone-200 bg-white text-xs hover:border-stone-300 transition-colors">
        <Building2 className="w-3.5 h-3.5 text-[#2A5C45]" />
        <select
          value={current?.id}
          onChange={(e) => setCurrentProject(e.target.value)}
          aria-label="Select active project"
          className="bg-transparent font-medium text-stone-800 pr-5 focus:outline-none cursor-pointer appearance-none text-xs"
        >
          {projects.map((p) => (
            <option key={p.id} value={p.id}>
              {p.title} ({p.project_code})
            </option>
          ))}
        </select>
        <ChevronDown className="w-3 h-3 text-stone-400 absolute right-2.5 pointer-events-none" />
      </div>
    </div>
  );
}
