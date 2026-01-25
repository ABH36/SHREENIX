// src/app/api/order/route.ts
export const runtime = "nodejs";

import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '../../../lib/db';
import Order from '../../../models/Order';

// POST: Create new order (Public route)
export async function POST(req: NextRequest) {
  try {
    await dbConnect();

    const body = await req.json();

    // Extract data
    const { name, phone, address, city, pincode, state, productName, quantity, amount } = body;

    // Validation
    if (!name || !phone || !address || !city || !pincode || !state) {
      return NextResponse.json(
        { success: false, error: 'All fields are required' },
        { status: 400 }
      );
    }

    // Phone validation
    if (!/^[0-9]{10}$/.test(phone)) {
      return NextResponse.json(
        { success: false, error: 'Invalid phone number' },
        { status: 400 }
      );
    }

    // Pincode validation
    if (!/^[0-9]{6}$/.test(pincode)) {
      return NextResponse.json(
        { success: false, error: 'Invalid pincode' },
        { status: 400 }
      );
    }

    // Get IP address for fraud detection
    const ipAddress = req.headers.get('x-forwarded-for') || 
                     req.headers.get('x-real-ip') || 
                     'unknown';

    // Create order
    const order = await Order.create({
      customerDetails: {
        name: name.trim(),
        phone: phone.trim(),
        address: address.trim(),
        city: city.trim(),
        pincode: pincode.trim(),
        state: state.trim()
      },
      orderItems: [
        {
          name: productName || 'Shreenix Ayurveda',
          qty: quantity || 1,
          price: amount || 0
        }
      ],
      totalPrice: amount || 0,
      paymentMethod: 'COD',
      ipAddress
    });

    return NextResponse.json({
      success: true,
      orderId: order._id,
      message: 'Order placed successfully'
    });

  } catch (error: any) {
    console.error('Order creation error:', error);

    // Handle duplicate orders (same phone + same minute)
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, error: 'Duplicate order detected' },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, error: 'Failed to place order' },
      { status: 500 }
    );
  }
}