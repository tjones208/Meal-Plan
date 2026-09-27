/*
 * nutrition-ai — Supabase Edge Function that powers the AI features of the
 * Meal Plan app using Google's Gemini API free tier. The API key lives here
 * as a Supabase secret, never in the browser.
 *
 * POST JSON { action, ... }:
 *   - "analyze_photo": { image: base64 JPEG/PNG/WebP, mediaType, note? }
 *   - "analyze_text":  { text }                      e.g. "2 eggs and toast"
 *   - "coach":         { messages: [{role, content}], context: {...} }
 *
 * Secrets (Supabase dashboard → Edge Functions → Secrets):
 *   GEMINI_API_KEY     required; free key from https://aistudio.google.com/apikey
 *                      (no credit card; keep billing off so it can never cost anything)
 *   APP_PASSCODE       optional; when set, requests must send the same value
 *                      in the `x-app-passcode` header (stops strangers who
 *                      find the public anon key from using up your free quota).
 *   GEMINI_MODEL       optional; defaults to gemini-flash-latest.
 *
 * When the free daily quota for the main model runs out, requests retry on
 * the Flash-Lite model, which has its own (larger) free quota.
 */

import { ApiError, GoogleGenAI, type Content, type Part } from 'npm:@google/genai@2.24.0';

const MODELS = [Deno.env.get('GEMINI_MODEL') || 'gemini-flash-latest', 'gemini-flash-lite-latest'];
const MAX_IMAGE_B64 = 7_000_000; // ~5 MB decoded; the app downsizes before upload
const MAX_TEXT = 2_000;
const MAX_CHAT_MESSAGES = 24;

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-app-passcode',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: { ...CORS, 'Content-Type': 'application/json' } });
}

/* ------------------------------------------------------------------ *
 * Meal analysis (photo or text) → structured nutrition
 * ------------------------------------------------------------------ */

const NUTRIENT_KEYS = [
  'calories', 'protein', 'carbs', 'fat', 'saturatedFat', 'fiber', 'sugar',
  'sodium', 'cholesterol', 'potassium', 'calcium', 'iron', 'vitaminC', 'vitaminD',
];

const MEAL_SCHEMA = {
  type: 'object',
  properties: {
    isFood: { type: 'boolean' },
    mealName: { type: 'string' },
    items: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          portion: { type: 'string' },
          grams: { type: 'number' },
          confidence: { type: 'string', enum: ['high', 'medium', 'low'] },
          nutrients: {
            type: 'object',
            properties: Object.fromEntries(NUTRIENT_KEYS.map((k) => [k, { type: 'number' }])),
            required: NUTRIENT_KEYS,
          },
        },
        required: ['name', 'portion', 'grams', 'confidence', 'nutrients'],
      },
    },
    healthScore: { type: 'integer' },
    notes: { type: 'string' },
    tip: { type: 'string' },
  },
  required: ['isFood', 'mealName', 'items', 'healthScore', 'notes', 'tip'],
};

const ANALYST_SYSTEM = `You are an expert registered dietitian and food scientist who estimates the nutrition of meals.

Work like a professional:
- Identify every distinct food and drink, including easy-to-miss calories: cooking oils, butter, dressings, sauces, cheese, sugary drinks, condiments.
- Estimate each portion from visual cues (plate ~10-11 in / 27 cm, utensils, hands, packaging, typical restaurant servings). State the portion in household units plus grams.
- Use USDA FoodData Central-style reference values. If a nutrition label or package is visible, read it exactly and use it. If a brand or restaurant is recognisable, use its published values.
- Be realistic, not optimistic: people under-report, so do not shave portions.
- Units: calories kcal; protein, carbs, fat, saturatedFat, fiber, sugar in grams; sodium, cholesterol, potassium, calcium, iron, vitaminC in mg; vitaminD in mcg. Values are for the portion shown, not per 100 g.
- confidence: "high" when clearly visible/labelled, "medium" for typical estimates, "low" for hidden or ambiguous items.
- healthScore: 1-10 for overall nutritional quality (protein adequacy, fiber, vegetables, whole foods, sodium, added sugar, fried food).
- notes: one or two sentences on assumptions (e.g. "Assumed 1 tbsp olive oil for cooking").
- tip: one short, specific, encouraging suggestion to make this meal better for the user.
- If the image or text is not food, set isFood to false, return an empty items list and explain in notes.`;

async function analyzeMeal(ai: GoogleGenAI, parts: Part[]) {
  const res = await generate(ai, {
    contents: [{ role: 'user', parts }],
    config: {
      systemInstruction: ANALYST_SYSTEM,
      responseMimeType: 'application/json',
      responseJsonSchema: MEAL_SCHEMA,
      temperature: 0.2,
    },
  });
  const text = res.text;
  if (!text) throw new HttpError(502, 'The AI returned no result. Please try again.');
  try {
    return JSON.parse(text);
  } catch {
    throw new HttpError(502, 'The AI returned an unreadable result. Please try again.');
  }
}

/* ------------------------------------------------------------------ *
 * Nutrition coach chat
 * ------------------------------------------------------------------ */

const COACH_SYSTEM = `You are the user's personal nutrition coach inside their Meal Plan app. You have the expertise of a registered dietitian and sports nutritionist.

How you work:
- Ground every answer in the user's actual data supplied below (profile, targets, today's food log, recent days, weight trend). Quote real numbers ("you're at 92 g of 150 g protein").
- Be practical and specific: name foods, portions and macros. When suggesting meals, prefer recipes from the user's recipe library (listed below) and mention them by exact name so they can find them in the app; otherwise suggest simple whole-food options.
- Keep replies short and skimmable for a phone: a sentence or two, then bullets when useful. No long preambles.
- Be encouraging and non-judgemental. Celebrate consistency.
- Stay evidence-based (e.g. protein 1.6-2.2 g/kg for muscle gain, 25-38 g fiber, sodium under 2300 mg, 20-35% of calories from fat).
- You are not a doctor. For medical conditions, medications, pregnancy, eating disorders or very-low-calorie diets, give general information and recommend a doctor or registered dietitian. Never recommend under 1200 kcal/day (women) or 1500 kcal/day (men) without medical supervision.
- Use plain text with simple "- " bullets and **bold** only; no tables or headings.`;

type ChatTurn = { role: 'user' | 'assistant'; content: string };

async function coach(ai: GoogleGenAI, body: { messages?: ChatTurn[]; context?: Record<string, unknown> }): Promise<string> {
  const turns = (Array.isArray(body.messages) ? body.messages : [])
    .filter((m) => (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string' && m.content.trim())
    .slice(-MAX_CHAT_MESSAGES);
  while (turns.length && turns[0].role !== 'user') turns.shift();
  if (!turns.length || turns[turns.length - 1].role !== 'user') throw new HttpError(400, 'Send a question for the coach.');

  const ctx = body.context || {};
  const recipes = typeof ctx.recipes === 'string' ? ctx.recipes.slice(0, 40_000) : '';
  const { recipes: _omit, ...userData } = ctx;

  const contents: Content[] = turns.map((m) => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content.slice(0, 4000) }],
  }));

  const res = await generate(ai, {
    contents,
    config: {
      systemInstruction: [
        COACH_SYSTEM,
        `User's recipe library (name | meal types | kcal, protein/carbs/fat g per serving):\n${recipes || '(none)'}`,
        `User data (JSON):\n${JSON.stringify(userData).slice(0, 60_000)}`,
      ].join('\n\n'),
      temperature: 0.6,
    },
  });
  return (res.text || '').trim() || "Sorry, I couldn't come up with an answer. Try asking another way.";
}

/* ------------------------------------------------------------------ *
 * Shared plumbing
 * ------------------------------------------------------------------ */

class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

// Try the main model, then Flash-Lite when the first is out of free quota
// (429) or unavailable (404/503).
// deno-lint-ignore no-explicit-any
async function generate(ai: GoogleGenAI, req: { contents: Content[]; config: any }) {
  let lastErr: unknown = null;
  for (const model of MODELS) {
    try {
      const res = await ai.models.generateContent({ model, ...req });
      const reason = res.candidates?.[0]?.finishReason;
      if (!res.text && (reason === 'SAFETY' || reason === 'PROHIBITED_CONTENT' || res.promptFeedback?.blockReason)) {
        throw new HttpError(422, 'The AI declined to analyse this input.');
      }
      return res;
    } catch (err) {
      lastErr = err;
      if (err instanceof ApiError && [404, 429, 503].includes(err.status)) continue;
      throw err;
    }
  }
  throw lastErr;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  const passcode = Deno.env.get('APP_PASSCODE');
  if (passcode && req.headers.get('x-app-passcode') !== passcode) {
    return json({ error: 'Wrong or missing app passcode. Set it in the Coach tab settings.' }, 401);
  }
  const apiKey = Deno.env.get('GEMINI_API_KEY');
  if (!apiKey) return json({ error: 'Server is missing GEMINI_API_KEY. Add your free key in Supabase → Edge Functions → Secrets.' }, 500);

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return json({ error: 'Invalid JSON body' }, 400);
  }

  const ai = new GoogleGenAI({ apiKey });

  try {
    switch (body.action) {
      case 'analyze_photo': {
        const image = String(body.image || '');
        const mediaType = String(body.mediaType || 'image/jpeg');
        if (!image || image.length > MAX_IMAGE_B64) throw new HttpError(400, 'Missing or oversized image.');
        if (!['image/jpeg', 'image/png', 'image/webp'].includes(mediaType)) throw new HttpError(400, 'Unsupported image type.');
        const note = String(body.note || '').slice(0, MAX_TEXT);
        return json(
          await analyzeMeal(ai, [
            { inlineData: { mimeType: mediaType, data: image } },
            { text: note ? `Analyse this meal. Extra details from me: ${note}` : 'Analyse this meal.' },
          ])
        );
      }
      case 'analyze_text': {
        const text = String(body.text || '').trim().slice(0, MAX_TEXT);
        if (!text) throw new HttpError(400, 'Describe what you ate.');
        return json(await analyzeMeal(ai, [{ text: `Analyse this meal I ate: ${text}` }]));
      }
      case 'coach':
        return json({ reply: await coach(ai, body as { messages?: ChatTurn[] }) });
      default:
        return json({ error: 'Unknown action' }, 400);
    }
  } catch (err) {
    if (err instanceof HttpError) return json({ error: err.message }, err.status);
    if (err instanceof ApiError) {
      if (err.status === 429) return json({ error: "You've reached today's free AI limit. Try again later, or log by barcode or recipes for now." }, 429);
      if (err.status === 400 && /api key/i.test(err.message)) return json({ error: 'The server Gemini API key is invalid.' }, 500);
      if (err.status === 403) return json({ error: 'The Gemini API key is not allowed to use this model.' }, 500);
      console.error(err);
      return json({ error: `AI service error (${err.status}).` }, 502);
    }
    console.error(err);
    return json({ error: 'Something went wrong analysing that. Please try again.' }, 500);
  }
});
