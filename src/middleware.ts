import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // 1. अगर यूजर Login Page पर है
  if (path === '/admin/login') {
    // अगर उसके पास पहले से टोकन है (Logged In है), तो उसे Dashboard पर भेज दो
    // (ताकि बार-बार login न करना पड़े)
    const token = request.cookies.get('admin_token')?.value;
    if (token) {
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }
    return NextResponse.next(); // नहीं तो Login पेज खुलने दो
  }

  // 2. अगर यूजर किसी और /admin पेज पर जाने की कोशिश कर रहा है (जैसे Dashboard)
  if (path.startsWith('/admin')) {
    // चेक करो 'admin_token' नाम की कुकी (Cookie) है या नहीं
    const token = request.cookies.get('admin_token')?.value;

    // अगर टोकन नहीं है (यानी चोरी-छिपे घुस रहा है) -> Login Page पर धक्के मारो
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // सब ठीक है -> अंदर जाने दो
  return NextResponse.next();
}

// यह सेटिंग बताती है कि ये गार्ड सिर्फ '/admin' रास्तों पर खड़ा रहेगा
export const config = {
  matcher: '/admin/:path*',
};