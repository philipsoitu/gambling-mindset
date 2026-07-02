import { GoogleGenAI } from '@google/genai';
import { env } from '$env/dynamic/private';
import { json, type RequestHandler } from '@sveltejs/kit';

const oddsSchema = {
  type: 'object',
  additionalProperties: false,
  properties: {
    team1: { type: 'string' },
    team2: { type: 'string' },
    odds: {
      type: 'object',
      additionalProperties: false,
      properties: {
        winner3Way: {
          type: 'object',
          additionalProperties: false,
          properties: {
            team1: { type: 'number' },
            draw: { type: 'number' },
            team2: { type: 'number' }
          },
          required: ['team1', 'draw', 'team2']
        },
        winner2Way: {
          type: 'object',
          additionalProperties: false,
          properties: {
            team1: { type: 'number' },
            team2: { type: 'number' }
          },
          required: ['team1', 'team2']
        },
        doubleChance: {
          type: 'object',
          additionalProperties: false,
          properties: {
            team1OrDraw: { type: 'number' },
            team2OrDraw: { type: 'number' },
            team1OrTeam2: { type: 'number' }
          },
          required: ['team1OrDraw', 'team2OrDraw', 'team1OrTeam2']
        },
        drawNoBet: {
          type: 'object',
          additionalProperties: false,
          properties: {
            team1: { type: 'number' },
            team2: { type: 'number' }
          },
          required: ['team1', 'team2']
        }
      },
      required: ['winner3Way', 'winner2Way', 'doubleChance', 'drawNoBet']
    }
  },
  required: ['team1', 'team2', 'odds']
};

function parseJsonOutput(text: string) {
  const trimmed = text.trim();
  if (!trimmed) throw new Error('Gemini returned an empty response.');

  try {
    return JSON.parse(trimmed);
  } catch {
    const match = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/) ?? trimmed.match(/\{[\s\S]*\}/);
    if (!match) throw new Error(`Gemini did not return JSON: ${trimmed.slice(0, 300)}`);
    return JSON.parse(match[1] ?? match[0]);
  }
}

async function fileToGenerativePart(file: File) {
  return {
    inlineData: {
      mimeType: file.type || 'image/png',
      data: Buffer.from(await file.arrayBuffer()).toString('base64')
    }
  };
}

export const POST: RequestHandler = async ({ request }) => {
  const apiKey = env.GEMINI_API_KEY ?? env.GOOGLE_API_KEY;
  if (!apiKey) {
    return json({ error: 'Set GEMINI_API_KEY or GOOGLE_API_KEY before using odds extraction.' }, { status: 500 });
  }

  const formData = await request.formData();
  const files = formData.getAll('images').filter((value): value is File => value instanceof File);
  if (!files.length) return json({ error: 'Upload at least one image.' }, { status: 400 });

  const ai = new GoogleGenAI({ apiKey });
  const model = 'gemini-3.1-flash-lite';

  try {
    const games = await Promise.all(
      files.map(async (file, index) => {
        const result = await ai.models.generateContent({
          model,
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: `Extract the decimal betting odds from this sportsbook screenshot.
Return JSON that exactly matches this shape and key names:
{
  "team1": "First Listed Team",
  "team2": "Second Listed Team",
  "odds": {
    "winner3Way": { "team1": 2.1, "draw": 3.4, "team2": 3.1 },
    "winner2Way": { "team1": 1.8, "team2": 2.0 },
    "doubleChance": { "team1OrDraw": 1.3, "team2OrDraw": 1.5, "team1OrTeam2": 1.2 },
    "drawNoBet": { "team1": 1.6, "team2": 2.3 }
  }
}
Treat team1 as the first/listed home team and team2 as the second/listed away team. Use 0 for any missing or not visible odds. Use only numbers for odds.`
                },
                await fileToGenerativePart(file)
              ]
            }
          ],
          config: {
            responseMimeType: 'application/json',
            responseSchema: oddsSchema
          }
        });

        return {
          index,
          name: file.name || `Image ${index + 1}`,
          ...parseJsonOutput(result.text ?? '')
        };
      })
    );

    return json({ games });
  } catch (err) {
    console.error('Odds extraction failed', err);
    return json(
      { error: err instanceof Error ? err.message : 'Failed to extract odds from the uploaded image.' },
      { status: 500 }
    );
  }
};
