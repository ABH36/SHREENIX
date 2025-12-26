import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/db';
import Coupon from '../../../../models/Coupon';

// GET: All Coupons
export async function GET() {
  try {
    await dbConnect();
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    return NextResponse.json({ success: true, coupons });
  } catch {
    return NextResponse.json({ success: false, coupons: [] }, { status: 500 });
  }
}

// POST: Create Coupon
export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();

    const coupon = await Coupon.create({
      code: body.code.toUpperCase(),
      discountAmount: body.discountAmount,
      isActive: true
    });

    return NextResponse.json({ success: true, coupon }, { status: 201 });
  } catch {
    return NextResponse.json(
      { success: false, error: 'Code already exists or invalid' },
      { status: 400 }
    );
  }
}

// DELETE: Remove Coupon
export async function DELETE(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, message: 'Missing coupon ID' }, { status: 400 });
    }

    await Coupon.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
