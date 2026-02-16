// Auth Logout API
/// <reference types="@cloudflare/workers-types" />
import { getSession, json, handleOptions } from "../../_auth";

type Env = {
  DB: D1Database;
};

type PagesContext = {
  request: Request;
  env: Env;
};

// POST /api/auth/logout - Logout user
export async function onRequestPost({ request, env }: PagesContext) {
  const session = await getSession(request, env.DB);
  
  if (session) {
    // Delete session from database
    await env.DB.prepare("DELETE FROM sessions WHERE id = ?")
      .bind(session.id)
      .run();
  }

  return new Response(JSON.stringify({ success: true }), {
    headers: {
      "Content-Type": "application/json",
      "Set-Cookie": "session=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0",
    },
  });
}

export { handleOptions as onRequestOptions };
