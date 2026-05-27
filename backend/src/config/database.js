/**
 * database.js
 * Creates and exports a single Supabase client instance using the
 * service role key, which bypasses Row Level Security (RLS) and
 * gives the backend full read/write access to all tables.
 *
 * Only import this in repository files — never directly in routes,
 * controllers, or services.
 */

const { createClient } = require('@supabase/supabase-js');
const config = require('./env');

// Create the Supabase client with the service role key.
// The service role key is secret — never expose it on the frontend.
const supabase = createClient(
  config.supabase.url,
  config.supabase.serviceRoleKey,
  {
    auth: {
      // We manage our own JWT auth — disable Supabase's built-in auth session
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

module.exports = supabase;
