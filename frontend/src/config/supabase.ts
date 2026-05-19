/// <reference types="vite/client" />
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnon = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

/**
 * Validation block to ensure critical environment variables are present.
 * Throws an explicit error at runtime if the configuration is missing,
 * preventing the application from failing silently.
 */
if (!supabaseUrl || !supabaseAnon) {
  throw new Error(
    "Missing Supabase env vars.\n" +
      "Create a .env file with VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY",
  );
}

/**
 * The initialized Supabase client instance used to interact with the database,
 * authentication, and storage services throughout the application.
 * 
 * Configuration options:
 * - persistSession: Automatically saves the user session in local storage.
 * - autoRefreshToken: Automatically refreshes the authentication token before expiration.
 * - detectSessionInUrl: Automatically detects tokens in the URL hash (useful for OAuth redirects).
 */
export const supabase = createClient(supabaseUrl, supabaseAnon, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

/**
 * Re-exports User and Session types from the Supabase SDK
 * to provide strict type safety across the application components.
 */
export type { User, Session } from "@supabase/supabase-js";
