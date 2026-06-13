/**
 * 관리자 영역 접근 제어 미들웨어
 * - /admin/login은 인증 없이 통과
 * - 나머지 /admin/* 경로는 admin_session 쿠키 유무 확인
 * - 세션 없으면 /admin/login으로 리다이렉트
 *
 * Edge Runtime: request.cookies 동기 접근 (await cookies() 사용 불가)
 */

import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // 로그인 페이지는 인증 없이 접근 허용
  if (pathname === '/admin/login') {
    return NextResponse.next()
  }

  // admin_session 쿠키 확인
  const session = request.cookies.get('admin_session')
  if (!session) {
    return NextResponse.redirect(new URL('/admin/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
}
