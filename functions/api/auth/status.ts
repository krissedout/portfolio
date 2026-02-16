// Auth Status API - Check if user is logged in
/// <reference types="@cloudflare/workers-types" />
import { getSession, json, handleOptions, ALLOWED_IDENTITY_ID } from "../../_auth";

type Env = {
  DB: D1Database;
};

type PagesContext = {
  request: Request;
  env: Env;
};

// GET /api/auth/status - Check auth status
export async function onRequestGet({ request, env }: PagesContext) {
  const session = await getSession(request, env.DB);
  
  if (!session) {
    return json({ authenticated: false });
  }

  if (session.identity_id !== ALLOWED_IDENTITY_ID) {
    return json({ authenticated: false });
  }

  return json({
    authenticated: true,
    handle: session.handle,
    expires_at: session.expires_at,
  });
}

export { handleOptions as onRequestOptions };
