export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";

const getDb = async () => {
  const dbConnect = (await import("../../../../lib/db")).default;
  const Order = (await import("../../../../models/Order")).default;
  await dbConnect();
  return { Order };
};

export async function PUT(req: Request) {
  try {
    const { Order } = await getDb();
    const { orderId, status } = await req.json();

    if (!orderId || !status) {
      return NextResponse.json(
        { success: false, message: "Missing parameters" },
        { status: 400 }
      );
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { orderStatus: status },
      { new: true, runValidators: true }
    ).lean();

    if (!updatedOrder) {
      return NextResponse.json(
        { success: false, message: "Order not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, order: updatedOrder });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
