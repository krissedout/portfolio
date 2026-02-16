// Shared authentication utilities
/// <reference types="@cloudflare/workers-types" />

// Hardcoded allowed identity - only this Ave ID can access admin
export const ALLOWED_IDENTITY_ID = "e39d9556-9662-43c9-a54c-e1b95cbf05de";

export type Session = {
  id: string;
  identity_id: string;
  handle: string | null;
  access_token: string;
  created_at: string;
  expires_at: string;
};

export async function getSession(request: Request, db: D1Database): Promise<Session | null> {
  const cookieHeader = request.headers.get("Cookie") || "";
  const cookies = Object.fromEntries(
    cookieHeader.split(";").map((c) => {
      const [key, ...v] = c.trim().split("=");
      return [key, v.join("=")];
    })
  );

  const sessionId = cookies["session"];
  if (!sessionId) return null;

  const result = await db.prepare(
    "SELECT * FROM sessions WHERE id = ? AND expires_at > ?"
  )
    .bind(sessionId, new Date().toISOString())
    .first<Session>();

  return result || null;
}

export async function requireAuth(request: Request, db: D1Database): Promise<Session> {
  const session = await getSession(request, db);
  if (!session) {
    throw new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }
  if (session.identity_id !== ALLOWED_IDENTITY_ID) {
    throw new Response(JSON.stringify({ error: "Forbidden" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }
  return session;
}

export const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export function handleOptions() {
  return new Response(null, { headers: corsHeaders });
}
