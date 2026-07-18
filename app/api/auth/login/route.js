import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { query } from '../../../../lib/db';
import { signAdminToken, sessionCookieOptions, SESSION_COOKIE } from '../../../../lib/auth';

export async function POST(request) {
  const body = await request.json().catch(() => null);

  if (!body?.username || !body?.password) {
    return NextResponse.json({ error: 'Username and password are required.' }, { status: 400 });
  }

  const { rows } = await query('SELECT * FROM admins WHERE username = $1', [body.username]);
  const admin = rows[0];

  if (!admin || !bcrypt.compareSync(body.password, admin.password_hash)) {
    return NextResponse.json({ error: 'Invalid username or password.' }, { status: 401 });
  }

  const token = await signAdminToken({ sub: admin.id, username: admin.username });

  const response = NextResponse.json({ ok: true });
  response.cookies.set(SESSION_COOKIE, token, sessionCookieOptions);
  return response;
}
