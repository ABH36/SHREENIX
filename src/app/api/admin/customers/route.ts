export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { default: dbConnect } = await import("../../../../lib/db");
    const { default: Order } = await import("../../../../models/Order");
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
          lastOrderDate: { $max: "$createdAt" },
        },
      },
      { $sort: { lastOrderDate: -1 } },
    ]);

    return NextResponse.json({ success: true, customers });
  } catch {
    return NextResponse.json(
      { success: false, message: "Failed to load customers" },
      { status: 500 }
    );
  }
}
