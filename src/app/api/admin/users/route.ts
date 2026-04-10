import { NextRequest, NextResponse } from 'next/server';
import { readDb } from '@/lib/db';
import { verifyToken, getTokenFromHeaders } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const token = getTokenFromHeaders(req.headers);
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const decoded = verifyToken(token);
    if (!decoded || decoded.role !== 'admin') {
      return NextResponse.json({ error: 'Admin access required' }, { status: 403 });
    }

    const db = readDb();
    const users = db.users
      .filter(u => u.role === 'user')
      .map(u => {
        const userOrders = db.orders.filter(o => o.userId === u.id);
        return {
          id: u.id,
          name: u.name,
          phone: u.phone,
          email: u.email,
          orderCount: userOrders.length,
          totalSpent: userOrders.reduce((sum, o) => sum + o.totalPrice, 0),
          createdAt: u.createdAt,
        };
      });

    return NextResponse.json({ users });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
