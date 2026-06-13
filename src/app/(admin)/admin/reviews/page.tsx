/**
 * 관리자 리뷰 목록 페이지
 * - 초안 포함 전체 리뷰를 테이블로 표시
 * - Notion API 미설정 시 빈 목록으로 폴백
 * Server Component
 */

import { fetchAllPosts } from '@/lib/notion'
import { ReviewTable } from '@/components/admin/ReviewTable'
import type { AdminReviewRow } from '@/types/notion'

export default async function AdminReviewsPage() {
  let rows: AdminReviewRow[] = []

  if (process.env.NOTION_API_KEY && process.env.NOTION_DATABASE_ID) {
    try {
      rows = await fetchAllPosts()
    } catch {
      // Notion API 오류 시 빈 목록으로 폴백
      rows = []
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">리뷰 목록</h1>
      <ReviewTable rows={rows} />
    </div>
  )
}
