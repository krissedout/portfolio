# Portfolio

This portfolio now uses BaseHub for content and keeps a single Cloudflare Pages Function for the contact form.

## Environment

Create a local `.env` file:

```env
VITE_BASEHUB_TOKEN=your_basehub_read_token
```

For the contact form, set this Cloudflare secret:

```powershell
wrangler secret put DISCORD_WEBHOOK_URL
```

## BaseHub schema

Create these blocks in your BaseHub repo:

### Document: `about`
- Rich Text: `content`

### Document: `skills`
- Rich Text: `content`

### List: `projects`
Each row uses the row title as the project name and auto slug.

- Text: `summary`
- Rich Text: `longDescription`
- Select: `status` with options `active`, `wip`, `archived`
- Text: `url`
- Select (multiple): `technologies`
- Boolean: `featured`
- Media: `coverImage`

### List: `pages`
Each row uses the row title as the page title and auto slug.

- Select: `pageType` with options `page`, `blog`, `project`
- Text: `excerpt`
- Date: `publishedAt`
- Media: `coverImage`
- Rich Text: `content`

## Routes

- `/`
- `/p/:slug`
- `/blog/:slug`
- `/project/:slug`
