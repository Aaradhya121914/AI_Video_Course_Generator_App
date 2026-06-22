import { GoogleGenerativeAI } from '@google/generative-ai';

export const runtime = 'nodejs';

const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: 'application/json',
};

function getRetryDelaySeconds(message) {
  const match = String(message || '').match(/retry in\s+([\d.]+)s/i);
  return match ? Math.ceil(Number(match[1])) : null;
}

export async function POST(request) {
  if (!apiKey) {
    return Response.json(
      { error: 'Gemini API key is not configured.' },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const prompt = String(body?.prompt || '').trim();

    if (!prompt) {
      return Response.json(
        { error: 'Prompt is required.' },
        { status: 400 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-3.5-flash' });
    const chat = model.startChat({
      generationConfig,
      history: [],
    });

    const result = await chat.sendMessage(prompt);
    const text =
      typeof result.response?.text === 'function'
        ? result.response.text()
        : result.response?.text || '';

    return Response.json({ text });
  } catch (error) {
    const message = String(error?.message || error || 'Failed to generate chapter content.');
    const retryDelaySeconds = getRetryDelaySeconds(message);
    const isQuotaError = message.includes('[429') || message.toLowerCase().includes('quota exceeded');

    return Response.json(
      {
        error: message,
        retryDelaySeconds,
      },
      { status: isQuotaError ? 429 : 500 }
    );
  }
}
