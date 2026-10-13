import React from 'react';
import { PageHeader } from './PageHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LucideIcon, Layers, Sparkles } from 'lucide-react';

interface ScreenPlaceholderProps {
  title: string;
  subtitle: string;
  panelName: 'Admin Panel' | 'Project Team Panel' | 'Client Portal';
  screenNumber: string; // e.g. "Screen 1 of 8"
  icon: LucideIcon;
  plannedFeatures: string[];
  breadcrumbs?: Array<{ label: string; href?: string }>;
  headerActions?: React.ReactNode;
  children?: React.ReactNode;
}

export function ScreenPlaceholder({
  title,
  subtitle,
  panelName,
  screenNumber,
  icon: Icon,
  plannedFeatures,
  breadcrumbs,
  headerActions,
  children,
}: ScreenPlaceholderProps) {
  return (
    <div className="space-y-6">
      <PageHeader
        title={title}
        subtitle={subtitle}
        breadcrumbs={breadcrumbs}
        badge={
          <Badge variant="secondary" className="font-mono text-[11px] text-stone-600">
            {screenNumber}
          </Badge>
        }
        actions={headerActions}
      />

      {/* Screen Scaffold Card */}
      <Card className="border-stone-200 bg-white">
        <CardHeader className="pb-3 border-b border-stone-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-md bg-[#2A5C45]/10 text-[#2A5C45] flex items-center justify-center">
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <CardTitle className="text-sm font-semibold text-stone-900">
                  {title} Foundation Scaffold
                </CardTitle>
                <CardDescription className="text-xs text-stone-500">
                  {panelName} • Logical Screen Route Active
                </CardDescription>
              </div>
            </div>
            <Badge className="bg-[#EAF2ED] text-[#204E38] border-[#CDE1D4] text-[10px] font-mono">
              Ready for Implementation
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="pt-4 space-y-4">
          <div className="p-3.5 rounded-md bg-stone-50 border border-stone-200/60 text-xs">
            <span className="font-semibold text-stone-800 block mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#2A5C45]" />
              Planned Scope & Capabilities:
            </span>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-stone-600">
              {plannedFeatures.map((feat, idx) => (
                <li key={idx} className="flex items-start gap-1.5 text-[11px]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2A5C45] mt-1 shrink-0" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Any contextual preview data injected from the demo store */}
          {children && <div className="pt-2">{children}</div>}
        </CardContent>
      </Card>
    </div>
  );
}
