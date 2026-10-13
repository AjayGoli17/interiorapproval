export type PanelType = 'admin' | 'team' | 'client';

/**
 * Detects the active panel based on:
 * 1. Subdomain / Hostname (e.g. admin.yourdomain.com, team.yourdomain.com, client.yourdomain.com)
 * 2. Environment variable (VITE_PANEL_MODE='admin' | 'team' | 'client')
 * 3. URL search parameter (?panel=admin | ?panel=team | ?panel=client)
 */
export function getActivePanel(): PanelType | null {
  if (typeof window === 'undefined') return null;

  // 1. Check Subdomain / Hostname
  const host = window.location.hostname.toLowerCase();
  
  // Handles admin.yourdomain.com, studioflow-admin.vercel.app, admin.localhost, etc.
  if (
    host.startsWith('admin.') ||
    host.includes('-admin.') ||
    host.includes('.admin.') ||
    host.startsWith('admin-')
  ) {
    return 'admin';
  }

  // Handles team.yourdomain.com, studioflow-team.vercel.app, team.localhost, etc.
  if (
    host.startsWith('team.') ||
    host.includes('-team.') ||
    host.includes('.team.') ||
    host.startsWith('team-')
  ) {
    return 'team';
  }

  // Handles client.yourdomain.com, studioflow-client.vercel.app, client.localhost, etc.
  if (
    host.startsWith('client.') ||
    host.includes('-client.') ||
    host.includes('.client.') ||
    host.startsWith('client-')
  ) {
    return 'client';
  }

  // 2. Check Build-time Environment Variable
  const envMode = import.meta.env.VITE_PANEL_MODE as string | undefined;
  if (envMode === 'admin' || envMode === 'team' || envMode === 'client') {
    return envMode;
  }

  // 3. Check Query Parameter (?panel=admin | ?panel=team | ?panel=client)
  try {
    const params = new URLSearchParams(window.location.search);
    const param = params.get('panel') as string | null;
    if (param === 'admin' || param === 'team' || param === 'client') {
      return param;
    }
  } catch {
    // ignore
  }

  return null;
}

/**
 * Returns true if the session is locked to a specific panel link.
 */
export function isPanelLocked(): boolean {
  return getActivePanel() !== null;
}

/**
 * Returns the default entry route for the panel.
 */
export function getPanelEntryRoute(panel: PanelType): string {
  switch (panel) {
    case 'admin':
      return '/admin/dashboard';
    case 'team':
      return '/team/dashboard';
    case 'client':
      return '/client/dashboard';
  }
}

/**
 * Formats a clean human-readable title for the active panel.
 */
export function getPanelLabel(panel: PanelType): string {
  switch (panel) {
    case 'admin':
      return 'Admin Control Panel';
    case 'team':
      return 'Project Team Workspace';
    case 'client':
      return 'Client Portal';
  }
}
