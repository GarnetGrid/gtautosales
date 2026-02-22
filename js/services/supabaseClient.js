// ============================================================
//  Supabase Client — GT Auto Sales
//  CDN import for static site (no build tool)
//  Anon key is safe for frontend — RLS enforces security
// ============================================================

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = 'https://fmcqefjxdpwtxskdhtgk.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZtY3FlZmp4ZHB3dHhza2RodGdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzExNDIxNDMsImV4cCI6MjA4NjcxODE0M30.r7qXVfd3zRkzxjbJKjhhDhdKSrXFrSKLODVOOnMBhJQ';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
