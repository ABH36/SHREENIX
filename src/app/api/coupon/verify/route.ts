// src/app/api/coupon/verify/route.ts
export const runtime = "nodejs";

import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../../lib/db';
import Coupon from '../../../../models/Coupon';

// POST: Verify coupon (Public route)
export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const { code } = await req.json();

    if (!code) {
      return NextResponse.json(
        { success: false, message: 'Coupon code is required' },
        { status: 400 }
      );
    }

    // Find coupon
    const coupon = await Coupon.findOne({
      code: code.toUpperCase(),
      isActive: true
    });

    if (!coupon) {
      return NextResponse.json(
        { success: false, message: 'Invalid or inactive coupon' },
        { status: 404 }
      );
    }

    // Check if expired
    if (coupon.validUntil && new Date() > coupon.validUntil) {
      return NextResponse.json(
        { success: false, message: 'Coupon has expired' },
        { status: 400 }
      );
    }

    // Check usage limit
    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return NextResponse.json(
        { success: false, message: 'Coupon usage limit reached' },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      code: coupon.code,
      discount: coupon.discountAmount,
      discountType: coupon.discountType,
      message: 'Coupon applied successfully'
    });

  } catch (error) {
    console.error('Coupon verification error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to verify coupon' },
      { status: 500 }
    );
  }
}