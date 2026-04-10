import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { readDb, writeDb } from '@/lib/db';
import { signToken } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const { name, phone, email, password } = await req.json();

    if (!name || !phone || !password) {
      return NextResponse.json({ error: 'Name, phone, and password are required' }, { status: 400 });
    }

    const db = readDb();
    const existingUser = db.users.find(u => u.phone === phone);
    if (existingUser) {
      return NextResponse.json({ error: 'Phone number already registered' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      id: uuidv4(),
      name,
      phone,
      email: email || '',
      password: hashedPassword,
      role: 'user' as const,
      createdAt: new Date().toISOString(),
    };

    db.users.push(newUser);
    writeDb(db);

    const token = signToken({ id: newUser.id, role: newUser.role });

    return NextResponse.json({
      token,
      user: { id: newUser.id, name: newUser.name, phone: newUser.phone, email: newUser.email, role: newUser.role },
    });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
