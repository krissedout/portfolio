// Projects API - CRUD operations
/// <reference types="@cloudflare/workers-types" />
import { requireAuth, json, corsHeaders, handleOptions } from "../../_auth";

type Env = {
  DB: D1Database;
  IMAGES: R2Bucket;
};

type PagesContext = {
  request: Request;
  env: Env;
};

export type Project = {
  id: string;
  name: string;
  slug: string;
  url: string | null;
  description: string;
  long_description: string | null;
  color: string;
  status: string;
  screenshots: string | null; // JSON array
  technologies: string | null; // JSON array
  featured: number;
  sort_order: number;
  created_at: string;
  updated_at: string;
};

// GET /api/projects - List all projects
export async function onRequestGet({ request, env }: PagesContext) {
  const url = new URL(request.url);
  const admin = url.searchParams.has("admin");

  let query = "SELECT * FROM projects ORDER BY sort_order ASC, created_at DESC";
  
  // For public requests, only show active projects
  if (!admin) {
    query = "SELECT * FROM projects WHERE status != 'archived' ORDER BY featured DESC, sort_order ASC, created_at DESC";
  }

  const result = await env.DB.prepare(query).all<Project>();
  
  // Parse JSON fields
  const projects = result.results.map(p => ({
    ...p,
    screenshots: p.screenshots ? JSON.parse(p.screenshots) : [],
    technologies: p.technologies ? JSON.parse(p.technologies) : [],
  }));

  return json(projects);
}

// POST /api/projects - Create new project
export async function onRequestPost({ request, env }: PagesContext) {
  try {
    await requireAuth(request, env.DB);
  } catch (e) {
    return e as Response;
  }

  const body = await request.json() as Partial<Project>;
  
  if (!body.name || !body.slug || !body.description) {
    return json({ error: "name, slug, and description are required" }, 400);
  }

  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  await env.DB.prepare(
    `INSERT INTO projects (id, name, slug, url, description, long_description, color, status, screenshots, technologies, featured, sort_order, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(
    id,
    body.name,
    body.slug,
    body.url || null,
    body.description,
    body.long_description || null,
    body.color || "#714DD7",
    body.status || "active",
    body.screenshots ? JSON.stringify(body.screenshots) : null,
    body.technologies ? JSON.stringify(body.technologies) : null,
    body.featured ? 1 : 0,
    body.sort_order || 0,
    now,
    now
  ).run();

  return json({ id, ...body, created_at: now, updated_at: now }, 201);
}

export { handleOptions as onRequestOptions };
