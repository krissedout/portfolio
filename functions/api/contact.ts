type ContactRequest = {
  name?: string;
  contact?: string;
  message?: string;
};

type Env = {
  DISCORD_WEBHOOK_URL?: string;
};

type PagesContext = {
  request: Request;
  env: Env;
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json" },
  });

export async function onRequestPost({ request, env }: PagesContext) {
  const webhookUrl = env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) {
    return json({ error: "Server misconfigured" }, 500);
  }

  let payload: ContactRequest;
  try {
    payload = (await request.json()) as ContactRequest;
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }

  const name = payload.name?.trim();
  const contact = payload.contact?.trim();
  const message = payload.message?.trim();

  if (!name || !contact || !message) {
    return json({ error: "Missing fields" }, 400);
  }

  const resp = await fetch(webhookUrl, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      content:
        `**New message from contact form**\n` +
        `**Name:** ${name}\n` +
        `**Contact:** ${contact}\n` +
        `**Message:** ${message}`,
    }),
  });

  if (!resp.ok) {
    return json({ error: "Discord error" }, 502);
  }

  return json({ ok: true }, 200);
}
