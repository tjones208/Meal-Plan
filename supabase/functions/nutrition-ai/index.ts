/*
 * nutrition-ai — Supabase Edge Function that powers the AI features of the
 * Meal Plan app. The Anthropic API key lives here as a Supabase secret, never
 * in the browser.
 *
 * POST JSON { action, ... }:
 *   - "analyze_photo": { image: base64 JPEG/PNG/WebP, mediaType, note? }
 *   - "analyze_text":  { text }                      e.g. "2 eggs and toast"
 *   - "coach":         { messages: [{role, content}], context: {...} }
 *
 * Secrets (Supabase dashboard → Edge Functions → Secrets):
 *   ANTHROPIC_API_KEY  required
 *   APP_PASSCODE       optional; when set, requests must send the same value
 *                      in the `x-app-passcode` header (stops strangers who
 *                      find the public anon key from spending your credits).
 *   ANTHROPIC_MODEL    optional; defaults to claude-opus-5.
 */

import Anthropic from 'npm:@anthropic-ai/sdk@0.128.0';

const MODEL = Deno.env.get('ANTHROPIC_MODEL') || 'claude-opus-5';
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
] as const;

const nutrientsSchema = {
  type: 'object',
  properties: Object.fromEntries(NUTRIENT_KEYS.map((k) => [k, { type: 'number' }])),
  required: [...NUTRIENT_KEYS],
  additionalProperties: false,
};

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
          nutrients: nutrientsSchema,
        },
        required: ['name', 'portion', 'grams', 'confidence', 'nutrients'],
        additionalProperties: false,
      },
    },
    healthScore: { type: 'integer' },
    notes: { type: 'string' },
    tip: { type: 'string' },
  },
  required: ['isFood', 'mealName', 'items', 'healthScore', 'notes', 'tip'],
  additionalProperties: false,
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

type MealResult = { isFood: boolean; mealName: string; items: unknown[]; healthScore: number; notes: string; tip: string };

async function analyzeMeal(client: Anthropic, content: Anthropic.ContentBlockParam[]): Promise<MealResult> {
  const msg = await createWithFallback(client, {
    model: MODEL,
    max_tokens: 16000,
    thinking: { type: 'adaptive' },
    output_config: { effort: 'high', format: { type: 'json_schema', schema: MEAL_SCHEMA } },
    system: ANALYST_SYSTEM,
    messages: [{ role: 'user', content }],
  });
  if (msg.stop_reason === 'refusal') throw new HttpError(422, 'The AI declined to analyse this input.');
  const text = msg.content.find((b: { type: string }) => b.type === 'text') as { text: string } | undefined;
  if (!text) throw new HttpError(502, 'The AI returned no result. Please try again.');
  return JSON.parse(text.text);
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

async function coach(client: Anthropic, body: { messages?: ChatTurn[]; context?: Record<string, unknown> }): Promise<string> {
  const turns = (Array.isArray(body.messages) ? body.messages : [])
    .filter((m) => (m.role === 'user' || m.role === 'assistant') && typeof m.content === 'string' && m.content.trim())
    .slice(-MAX_CHAT_MESSAGES)
    .map((m) => ({ role: m.role, content: m.content.slice(0, 4000) }));
  while (turns.length && turns[0].role !== 'user') turns.shift();
  if (!turns.length || turns[turns.length - 1].role !== 'user') throw new HttpError(400, 'Send a question for the coach.');

  const ctx = body.context || {};
  const recipes = typeof ctx.recipes === 'string' ? ctx.recipes.slice(0, 40_000) : '';
  const { recipes: _omit, ...userData } = ctx;

  const msg = await createWithFallback(client, {
    model: MODEL,
    max_tokens: 16000,
    thinking: { type: 'adaptive' },
    output_config: { effort: 'medium' },
    system: [
      // Stable prefix (instructions + recipe library) is cached; the user's live data follows it.
      { type: 'text', text: COACH_SYSTEM },
      { type: 'text', text: `User's recipe library (name | meal types | kcal, protein/carbs/fat g per serving):\n${recipes || '(none)'}`, cache_control: { type: 'ephemeral' } },
      { type: 'text', text: `User data (JSON):\n${JSON.stringify(userData).slice(0, 60_000)}` },
    ],
    messages: turns,
  });
  if (msg.stop_reason === 'refusal') return "Sorry, I can't help with that one. Try asking another way.";
  return msg.content
    .filter((b: { type: string }) => b.type === 'text')
    .map((b: { text: string }) => b.text)
    .join('\n')
    .trim();
}

/* ------------------------------------------------------------------ *
 * Shared plumbing
 * ------------------------------------------------------------------ */

class HttpError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

// Opt into server-side refusal fallbacks; if the account/API rejects that
// beta parameter, retry once as a plain request.
// deno-lint-ignore no-explicit-any
async function createWithFallback(client: Anthropic, params: any): Promise<any> {
  try {
    return await client.beta.messages.create({ ...params, betas: ['server-side-fallback-2026-07-01'], fallbacks: 'default' });
  } catch (err) {
    if (err instanceof Anthropic.BadRequestError && /fallback/i.test(err.message)) {
      return await client.messages.create(params);
    }
    throw err;
  }
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: CORS });
  if (req.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  const passcode = Deno.env.get('APP_PASSCODE');
  if (passcode && req.headers.get('x-app-passcode') !== passcode) {
    return json({ error: 'Wrong or missing app passcode. Set it in the Coach tab settings.' }, 401);
  }
  const apiKey = Deno.env.get('ANTHROPIC_API_KEY');
  if (!apiKey) return json({ error: 'Server is missing ANTHROPIC_API_KEY. Add it in Supabase → Edge Functions → Secrets.' }, 500);

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return json({ error: 'Invalid JSON body' }, 400);
  }

  const client = new Anthropic({ apiKey });

  try {
    switch (body.action) {
      case 'analyze_photo': {
        const image = String(body.image || '');
        const mediaType = String(body.mediaType || 'image/jpeg');
        if (!image || image.length > MAX_IMAGE_B64) throw new HttpError(400, 'Missing or oversized image.');
        if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif'].includes(mediaType)) throw new HttpError(400, 'Unsupported image type.');
        const note = String(body.note || '').slice(0, MAX_TEXT);
        const result = await analyzeMeal(client, [
          { type: 'image', source: { type: 'base64', media_type: mediaType as 'image/jpeg', data: image } },
          { type: 'text', text: note ? `Analyse this meal. Extra details from me: ${note}` : 'Analyse this meal.' },
        ]);
        return json(result);
      }
      case 'analyze_text': {
        const text = String(body.text || '').trim().slice(0, MAX_TEXT);
        if (!text) throw new HttpError(400, 'Describe what you ate.');
        return json(await analyzeMeal(client, [{ type: 'text', text: `Analyse this meal I ate: ${text}` }]));
      }
      case 'coach':
        return json({ reply: await coach(client, body as { messages?: ChatTurn[] }) });
      default:
        return json({ error: 'Unknown action' }, 400);
    }
  } catch (err) {
    if (err instanceof HttpError) return json({ error: err.message }, err.status);
    if (err instanceof Anthropic.RateLimitError) return json({ error: 'The AI is busy right now. Try again in a minute.' }, 429);
    if (err instanceof Anthropic.AuthenticationError) return json({ error: 'The server API key is invalid.' }, 500);
    if (err instanceof Anthropic.APIError) return json({ error: `AI service error (${err.status}).` }, 502);
    console.error(err);
    return json({ error: 'Something went wrong analysing that. Please try again.' }, 500);
  }
});
