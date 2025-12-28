export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";

const getDb = async () => {
  const dbConnect = (await import("../../../../lib/db")).default;
  const Order = (await import("../../../../models/Order")).default;
  await dbConnect();
  return { Order };
};

export async function GET() {
  try {
    const { Order } = await getDb();

    const orders = await Order.find({})
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ success: true, orders });
  } catch {
    return NextResponse.json(
      { success: false, message: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
