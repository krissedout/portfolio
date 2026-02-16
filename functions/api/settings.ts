// Settings API - Site-wide settings
/// <reference types="@cloudflare/workers-types" />
import { requireAuth, json, handleOptions } from "../_auth";

type Env = {
  DB: D1Database;
};

type PagesContext = {
  request: Request;
  env: Env;
};

// GET /api/settings - Get all settings
export async function onRequestGet({ request, env }: PagesContext) {
  const result = await env.DB.prepare("SELECT * FROM settings").all<{ key: string; value: string }>();
  
  const settings: Record<string, string> = {};
  for (const row of result.results) {
    settings[row.key] = row.value;
  }

  return json(settings);
}

// PUT /api/settings - Update settings
export async function onRequestPut({ request, env }: PagesContext) {
  try {
    await requireAuth(request, env.DB);
  } catch (e) {
    return e as Response;
  }

  const body = await request.json() as Record<string, string>;
  const now = new Date().toISOString();

  for (const [key, value] of Object.entries(body)) {
    await env.DB.prepare(
      `INSERT INTO settings (key, value, updated_at) VALUES (?, ?, ?)
       ON CONFLICT(key) DO UPDATE SET value = ?, updated_at = ?`
    ).bind(key, value, now, value, now).run();
  }

  return json({ success: true });
}

export { handleOptions as onRequestOptions };
