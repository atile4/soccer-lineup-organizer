// app/api/supabase-token/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebase-admin';
import { sign } from 'jsonwebtoken';

export async function POST(req: NextRequest) {
  try {
    const { firebaseToken } = await req.json();

    if (!firebaseToken) {
      return NextResponse.json({ error: 'Missing token' }, { status: 400 });
    }

    // Verify the Firebase token is legit
    const decoded = await adminAuth.verifyIdToken(firebaseToken);

    // Mint a Supabase-compatible JWT using the same user ID
    const supabaseToken = sign(
      {
        sub: decoded.uid,       // this becomes auth.uid() in RLS
        role: 'authenticated',
      },
      process.env.SUPABASE_JWT_SECRET!,
      { expiresIn: '1h' }
    );

    return NextResponse.json({ supabaseToken });
  } catch (err) {
    console.error('Token exchange failed:', err);
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
}