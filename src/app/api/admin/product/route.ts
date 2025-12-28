export const dynamic = "force-dynamic";
export const runtime = "nodejs";
import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/db';
import Product from '../../../../models/Product';

export async function GET() {
  try {
    await dbConnect();

    let product = await Product.findOne().lean();

    if (!product) {
      product = await Product.create({
        name: 'Shreenix Ayurveda',
        variants: [{ weight: '50g', price: 499, mrp: 999, inStock: true }],
        heroImages: ['/hero-product.png'],
        treatmentImages: ['/problem-1.png', '/problem-2.png', '/problem-3.png'],
        deliveryRules: { allowedStates: [], allowedPincodes: [] },
        topBar: { text: '🎉 Free Delivery on Prepaid Orders!', isActive: true }
      });
    }

    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error('Product Fetch Error:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    await dbConnect();
    const body = await req.json();

    const product = await Product.findOneAndUpdate({}, body, {
      new: true,
      upsert: true,
      runValidators: true
    }).lean();

    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error('Product Update Error:', error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
