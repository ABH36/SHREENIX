export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";

const getDb = async () => {
  const dbConnect = (await import("../../../lib/db")).default;
  const Order = (await import("../../../models/Order")).default;
  await dbConnect();
  return { Order };
};

export async function POST(req: Request) {
  try {
    const { Order } = await getDb();
    const body = await req.json();

    const { name, phone, address, city, pincode, state, quantity, amount } = body;

    if (!name || !phone || !address || !pincode) {
      return NextResponse.json(
        { success: false, message: "Please fill all required fields" },
        { status: 400 }
      );
    }

    const newOrder = await Order.create({
      customerDetails: {
        name,
        phone,
        address,
        city,
        pincode,
        state: state || "India",
      },
      orderItems: [
        {
          name: "Shreenix Fungal Infection Cream",
          qty: quantity || 1,
          price: 499,
          product: "65f2a3b1c9e8d7f6a5b4c3d2",
        },
      ],
      paymentMethod: "COD",
      itemsPrice: 499 * (quantity || 1),
      shippingPrice: 0,
      totalPrice: amount || 499,
      isPaid: false,
      orderStatus: "Processing",
    });

    return NextResponse.json(
      {
        success: true,
        message: "Order Placed Successfully!",
        orderId: newOrder._id,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: "Server Error: " + error.message },
      { status: 500 }
    );
  }
}
