/**
 * 관리자 영역 공통 레이아웃
 * - robots noindex: 검색 엔진 색인 차단
 * - AdminHeader + AdminSidebar + main 구조
 * Server Component (기본)
 */

import type { Metadata } from 'next'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { AdminSidebar } from '@/components/admin/AdminSidebar'

export const metadata: Metadata = {
  robots: { index: false, follow: false },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <AdminHeader />
      <div className="flex flex-1">
        <AdminSidebar />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
