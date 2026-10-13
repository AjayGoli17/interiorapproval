import React from 'react';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  badge?: React.ReactNode;
  actions?: React.ReactNode;
  breadcrumbs?: Array<{ label: string; href?: string }>;
  className?: string;
}

export function PageHeader({
  title,
  subtitle,
  badge,
  actions,
  breadcrumbs,
  className,
}: PageHeaderProps) {
  return (
    <div className={cn('mb-6 pb-4 border-b border-stone-200/60', className)}>
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="mb-2 flex items-center space-x-1.5 text-xs text-stone-500">
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={idx}>
              {crumb.href ? (
                <a
                  href={crumb.href}
                  className="hover:text-stone-800 transition-colors"
                >
                  {crumb.label}
                </a>
              ) : (
                <span className="text-stone-700 font-medium">{crumb.label}</span>
              )}
              {idx < breadcrumbs.length - 1 && (
                <span className="text-stone-400">/</span>
              )}
            </React.Fragment>
          ))}
        </nav>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-stone-900">
            {title}
          </h1>
          {badge}
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>

      {subtitle && (
        <p className="mt-1 text-xs sm:text-sm text-stone-500 max-w-3xl">
          {subtitle}
        </p>
      )}
    </div>
  );
}
