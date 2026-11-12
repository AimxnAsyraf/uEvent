import { beforeEach, describe, expect, test } from 'vitest';
import { createAdminClient } from '@/lib/supabase/admin';
import { addMember, anonClient, clientFor, makeClub, makeUser, resetDb } from './helpers';

const admin = () => createAdminClient();

async function makeEvent(clubId: string, createdBy: string, status: 'draft' | 'approved', title: string) {
  const { data, error } = await admin()
    .from('events')
    .insert({
      club_id: clubId,
      title,
      description: 'An event',
      starts_at: '2026-12-10T10:00:00Z',
      ends_at: '2026-12-10T12:00:00Z',
      venue: 'Chancellor Hall',
      expected_participants: 100,
      budget: [{ kind: 'expense', label: 'Food', amount: 500 }],
      status,
      created_by: createdBy,
    })
    .select('id')
    .single();
  if (error) throw new Error(error.message);
  return data.id;
}

beforeEach(async () => {
  await resetDb();
});

describe('accounts', () => {
  test('rejects accounts outside utp.edu.my', async () => {
    await expect(makeUser('x@gmail.com')).rejects.toThrow();
    await expect(makeUser('x@utp.edu.my.evil.com')).rejects.toThrow();
    await expect(makeUser('x@sub.utp.edu.my')).rejects.toThrow();
  });

  test('stores email in lower case', async () => {
    const u = await makeUser('Ali_12345@UTP.EDU.MY');
    const { data } = await admin().from('profiles').select('email').eq('id', u.id).single();
    expect(data!.email).toBe('ali_12345@utp.edu.my');
  });

  test('copies the full name from sign-up metadata', async () => {
    const u = await makeUser('siti_22222@utp.edu.my', { fullName: 'Siti Aminah' });
    const { data } = await admin().from('profiles').select('full_name, is_src_admin').eq('id', u.id).single();
    expect(data).toEqual({ full_name: 'Siti Aminah', is_src_admin: false });
  });

  test('settings are seeded with the spec defaults', async () => {
    const { data } = await admin().from('settings').select('key, value').order('key');
    expect(data).toEqual([
      { key: 'min_notice_days', value: 3 },
      { key: 'report_due_days', value: 14 },
    ]);
  });
});

describe('read access', () => {
  test('anonymous visitors see only approved events, without budget', async () => {
    const pres = await makeUser('pres_1@utp.edu.my');
    const club = await makeClub('Robotics Club', pres.id);
    await makeEvent(club.id, pres.id, 'draft', 'Draft event');
    await makeEvent(club.id, pres.id, 'approved', 'Approved event');

    const { data, error } = await anonClient().from('public_events').select('*');
    expect(error).toBeNull();
    expect(data).toHaveLength(1);
    expect(data![0]).toMatchObject({ title: 'Approved event', club_name: 'Robotics Club' });
    expect(Object.keys(data![0])).not.toContain('budget');
    expect(Object.keys(data![0])).not.toContain('status');

    const direct = await anonClient().from('events').select('*');
    expect(direct.data ?? []).toHaveLength(0);
    const clubs = await anonClient().from('clubs').select('*');
    expect(clubs.data ?? []).toHaveLength(0);
  });

  test("a member of another club cannot read a club's events", async () => {
    const pres = await makeUser('pres_1@utp.edu.my');
    const club = await makeClub('Robotics Club', pres.id);
    await makeEvent(club.id, pres.id, 'draft', 'Secret draft');
    const outsider = await makeUser('out_1@utp.edu.my');
    await makeClub('Chess Club', outsider.id);

    const { data } = await (await clientFor(outsider.id)).from('events').select('*');
    expect(data).toHaveLength(0);
  });

  test("members and SRC admins can read a club's events", async () => {
    const pres = await makeUser('pres_1@utp.edu.my');
    const club = await makeClub('Robotics Club', pres.id);
    await makeEvent(club.id, pres.id, 'draft', 'Draft');
    const member = await makeUser('mem_1@utp.edu.my');
    await addMember(club.id, member.id);
    const src = await makeUser('src_1@utp.edu.my', { srcAdmin: true });

    expect((await (await clientFor(member.id)).from('events').select('id')).data).toHaveLength(1);
    expect((await (await clientFor(src.id)).from('events').select('id')).data).toHaveLength(1);
  });

  test('a user reads only their own notifications', async () => {
    const a = await makeUser('a_1@utp.edu.my');
    const b = await makeUser('b_1@utp.edu.my');
    await admin().from('notifications').insert([
      { user_id: a.id, title: 'For A', body: '', link: '/' },
      { user_id: b.id, title: 'For B', body: '', link: '/' },
    ]);
    const { data } = await (await clientFor(a.id)).from('notifications').select('title');
    expect(data).toEqual([{ title: 'For A' }]);
  });
});

describe('write protection', () => {
  test('a signed-in user cannot write events directly', async () => {
    const pres = await makeUser('pres_1@utp.edu.my');
    const club = await makeClub('Robotics Club', pres.id);
    const client = await clientFor(pres.id);

    const insert = await client.from('events').insert({
      club_id: club.id,
      title: 'Sneaky',
      description: '',
      starts_at: '2026-12-10T10:00:00Z',
      ends_at: '2026-12-10T12:00:00Z',
      venue: 'X',
      expected_participants: 1,
      created_by: pres.id,
    });
    expect(insert.error).not.toBeNull();

    const eventId = await makeEvent(club.id, pres.id, 'draft', 'Draft');
    await client.from('events').update({ status: 'approved' }).eq('id', eventId);
    const { data } = await admin().from('events').select('status').eq('id', eventId).single();
    expect(data!.status).toBe('draft');
  });

  test('a user cannot make themselves an SRC admin', async () => {
    const u = await makeUser('u_1@utp.edu.my');
    await (await clientFor(u.id)).from('profiles').update({ is_src_admin: true }).eq('id', u.id);
    const { data } = await admin().from('profiles').select('is_src_admin').eq('id', u.id).single();
    expect(data!.is_src_admin).toBe(false);
  });
});

describe('integrity', () => {
  test('a club cannot have two presidents', async () => {
    const pres = await makeUser('pres_1@utp.edu.my');
    const club = await makeClub('Robotics Club', pres.id);
    const second = await makeUser('pres_2@utp.edu.my');
    const { error } = await admin()
      .from('club_members')
      .insert({ club_id: club.id, user_id: second.id, role: 'president' });
    expect(error).not.toBeNull();
  });

  test('an event must end after it starts', async () => {
    const pres = await makeUser('pres_1@utp.edu.my');
    const club = await makeClub('Robotics Club', pres.id);
    const { error } = await admin().from('events').insert({
      club_id: club.id,
      title: 'Backwards',
      description: '',
      starts_at: '2026-12-10T12:00:00Z',
      ends_at: '2026-12-10T10:00:00Z',
      venue: 'X',
      expected_participants: 1,
      created_by: pres.id,
    });
    expect(error).not.toBeNull();
  });

  test('the same invitation cannot be created twice, including SRC admin invitations', async () => {
    const src = await makeUser('src_1@utp.edu.my', { srcAdmin: true });
    const row = { email: 'new_1@utp.edu.my', club_id: null, role: 'src_admin' as const, invited_by: src.id };
    expect((await admin().from('invitations').insert(row)).error).toBeNull();
    expect((await admin().from('invitations').insert(row)).error).not.toBeNull();
  });

  test('storage buckets exist with the right visibility', async () => {
    const { data } = await admin().storage.listBuckets();
    const buckets = Object.fromEntries((data ?? []).map((b) => [b.id, b.public]));
    expect(buckets).toMatchObject({ attachments: false, posters: true });
  });
});
