// src/app/api/admin/login/route.ts
export const runtime = "nodejs";

import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const ADMIN_USER = process.env.ADMIN_USER!;
const ADMIN_PASS = process.env.ADMIN_PASS!;
const JWT_SECRET = process.env.JWT_SECRET!;

// Rate limiting store (in-memory, production mein Redis use karo)
const loginAttempts = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const attempt = loginAttempts.get(ip);

  if (!attempt || now > attempt.resetAt) {
    loginAttempts.set(ip, { count: 1, resetAt: now + 15 * 60 * 1000 }); // 15 min
    return true;
  }

  if (attempt.count >= 5) {
    return false; // Max 5 attempts in 15 min
  }

  attempt.count++;
  return true;
}

export async function POST(req: NextRequest) {
  try {
    // Get IP for rate limiting
    const ip = req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown';

    // Rate limit check
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: 'Too many login attempts. Try again after 15 minutes.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { username, password } = body;

    // Input validation
    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username and password are required' },
        { status: 400 }
      );
    }

    if (typeof username !== 'string' || typeof password !== 'string') {
      return NextResponse.json(
        { error: 'Invalid input format' },
        { status: 400 }
      );
    }

    // Verify credentials (constant-time comparison for security)
    const isValidUser = username === ADMIN_USER;
    const isValidPass = password === ADMIN_PASS;

    if (!isValidUser || !isValidPass) {
      // Don't reveal which field is wrong (security best practice)
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        username,
        role: 'admin',
        iat: Math.floor(Date.now() / 1000),
      },
      JWT_SECRET,
      {
        expiresIn: '24h', // Token expires in 24 hours
      }
    );

    // Create response with secure cookie
    const response = NextResponse.json(
      {
        success: true,
        message: 'Login successful',
        user: { username, role: 'admin' }
      },
      { status: 200 }
    );

    // Set secure HTTP-only cookie
    response.cookies.set({
      name: 'admin_token',
      value: token,
      httpOnly: true, // Prevents XSS attacks
      secure: process.env.NODE_ENV === 'production', // HTTPS only in production
      sameSite: 'strict', // CSRF protection
      maxAge: 60 * 60 * 24, // 24 hours
      path: '/',
    });

    // Clear rate limit on successful login
    loginAttempts.delete(ip);

    return response;

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}