// Ave ID OAuth Callback Endpoint
/// <reference types="@cloudflare/workers-types" />

// Hardcoded allowed identity - only this Ave ID can access admin
const ALLOWED_IDENTITY_ID = "e39d9556-9662-43c9-a54c-e1b95cbf05de";

type Env = {
  AVE_CLIENT_ID: string;
  DB: D1Database;
};

type PagesContext = {
  request: Request;
  env: Env;
};

export async function onRequestGet({ request, env }: PagesContext) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const error = url.searchParams.get("error");

  if (error) {
    return new Response(null, {
      status: 302,
      headers: { "Location": `/?auth_error=${encodeURIComponent(error)}` },
    });
  }

  if (!code || !state) {
    return new Response(null, {
      status: 302,
      headers: { "Location": "/?auth_error=missing_params" },
    });
  }

  // Get cookies
  const cookieHeader = request.headers.get("Cookie") || "";
  const cookies = Object.fromEntries(
    cookieHeader.split(";").map((c) => {
      const [key, ...v] = c.trim().split("=");
      return [key, v.join("=")];
    })
  );

  const storedState = cookies["auth_state"];
  const verifier = cookies["pkce_verifier"];

  if (!storedState || storedState !== state) {
    return new Response(null, {
      status: 302,
      headers: { "Location": "/?auth_error=invalid_state" },
    });
  }

  if (!verifier) {
    return new Response(null, {
      status: 302,
      headers: { "Location": "/?auth_error=missing_verifier" },
    });
  }

  // Exchange code for tokens
  const redirectUri = `${url.origin}/api/auth/callback`;
  
  try {
    const tokenResponse = await fetch("https://api.aveid.net/api/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        grantType: "authorization_code",
        clientId: env.AVE_CLIENT_ID,
        code: code,
        redirectUri: redirectUri,
        codeVerifier: verifier,
      }),
    });

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error("Token exchange failed:", errorText);
      return new Response(null, {
        status: 302,
        headers: { "Location": "/?auth_error=token_exchange_failed" },
      });
    }

    const tokens = await tokenResponse.json() as {
      access_token: string;
      access_token_jwt?: string;
      id_token?: string;
      refresh_token?: string;
    };

    // Get user info
    const userResponse = await fetch("https://api.aveid.net/api/oauth/userinfo", {
      headers: {
        "Authorization": `Bearer ${tokens.access_token}`,
      },
    });

    if (!userResponse.ok) {
      return new Response(null, {
        status: 302,
        headers: { "Location": "/?auth_error=userinfo_failed" },
      });
    }

    const user = await userResponse.json() as {
      sub: string;
      handle?: string;
      email?: string;
      name?: string;
      picture?: string;
    };

    // Check if this identity is allowed
    if (user.sub !== ALLOWED_IDENTITY_ID) {
      return new Response(null, {
        status: 302,
        headers: { "Location": "/?auth_error=unauthorized" },
      });
    }

    // Create session
    const sessionId = crypto.randomUUID();
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(); // 7 days

    await env.DB.prepare(
      "INSERT INTO sessions (id, identity_id, handle, access_token, created_at, expires_at) VALUES (?, ?, ?, ?, ?, ?)"
    )
      .bind(sessionId, user.sub, user.handle || null, tokens.access_token, new Date().toISOString(), expiresAt)
      .run();

    // Clear auth cookies and set session cookie
    return new Response(null, {
      status: 302,
      headers: {
        "Location": "/",
        "Set-Cookie": [
          "pkce_verifier=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0",
          "auth_state=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0",
          `session=${sessionId}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${7 * 24 * 60 * 60}`,
        ].join(", "),
      },
    });
  } catch (err) {
    console.error("Auth callback error:", err);
    return new Response(null, {
      status: 302,
      headers: { "Location": "/?auth_error=server_error" },
    });
  }
}
