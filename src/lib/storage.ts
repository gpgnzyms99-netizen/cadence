import { Workspace, Update } from './types';
import { getDefaultDemoSlides } from './segmenter';

export const DEFAULT_WORKSPACE: Workspace = {
  id: 'ws-ttc',
  slug: 'ttc',
  name: 'TTC Executive',
  brand: {
    name: 'TTC Group',
    logoUrl: '/globe.svg',
    palette: {
      primary: '#6366f1', // Indigo accent
      accent: '#38bdf8',  // Sky blue
      bg: '#090d16'       // Deep midnight dark
    },
    fonts: {
      head: 'Inter, sans-serif',
      body: 'Inter, sans-serif'
    },
    defaultMediaTone: 'editorial'
  }
};

const DEMO_UPDATE_ID = 'up-2026-w26';

export const DEMO_UPDATE: Update = {
  id: DEMO_UPDATE_ID,
  workspaceId: 'ws-ttc',
  workspaceSlug: 'ttc',
  period: '2026-w26',
  title: 'Executive Briefing — W26 2026',
  subtitle: 'Commercial Momentum & Strategic Transformation',
  status: 'published',
  slides: getDefaultDemoSlides(DEMO_UPDATE_ID),
  publishedAt: '2026-06-29T06:00:00Z',
  updatedAt: '2026-06-29T06:00:00Z',
  rawContent: `# Executive Briefing
## Commercial Momentum
Revenue: £4.8M (+24% vs Q1)
Net Revenue Retention: 118% (+4% YoY)

## Product Transformation
This quarter marked a decisive transition from static presentation decks to live executive slideware. By deploying Cadence, leadership updates are now delivered as real-time, agency-grade digital experiences.

## Operational Shift: Static vs Live Slideware
Comparison of legacy email attachments versus live Cadence platform.

## Q3 - Q4 Strategic Execution Roadmap
Phase 1: Cadence Launch - June 2026 - completed
Phase 2: AI Media & Video - July 2026 - in-progress
Phase 3: Deep Analytics - August 2026 - upcoming

> Replacing static deck attachments with live agency slideware fundamentally elevates how our executive narrative is experienced by partners and investors.

## Summary & Next Steps
Thank you for reviewing the Week 26 executive update.`
};

export function getWorkspace(slug: string): Workspace {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(`cadence_ws_${slug}`);
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
  }
  return { ...DEFAULT_WORKSPACE, slug };
}

export function saveWorkspace(ws: Workspace) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(`cadence_ws_${ws.slug}`, JSON.stringify(ws));
  }
}

export function getUpdatesForWorkspace(workspaceSlug: string): Update[] {
  let updates: Update[] = [DEMO_UPDATE];
  
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(`cadence_updates_${workspaceSlug}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          updates = parsed;
        }
      } catch (e) { console.error(e); }
    }
  }

  return updates.sort((a, b) => b.period.localeCompare(a.period));
}

export function getUpdateByPeriod(workspaceSlug: string, period?: string): Update | null {
  const updates = getUpdatesForWorkspace(workspaceSlug);
  if (!period) {
    // Return latest published update (§3 clean requirement)
    const published = updates.filter(u => u.status === 'published');
    return published[0] || updates[0] || null;
  }
  return updates.find(u => u.period.toLowerCase() === period.toLowerCase()) || null;
}

export function saveUpdate(update: Update) {
  if (typeof window !== 'undefined') {
    const updates = getUpdatesForWorkspace(update.workspaceSlug);
    const index = updates.findIndex(u => u.id === update.id || u.period === update.period);
    if (index >= 0) {
      updates[index] = update;
    } else {
      updates.push(update);
    }
    localStorage.setItem(`cadence_updates_${update.workspaceSlug}`, JSON.stringify(updates));
  }
}
