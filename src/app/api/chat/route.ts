import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const baseURL = process.env.LLM_TRACE_LENS_URL || 'https://llm-trace-lens-z6xv.vercel.app/v1';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: baseURL,
});

export async function POST(request: NextRequest) {
  try {
    const { messages } = await request.json();

    console.log('Using baseURL:', baseURL);
    console.log('API Key exists:', !!process.env.OPENAI_API_KEY);

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: messages,
    });

    // デバッグ: _trace が含まれているか確認
    const rawResponse = response as unknown as { _trace?: unknown };
    console.log('Has _trace:', !!rawResponse._trace);

    return NextResponse.json({
      message: response.choices[0].message.content,
      _debug: {
        baseURL: baseURL,
        hasTrace: !!rawResponse._trace,
      },
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
