import { NextRequest, NextResponse } from 'next/server'

async function getSessionToken(): Promise<string> {
  const password = process.env.ADMIN_PASSWORD ?? 'changeme'
  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  )
  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    encoder.encode('connan-admin-v1'),
  )
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

// POST /api/auth — login
export async function POST(request: NextRequest) {
  const body = await request.json()
  const { password } = body as { password: string }

  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Mot de passe incorrect.' }, { status: 401 })
  }

  const token = await getSessionToken()
  const response = NextResponse.json({ ok: true })
  response.cookies.set('admin_session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30, // 30 jours
    path: '/',
  })
  return response
}

// DELETE /api/auth — logout
export async function DELETE() {
  const response = NextResponse.json({ ok: true })
  response.cookies.set('admin_session', '', {
    maxAge: 0,
    path: '/',
  })
  return response
}
