'use client'

/**
 * 관리자 레이아웃 사이드바 컴포넌트
 * - usePathname으로 현재 경로를 감지해 활성 링크 스타일 적용
 */

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutList } from 'lucide-react'
import { cn } from '@/lib/utils'

/** 사이드바 네비게이션 항목 정의 */
const navItems = [
  {
    href: '/admin/reviews',
    label: '리뷰 목록',
    icon: LayoutList,
  },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <aside className="w-56 min-h-screen border-r bg-muted/30">
      <nav className="p-3 space-y-1">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(`${href}/`)
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-muted text-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
            >
              <Icon className="h-4 w-4 shrink-0" />
              {label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
