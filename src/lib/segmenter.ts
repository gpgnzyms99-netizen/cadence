import { Slide, SlideArchetype, SlideContent, TimelinePhase } from './types';

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'slide';
}

export function parseDocumentToSlides(rawText: string, updateId: string): Slide[] {
  const lines = rawText.split('\n');
  const slides: Slide[] = [];
  
  let currentTitle = '';
  let currentLines: string[] = [];
  let order = 0;

  const flushSlide = () => {
    if (!currentTitle && currentLines.length === 0) return;
    
    order++;
    const slideText = currentLines.join('\n').trim();
    const { archetype, content } = analyzeSlideContent(currentTitle, slideText);
    const slug = slugify(currentTitle || `slide-${order}`);

    slides.push({
      id: `${updateId}-slide-${order}`,
      updateId,
      order,
      archetype,
      slug,
      title: currentTitle || `Slide ${order}`,
      content,
      mediaPrompt: `Executive agency visual art for ${currentTitle}, modern editorial aesthetic, minimalist geometric composition`,
      mediaType: archetype === 'cover' ? 'video' : 'image',
      tone: 'editorial'
    });

    currentTitle = '';
    currentLines = [];
  };

  // Check if first lines define a cover
  let isParsingCover = true;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (line.startsWith('# ')) {
      flushSlide();
      currentTitle = line.replace(/^#\s+/, '');
    } else if (line.startsWith('## ')) {
      flushSlide();
      currentTitle = line.replace(/^##\s+/, '');
    } else if (line !== '') {
      currentLines.push(line);
    }
  }
  flushSlide();

  // If no slides were produced, create default slides
  if (slides.length === 0) {
    return getDefaultDemoSlides(updateId);
  }

  // Ensure cover slide is at start if archetype isn't cover
  if (slides.length > 0 && slides[0].archetype !== 'cover') {
    slides[0].archetype = 'cover';
  }

  return slides;
}

function analyzeSlideContent(title: string, body: string): { archetype: SlideArchetype; content: SlideContent } {
  const lowerTitle = title.toLowerCase();
  const lowerBody = body.toLowerCase();

  // 1. Cover
  if (lowerTitle.includes('update') || lowerTitle.includes('report') || lowerTitle.includes('welcome') || lowerTitle.includes('executive')) {
    return {
      archetype: 'cover',
      content: {
        title: title || 'Executive Update',
        subtitle: body || 'Strategic Performance & Key Milestones'
      }
    };
  }

  // 2. Headline Metric
  if (
    body.includes('£') || 
    body.includes('$') || 
    body.includes('%') || 
    lowerTitle.includes('metric') || 
    lowerTitle.includes('revenue') || 
    lowerTitle.includes('arr') || 
    lowerTitle.includes('growth')
  ) {
    // Extract numbers if possible
    const metricLines = body.split('\n').filter(l => l.length > 0);
    const mainMetric = metricLines[0] || '£4.2M';
    
    return {
      archetype: 'headline-metric',
      content: {
        title: title || 'Headline Metrics',
        subtitle: metricLines.slice(1).join(' ') || 'Exceeding Q2 revenue targets across primary growth vectors.',
        metrics: [
          {
            value: mainMetric.match(/[$£€]?\d+(\.\d+)?[M|K|%]?/)?.[0] || '£4.2M',
            label: title || 'Quarterly ARR',
            delta: '+18% vs prior period',
            deltaType: 'positive',
            sparkline: [28, 35, 42, 38, 55, 62, 78, 85, 94]
          }
        ]
      }
    };
  }

  // 3. Roadmap / Timeline
  if (lowerTitle.includes('roadmap') || lowerTitle.includes('timeline') || lowerBody.includes('phase') || lowerBody.includes('milestone')) {
    const phases: TimelinePhase[] = [
      { phase: 'Phase 1', date: 'Q1 2026', title: 'Foundation & Architecture', status: 'completed', description: 'Core system buildout completed ahead of schedule.' },
      { phase: 'Phase 2', date: 'Q2 2026', title: 'Enterprise Rollout', status: 'in-progress', description: 'Active onboarding across priority enterprise accounts.' },
      { phase: 'Phase 3', date: 'Q3 2026', title: 'Global Scale', status: 'upcoming', description: 'International expansion and API partner integrations.' }
    ];
    return {
      archetype: 'roadmap',
      content: {
        title: title || 'Product & Strategic Roadmap',
        subtitle: 'Multi-quarter execution timeline across core workstreams.',
        timeline: phases
      }
    };
  }

  // 4. Quote / Callout
  if (body.startsWith('>') || lowerTitle.includes('quote') || lowerTitle.includes('callout') || lowerTitle.includes('takeaway')) {
    const cleanQuote = body.replace(/^>\s*/, '').trim();
    return {
      archetype: 'quote',
      content: {
        title: title || 'Key Leadership Takeaway',
        quote: {
          text: cleanQuote || 'Our execution speed this quarter proves that aligning product engineering directly with client feedback yields immediate compounding dividends.',
          author: 'GV',
          role: 'Chief Executive Officer'
        }
      }
    };
  }

  // 5. Comparison
  if (lowerTitle.includes('vs') || lowerTitle.includes('comparison') || lowerTitle.includes('before') || lowerBody.includes('prior vs current')) {
    return {
      archetype: 'comparison',
      content: {
        title: title || 'Performance Shift',
        comparison: {
          left: {
            title: 'Previous State (Q1)',
            subtitle: 'Manual operations & fragmented reporting',
            points: ['3+ days latency on reporting', 'High operational friction', 'Limited visibility into live metrics']
          },
          right: {
            title: 'Current State (Cadence Live)',
            subtitle: 'Automated executive slideware',
            points: ['Real-time live URL delivery', 'Zero manual slide design required', 'Integrated analytics and motion aesthetics']
          }
        }
      }
    };
  }

  // 6. Closing
  if (lowerTitle.includes('summary') || lowerTitle.includes('next steps') || lowerTitle.includes('closing') || lowerTitle.includes('contact')) {
    return {
      archetype: 'closing',
      content: {
        title: title || 'Summary & Next Steps',
        body: body || 'We look forward to reviewing these results during our upcoming advisory board sync.',
        cta: {
          text: 'Schedule Advisory Sync',
          link: '#'
        }
      }
    };
  }

  // 7. Default Narrative
  return {
    archetype: 'narrative',
    content: {
      title: title || 'Strategic Overview',
      body: body || 'Strong operational momentum continues across all key business units with heightened focus on scalable architecture.'
    }
  };
}

export function getDefaultDemoSlides(updateId: string): Slide[] {
  return [
    {
      id: `${updateId}-1`,
      updateId,
      order: 1,
      archetype: 'cover',
      slug: 'cover',
      title: 'TTC Executive Update',
      content: {
        title: 'Executive Briefing',
        subtitle: 'Week 26, 2026 — Strategic Growth & Product Milestones'
      },
      mediaPrompt: 'Dark luxury abstract glassmorphism waves with deep sapphire blue and golden aura lights, 8k render, cinematic lighting',
      mediaType: 'gradient',
      tone: 'editorial'
    },
    {
      id: `${updateId}-2`,
      updateId,
      order: 2,
      archetype: 'headline-metric',
      slug: 'headline-metrics',
      title: 'Commercial Momentum',
      content: {
        title: 'Commercial Momentum',
        subtitle: 'Strong expansion driven by enterprise tier adoption and elevated net retention rates.',
        metrics: [
          {
            value: '£4.8M',
            label: 'Annual Recurring Revenue (ARR)',
            delta: '+24% vs Q1',
            deltaType: 'positive',
            sparkline: [35, 42, 50, 48, 65, 74, 88, 95, 112]
          },
          {
            value: '118%',
            label: 'Net Revenue Retention',
            delta: '+4% YoY',
            deltaType: 'positive',
            sparkline: [102, 104, 108, 106, 112, 114, 118]
          }
        ]
      },
      mediaPrompt: 'Dynamic glowing financial trendlines intersecting high-tech dark architectural grid, minimalist data visual',
      mediaType: 'image',
      tone: 'data-driven'
    },
    {
      id: `${updateId}-3`,
      updateId,
      order: 3,
      archetype: 'narrative',
      slug: 'strategic-narrative',
      title: 'Product Transformation',
      content: {
        title: 'Product Transformation & Cadence Launch',
        body: 'This quarter marked a decisive transition from static presentation decks to live executive slideware. By deploying Cadence, leadership updates are now delivered as real-time, agency-grade digital experiences. This eliminates design bottlenecks while ensuring complete visual coherence across all board communications.'
      },
      mediaPrompt: 'Modernist abstract architecture with dramatic light ray shadows, minimal luxury editorial aesthetic',
      mediaType: 'image',
      tone: 'editorial'
    },
    {
      id: `${updateId}-4`,
      updateId,
      order: 4,
      archetype: 'comparison',
      slug: 'operational-shift',
      title: 'Operational Evolution',
      content: {
        title: 'Operational Shift: Static vs Live Slideware',
        comparison: {
          left: {
            title: 'Legacy Approach (Email & PDFs)',
            subtitle: 'Static, fragmented, and design-heavy',
            points: [
              'Hours wasted tweaking slide formatting',
              'Stale data the moment an email is sent',
              'Zero analytics or engagement tracking'
            ]
          },
          right: {
            title: 'Cadence Live Platform',
            subtitle: 'Dynamic, persistent, agency-grade',
            points: [
              'Plain language input auto-rendered into slideware',
              'One stable live URL always showing latest metrics',
              'Passcode secured with rich motion & media art'
            ]
          }
        }
      },
      mediaPrompt: 'Dual side-by-side prism split glowing with violet and teal cyan light reflection',
      mediaType: 'image',
      tone: 'abstract'
    },
    {
      id: `${updateId}-5`,
      updateId,
      order: 5,
      archetype: 'roadmap',
      slug: 'execution-roadmap',
      title: 'Strategic Roadmap',
      content: {
        title: 'Q3 - Q4 Strategic Execution Roadmap',
        subtitle: 'Key deliverables aligned with fiscal year expansion goals.',
        timeline: [
          {
            phase: 'Phase 1: Cadence Launch',
            date: 'June 2026',
            title: 'Live Link Engine & Passcode Security',
            status: 'completed',
            description: 'Core platform deployment with real-time markdown segmenter and viewer gate.'
          },
          {
            phase: 'Phase 2: AI Media & Video',
            date: 'July 2026',
            title: 'Generative Ambient Motion',
            status: 'in-progress',
            description: 'Automated 4k generative visual backgrounds tied to brand palette.'
          },
          {
            phase: 'Phase 3: Deep Analytics',
            date: 'August 2026',
            title: 'Recipient Dwell & Engagement Index',
            status: 'upcoming',
            description: 'Heatmap dwell tracking per slide for board and leadership reviews.'
          }
        ]
      },
      mediaPrompt: 'Abstract futuristic timeline ribbon flowing through dark space with lit milestones',
      mediaType: 'image',
      tone: 'corporate'
    },
    {
      id: `${updateId}-6`,
      updateId,
      order: 6,
      archetype: 'quote',
      slug: 'leadership-perspective',
      title: 'Leadership Vision',
      content: {
        title: 'Leadership Perspective',
        quote: {
          text: 'Replacing static deck attachments with live agency slideware fundamentally elevates how our executive narrative is experienced by partners and investors.',
          author: 'GV',
          role: 'Founder & Chief Executive Officer'
        }
      },
      mediaPrompt: 'Minimalist dark dramatic portrait silhouette with subtle warm backlight spotlight',
      mediaType: 'image',
      tone: 'editorial'
    },
    {
      id: `${updateId}-7`,
      updateId,
      order: 7,
      archetype: 'closing',
      slug: 'next-steps',
      title: 'Summary & Action Items',
      content: {
        title: 'Summary & Next Steps',
        body: 'Thank you for reviewing the Week 26 executive update. Our upcoming leadership sync is scheduled for Thursday at 10:00 AM BST.',
        cta: {
          text: 'Open Advisory Sync Calendar',
          link: '#'
        }
      },
      mediaPrompt: 'Cinematic deep space sunset glow with subtle glowing grid horizon, agency finish',
      mediaType: 'image',
      tone: 'editorial'
    }
  ];
}
