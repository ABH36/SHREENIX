export const dynamic = "force-dynamic";
export const runtime = "nodejs";

import { NextResponse } from "next/server";

export async function POST() {
  const { cookies } = await import("next/headers");
  cookies().delete("admin_token");

  return NextResponse.json({ success: true, message: "Logged out" });
}
