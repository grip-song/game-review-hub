/**
 * 관리자 로그인 페이지
 * - useActionState (React 19)로 Server Action 에러 처리
 * - 인증 성공 시 loginAction 내부에서 /admin/reviews로 리다이렉트
 */

import type { Metadata } from 'next'
import { LoginForm } from './LoginForm'

export const metadata: Metadata = {
  title: '관리자 로그인',
  robots: { index: false, follow: false },
}

export default function AdminLoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30">
      <LoginForm />
    </div>
  )
}
