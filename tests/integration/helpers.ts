import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import pg from 'pg';
import { createAdminClient } from '@/lib/supabase/admin';
import type { Database } from '@/lib/database.types';

export const TEST_PASSWORD = 'test-password-123';

const APP_TABLES = [
  'notifications',
  'event_reports',
  'change_requests',
  'event_history',
  'event_attachments',
  'events',
  'invitations',
  'club_members',
  'clubs',
  'profiles',
];

/** Empties every app table and auth user, then restores default settings. */
export async function resetDb(): Promise<void> {
  const client = new pg.Client({ connectionString: process.env.SUPABASE_DB_URL });
  await client.connect();
  try {
    await client.query(`truncate ${APP_TABLES.map((t) => `public.${t}`).join(', ')} cascade`);
    await client.query('delete from auth.users');
    await client.query(
      `insert into public.settings (key, value) values ('min_notice_days', 3), ('report_due_days', 14)
       on conflict (key) do update set value = excluded.value`,
    );
  } finally {
    await client.end();
  }
}

/** Creates a confirmed auth user. Throws when the database refuses the account. */
export async function makeUser(
  email: string,
  opts: { srcAdmin?: boolean; fullName?: string } = {},
): Promise<{ id: string; email: string }> {
  const admin = createAdminClient();
  const { data, error } = await admin.auth.admin.createUser({
    email,
    password: TEST_PASSWORD,
    email_confirm: true,
    user_metadata: { full_name: opts.fullName ?? email.split('@')[0] },
  });
  if (error || !data.user) throw new Error(`makeUser(${email}) failed: ${error?.message}`);
  if (opts.srcAdmin) {
    const { error: e } = await admin.from('profiles').update({ is_src_admin: true }).eq('id', data.user.id);
    if (e) throw new Error(e.message);
  }
  return { id: data.user.id, email: data.user.email! };
}

export async function makeClub(name: string, presidentId: string): Promise<{ id: string }> {
  const admin = createAdminClient();
  const { data, error } = await admin.from('clubs').insert({ name, description: '' }).select('id').single();
  if (error) throw new Error(error.message);
  const { error: e } = await admin
    .from('club_members')
    .insert({ club_id: data.id, user_id: presidentId, role: 'president', can_submit: true });
  if (e) throw new Error(e.message);
  return { id: data.id };
}

export async function addMember(clubId: string, userId: string, opts: { canSubmit?: boolean } = {}): Promise<void> {
  const { error } = await createAdminClient()
    .from('club_members')
    .insert({ club_id: clubId, user_id: userId, role: 'committee', can_submit: opts.canSubmit ?? false });
  if (error) throw new Error(error.message);
}

/** A client signed in as the given user, so row level security applies. */
export async function clientFor(userId: string): Promise<SupabaseClient<Database>> {
  const { data, error } = await createAdminClient().auth.admin.getUserById(userId);
  if (error || !data.user?.email) throw new Error(`clientFor(${userId}): ${error?.message}`);
  const client = anonClient();
  const { error: signInError } = await client.auth.signInWithPassword({
    email: data.user.email,
    password: TEST_PASSWORD,
  });
  if (signInError) throw new Error(signInError.message);
  return client;
}

export function anonClient(): SupabaseClient<Database> {
  return createClient<Database>(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
