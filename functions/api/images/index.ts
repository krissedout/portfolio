// Images API - Upload and manage images in R2
/// <reference types="@cloudflare/workers-types" />
import { requireAuth, json, handleOptions } from "../../_auth";

type Env = {
  DB: D1Database;
  IMAGES: R2Bucket;
};

type PagesContext = {
  request: Request;
  env: Env;
};

// GET /api/images - List images
export async function onRequestGet({ request, env }: PagesContext) {
  const url = new URL(request.url);
  const prefix = url.searchParams.get("prefix") || "";
  const limit = parseInt(url.searchParams.get("limit") || "100");

  const result = await env.IMAGES.list({ prefix, limit });
  
  const images = result.objects.map(obj => ({
    key: obj.key,
    size: obj.size,
    uploaded: obj.uploaded,
    url: `/api/images/${obj.key}`,
  }));

  return json(images);
}

// POST /api/images - Upload image
export async function onRequestPost({ request, env }: PagesContext) {
  try {
    await requireAuth(request, env.DB);
  } catch (e) {
    return e as Response;
  }

  const formData = await request.formData();
  const file = formData.get("file") as File | null;
  const customKey = formData.get("key") as string | null;

  if (!file) {
    return json({ error: "No file provided" }, 400);
  }

  // Generate key if not provided
  const key = customKey || `uploads/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;

  // Upload to R2
  await env.IMAGES.put(key, file.stream(), {
    httpMetadata: {
      contentType: file.type,
    },
  });

  return json({ 
    key, 
    url: `/api/images/${key}`,
    size: file.size,
  }, 201);
}

export { handleOptions as onRequestOptions };
