// src/app/api/admin/customers/route.ts
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextRequest, NextResponse } from 'next/server';
import { getAdminUser } from '../../../../lib/auth';
import dbConnect from '../../../../lib/db';
import Order from '../../../../models/Order';

// GET: Fetch customer analytics (Admin only)
export async function GET(req: NextRequest) {
  try {
    // Auth check
    const user = await getAdminUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    // Aggregate customer data from orders
    const customerData = await Order.aggregate([
      {
        $group: {
          _id: '$customerDetails.phone',
          name: { $first: '$customerDetails.name' },
          city: { $first: '$customerDetails.city' },
          totalOrders: { $sum: 1 },
          totalSpent: { $sum: '$totalPrice' },
          lastOrderDate: { $max: '$createdAt' }
        }
      },
      {
        $sort: { totalSpent: -1 }
      },
      {
        $limit: 500
      }
    ]);

    const customers = customerData.map(c => ({
      _id: c._id,
      name: c.name,
      city: c.city,
      totalOrders: c.totalOrders,
      totalSpent: c.totalSpent,
      lastOrderDate: c.lastOrderDate
    }));

    return NextResponse.json({
      success: true,
      customers
    });

  } catch (error) {
    console.error('Customers fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch customers' },
      { status: 500 }
    );
  }
}