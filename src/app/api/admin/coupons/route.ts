// src/app/api/admin/coupons/route.ts
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextRequest, NextResponse } from 'next/server';
import { getAdminUser } from '../../../../lib/auth';
import dbConnect from '../../../../lib/db';
import Coupon from '../../../../models/Coupon';

// GET: Fetch all coupons (Admin only)
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

    const coupons = await Coupon.find()
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      coupons
    });

  } catch (error) {
    console.error('Coupons fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch coupons' },
      { status: 500 }
    );
  }
}

// POST: Create new coupon (Admin only)
export async function POST(req: NextRequest) {
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

    const body = await req.json();
    const { code, discountAmount } = body;

    // Validation
    if (!code || !discountAmount) {
      return NextResponse.json(
        { success: false, error: 'Code and discount amount are required' },
        { status: 400 }
      );
    }

    // Check if coupon already exists
    const existing = await Coupon.findOne({ code: code.toUpperCase() });
    if (existing) {
      return NextResponse.json(
        { success: false, error: 'Coupon code already exists' },
        { status: 400 }
      );
    }

    // Create coupon
    const coupon = await Coupon.create({
      code: code.toUpperCase(),
      discountAmount: Number(discountAmount),
      isActive: true
    });

    return NextResponse.json({
      success: true,
      coupon,
      message: 'Coupon created successfully'
    });

  } catch (error: any) {
    console.error('Coupon creation error:', error);

    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, error: 'Coupon code already exists' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to create coupon' },
      { status: 500 }
    );
  }
}

// DELETE: Delete coupon (Admin only)
export async function DELETE(req: NextRequest) {
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

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Coupon ID is required' },
        { status: 400 }
      );
    }

    await Coupon.findByIdAndDelete(id);

    return NextResponse.json({
      success: true,
      message: 'Coupon deleted successfully'
    });

  } catch (error) {
    console.error('Coupon deletion error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete coupon' },
      { status: 500 }
    );
  }
}