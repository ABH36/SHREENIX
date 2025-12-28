export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";

const getDb = async () => {
  const dbConnect = (await import("../../../lib/db")).default;
  const Review = (await import("../../../models/Review")).default;
  await dbConnect();
  return { Review };
};

export async function GET() {
  try {
    const { Review } = await getDb();
    const reviews = await Review.find().sort({ date: -1 });
    return NextResponse.json({ success: true, reviews });
  } catch (error) {
    console.error("Review Fetch Error:", error);
    return NextResponse.json({ success: false, reviews: [] }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { Review } = await getDb();
    const body = await req.json();
    const review = await Review.create(body);
    return NextResponse.json({ success: true, review });
  } catch (error) {
    console.error("Review Create Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to add review" },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { Review } = await getDb();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, message: "Missing ID" },
        { status: 400 }
      );
    }

    await Review.findByIdAndDelete(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Review Delete Error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
