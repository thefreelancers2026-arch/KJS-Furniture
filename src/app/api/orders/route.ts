import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { readDb, writeDb } from '@/lib/db';
import { verifyToken, getTokenFromHeaders } from '@/lib/auth';

export async function GET(req: NextRequest) {
  try {
    const token = getTokenFromHeaders(req.headers);
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

    const db = readDb();

    if (decoded.role === 'admin') {
      return NextResponse.json({ orders: db.orders });
    }

    const userOrders = db.orders.filter(o => o.userId === decoded.id);
    return NextResponse.json({ orders: userOrders });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const token = getTokenFromHeaders(req.headers);
    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const decoded = verifyToken(token);
    if (!decoded) return NextResponse.json({ error: 'Invalid token' }, { status: 401 });

    const { items, address, landmark } = await req.json();

    if (!items || items.length === 0 || !address) {
      return NextResponse.json({ error: 'Items and address are required' }, { status: 400 });
    }

    const db = readDb();
    const user = db.users.find(u => u.id === decoded.id);
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 });

    const orderItems = items.map((item: { productId: string; quantity: number }) => {
      const product = db.products.find(p => p.id === item.productId);
      return {
        productId: item.productId,
        productName: product?.name || 'Unknown',
        productImage: product?.image || '',
        price: product?.price || 0,
        quantity: item.quantity,
      };
    });

    const totalPrice = orderItems.reduce((sum: number, item: { price: number; quantity: number }) => sum + item.price * item.quantity, 0);

    const orderId = 'KGS-' + Date.now().toString(36).toUpperCase() + '-' + uuidv4().slice(0, 4).toUpperCase();

    const newOrder = {
      id: orderId,
      userId: decoded.id,
      userName: user.name,
      userPhone: user.phone,
      address,
      landmark: landmark || '',
      items: orderItems,
      totalPrice,
      status: 'Pending' as const,
      createdAt: new Date().toISOString(),
    };

    db.orders.push(newOrder);
    writeDb(db);

    return NextResponse.json({ order: newOrder }, { status: 201 });
  } catch {
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
