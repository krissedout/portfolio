// Blocks API - CRUD operations for content blocks
/// <reference types="@cloudflare/workers-types" />
import { requireAuth, json, handleOptions } from "../../_auth";

type Env = {
  DB: D1Database;
};

type PagesContext = {
  request: Request;
  env: Env;
};

export type Block = {
  id: string;
  page_id: string;
  block_type: string;
  content: string; // JSON
  sort_order: number;
  created_at: string;
  updated_at: string;
};

// GET /api/blocks - List blocks for a page
export async function onRequestGet({ request, env }: PagesContext) {
  const url = new URL(request.url);
  const pageId = url.searchParams.get("page");

  if (!pageId) {
    return json({ error: "page parameter required" }, 400);
  }

  const result = await env.DB.prepare(
    "SELECT * FROM blocks WHERE page_id = ? ORDER BY sort_order ASC"
  ).bind(pageId).all<Block>();

  // Parse JSON content
  const blocks = result.results.map(b => ({
    ...b,
    content: b.content ? JSON.parse(b.content) : {},
  }));

  return json(blocks);
}

// POST /api/blocks - Create new block
export async function onRequestPost({ request, env }: PagesContext) {
  try {
    await requireAuth(request, env.DB);
  } catch (e) {
    return e as Response;
  }

  const body = await request.json() as Partial<Block> & { after_id?: string };
  
  if (!body.page_id || !body.block_type) {
    return json({ error: "page_id and block_type are required" }, 400);
  }

  const id = crypto.randomUUID();
  const now = new Date().toISOString();

  // Determine sort order
  let sortOrder = body.sort_order ?? 0;
  if (body.after_id) {
    // Insert after the specified block
    const afterBlock = await env.DB.prepare(
      "SELECT sort_order FROM blocks WHERE id = ?"
    ).bind(body.after_id).first<{ sort_order: number }>();
    
    if (afterBlock) {
      sortOrder = afterBlock.sort_order + 1;
      // Shift all blocks after this one
      await env.DB.prepare(
        "UPDATE blocks SET sort_order = sort_order + 1 WHERE page_id = ? AND sort_order >= ?"
      ).bind(body.page_id, sortOrder).run();
    }
  } else {
    // Get max sort order for this page
    const maxOrder = await env.DB.prepare(
      "SELECT MAX(sort_order) as max FROM blocks WHERE page_id = ?"
    ).bind(body.page_id).first<{ max: number | null }>();
    sortOrder = (maxOrder?.max ?? -1) + 1;
  }

  await env.DB.prepare(
    `INSERT INTO blocks (id, page_id, block_type, content, sort_order, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  ).bind(
    id,
    body.page_id,
    body.block_type,
    body.content ? JSON.stringify(body.content) : "{}",
    sortOrder,
    now,
    now
  ).run();

  return json({ 
    id, 
    page_id: body.page_id,
    block_type: body.block_type,
    content: body.content || {},
    sort_order: sortOrder,
    created_at: now,
    updated_at: now
  }, 201);
}

export { handleOptions as onRequestOptions };
