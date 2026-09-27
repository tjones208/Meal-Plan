/*
 * AI + food-data services used by the tracker.
 *
 *  - callNutritionAI(): talks to the `nutrition-ai` Supabase Edge Function,
 *    which calls Gemini's free tier with a key held server-side (see
 *    supabase/functions/nutrition-ai). Uses SUPABASE_URL / SUPABASE_KEY from
 *    js/sync.js.
 *  - prepareImage(): downsizes a camera photo to a JPEG the model reads well
 *    (long edge 1568 px, keeps uploads small) plus a tiny thumbnail for the log.
 *  - lookupBarcode(): Open Food Facts product lookup (free, no key).
 *  - BarcodeScanner: live camera scanning where the browser supports the
 *    BarcodeDetector API (Chrome/Android); other browsers type the number.
 */

const AI_FUNCTION = 'nutrition-ai';
const PASSCODE_KEY = 'mealplan.aiPasscode';

function getAiPasscode() {
  try {
    return localStorage.getItem(PASSCODE_KEY) || '';
  } catch (e) {
    return '';
  }
}

function setAiPasscode(v) {
  try {
    if (v) localStorage.setItem(PASSCODE_KEY, v);
    else localStorage.removeItem(PASSCODE_KEY);
  } catch (e) {
    /* ignore */
  }
}

async function callNutritionAI(payload) {
  const headers = {
    'Content-Type': 'application/json',
    apikey: SUPABASE_KEY,
    Authorization: `Bearer ${SUPABASE_KEY}`,
  };
  const pass = getAiPasscode();
  if (pass) headers['x-app-passcode'] = pass;

  let res;
  try {
    res = await fetch(`${SUPABASE_URL}/functions/v1/${AI_FUNCTION}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });
  } catch (e) {
    throw new Error("Can't reach the AI service. Check your connection and try again.");
  }
  let data = null;
  try {
    data = await res.json();
  } catch (e) {
    /* non-JSON error */
  }
  if (!res.ok) {
    if (res.status === 404) throw new Error('The AI service is not deployed yet (nutrition-ai edge function).');
    throw new Error((data && (data.error || data.message)) || `AI service error (${res.status}).`);
  }
  return data;
}

/* ---- Images ---- */
function loadImageFromFile(file) {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Couldn't read that image. Try a JPEG or PNG photo."));
    };
    img.src = url;
  });
}

function drawScaled(img, maxEdge, quality) {
  const scale = Math.min(1, maxEdge / Math.max(img.naturalWidth, img.naturalHeight));
  const w = Math.max(1, Math.round(img.naturalWidth * scale));
  const h = Math.max(1, Math.round(img.naturalHeight * scale));
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, w, h);
  ctx.drawImage(img, 0, 0, w, h);
  return canvas.toDataURL('image/jpeg', quality);
}

// Returns { base64, mediaType, previewUrl, thumb }.
async function prepareImage(file) {
  const img = await loadImageFromFile(file);
  const dataUrl = drawScaled(img, 1568, 0.85);
  const thumb = drawScaled(img, 160, 0.7);
  return { base64: dataUrl.split(',')[1], mediaType: 'image/jpeg', previewUrl: dataUrl, thumb };
}

/* ---- Barcode lookup (Open Food Facts) ---- */
async function lookupBarcode(code) {
  const clean = String(code || '').replace(/\D/g, '');
  if (clean.length < 6) throw new Error('Enter the full barcode number.');
  let res;
  try {
    res = await fetch(
      `https://world.openfoodfacts.org/api/v2/product/${clean}.json?fields=product_name,brands,serving_size,serving_quantity,nutriments,image_front_small_url`
    );
  } catch (e) {
    throw new Error("Can't reach the food database. Check your connection.");
  }
  const data = await res.json().catch(() => null);
  if (!res.ok || !data || data.status !== 1 || !data.product) {
    throw new Error('Product not found. Try a photo of the nutrition label instead.');
  }
  const p = data.product;
  const n = p.nutriments || {};
  const servingG = Number(p.serving_quantity) || 0;
  // Prefer per-serving values; fall back to per-100 g scaled to the serving (or 100 g).
  const basis = servingG > 0 ? servingG : 100;
  const get = (key, mult) => {
    const serving = Number(n[`${key}_serving`]);
    if (servingG > 0 && Number.isFinite(serving)) return serving * mult;
    const per100 = Number(n[`${key}_100g`]);
    return Number.isFinite(per100) ? (per100 * basis * mult) / 100 : 0;
  };
  let calories = get('energy-kcal', 1);
  if (!calories) calories = get('energy', 1) / 4.184; // kJ → kcal
  const nutrients = cleanNutrients({
    calories,
    protein: get('proteins', 1),
    carbs: get('carbohydrates', 1),
    fat: get('fat', 1),
    saturatedFat: get('saturated-fat', 1),
    fiber: get('fiber', 1),
    sugar: get('sugars', 1),
    sodium: get('sodium', 1000), // OFF stores grams
    cholesterol: get('cholesterol', 1000),
    potassium: get('potassium', 1000),
    calcium: get('calcium', 1000),
    iron: get('iron', 1000),
    vitaminC: get('vitamin-c', 1000),
    vitaminD: get('vitamin-d', 1e6),
  });
  const name = [p.brands && p.brands.split(',')[0], p.product_name].filter(Boolean).join(' ') || `Product ${clean}`;
  return {
    name,
    portion: p.serving_size || (servingG ? `${servingG} g` : '100 g'),
    grams: basis,
    nutrients,
    image: p.image_front_small_url || null,
  };
}

/* ---- Live barcode scanning ---- */
const BarcodeScanner = {
  supported() {
    return 'BarcodeDetector' in window && !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
  },
  stream: null,
  running: false,

  async start(videoEl, onCode) {
    const detector = new window.BarcodeDetector({ formats: ['ean_13', 'ean_8', 'upc_a', 'upc_e'] });
    this.stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
    videoEl.srcObject = this.stream;
    await videoEl.play();
    this.running = true;
    const tick = async () => {
      if (!this.running) return;
      try {
        const codes = await detector.detect(videoEl);
        if (codes && codes.length) {
          this.stop();
          onCode(codes[0].rawValue);
          return;
        }
      } catch (e) {
        /* frame not ready */
      }
      setTimeout(tick, 250);
    };
    tick();
  },

  stop() {
    this.running = false;
    if (this.stream) this.stream.getTracks().forEach((t) => t.stop());
    this.stream = null;
  },
};
