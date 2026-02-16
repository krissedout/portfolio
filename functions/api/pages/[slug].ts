// Single Page API - Update and Delete
/// <reference types="@cloudflare/workers-types" />
import { requireAuth, json, handleOptions } from "../../_auth";
import type { Page } from "./index";

type Env = {
  DB: D1Database;
};

type PagesContext = {
  request: Request;
  env: Env;
  params: { slug: string };
};

// GET /api/pages/:slug - Get single page
export async function onRequestGet({ request, env, params }: PagesContext) {
  const result = await env.DB.prepare(
    "SELECT * FROM pages WHERE slug = ? OR id = ?"
  ).bind(params.slug, params.slug).first<Page>();

  if (!result) {
    return json({ error: "Page not found" }, 404);
  }

  return json(result);
}

// PUT /api/pages/:slug - Update page
export async function onRequestPut({ request, env, params }: PagesContext) {
  try {
    await requireAuth(request, env.DB);
  } catch (e) {
    return e as Response;
  }

  const body = await request.json() as Partial<Page>;
  const now = new Date().toISOString();

  // Build dynamic update query
  const updates: string[] = [];
  const values: (string | number | null)[] = [];

  if (body.title !== undefined) { updates.push("title = ?"); values.push(body.title); }
  if (body.slug !== undefined) { updates.push("slug = ?"); values.push(body.slug); }
  if (body.content !== undefined) { updates.push("content = ?"); values.push(body.content); }
  if (body.page_type !== undefined) { updates.push("page_type = ?"); values.push(body.page_type); }
  if (body.excerpt !== undefined) { updates.push("excerpt = ?"); values.push(body.excerpt || null); }
  if (body.cover_image !== undefined) { updates.push("cover_image = ?"); values.push(body.cover_image || null); }
  
  if (body.published !== undefined) {
    updates.push("published = ?");
    values.push(body.published ? 1 : 0);
    // If publishing for the first time, set published_at
    if (body.published) {
      updates.push("published_at = ?");
      values.push(now);
    }
  }

  updates.push("updated_at = ?");
  values.push(now);
  values.push(params.slug);

  if (updates.length === 1) {
    return json({ error: "No fields to update" }, 400);
  }

  await env.DB.prepare(
    `UPDATE pages SET ${updates.join(", ")} WHERE slug = ? OR id = ?`
  ).bind(...values, params.slug).run();

  return json({ success: true, updated_at: now });
}

// DELETE /api/pages/:slug - Delete page
export async function onRequestDelete({ request, env, params }: PagesContext) {
  try {
    await requireAuth(request, env.DB);
  } catch (e) {
    return e as Response;
  }

  await env.DB.prepare("DELETE FROM pages WHERE slug = ? OR id = ?")
    .bind(params.slug, params.slug)
    .run();

  return json({ success: true });
}

export { handleOptions as onRequestOptions };
