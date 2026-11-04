// Prices come from here, never from the browser. Replace each price_ ID with the real one from DH Sandbox.
const SETS = {
  "edited-5":    { price: "price_$20", count: 5 },
  "prints-6x4":  { price: "price_$10",    count: 5 },
  "prints-5x7":  { price: "price_$15",    count: 5 },
  "prints-8x10": { price: "price_$25",   count: 5 },
};
const MAX_SETS = 10;

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } });

async function stripe(env, path, params) {
  const init = { headers: { Authorization: `Bearer ${env.STRIPE_SECRET_KEY}`, "Stripe-Version": "2026-01-28.clover" } };
  if (params) {
    init.method = "POST";
    init.headers["Content-Type"] = "application/x-www-form-urlencoded";
    init.body = params;
  }
  const res = await fetch(`https://api.stripe.com/v1${path}`, init);
  const body = await res.json();
  if (!res.ok) throw new Error(body.error?.message || "Stripe error");
  return body;
}

async function createCheckout(request, env) {
  let body;
  try { body = await request.json(); } catch { return json({ error: "Bad request" }, 400); }
  const items = Array.isArray(body.items) ? body.items : [];
  if (!items.length || items.length > MAX_SETS) return json({ error: "Cart is empty or too large" }, 400);

  const allowed = new Set(await (await env.ASSETS.fetch(new URL("/photos.json", request.url))).json());
  const params = new URLSearchParams({
    ui_mode: "custom",
    mode: "payment",
    return_url: `${new URL(request.url).origin}/complete.html?session_id={CHECKOUT_SESSION_ID}`,
  });

  const qty = {};
  for (const [i, item] of items.entries()) {
    const set = SETS[item.set];
    const photos = Array.isArray(item.photos) ? item.photos : [];
    const valid = set && photos.length === set.count && new Set(photos).size === photos.length && photos.every((p) => allowed.has(p));
    if (!valid) return json({ error: "Invalid selection" }, 400);
    qty[set.price] = (qty[set.price] || 0) + 1;
    params.set(`metadata[set_${i + 1}]`, `${item.set}: ${photos.join(", ")}`);
  }
  Object.entries(qty).forEach(([price, q], i) => {
    params.set(`line_items[${i}][price]`, price);
    params.set(`line_items[${i}][quantity]`, String(q));
  });

  try {
    const session = await stripe(env, "/checkout/sessions", params);
    return json({ clientSecret: session.client_secret });
  } catch (e) {
    console.error(e.message);
    return json({ error: "Could not start checkout" }, 500);
  }
}

async function sessionStatus(url, env) {
  const id = url.searchParams.get("session_id") || "";
  if (!/^cs_[A-Za-z0-9_]+$/.test(id)) return json(null, 400);
  try {
    const s = await stripe(env, `/checkout/sessions/${id}?expand[]=payment_intent`);
    const pi = s.payment_intent || {};
    return json({ status: s.status, payment_status: s.payment_status, payment_intent_id: pi.id, payment_intent_status: pi.status });
  } catch {
    return json(null, 400);
  }
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === "/api/create-checkout" && request.method === "POST") return createCheckout(request, env);
    if (url.pathname === "/api/session-status" && request.method === "GET") return sessionStatus(url, env);
    return env.ASSETS.fetch(request);
  },
};