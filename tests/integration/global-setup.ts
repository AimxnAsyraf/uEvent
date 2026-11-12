const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'http://127.0.0.1:54321';

export default async function globalSetup() {
  try {
    await fetch(`${SUPABASE_URL}/auth/v1/health`, { signal: AbortSignal.timeout(3000) });
  } catch {
    throw new Error(
      `Local Supabase is not reachable at ${SUPABASE_URL}. Run npm run db:start first.`,
    );
  }
}
