// Pages API - CRUD operations for dynamic pages and blog posts
/// <reference types="@cloudflare/workers-types" />
import { requireAuth, json, handleOptions } from "../../_auth";

type Env = {
  DB: D1Database;
};

type PagesContext = {
  request: Request;
  env: Env;
};

export type Page = {
  id: string;
  title: string;
  slug: string;
  content: string;
  page_type: string; // 'page', 'blog', 'project-detail'
  excerpt: string | null;
  cover_image: string | null;
  published: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

// GET /api/pages - List pages
export async function onRequestGet({ request, env }: PagesContext) {
  const url = new URL(request.url);
  const admin = url.searchParams.has("admin");
  const pageType = url.searchParams.get("type");

  let query = "SELECT * FROM pages";
  const conditions: string[] = [];
  const params: string[] = [];

  if (!admin) {
    conditions.push("published = 1");
  }

  if (pageType) {
    conditions.push("page_type = ?");
    params.push(pageType);
  }

  if (conditions.length > 0) {
    query += " WHERE " + conditions.join(" AND ");
  }

  query += " ORDER BY published_at DESC NULLS LAST, created_at DESC";

  const result = params.length > 0
    ? await env.DB.prepare(query).bind(...params).all<Page>()
    : await env.DB.prepare(query).all<Page>();

  return json(result.results);
}

// POST /api/pages - Create new page
export async function onRequestPost({ request, env }: PagesContext) {
  try {
    await requireAuth(request, env.DB);
  } catch (e) {
    return e as Response;
  }

  const body = await request.json() as Partial<Page>;
  
  if (!body.title || !body.slug || !body.content) {
    return json({ error: "title, slug, and content are required" }, 400);
  }

  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  const publishedAt = body.published ? now : null;

  await env.DB.prepare(
    `INSERT INTO pages (id, title, slug, content, page_type, excerpt, cover_image, published, published_at, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(
    id,
    body.title,
    body.slug,
    body.content,
    body.page_type || "page",
    body.excerpt || null,
    body.cover_image || null,
    body.published ? 1 : 0,
    publishedAt,
    now,
    now
  ).run();

  return json({ id, ...body, created_at: now, updated_at: now, published_at: publishedAt }, 201);
}

export { handleOptions as onRequestOptions };
