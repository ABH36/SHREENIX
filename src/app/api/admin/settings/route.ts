export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";

const getDb = async () => {
  const dbConnect = (await import("../../../../lib/db")).default;
  const SiteConfig = (await import("../../../../models/SiteConfig")).default;
  await dbConnect();
  return { SiteConfig };
};

export async function GET() {
  try {
    const { SiteConfig } = await getDb();

    let config = await SiteConfig.findOne().lean();
    if (!config) config = await SiteConfig.create({});

    return NextResponse.json({ success: true, config });
  } catch (error) {
    console.error("SiteConfig Fetch Error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { SiteConfig } = await getDb();
    const body = await req.json();

    const config = await SiteConfig.findOneAndUpdate({}, body, {
      new: true,
      upsert: true,
      runValidators: true,
    }).lean();

    return NextResponse.json({ success: true, config });
  } catch (error) {
    console.error("SiteConfig Update Error:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
