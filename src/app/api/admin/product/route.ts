// src/app/api/admin/product/route.ts
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { getAdminUser } from "../../../../lib/auth";
import dbConnect from "../../../../lib/db";
import Product from "../../../../models/Product";

// Helper: Convert old format to new format
function normalizeProduct(product: any) {
  if (!product) return null;

  // Convert heroImages from string[] to object[]
  if (product.heroImages && Array.isArray(product.heroImages)) {
    product.heroImages = product.heroImages.map((url: any, index: number) => {
      if (typeof url === 'string') {
        return { url, publicId: '', order: index };
      }
      return url;
    });
  }

  // Convert treatmentImages from string[] to object[]
  if (product.treatmentImages && Array.isArray(product.treatmentImages)) {
    product.treatmentImages = product.treatmentImages.map((url: any, index: number) => {
      if (typeof url === 'string') {
        return { url, publicId: '', order: index };
      }
      return url;
    });
  }

  return product;
}

// GET: Fetch product (Public route - no auth needed)
export async function GET() {
  try {
    await dbConnect();

    let product = await Product.findOne().lean();

    if (!product) {
      // Create default product if none exists
      product = await Product.create({
        name: "Shreenix Ayurveda",
        variants: [{ weight: "50g", price: 499, mrp: 999, inStock: true }],
        heroImages: [{ url: "/hero-product.png", publicId: "", order: 0 }],
        treatmentImages: [
          { url: "/problem-1.png", publicId: "", order: 0 },
          { url: "/problem-2.png", publicId: "", order: 1 },
          { url: "/problem-3.png", publicId: "", order: 2 }
        ],
        deliveryRules: { allowedStates: [], allowedPincodes: [] },
        topBar: { text: "🎉 Free Delivery on Prepaid Orders!", isActive: true },
        seo: {
          metaTitle: "Shreenix Ayurveda – Trusted Ayurvedic Fungal Care",
          metaDescription: "Clinically inspired Ayurvedic cream for fungal infection, itching, rashes & ringworm. Fast relief, safe and natural.",
          keywords: ["ayurvedic cream", "fungal infection", "ringworm treatment"]
        }
      });
    }

    // Normalize product (backward compatibility)
    product = normalizeProduct(product);

    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error("Product Fetch Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

// PUT: Update product (Admin only)
export async function PUT(req: NextRequest) {
  try {
    // Auth check
    const user = await getAdminUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    await dbConnect();

    const body = await req.json();

    // Normalize incoming data (support both old and new formats)
    const normalizedBody = { ...body };

    // Convert heroImages if needed
    if (normalizedBody.heroImages && Array.isArray(normalizedBody.heroImages)) {
      normalizedBody.heroImages = normalizedBody.heroImages.map((item: any, index: number) => {
        if (typeof item === 'string') {
          return { url: item, publicId: '', order: index };
        }
        return item;
      });
    }

    // Convert treatmentImages if needed
    if (normalizedBody.treatmentImages && Array.isArray(normalizedBody.treatmentImages)) {
      normalizedBody.treatmentImages = normalizedBody.treatmentImages.map((item: any, index: number) => {
        if (typeof item === 'string') {
          return { url: item, publicId: '', order: index };
        }
        return item;
      });
    }

    // Validate variants
    if (normalizedBody.variants && Array.isArray(normalizedBody.variants)) {
      for (const variant of normalizedBody.variants) {
        if (!variant.weight || typeof variant.price !== 'number' || typeof variant.mrp !== 'number') {
          return NextResponse.json(
            { success: false, error: "Invalid variant data" },
            { status: 400 }
          );
        }
      }
    }

    const product = await Product.findOneAndUpdate({}, normalizedBody, {
      new: true,
      upsert: true,
      runValidators: true,
    }).lean();

    return NextResponse.json({ success: true, product: normalizeProduct(product) });
  } catch (error: any) {
    console.error("Product Update Error:", error);
    
    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      return NextResponse.json(
        { success: false, error: "Validation failed", details: error.message },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: "Failed to update product" },
      { status: 500 }
    );
  }
}