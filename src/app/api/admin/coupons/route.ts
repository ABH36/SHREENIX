export const runtime = "nodejs";
export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { default: dbConnect } = await import("../../../../lib/db");
    const { default: Coupon } = await import("../../../../models/Coupon");
    await dbConnect();

    const coupons = await Coupon.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, coupons });
  } catch {
    return NextResponse.json({ success: false, coupons: [] });
  }
}

export async function POST(req: Request) {
  try {
    const { default: dbConnect } = await import("../../../../lib/db");
    const { default: Coupon } = await import("../../../../models/Coupon");
    await dbConnect();

    const { code, discountAmount } = await req.json();
    if (!code || !discountAmount) {
      return NextResponse.json({ success: false, error: "All fields required" }, { status: 400 });
    }

    const existing = await Coupon.findOne({ code: code.toUpperCase() });
    if (existing) {
      return NextResponse.json({ success: false, error: "Coupon code already exists" }, { status: 400 });
    }

    const coupon = await Coupon.create({
      code: code.toUpperCase(),
      discountAmount: Number(discountAmount),
    });

    return NextResponse.json({ success: true, coupon });
  } catch {
    return NextResponse.json({ success: false, error: "Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { default: dbConnect } = await import("../../../../lib/db");
    const { default: Coupon } = await import("../../../../models/Coupon");
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ success: false, error: "ID missing" });

    await Coupon.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, error: "Delete Failed" }, { status: 500 });
  }
}
