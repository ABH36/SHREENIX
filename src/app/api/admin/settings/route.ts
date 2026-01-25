// src/app/api/admin/settings/route.ts
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextRequest, NextResponse } from 'next/server';
import { getAdminUser } from '../../../../lib/auth';
import dbConnect from '../../../../lib/db';
import Settings from '../../../../models/Settings';

// GET: Fetch settings (Public for contact info)
export async function GET() {
  try {
    await dbConnect();

    let settings = await Settings.findOne().lean();

    if (!settings) {
      // Create default settings
      settings = await Settings.create({
        phone: '9630703732',
        email: 'shreenix.care@gmail.com',
        address: 'Indore, Madhya Pradesh'
      });
    }

    return NextResponse.json({
      success: true,
      config: settings
    });

  } catch (error) {
    console.error('Settings fetch error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

// PUT: Update settings (Admin only)
export async function PUT(req: NextRequest) {
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

    // Update or create settings
    const settings = await Settings.findOneAndUpdate(
      {},
      body,
      {
        new: true,
        upsert: true,
        runValidators: true
      }
    );

    return NextResponse.json({
      success: true,
      config: settings,
      message: 'Settings updated successfully'
    });

  } catch (error: any) {
    console.error('Settings update error:', error);

    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to update settings' },
      { status: 500 }
    );
  }
}