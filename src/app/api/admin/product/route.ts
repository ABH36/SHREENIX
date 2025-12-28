export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";

const getDb = async () => {
  const dbConnect = (await import("../../../../lib/db")).default;
  const Product = (await import("../../../../models/Product")).default;
  await dbConnect();
  return { Product };
};

export async function GET() {
  try {
    const { Product } = await getDb();

    let product = await Product.findOne().lean();

    if (!product) {
      product = await Product.create({
        name: "Shreenix Ayurveda",
        variants: [{ weight: "50g", price: 499, mrp: 999, inStock: true }],
        heroImages: ["/hero-product.png"],
        treatmentImages: ["/problem-1.png", "/problem-2.png", "/problem-3.png"],
        deliveryRules: { allowedStates: [], allowedPincodes: [] },
        topBar: { text: "🎉 Free Delivery on Prepaid Orders!", isActive: true },
      });
    }

    return NextResponse.json({ success: true, product });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { Product } = await getDb();
    const body = await req.json();

    const product = await Product.findOneAndUpdate({}, body, {
      new: true,
      upsert: true,
      runValidators: true,
    }).lean();

    return NextResponse.json({ success: true, product });
  } catch {
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
