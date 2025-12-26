import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/db';
import Order from '../../../../models/Order';

export async function GET() {
  try {
    await dbConnect();

    const orders = await Order.find({})
      .sort({ createdAt: -1 })
      .lean(); // ⚡ Faster + Low memory

    return NextResponse.json({ success: true, orders });
  } catch (error) {
    console.error('Fetch Orders Error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}
