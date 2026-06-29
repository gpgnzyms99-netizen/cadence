export type SlideArchetype = 
  | 'cover'
  | 'headline-metric'
  | 'narrative'
  | 'comparison'
  | 'roadmap'
  | 'quote'
  | 'closing';

export type MediaTone = 'corporate' | 'editorial' | 'abstract' | 'data-driven';

export interface WorkspaceBrand {
  name: string;
  logoUrl?: string;
  palette: {
    primary: string;
    accent: string;
    bg: string;
  };
  fonts: {
    head: string;
    body: string;
  };
  defaultMediaTone: MediaTone;
}

export interface Workspace {
  id: string;
  slug: string;
  name: string;
  brand: WorkspaceBrand;
}

export interface MetricData {
  value: string;
  label: string;
  delta: string;
  deltaType: 'positive' | 'negative' | 'neutral';
  sparkline?: number[];
}

export interface ComparisonItem {
  title: string;
  subtitle?: string;
  points: string[];
}

export interface TimelinePhase {
  phase: string;
  date: string;
  title: string;
  status: 'completed' | 'in-progress' | 'upcoming';
  description?: string;
}

export interface SlideContent {
  title?: string;
  subtitle?: string;
  body?: string;
  metrics?: MetricData[];
  comparison?: {
    left: ComparisonItem;
    right: ComparisonItem;
  };
  timeline?: TimelinePhase[];
  quote?: {
    text: string;
    author?: string;
    role?: string;
  };
  cta?: {
    text: string;
    link?: string;
  };
}

export interface Slide {
  id: string;
  updateId: string;
  order: number;
  archetype: SlideArchetype;
  slug: string;
  title: string;
  content: SlideContent;
  mediaPrompt?: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video' | 'gradient';
  tone?: MediaTone;
}

export interface Update {
  id: string;
  workspaceId: string;
  workspaceSlug: string;
  period: string; // e.g. "2026-w26", "2026-06", "2026-q2"
  title: string;
  subtitle?: string;
  status: 'draft' | 'published';
  slides: Slide[];
  rawContent?: string;
  publishedAt?: string;
  updatedAt: string;
}
