import React from 'react';
import { Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function LoadingState({
  message = 'Loading workspace data...',
  className = '',
}: {
  message?: string;
  className?: string;
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center p-12 text-center ${className}`}
    >
      <Loader2 className="h-6 w-6 animate-spin text-[#2A5C45] mb-3" />
      <p className="text-xs text-stone-500 font-medium">{message}</p>
    </div>
  );
}

export function ErrorState({
  title = 'Something went wrong',
  description = 'Could not load the requested section. Please try again.',
  onRetry,
  className = '',
}: {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}) {
  return (
    <div
      className={`flex flex-col items-center justify-center p-8 text-center rounded-lg border border-rose-200 bg-rose-50/30 ${className}`}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-rose-100 text-rose-600 mb-3">
        <AlertCircle className="h-5 w-5" />
      </div>
      <h3 className="text-sm font-semibold text-rose-900">{title}</h3>
      <p className="mt-1 max-w-sm text-xs text-rose-700">{description}</p>
      {onRetry && (
        <Button onClick={onRetry} variant="outline" size="sm" className="mt-4">
          Try Again
        </Button>
      )}
    </div>
  );
}
