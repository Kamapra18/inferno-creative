import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Hanya jalankan middleware ini untuk path yang dimulai dengan /admin/dashboard
  if (request.nextUrl.pathname.startsWith("/admin/dashboard")) {
    const token = request.cookies.get("admin_token");
    
    // Jika tidak ada token atau token tidak valid, redirect ke halaman login
    if (!token || token.value !== "authenticated") {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
  }

  // Lanjutkan request jika sudah login atau path tidak diproteksi
  return NextResponse.next();
}

// Tentukan path mana saja yang akan diproses oleh middleware
export const config = {
  matcher: ["/admin/dashboard/:path*"],
};
