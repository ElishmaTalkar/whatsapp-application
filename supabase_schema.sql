-- Supabase Schema for WhatsApp AI Application

-- Businesses Table
CREATE TABLE IF NOT EXISTS businesses (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    use_case TEXT,
    prompt_instruction TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Meta Connections Table
CREATE TABLE IF NOT EXISTS meta_connections (
    id TEXT PRIMARY KEY,
    business_id TEXT REFERENCES businesses(id) ON DELETE CASCADE,
    platform TEXT NOT NULL,
    access_token TEXT NOT NULL,
    phone_number_id TEXT,
    waba_id TEXT,
    page_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Messages Table
CREATE TABLE IF NOT EXISTS messages (
    id TEXT PRIMARY KEY,
    business_id TEXT REFERENCES businesses(id) ON DELETE CASCADE,
    customer_id TEXT NOT NULL,
    platform TEXT NOT NULL,
    incoming_payload TEXT NOT NULL,
    ai_response TEXT,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Leads Table
CREATE TABLE IF NOT EXISTS leads (
    id TEXT PRIMARY KEY,
    business_id TEXT REFERENCES businesses(id) ON DELETE CASCADE,
    phone_number TEXT NOT NULL,
    name TEXT,
    last_interaction TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(business_id, phone_number)
);

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (Initial setup: Allow everything for now, or you can refine later)
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE meta_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Simple permissive policies (Note: In production you should restrict these)
CREATE POLICY "Allow all for now" ON businesses FOR ALL USING (true);
CREATE POLICY "Allow all for now" ON meta_connections FOR ALL USING (true);
CREATE POLICY "Allow all for now" ON messages FOR ALL USING (true);
CREATE POLICY "Allow all for now" ON leads FOR ALL USING (true);
CREATE POLICY "Allow all for now" ON users FOR ALL USING (true);
