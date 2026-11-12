// Runs before every integration test file. Later tasks add shared env here.
process.env.NEXT_PUBLIC_SUPABASE_URL ??= 'http://127.0.0.1:54321';
