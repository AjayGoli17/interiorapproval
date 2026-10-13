import React from 'react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export type StatusCategory =
  | 'project'
  | 'approval'
  | 'task'
  | 'delivery'
  | 'payment'
  | 'priority'
  | 'issue'
  | 'team';

interface StatusBadgeProps {
  status: string;
  category?: StatusCategory;
  className?: string;
}

export function StatusBadge({ status, category = 'approval', className }: StatusBadgeProps) {
  const normalized = status.toLowerCase();

  // Success / Completed / Positive statuses
  if (
    normalized === 'approved' ||
    normalized === 'client_approved' ||
    normalized === 'sample_approved' ||
    normalized === 'completed' ||
    normalized === 'payment_received' ||
    normalized === 'paid' ||
    normalized === 'received' ||
    normalized === 'delivered' ||
    normalized === 'installed' ||
    normalized === 'implemented' ||
    normalized === 'resolved' ||
    normalized === 'verified_closed' ||
    normalized === 'available'
  ) {
    return (
      <Badge
        className={cn(
          'bg-[#EAF2ED] text-[#204E38] border-[#CDE1D4] font-medium capitalize',
          className
        )}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-[#2A5C45] mr-1.5 inline-block shrink-0" />
        {status.replace(/_/g, ' ')}
      </Badge>
    );
  }

  // Pending / In-progress / Neutral-Active statuses
  if (
    normalized === 'pending' ||
    normalized === 'under_review' ||
    normalized === 'reviewed' ||
    normalized === 'quoted' ||
    normalized === 'requested' ||
    normalized === 'submitted' ||
    normalized === 'in_progress' ||
    normalized === 'in_design' ||
    normalized === 'design_phase' ||
    normalized === 'client_review' ||
    normalized === 'in_execution' ||
    normalized === 'execution' ||
    normalized === 'invoice_raised' ||
    normalized === 'partially_paid' ||
    normalized === 'investigating' ||
    normalized === 'action_assigned' ||
    normalized === 'ordered' ||
    normalized === 'po_issued' ||
    normalized === 'in_transit' ||
    normalized === 'dispatched' ||
    normalized === 'medium' ||
    normalized === 'busy'
  ) {
    return (
      <Badge
        className={cn(
          'bg-amber-50 text-amber-800 border-amber-200/80 font-medium capitalize',
          className
        )}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mr-1.5 inline-block shrink-0" />
        {status.replace(/_/g, ' ')}
      </Badge>
    );
  }

  // Destructive / Warning / Error statuses
  if (
    normalized === 'rejected' ||
    normalized === 'revision_requested' ||
    normalized === 'cancelled' ||
    normalized === 'blocked' ||
    normalized === 'delayed' ||
    normalized === 'overdue' ||
    normalized === 'critical' ||
    normalized === 'high' ||
    normalized === 'on_leave'
  ) {
    return (
      <Badge
        className={cn(
          'bg-rose-50 text-rose-700 border-rose-200/80 font-medium capitalize',
          className
        )}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mr-1.5 inline-block shrink-0" />
        {status.replace(/_/g, ' ')}
      </Badge>
    );
  }

  // Neutral / default (draft, scheduled, todo, low, lead, on_hold)
  return (
    <Badge
      variant="secondary"
      className={cn('text-stone-600 font-medium capitalize bg-stone-100 border-stone-200', className)}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-stone-400 mr-1.5 inline-block shrink-0" />
      {status.replace(/_/g, ' ')}
    </Badge>
  );
}
