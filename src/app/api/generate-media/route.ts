import { NextResponse } from 'next/server';
import { generateGeminiVisual } from '@/lib/geminiMedia';

export async function POST(request: Request) {
  try {
    const { prompt, archetype, tone } = await request.json();
    
    const result = await generateGeminiVisual(
      prompt || 'Executive agency visual art',
      archetype || 'narrative',
      tone || 'editorial'
    );

    return NextResponse.json({ success: true, media: result });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Generation failed' }, { status: 500 });
  }
}
