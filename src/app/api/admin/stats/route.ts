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
    const users = db.users.filter(u => u.role === 'user');
    const totalRevenue = db.orders.reduce((sum, o) => sum + o.totalPrice, 0);
    const pendingOrders = db.orders.filter(o => o.status === 'Pending').length;

    // Orders by status
    const ordersByStatus: Record<string, number> = {};
    db.orders.forEach(o => {
      ordersByStatus[o.status] = (ordersByStatus[o.status] || 0) + 1;
    });

    // Revenue by month
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const revenueByMonth: { month: string; revenue: number }[] = [];
    const now = new Date();
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const monthRevenue = db.orders
        .filter(o => o.createdAt.startsWith(monthKey))
        .reduce((sum, o) => sum + o.totalPrice, 0);
      revenueByMonth.push({ month: monthNames[d.getMonth()], revenue: monthRevenue });
    }

    // Recent orders (last 5)
    const recentOrders = [...db.orders]
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5)
      .map(o => ({
        id: o.id,
        userName: o.userName,
        totalPrice: o.totalPrice,
        status: o.status,
        createdAt: o.createdAt,
      }));

    return NextResponse.json({
      totalUsers: users.length,
      totalProducts: db.products.length,
      totalOrders: db.orders.length,
      pendingOrders,
      totalRevenue,
      ordersByStatus,
      revenueByMonth,
      recentOrders,
    });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
