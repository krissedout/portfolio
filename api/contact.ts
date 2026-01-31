// api/contact.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') return res.status(405).end();

    const { name, contact, message } = req.body ?? {};
    if (!name || !contact || !message) {
        return res.status(400).json({ error: 'Missing fields' });
    }

    const resp = await fetch(process.env.DISCORD_WEBHOOK_URL!, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            content: `**New message from contact form**\n**Name:** ${name}\n**Contact:** ${contact}\n**Message:** ${message}`
        })
    });

    return resp.ok
        ? res.status(200).json({ ok: true })
        : res.status(502).json({ error: 'Discord error' });
}
