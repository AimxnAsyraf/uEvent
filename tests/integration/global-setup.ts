import { execSync } from 'node:child_process';
import type { TestProject } from 'vitest/node';

export type LocalSupabase = { url: string; anonKey: string; serviceRoleKey: string; dbUrl: string };

declare module 'vitest' {
  export interface ProvidedContext {
    supabase: LocalSupabase;
  }
}

function readLocalSupabase(): LocalSupabase {
  let status: Record<string, string>;
  try {
    status = JSON.parse(
      execSync('npx supabase status -o json', { stdio: ['ignore', 'pipe', 'ignore'] }).toString(),
    );
  } catch {
    throw new Error('Local Supabase is not running. Run npm run db:start first.');
  }
  return {
    url: status.API_URL,
    anonKey: status.ANON_KEY,
    serviceRoleKey: status.SERVICE_ROLE_KEY,
    dbUrl: status.DB_URL,
  };
}

export default async function globalSetup(project: TestProject) {
  const local = readLocalSupabase();
  try {
    await fetch(`${local.url}/auth/v1/health`, { signal: AbortSignal.timeout(3000) });
  } catch {
    throw new Error(`Local Supabase is not reachable at ${local.url}. Run npm run db:start first.`);
  }
  project.provide('supabase', local);
}
