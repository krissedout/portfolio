# Portfolio Deployment Guide

This portfolio now uses Cloudflare D1 for dynamic content storage, R2 for image uploads, and Ave ID for authentication.

## Prerequisites

1. A Cloudflare account with Pages enabled
2. An Ave ID developer account (https://devs.aveid.net)
3. Wrangler CLI installed (`npm install -g wrangler`)

## Setup Steps

### 1. Create D1 Database

```bash
# Create the D1 database
wrangler d1 create portfolio-content

# Note the database ID from the output and update wrangler.toml:
# database_id = "your-database-id-here"
```

### 2. Create R2 Bucket

```bash
# Create the R2 bucket for images
wrangler r2 bucket create portfolio-images
```

### 3. Initialize Database Schema

```bash
# Apply the schema to your D1 database
wrangler d1 execute portfolio-content --file=./schema.sql

# (Optional) Seed with initial data
wrangler d1 execute portfolio-content --file=./seed.sql
```

### 4. Create Ave ID OAuth App

1. Go to https://devs.aveid.net
2. Create a new OAuth application
3. Set the redirect URI to: `https://your-domain.com/api/auth/callback`
4. Note your Client ID

### 5. Configure Environment Variables

In your Cloudflare Pages dashboard, set these environment variables:

| Variable | Description |
|----------|-------------|
| `AVE_CLIENT_ID` | Your Ave OAuth Client ID |

### 6. Update wrangler.toml

Update the `wrangler.toml` file with your actual database ID:

```toml
[[d1_databases]]
binding = "DB"
database_name = "portfolio-content"
database_id = "YOUR_ACTUAL_DATABASE_ID"
```

### 7. Deploy

```bash
# Build and deploy
bun run build
wrangler pages deploy dist
```

Or connect your GitHub repository to Cloudflare Pages for automatic deployments.

## Usage

### In-Place Editing

1. Navigate to `/login` (only accessible via direct URL)
2. Sign in with your Ave ID (only the hardcoded identity ID can access)
3. You'll be redirected back to the homepage
4. Navigate to any page (About, Skills, Work)
5. Edit content directly on the page with dotted-border fields
6. Use the insert buttons to add new blocks
7. Use the side controls to move or delete blocks

### Block Types

- **Text** - Paragraph text
- **Heading** - Section headings (h1, h2, h3)
- **List** - Bullet point lists
- **Skill Section** - Image + title + description combo
- **Image** - Standalone images
- **Spacer** - Vertical spacing
- **Divider** - Horizontal line separator

### Preview Mode

When editing, toggle "Preview Mode" to see what visitors will see. Changes are stored in your session but only persist when you save.

### Adding Projects

Projects are managed through the Admin panel at `/admin`:
1. Go to Admin → Projects
2. Fill in project details
3. Add screenshots via the Images tab
4. Projects appear on the Work page

### Adding Blog Posts

1. Go to Admin → Pages
2. Create a new page with type "blog"
3. Write content in markdown
4. Publish when ready

### Uploading Images

1. Go to Admin → Images
2. Upload images (they'll be stored in R2)
3. Copy the URL to use in projects or pages

## Auth Callback URL

The OAuth callback URL is: `https://your-domain.com/api/auth/callback`

This is where Ave ID redirects after successful authentication.

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/blocks?page=<page_id>` | GET | List blocks for a page |
| `/api/blocks` | POST | Create block (auth required) |
| `/api/blocks/:id` | GET | Get single block |
| `/api/blocks/:id` | PUT | Update block (auth required) |
| `/api/blocks/:id` | DELETE | Delete block (auth required) |
| `/api/projects` | GET | List all projects |
| `/api/projects?admin=true` | GET | List all projects (including archived) |
| `/api/projects` | POST | Create project (auth required) |
| `/api/projects/:id` | GET | Get single project |
| `/api/projects/:id` | PUT | Update project (auth required) |
| `/api/projects/:id` | DELETE | Delete project (auth required) |
| `/api/pages` | GET | List published pages |
| `/api/pages?admin=true` | GET | List all pages (auth required) |
| `/api/pages` | POST | Create page (auth required) |
| `/api/pages/:slug` | GET | Get page by slug |
| `/api/pages/:slug` | PUT | Update page (auth required) |
| `/api/pages/:slug` | DELETE | Delete page (auth required) |
| `/api/images` | GET | List images |
| `/api/images` | POST | Upload image (auth required) |
| `/api/images/:key` | GET | Get image |
| `/api/images/:key` | DELETE | Delete image (auth required) |
| `/api/auth/login` | GET | Start Ave OAuth flow |
| `/api/auth/callback` | GET | OAuth callback |
| `/api/auth/status` | GET | Check auth status |
| `/api/auth/logout` | POST | Logout |
| `/api/settings` | GET | Get site settings |
| `/api/settings` | PUT | Update settings (auth required) |

## Security

- Only the hardcoded Ave identity ID (`e39d9556-9662-43c9-a54c-e1b95cbf05de`) can access editing
- Login is only accessible via `/login` URL (not linked anywhere)
- All write operations require authentication
- Sessions expire after 7 days
- PKCE is used for OAuth security

## Development

```bash
# Install dependencies
bun install

# Run dev server
bun run dev

# Build for production
bun run build
```

## File Structure

```
├── functions/           # Cloudflare Functions (API)
│   ├── _auth.ts        # Shared auth utilities
│   └── api/
│       ├── auth/       # Authentication endpoints
│       ├── blocks/     # Blocks CRUD
│       ├── projects/   # Projects CRUD
│       ├── pages/      # Pages CRUD
│       ├── images/     # Image upload/serve
│       └── settings.ts # Site settings
├── src/
│   ├── components/
│   │   └── EditableBlock.tsx # Block-based editing components
│   ├── pages/          # React pages
│   │   ├── Login.tsx   # Login page (/login)
│   │   ├── Admin.tsx   # Admin dashboard (/admin)
│   │   ├── DynamicPage.tsx # Dynamic page renderer
│   │   ├── Home.tsx    # Main portfolio
│   │   ├── About.tsx   # About page (editable)
│   │   ├── Skills.tsx  # Skills page (editable)
│   │   └── Work.tsx    # Projects page
│   └── main.tsx        # App entry with routing
├── schema.sql          # D1 database schema
├── seed.sql           # Initial data
└── wrangler.toml      # Cloudflare config
```
