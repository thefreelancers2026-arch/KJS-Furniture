import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { readDb, writeDb } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const { phone, newPassword } = await req.json();

    if (!phone || !newPassword) {
      return NextResponse.json({ error: 'Phone and new password are required' }, { status: 400 });
    }

    const db = readDb();
    const userIndex = db.users.findIndex(u => u.phone === phone);
    
    if (userIndex === -1) {
      return NextResponse.json({ error: 'No account found with this phone number' }, { status: 404 });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    db.users[userIndex].password = hashedPassword;
    writeDb(db);

    return NextResponse.json({ message: 'Password updated successfully' }, { status: 200 });
  } catch (error: any) {
    console.error('Reset error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
