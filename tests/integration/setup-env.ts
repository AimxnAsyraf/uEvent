import { inject } from 'vitest';

// Point the app's server code at the local Supabase stack.
const local = inject('supabase');
process.env.NEXT_PUBLIC_SUPABASE_URL = local.url;
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = local.anonKey;
process.env.SUPABASE_SERVICE_ROLE_KEY = local.serviceRoleKey;
process.env.SUPABASE_DB_URL = local.dbUrl;
