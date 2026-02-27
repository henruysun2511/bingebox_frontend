import { jwtDecode } from 'jwt-decode'; // npm install jwt-decode
import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  const token = request.cookies.get('accessToken')?.value;

  let userRole: string | null = null;
  if (token) {
    try {
      const decoded: any = jwtDecode(token);
      userRole = decoded.role; 
    } catch (error) {
      console.error('Invalid token');
    }
  }

  // --- QUY TẮC BẢO MẬT ---

  // A. Các trang yêu cầu đăng nhập (/profile, /booking, /payment)
  const isProtectedPath = pathname.startsWith('/profile') || 
                          pathname.startsWith('/booking') || 
                          pathname.startsWith('/payment');
  
  if (isProtectedPath && !token) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // B. Các trang Admin (/admin)
  if (pathname.startsWith('/admin')) {
    if (!token) {
      // Chưa đăng nhập -> về login
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
    if (userRole !== 'ADMIN') {
      // Đăng nhập rồi nhưng không phải ADMIN -> về trang chủ
      return NextResponse.redirect(new URL('/', request.url));
    }
  }

  // C. Các trang Auth (login, register) khi đã đăng nhập
  const isAuthPath = pathname.startsWith('/auth/login') || pathname.startsWith('/auth/register');
  if (isAuthPath && token) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

// Cấu hình các path middleware áp dụng
export const config = {
  // SỬA TẠI ĐÂY: Thêm dấu / trước auth
  matcher: [
    '/profile/:path*', 
    '/booking/:path*', 
    '/payment/:path*', 
    '/admin/:path*', 
    '/auth/login', 
    '/auth/register'
  ],
};