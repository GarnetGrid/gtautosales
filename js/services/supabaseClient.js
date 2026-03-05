// ============================================================
//  Supabase Client — GT Auto Sales
//  CDN import for static site (no build tool)
//  Anon key is safe for frontend — RLS enforces security
//  Config loaded from gt-config.js (not hardcoded)
// ============================================================

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../gt-config.js';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
