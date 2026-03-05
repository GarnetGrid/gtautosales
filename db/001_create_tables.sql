-- ============================================================
--  GT Auto Sales — Local PostgreSQL Schema
--  Migration: 001_create_tables
--  Run: psql -U garnet -d gtautosales -f 001_create_tables.sql
-- ============================================================
-- 1. Vehicles (Inventory)
CREATE TABLE IF NOT EXISTS vehicles (
    id SERIAL PRIMARY KEY,
    make VARCHAR(100) NOT NULL,
    model VARCHAR(200) NOT NULL,
    year INTEGER NOT NULL,
    price NUMERIC(12, 2) NOT NULL,
    mileage INTEGER DEFAULT 0,
    type VARCHAR(50) DEFAULT 'Sedan',
    image TEXT DEFAULT '',
    featured BOOLEAN DEFAULT FALSE,
    description TEXT DEFAULT '',
    engine VARCHAR(100) DEFAULT '',
    transmission VARCHAR(100) DEFAULT '',
    drivetrain VARCHAR(50) DEFAULT '',
    color VARCHAR(100) DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
-- 2. Upcoming Vehicles  
CREATE TABLE IF NOT EXISTS upcoming_vehicles (
    id SERIAL PRIMARY KEY,
    make VARCHAR(100) NOT NULL,
    model VARCHAR(200) NOT NULL,
    year INTEGER NOT NULL,
    price NUMERIC(12, 2) NOT NULL,
    arrival VARCHAR(100) DEFAULT '',
    image TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW()
);
-- 3. Leads (CRM)
CREATE TABLE IF NOT EXISTS leads (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) DEFAULT '',
    last_name VARCHAR(100) DEFAULT '',
    email VARCHAR(255),
    phone VARCHAR(50),
    vehicle_interest VARCHAR(200),
    budget_low NUMERIC(12, 2),
    budget_high NUMERIC(12, 2),
    trade_in VARCHAR(50),
    source VARCHAR(50) DEFAULT 'web',
    stage VARCHAR(50) DEFAULT 'new',
    temperature VARCHAR(50) DEFAULT 'warm',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
-- Indexes
CREATE INDEX IF NOT EXISTS idx_vehicles_featured ON vehicles(featured)
WHERE featured = TRUE;
CREATE INDEX IF NOT EXISTS idx_vehicles_type ON vehicles(type);
CREATE INDEX IF NOT EXISTS idx_vehicles_make ON vehicles(make);
CREATE INDEX IF NOT EXISTS idx_leads_stage ON leads(stage);
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
-- Updated_at trigger
CREATE OR REPLACE FUNCTION update_modified_column() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = NOW();
RETURN NEW;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER vehicles_updated_at BEFORE
UPDATE ON vehicles FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER leads_updated_at BEFORE
UPDATE ON leads FOR EACH ROW EXECUTE FUNCTION update_modified_column();