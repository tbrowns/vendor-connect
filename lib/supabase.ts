import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "https://jldfgdbxqdlhjbqfreyc.supabase.co";
const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpsZGZnZGJ4cWRsaGpicWZyZXljIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzA5NTQ0NTUsImV4cCI6MjA0NjUzMDQ1NX0.alnJP0hooA1pjGJDqF6w-0g2tlQRJoLwZSein8lPE0g";

// Optional: Add runtime check if you want to prevent client creation with empty values
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
