// src/lib/auth.ts
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!;

export interface AdminUser {
  username: string;
  role: string;
}

/**
 * Verify and decode JWT token from cookies
 * Use this in server components and API routes
 */
export async function getAdminUser(): Promise<AdminUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('admin_token')?.value;

    if (!token) return null;

    const decoded = jwt.verify(token, JWT_SECRET) as AdminUser;
    return decoded;
  } catch {
    return null;
  }
}

/**
 * Check if user is authenticated admin
 */
export async function isAuthenticated(): Promise<boolean> {
  const user = await getAdminUser();
  return !!user;
}

/**
 * Verify token (for middleware and client-side checks)
 */
export function verifyToken(token: string): boolean {
  try {
    jwt.verify(token, JWT_SECRET);
    return true;
  } catch {
    return false;
  }
}