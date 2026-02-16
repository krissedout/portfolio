// Single Image API - Get and Delete
/// <reference types="@cloudflare/workers-types" />
import { requireAuth, json, handleOptions } from "../../_auth";

type Env = {
  DB: D1Database;
  IMAGES: R2Bucket;
};

type PagesContext = {
  request: Request;
  env: Env;
  params: { key: string };
};

// GET /api/images/:key - Get image
export async function onRequestGet({ request, env, params }: PagesContext) {
  // Decode the key (it might be URL encoded)
  const key = decodeURIComponent(params.key);
  
  const object = await env.IMAGES.get(key);
  
  if (!object) {
    return json({ error: "Image not found" }, 404);
  }

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("Cache-Control", "public, max-age=31536000");
  headers.set("Access-Control-Allow-Origin", "*");

  return new Response(object.body, { headers });
}

// DELETE /api/images/:key - Delete image
export async function onRequestDelete({ request, env, params }: PagesContext) {
  try {
    await requireAuth(request, env.DB);
  } catch (e) {
    return e as Response;
  }

  const key = decodeURIComponent(params.key);
  
  await env.IMAGES.delete(key);

  return json({ success: true });
}

export { handleOptions as onRequestOptions };
