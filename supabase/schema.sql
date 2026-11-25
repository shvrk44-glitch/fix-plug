-- ==============================================================================
-- FIX-PLUG Supabase Production Database Schema & Security Policies
-- Location: Kano, Nigeria | Purpose: Verified Trades & Artisan Marketplace
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Customer Requests Table
CREATE TABLE IF NOT EXISTS public.customer_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW()),
    name VARCHAR(150) NOT NULL,
    phone VARCHAR(35) NOT NULL,
    area VARCHAR(100) NOT NULL,
    trade VARCHAR(80) NOT NULL,
    description TEXT NOT NULL,
    preferred_time VARCHAR(100),
    status VARCHAR(50) NOT NULL DEFAULT 'pending', -- pending, contacted, dispatched, completed, cancelled
    dispatch_notes TEXT,
    assigned_artisan_id UUID,
    source VARCHAR(50) DEFAULT 'web'
);

-- 3. Artisan Applications Table
CREATE TABLE IF NOT EXISTS public.artisan_applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW()),
    name VARCHAR(150) NOT NULL,
    phone VARCHAR(35) NOT NULL,
    trade VARCHAR(80) NOT NULL,
    area VARCHAR(100) NOT NULL,
    experience VARCHAR(100) NOT NULL,
    certification VARCHAR(200),
    status VARCHAR(50) NOT NULL DEFAULT 'under_review', -- under_review, assessment_scheduled, vetted_active, rejected
    guarantor_name VARCHAR(150),
    guarantor_phone VARCHAR(35),
    id_type VARCHAR(50), -- NIN, Voter Card, Driver License (checked in person)
    vetting_notes TEXT,
    vetted_by VARCHAR(100),
    vetted_at TIMESTAMPTZ
);

-- 4. General Contact / Partnership Inquiries Table
CREATE TABLE IF NOT EXISTS public.contact_inquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT TIMEZONE('utc', NOW()),
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150),
    phone VARCHAR(35),
    category VARCHAR(80) DEFAULT 'general', -- general, estate_partner, press, artisan_lead
    message TEXT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'unread'
);

-- 5. Performance Indexes
CREATE INDEX IF NOT EXISTS idx_customer_requests_status ON public.customer_requests(status);
CREATE INDEX IF NOT EXISTS idx_customer_requests_created ON public.customer_requests(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_customer_requests_phone ON public.customer_requests(phone);

CREATE INDEX IF NOT EXISTS idx_artisan_apps_status ON public.artisan_applications(status);
CREATE INDEX IF NOT EXISTS idx_artisan_apps_created ON public.artisan_applications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_artisan_apps_phone ON public.artisan_applications(phone);

-- 6. Row Level Security (RLS) Configuration
ALTER TABLE public.customer_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artisan_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_inquiries ENABLE ROW LEVEL SECURITY;

-- Anonymous users (public landing page visitors) can insert new requests:
CREATE POLICY "Public can submit customer requests"
    ON public.customer_requests
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

CREATE POLICY "Public can submit artisan applications"
    ON public.artisan_applications
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

CREATE POLICY "Public can submit contact inquiries"
    ON public.contact_inquiries
    FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- Authenticated Dashboard / Admins can view and update all records:
CREATE POLICY "Admin full access to customer requests"
    ON public.customer_requests
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Admin full access to artisan applications"
    ON public.artisan_applications
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

CREATE POLICY "Admin full access to contact inquiries"
    ON public.contact_inquiries
    FOR ALL
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- 7. Trigger to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_customer_requests_modtime
    BEFORE UPDATE ON public.customer_requests
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();

CREATE TRIGGER update_artisan_applications_modtime
    BEFORE UPDATE ON public.artisan_applications
    FOR EACH ROW
    EXECUTE FUNCTION update_modified_column();
