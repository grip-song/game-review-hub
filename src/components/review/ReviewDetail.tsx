/**
 * 게임 리뷰 상세 정보 컴포넌트 (F002)
 * - 제목, 카테고리 뱃지, 태그 목록, 발행일 헤더 영역
 * - 평점 섹션: Score를 10점 만점 시각화
 * - 장단점 섹션: Pros / Cons 블록 구분 표시
 * Server Component (상태 없음)
 */

import Image from "next/image"
import { Calendar, ThumbsUp, ThumbsDown } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import type { ReviewPost } from "@/types/notion"
import { ShareButton } from "@/components/review/ShareButton"

interface ReviewDetailProps {
  post: ReviewPost
}

/** 발행일 ISO 문자열을 한국어 형식으로 포맷 */
function formatDate(isoDate: string): string {
  if (!isoDate) return ""
  const date = new Date(isoDate)
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

/** 평점 막대 너비 계산 (10점 만점 → 퍼센트) */
function scoreToPercent(score: number): number {
  return Math.min(100, Math.max(0, (score / 10) * 100))
}

/** 평점에 따른 색상 결정 */
function scoreColor(score: number): string {
  if (score >= 8) return "bg-green-500"
  if (score >= 6) return "bg-yellow-500"
  if (score >= 4) return "bg-orange-500"
  return "bg-red-500"
}

export function ReviewDetail({ post }: ReviewDetailProps) {
  return (
    <article>
      {/* 커버 이미지 — 원본 비율 그대로 표시 */}
      {post.coverImage && (
        <div className="w-full overflow-hidden rounded-xl mb-8">
          <Image
            src={post.coverImage}
            alt={post.title}
            width={1200}
            height={900}
            className="w-full h-auto"
            sizes="(max-width: 768px) 100vw, 768px"
            priority
            referrerPolicy="no-referrer"
          />
        </div>
      )}

      {/* 헤더 영역 */}
      <header className="mb-8">
        {/* 카테고리 뱃지 */}
        {post.category && (
          <Badge variant="secondary" className="mb-3">
            {post.category}
          </Badge>
        )}

        {/* 제목 */}
        <h1 className="text-3xl font-bold tracking-tight mb-4">{post.title}</h1>

        {/* 발행일 */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
          <Calendar className="size-4" />
          <time dateTime={post.published}>{formatDate(post.published)}</time>
        </div>

        {/* 태그 목록 */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-muted px-2.5 py-0.5 text-xs text-muted-foreground"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* 공유 버튼 — Client Component를 Server Component 내에서 삽입 */}
        <div className="mt-3">
          <ShareButton title={post.title} />
        </div>
      </header>

      <Separator className="mb-8" />

      {/* 평점 섹션 */}
      {post.score > 0 && (
        <section className="mb-8 rounded-lg border p-5">
          <h2 className="text-base font-semibold mb-3">총점</h2>
          <div className="flex items-center gap-4">
            {/* 숫자 표시 */}
            <div className="text-5xl font-bold tabular-nums">
              {post.score}
              <span className="text-xl text-muted-foreground font-normal">/10</span>
            </div>
            {/* 막대 그래프 */}
            <div className="flex-1">
              <div className="h-3 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all ${scoreColor(post.score)}`}
                  style={{ width: `${scoreToPercent(post.score)}%` }}
                />
              </div>
              <p className="mt-1.5 text-xs text-muted-foreground">
                {post.score >= 8
                  ? "강력 추천"
                  : post.score >= 6
                  ? "추천"
                  : post.score >= 4
                  ? "보통"
                  : "비추천"}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* 장단점 섹션 */}
      {(post.pros || post.cons) && (
        <section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* 장점 */}
          {post.pros && (
            <div className="rounded-lg border border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/30 p-4">
              <div className="flex items-center gap-2 mb-2 text-green-700 dark:text-green-400">
                <ThumbsUp className="size-4" />
                <h3 className="font-semibold text-sm">장점</h3>
              </div>
              <p className="text-sm text-muted-foreground whitespace-pre-line">{post.pros}</p>
            </div>
          )}

          {/* 단점 */}
          {post.cons && (
            <div className="rounded-lg border border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-950/30 p-4">
              <div className="flex items-center gap-2 mb-2 text-red-700 dark:text-red-400">
                <ThumbsDown className="size-4" />
                <h3 className="font-semibold text-sm">단점</h3>
              </div>
              <p className="text-sm text-muted-foreground whitespace-pre-line">{post.cons}</p>
            </div>
          )}
        </section>
      )}

      <Separator className="mb-8" />
    </article>
  )
}
