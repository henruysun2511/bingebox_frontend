import { jwtVerify } from "jose";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const PUBLIC_ROUTES = ["/auth/login", "/auth/register"];
const PROTECTED_ROUTES = ["/profile"];
const ADMIN_PREFIX = "/admin";

const JWT_SECRET = new TextEncoder().encode(
  process.env.ACCESS_TOKEN_SECRET!
);

export async function middleware(req: NextRequest) {
  console.log("🔥 Middleware HIT:", req.nextUrl.pathname);

  const { pathname } = req.nextUrl;
  const accessToken = req.cookies.get("accessToken")?.value;
  console.log(accessToken);

  let payload: any = null;

  if (accessToken) {
    try {
      const { payload: decoded } = await jwtVerify(accessToken, JWT_SECRET);
      payload = decoded;
      console.log("✅ Payload:", payload);
    } catch {
      console.log("❌ Token invalid or expired");
    }
  }

  const isLoggedIn = !!payload;
  const role = payload?.role;

  if (isLoggedIn && PUBLIC_ROUTES.some(r => pathname.startsWith(r))) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  const isProtected = PROTECTED_ROUTES.some(r => pathname.startsWith(r));
  const isAdmin = pathname.startsWith(ADMIN_PREFIX);

  if (!isLoggedIn && (isProtected || isAdmin)) {
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }

  if (isLoggedIn && isAdmin && role !== "ADMIN") {
    return NextResponse.redirect(new URL("/403", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/auth/login",
    "/auth/register",
    "/profile/:path*",
    "/admin/:path*",
  ],
};