/**
 * 게임 리뷰 카드 그리드 레이아웃 컴포넌트 (F001, F011)
 * - ReviewCard 목록을 반응형 그리드로 배치
 *   모바일(1열) → 태블릿(2열) → 데스크톱(3열)
 * - 빈 상태(empty state) 메시지 처리
 * Server Component (상태 없음)
 */

import { ReviewCard } from "@/components/review/ReviewCard"
import type { ReviewPost } from "@/types/notion"

interface ReviewGridProps {
  posts: ReviewPost[]
  /** 글이 없을 때 표시할 메시지 */
  emptyMessage?: string
}

export function ReviewGrid({
  posts,
  emptyMessage = "아직 등록된 리뷰가 없습니다.",
}: ReviewGridProps) {
  if (posts.length === 0) {
    return (
      <div className="rounded-lg border border-dashed py-20 text-center">
        <p className="text-sm text-muted-foreground">{emptyMessage}</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map((post) => (
        <ReviewCard key={post.id} post={post} />
      ))}
    </div>
  )
}
