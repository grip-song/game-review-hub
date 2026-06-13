'use client'

/**
 * 관리자 레이아웃 상단 헤더 컴포넌트
 * - 좌측: Shield 아이콘 + "관리자" 텍스트
 * - 우측: 블로그로 돌아가기 링크 + 로그아웃 버튼
 */

import Link from 'next/link'
import { Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { logoutAction } from '@/app/actions/admin'

export function AdminHeader() {
  return (
    <header className="border-b bg-background h-14 flex items-center justify-between px-6">
      {/* 좌측: 관리자 영역 표시 */}
      <div className="flex items-center gap-2">
        <Shield className="h-5 w-5 text-muted-foreground" />
        <span className="font-semibold text-sm">관리자</span>
      </div>

      {/* 우측: 블로그 이동 + 로그아웃 */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/">블로그로 돌아가기</Link>
        </Button>
        {/* 로그아웃: Server Action을 form으로 호출 */}
        <form action={logoutAction}>
          <Button type="submit" variant="ghost" size="sm">
            로그아웃
          </Button>
        </form>
      </div>
    </header>
  )
}
