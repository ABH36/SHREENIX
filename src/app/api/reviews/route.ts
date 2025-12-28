export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/db';
import Review from '../../../models/Review';

export async function GET() {
  try {
    await dbConnect();
    const reviews = await Review.find().sort({ date: -1 });
    return NextResponse.json({ success: true, reviews });
  } catch {
    return NextResponse.json({ success: false, reviews: [] }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();
    const review = await Review.create(body);
    return NextResponse.json({ success: true, review });
  } catch {
    return NextResponse.json({ success: false, error: 'Failed to add review' }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, message: 'Missing ID' }, { status: 400 });
    }

    await Review.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
