// Shared authentication utilities
/// <reference types="@cloudflare/workers-types" />

export const ALLOWED_IDENTITY_ID = "e39d9556-9662-43c9-a54c-e1b95cbf05de";
const AVE_ISSUER = "https://aveid.net";
const JWKS_URL = "https://aveid.net/.well-known/jwks.json";

type JwkKey = {
  kid?: string;
  kty: string;
  use?: string;
  alg?: string;
  n: string;
  e: string;
};

function b64urlDecode(s: string): Uint8Array {
  const b64 = s.replace(/-/g, "+").replace(/_/g, "/");
  const padded = b64 + "=".repeat((4 - (b64.length % 4)) % 4);
  return Uint8Array.from(atob(padded), (c) => c.charCodeAt(0));
}

async function verifyJwt(token: string): Promise<{ sub: string; handle?: string } | null> {
  const parts = token.split(".");
  if (parts.length !== 3) return null;

  const [headerB64, payloadB64, sigB64] = parts;

  let header: { alg: string; kid?: string };
  let payload: { sub?: string; iss?: string; exp?: number; handle?: string };

  try {
    header = JSON.parse(new TextDecoder().decode(b64urlDecode(headerB64)));
    payload = JSON.parse(new TextDecoder().decode(b64urlDecode(payloadB64)));
  } catch {
    return null;
  }

  if (header.alg !== "RS256") return null;
  if (!payload.sub || payload.iss !== AVE_ISSUER) return null;
  if (!payload.exp || Date.now() / 1000 > payload.exp) return null;

  try {
    const jwksRes = await fetch(JWKS_URL);
    if (!jwksRes.ok) return null;
    const jwks = (await jwksRes.json()) as { keys: JwkKey[] };

    const jwk = header.kid
      ? jwks.keys.find((k) => k.kid === header.kid)
      : jwks.keys.find((k) => k.alg === "RS256" || k.kty === "RSA");

    if (!jwk) return null;

    const cryptoKey = await crypto.subtle.importKey(
      "jwk",
      jwk,
      { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
      false,
      ["verify"]
    );

    const sigBytes = b64urlDecode(sigB64);
    const dataBytes = new TextEncoder().encode(`${headerB64}.${payloadB64}`);
    const valid = await crypto.subtle.verify("RSASSA-PKCS1-v1_5", cryptoKey, sigBytes, dataBytes);

    if (!valid) return null;
    return { sub: payload.sub, handle: payload.handle };
  } catch {
    return null;
  }
}

export async function requireAuth(
  request: Request,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _db: D1Database
): Promise<{ identity_id: string; handle: string | null }> {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    throw new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const token = authHeader.slice(7);
  const identity = await verifyJwt(token);

  if (!identity) {
    throw new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (identity.sub !== ALLOWED_IDENTITY_ID) {
    throw new Response(JSON.stringify({ error: "Forbidden" }), {
      status: 403,
      headers: { "Content-Type": "application/json" },
    });
  }

  return { identity_id: identity.sub, handle: identity.handle ?? null };
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
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

export function handleOptions() {
  return new Response(null, { headers: corsHeaders });
}
