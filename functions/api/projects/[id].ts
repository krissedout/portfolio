// Single Project API - Update and Delete
/// <reference types="@cloudflare/workers-types" />
import { requireAuth, json, handleOptions } from "../../_auth";
import type { Project } from "./index";

type Env = {
  DB: D1Database;
};

type PagesContext = {
  request: Request;
  env: Env;
  params: { id: string };
};

// GET /api/projects/:id - Get single project
export async function onRequestGet({ request, env, params }: PagesContext) {
  const result = await env.DB.prepare(
    "SELECT * FROM projects WHERE id = ? OR slug = ?"
  ).bind(params.id, params.id).first<Project>();

  if (!result) {
    return json({ error: "Project not found" }, 404);
  }

  return json({
    ...result,
    screenshots: result.screenshots ? JSON.parse(result.screenshots) : [],
    technologies: result.technologies ? JSON.parse(result.technologies) : [],
  });
}

// PUT /api/projects/:id - Update project
export async function onRequestPut({ request, env, params }: PagesContext) {
  try {
    await requireAuth(request, env.DB);
  } catch (e) {
    return e as Response;
  }

  const body = await request.json() as Partial<Project>;
  const now = new Date().toISOString();

  // Build dynamic update query
  const updates: string[] = [];
  const values: (string | number | null)[] = [];

  if (body.name !== undefined) { updates.push("name = ?"); values.push(body.name); }
  if (body.slug !== undefined) { updates.push("slug = ?"); values.push(body.slug); }
  if (body.url !== undefined) { updates.push("url = ?"); values.push(body.url || null); }
  if (body.description !== undefined) { updates.push("description = ?"); values.push(body.description); }
  if (body.long_description !== undefined) { updates.push("long_description = ?"); values.push(body.long_description || null); }
  if (body.color !== undefined) { updates.push("color = ?"); values.push(body.color); }
  if (body.status !== undefined) { updates.push("status = ?"); values.push(body.status); }
  if (body.screenshots !== undefined) { updates.push("screenshots = ?"); values.push(JSON.stringify(body.screenshots)); }
  if (body.technologies !== undefined) { updates.push("technologies = ?"); values.push(JSON.stringify(body.technologies)); }
  if (body.featured !== undefined) { updates.push("featured = ?"); values.push(body.featured ? 1 : 0); }
  if (body.sort_order !== undefined) { updates.push("sort_order = ?"); values.push(body.sort_order); }

  updates.push("updated_at = ?");
  values.push(now);
  values.push(params.id);

  if (updates.length === 1) {
    return json({ error: "No fields to update" }, 400);
  }

  await env.DB.prepare(
    `UPDATE projects SET ${updates.join(", ")} WHERE id = ?`
  ).bind(...values).run();

  return json({ success: true, updated_at: now });
}

// DELETE /api/projects/:id - Delete project
export async function onRequestDelete({ request, env, params }: PagesContext) {
  try {
    await requireAuth(request, env.DB);
  } catch (e) {
    return e as Response;
  }

  await env.DB.prepare("DELETE FROM projects WHERE id = ?")
    .bind(params.id)
    .run();

  return json({ success: true });
}

export { handleOptions as onRequestOptions };
