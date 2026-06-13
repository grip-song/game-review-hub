'use server'

/**
 * 관리자 인증 관련 Server Action
 * - loginAction: 패스워드 검증 후 세션 쿠키 설정
 * - logoutAction: 세션 쿠키 삭제 후 로그인 페이지로 리다이렉트
 */

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

/** 로그인 결과 타입 */
export interface LoginActionResult {
  error?: string
}

/**
 * 관리자 로그인 처리
 * - 패스워드 일치 시 httpOnly 세션 쿠키 설정 후 리뷰 목록으로 이동
 * - 불일치 시 에러 메시지 반환 (redirect 없음)
 */
export async function loginAction(
  _prevState: LoginActionResult,
  formData: FormData,
): Promise<LoginActionResult> {
  const password = formData.get('password') as string
  const adminPassword = process.env.ADMIN_PASSWORD

  // ADMIN_PASSWORD 환경 변수 미설정 또는 비밀번호 불일치
  if (!adminPassword || password !== adminPassword) {
    return { error: '비밀번호가 틀렸습니다.' }
  }

  // 인증 성공: httpOnly 세션 쿠키 발급 (24시간)
  const cookieStore = await cookies()
  cookieStore.set('admin_session', '1', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 86400,
    path: '/',
  })

  // 리뷰 목록으로 이동
  redirect('/admin/reviews')
}

/**
 * 관리자 로그아웃 처리
 * - 세션 쿠키 삭제 후 로그인 페이지로 리다이렉트
 */
export async function logoutAction() {
  const cookieStore = await cookies()
  cookieStore.delete('admin_session')
  redirect('/admin/login')
}
