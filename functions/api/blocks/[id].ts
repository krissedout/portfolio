// Single Block API - Update, Delete, Reorder
/// <reference types="@cloudflare/workers-types" />
import { requireAuth, json, handleOptions } from "../../_auth";
import type { Block } from "./index";

type Env = {
  DB: D1Database;
};

type PagesContext = {
  request: Request;
  env: Env;
  params: { id: string };
};

// GET /api/blocks/:id - Get single block
export async function onRequestGet({ request, env, params }: PagesContext) {
  const result = await env.DB.prepare(
    "SELECT * FROM blocks WHERE id = ?"
  ).bind(params.id).first<Block>();

  if (!result) {
    return json({ error: "Block not found" }, 404);
  }

  return json({
    ...result,
    content: result.content ? JSON.parse(result.content) : {},
  });
}

// PUT /api/blocks/:id - Update block
export async function onRequestPut({ request, env, params }: PagesContext) {
  try {
    await requireAuth(request, env.DB);
  } catch (e) {
    return e as Response;
  }

  const body = await request.json() as Partial<Block> & { move_to?: number };
  const now = new Date().toISOString();

  // Handle reordering
  if (body.move_to !== undefined) {
    const block = await env.DB.prepare(
      "SELECT page_id, sort_order FROM blocks WHERE id = ?"
    ).bind(params.id).first<{ page_id: string; sort_order: number }>();

    if (!block) {
      return json({ error: "Block not found" }, 404);
    }

    const currentOrder = block.sort_order;
    const newOrder = body.move_to;

    if (newOrder < currentOrder) {
      // Moving up - shift blocks in between down
      await env.DB.prepare(
        "UPDATE blocks SET sort_order = sort_order + 1 WHERE page_id = ? AND sort_order >= ? AND sort_order < ?"
      ).bind(block.page_id, newOrder, currentOrder).run();
    } else if (newOrder > currentOrder) {
      // Moving down - shift blocks in between up
      await env.DB.prepare(
        "UPDATE blocks SET sort_order = sort_order - 1 WHERE page_id = ? AND sort_order > ? AND sort_order <= ?"
      ).bind(block.page_id, currentOrder, newOrder).run();
    }

    await env.DB.prepare(
      "UPDATE blocks SET sort_order = ?, updated_at = ? WHERE id = ?"
    ).bind(newOrder, now, params.id).run();

    return json({ success: true, sort_order: newOrder });
  }

  // Regular content update
  const updates: string[] = [];
  const values: (string | number)[] = [];

  if (body.block_type !== undefined) {
    updates.push("block_type = ?");
    values.push(body.block_type);
  }
  if (body.content !== undefined) {
    updates.push("content = ?");
    values.push(JSON.stringify(body.content));
  }

  if (updates.length === 0) {
    return json({ error: "No fields to update" }, 400);
  }

  updates.push("updated_at = ?");
  values.push(now);
  values.push(params.id);

  await env.DB.prepare(
    `UPDATE blocks SET ${updates.join(", ")} WHERE id = ?`
  ).bind(...values).run();

  return json({ success: true, updated_at: now });
}

// DELETE /api/blocks/:id - Delete block
export async function onRequestDelete({ request, env, params }: PagesContext) {
  try {
    await requireAuth(request, env.DB);
  } catch (e) {
    return e as Response;
  }

  // Get block info before deleting
  const block = await env.DB.prepare(
    "SELECT page_id, sort_order FROM blocks WHERE id = ?"
  ).bind(params.id).first<{ page_id: string; sort_order: number }>();

  if (block) {
    // Delete the block
    await env.DB.prepare("DELETE FROM blocks WHERE id = ?")
      .bind(params.id)
      .run();

    // Shift remaining blocks up
    await env.DB.prepare(
      "UPDATE blocks SET sort_order = sort_order - 1 WHERE page_id = ? AND sort_order > ?"
    ).bind(block.page_id, block.sort_order).run();
  }

  return json({ success: true });
}

export { handleOptions as onRequestOptions };
