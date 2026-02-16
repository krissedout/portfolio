-- Portfolio Content Database Schema with Block-Based Editing

-- Content blocks (reusable across pages)
CREATE TABLE IF NOT EXISTS blocks (
    id TEXT PRIMARY KEY,
    page_id TEXT NOT NULL, -- 'about', 'skills', 'home', etc.
    block_type TEXT NOT NULL, -- 'text', 'heading', 'list', 'image', 'skill-section', 'project-card', etc.
    content TEXT, -- JSON content based on block_type
    sort_order INTEGER DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    url TEXT,
    description TEXT NOT NULL,
    long_description TEXT,
    color TEXT DEFAULT '#714DD7',
    status TEXT DEFAULT 'active', -- 'active', 'wip', 'archived'
    screenshots TEXT, -- JSON array of R2 keys
    technologies TEXT, -- JSON array of tech used
    featured INTEGER DEFAULT 0,
    sort_order INTEGER DEFAULT 0,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Pages table (for blog posts and custom pages)
CREATE TABLE IF NOT EXISTS pages (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    content TEXT NOT NULL, -- Markdown or rich text
    page_type TEXT DEFAULT 'page', -- 'page', 'blog', 'project-detail'
    excerpt TEXT,
    cover_image TEXT, -- R2 key
    published INTEGER DEFAULT 0,
    published_at TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Site settings table
CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TEXT DEFAULT CURRENT_TIMESTAMP
);

-- Sessions table for Ave auth
CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    identity_id TEXT NOT NULL,
    handle TEXT,
    access_token TEXT,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    expires_at TEXT NOT NULL
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_blocks_page ON blocks(page_id);
CREATE INDEX IF NOT EXISTS idx_blocks_sort ON blocks(page_id, sort_order);
CREATE INDEX IF NOT EXISTS idx_projects_sort ON projects(sort_order);
CREATE INDEX IF NOT EXISTS idx_projects_featured ON projects(featured);
CREATE INDEX IF NOT EXISTS idx_pages_type ON pages(page_type);
CREATE INDEX IF NOT EXISTS idx_pages_published ON pages(published);
CREATE INDEX IF NOT EXISTS idx_sessions_identity ON sessions(identity_id);
