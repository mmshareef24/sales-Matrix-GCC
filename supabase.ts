import { createClient } from '@supabase/supabase-js';

// Use process.env for environment variable access to resolve TypeScript "Property 'env' does not exist on type 'ImportMeta'" errors.
// These are provided by the execution context and align with standard environment variable access.
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://qwmyimzotogxcwiaorwp.supabase.co';
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF3bXlpbXpvdG9neGN3aWFvcndwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk5MzM0MzUsImV4cCI6MjA4NTUwOTQzNX0.u9xFZQhYCDis7k-_qS3fqKFeUW8Y6fMWVbx0Do_YRdI';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

/**
 * Probes the database connection by performing a lightweight head request.
 */
export const checkConnection = async () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    return { connected: false, error: 'Missing Supabase credentials.' };
  }
  try {
    // Attempting a simple query to verify the connection.
    // We check count of journal_entries as a connectivity smoke test.
    const { data, error } = await supabase.from('journal_entries').select('count', { count: 'exact', head: true }).limit(1);
    
    // PGRST116: no rows, 42P01: table does not exist. 
    // Both indicate connectivity is live even if schema is partially missing.
    if (error && error.code !== 'PGRST116' && error.code !== '42P01') {
      throw error;
    }
    
    return { connected: true, error: null };
  } catch (err: any) {
    return { connected: false, error: err.message };
  }
};