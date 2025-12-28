export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/db';
import SiteConfig from '../../../../models/SiteConfig';

export async function GET() {
  try {
    await dbConnect();

    let config = await SiteConfig.findOne().lean();

    if (!config) {
      config = await SiteConfig.create({});
    }

    return NextResponse.json({ success: true, config });
  } catch (error) {
    console.error('SiteConfig Fetch Error:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();

    const config = await SiteConfig.findOneAndUpdate({}, body, {
      new: true,
      upsert: true,
      runValidators: true
    }).lean();

    return NextResponse.json({ success: true, config });
  } catch (error) {
    console.error('SiteConfig Update Error:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
