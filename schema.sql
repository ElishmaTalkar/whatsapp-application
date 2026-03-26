-- Create businesses table
CREATE TABLE IF NOT EXISTS businesses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    use_case TEXT,
    prompt_instruction TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create meta_connections table
CREATE TABLE IF NOT EXISTS meta_connections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
    platform TEXT NOT NULL CHECK (platform IN ('whatsapp', 'instagram')),
    access_token TEXT NOT NULL,
    phone_number_id TEXT, -- For WhatsApp
    waba_id TEXT, -- For WhatsApp
    page_id TEXT, -- For Instagram
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create messages table for logging
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,
    customer_id TEXT NOT NULL,
    platform TEXT NOT NULL,
    incoming_payload JSONB NOT NULL,
    ai_response TEXT,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS (though for this demo we might keep it simple or use Service Role)
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE meta_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Basic policies (placeholder)
CREATE POLICY "Allow all for now" ON businesses FOR ALL USING (true);
CREATE POLICY "Allow all for now" ON meta_connections FOR ALL USING (true);
CREATE POLICY "Allow all for now" ON messages FOR ALL USING (true);
