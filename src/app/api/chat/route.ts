import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.LLM_TRACE_LENS_URL || 'https://llm-trace-lens-z6xv.vercel.app/v1',
});

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: messages,
    });

    return NextResponse.json({
      message: response.choices[0].message.content,
    });
  } catch (error: unknown) {
    console.error('OpenAI API error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Failed to get response from AI', details: errorMessage },
      { status: 500 }
    );
  }
}
