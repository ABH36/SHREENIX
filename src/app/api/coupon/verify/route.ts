export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";

const getDb = async () => {
  const dbConnect = (await import("../../../../lib/db")).default;
  const Coupon = (await import("../../../../models/Coupon")).default;
  await dbConnect();
  return { Coupon };
};

export async function POST(req: Request) {
  try {
    const { Coupon } = await getDb();
    const { code } = await req.json();

    if (!code) {
      return NextResponse.json(
        { success: false, message: "Coupon code required" },
        { status: 400 }
      );
    }

    const coupon = await Coupon.findOne({ code: code.toUpperCase() });

    if (!coupon || !coupon.isActive) {
      return NextResponse.json(
        { success: false, message: "Invalid or expired coupon" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      discount: coupon.discountAmount,
      code: coupon.code,
    });
  } catch {
    return NextResponse.json(
      { success: false, message: "Error checking coupon" },
      { status: 500 }
    );
  }
}
