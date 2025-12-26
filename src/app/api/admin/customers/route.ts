import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/db';
import Order from '../../../../models/Order';

export async function GET() {
  try {
    await dbConnect();

    const customers = await Order.aggregate([
      {
        $group: {
          _id: "$customerDetails.phone",
          name: { $first: "$customerDetails.name" },
          city: { $first: "$customerDetails.city" },
          address: { $first: "$customerDetails.address" },
          totalOrders: { $sum: 1 },
          totalSpent: { $sum: "$totalPrice" },
          lastOrderDate: { $max: "$createdAt" }
        }
      },
      { $sort: { lastOrderDate: -1 } }
    ]);

    return NextResponse.json({ success: true, customers });

  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: "Failed to load customers" },
      { status: 500 }
    );
  }
}
