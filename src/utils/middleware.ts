
// import { NextResponse } from "next/server";
// import type { NextRequest } from "next/server";
// import { jwtVerify } from "jose";
// import { RoleTypeEnum } from "./types/enum";

// const PUBLIC_ROUTES = ["/login"];
// const PROTECTED_ROUTES = ["/profile"];
// const ADMIN_PREFIX = "/admin";

// const JWT_SECRET = new TextEncoder().encode(
//   process.env.JWT_SECRET!
// );

// export async function middleware(req: NextRequest) {
//   const { pathname } = req.nextUrl;

//   const accessToken = req.cookies.get("accessToken")?.value;

//   let payload: any = null;

//   //Verify token nếu có
//   if (accessToken) {
//     try {
//       const { payload: decoded } = await jwtVerify(
//         accessToken,
//         JWT_SECRET
//       );
//       payload = decoded;
//     } catch (err) {
//       payload = null;
//     }
//   }

//   const isLoggedIn = !!payload;
//   const role = payload?.role;

//   /**
//    * Đã login → không cho vào /login
//    */
//   if (isLoggedIn && PUBLIC_ROUTES.includes(pathname)) {
//     return NextResponse.redirect(
//       new URL("/", req.url)
//     );
//   }

//   /**
//    * Chưa login → chặn route protected
//    */
//   if (!isLoggedIn) {
//     const isProtected =
//       PROTECTED_ROUTES.some(p =>
//         pathname.startsWith(p)
//       ) || pathname.startsWith(ADMIN_PREFIX);

//     if (isProtected) {
//       return NextResponse.redirect(
//         new URL("/login", req.url)
//       );
//     }
//   }

//   /**
//    * Không phải ADMIN → chặn /admin/**
//    */
//   if (
//     isLoggedIn &&
//     pathname.startsWith(ADMIN_PREFIX) &&
//     role !== RoleTypeEnum.ADMIN
//   ) {
//     return NextResponse.redirect(
//       new URL("/403", req.url)
//     );
//   }

//   return NextResponse.next();
// }