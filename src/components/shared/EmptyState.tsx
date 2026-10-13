import React from 'react';
import { LucideIcon, Inbox } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 text-center rounded-lg border border-dashed border-stone-200 bg-white/50 ${
        className || ''
      }`}
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-full bg-stone-100 text-stone-500 mb-3">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="text-sm font-semibold text-stone-900">{title}</h3>
      <p className="mt-1 max-w-sm text-xs text-stone-500">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} size="sm" className="mt-4">
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
