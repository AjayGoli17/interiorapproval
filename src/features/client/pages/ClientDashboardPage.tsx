import React from 'react';
import { ScreenPlaceholder } from '@/components/shared/ScreenPlaceholder';
import { Home, Sparkles, CheckCircle2, Clock, Calendar, ArrowRight } from 'lucide-react';
import { useDemoStore } from '@/stores/demoStore';
import { formatINR } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export function ClientDashboardPage() {
  const navigate = useNavigate();
  const { projects, currentProjectId, approvals } = useDemoStore();
  const project = projects.find((p) => p.id === currentProjectId) || projects[0];
  const pendingCount = approvals.filter(
    (a) => a.project_id === project?.id && a.status === 'pending'
  ).length;

  return (
    <ScreenPlaceholder
      title="Welcome to your Project Portal"
      subtitle={`Live status, design decisions, and progress for ${project.title}.`}
      panelName="Client Portal"
      screenNumber="Screen 1 of 5"
      icon={Home}
      plannedFeatures={[
        'Overall completion progress bar and current active trade milestone',
        'Direct callout for decisions currently awaiting homeowner sign-off',
        'Recent site photo highlights and contractor weekly update summary',
        'Direct one-click connection to Lead Designer Arjun Mehta',
      ]}
    >
      <div className="space-y-4 pt-2">
        {/* Progress Card */}
        <div className="p-4 rounded-lg bg-stone-50 border border-stone-200">
          <div className="flex items-center justify-between mb-2">
            <div>
              <span className="text-xs font-semibold text-stone-900 block">
                Execution Progress: {project.progress_percentage}%
              </span>
              <span className="text-[11px] text-stone-500">
                Phase 3 of 5: Modular Woodwork Carcass & Electrical Wiring
              </span>
            </div>
            <span className="text-xs font-medium text-stone-600">
              Target Handover: {project.target_handover_date}
            </span>
          </div>
          <div className="w-full bg-stone-200 rounded-full h-2">
            <div
              className="bg-[#2A5C45] h-2 rounded-full transition-all duration-500"
              style={{ width: `${project.progress_percentage}%` }}
            />
          </div>
        </div>

        {/* Action alert for pending items */}
        {pendingCount > 0 && (
          <div className="p-3.5 rounded-lg border border-amber-200 bg-amber-50/60 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-amber-900 font-medium">
              <Clock className="w-4 h-4 text-amber-600 shrink-0" />
              <span>You have {pendingCount} item awaiting your review and sign-off.</span>
            </div>
            <Button
              size="sm"
              variant="outline"
              onClick={() => navigate('/client/approvals')}
              className="text-xs h-7 bg-white text-amber-900 border-amber-300 hover:bg-amber-100"
            >
              Review Now <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          </div>
        )}
      </div>
    </ScreenPlaceholder>
  );
}
