import React from 'react';
import { ScreenPlaceholder } from '@/components/shared/ScreenPlaceholder';
import { CheckCircle2, Check, X, RefreshCw, MessageSquare } from 'lucide-react';
import { useDemoStore } from '@/stores/demoStore';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/shared/StatusBadge';

export function ClientApprovalsPage() {
  const { approvals, updateApprovalStatus } = useDemoStore();

  return (
    <ScreenPlaceholder
      title="Approvals & Decisions"
      subtitle="Your active decision queue: sign off on materials, layout plans, and finish specifications."
      panelName="Client Portal"
      screenNumber="Screen 3 of 5"
      icon={CheckCircle2}
      plannedFeatures={[
        'Interactive one-click "Approve" with confirmation modal and timestamp',
        '"Request Revision" flow with structured feedback input box',
        'Direct link to material swatches, warranty documents, and cost changes',
        'History log of previously approved items and signed revisions',
      ]}
    >
      <div className="space-y-4 pt-2">
        {approvals.map((item) => (
          <Card key={item.id} className="border-stone-200">
            <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-sm font-semibold text-stone-900">
                  {item.title}
                </CardTitle>
                <span className="text-xs text-stone-500">
                  Category: {item.category.toUpperCase()} • Due: {item.due_date || 'Flexible'}
                </span>
              </div>
              <StatusBadge status={item.status} />
            </CardHeader>
            <CardContent className="p-4 pt-2 text-xs text-stone-600 space-y-3">
              <p>{item.description}</p>
              {item.client_comments && (
                <div className="p-2.5 rounded bg-stone-50 border border-stone-200/60 italic text-stone-700">
                  Your Note: "{item.client_comments}"
                </div>
              )}
              {item.status === 'pending' && (
                <div className="flex items-center gap-2 pt-2 border-t border-stone-100">
                  <Button
                    size="sm"
                    className="h-8 text-xs bg-[#2A5C45] hover:bg-[#204E38]"
                    onClick={() => updateApprovalStatus(item.id, 'approved', 'Approved by Rahul Sharma')}
                  >
                    <Check className="w-3.5 h-3.5 mr-1" /> Approve Selection
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 text-xs text-rose-700 border-rose-200 hover:bg-rose-50"
                    onClick={() => updateApprovalStatus(item.id, 'revision_requested', 'Revision requested by client')}
                  >
                    <RefreshCw className="w-3.5 h-3.5 mr-1" /> Request Revision
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </ScreenPlaceholder>
  );
}
