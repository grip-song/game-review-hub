/**
 * 게임 리뷰 카드 컴포넌트 (F001)
 * - 제목, 카테고리 뱃지, 발행일, 평점 표시
 * - 클릭 시 /posts/[id]로 이동
 * Server Component (인터랙션 없음, Link 사용)
 */

import Link from "next/link"
import Image from "next/image"
import { Calendar, Star } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { ReviewPost } from "@/types/notion"

interface ReviewCardProps {
  post: ReviewPost
}

/** 발행일 ISO 문자열을 한국어 형식으로 포맷 (예: 2024-01-15 → 2024년 1월 15일) */
function formatDate(isoDate: string): string {
  if (!isoDate) return ""
  const date = new Date(isoDate)
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

/** 10점 만점 평점을 별 5개 기준으로 변환 */
function scoreToStars(score: number): number {
  return Math.round((score / 10) * 5 * 10) / 10
}

export function ReviewCard({ post }: ReviewCardProps) {
  return (
    <Link href={`/posts/${post.id}`} className="block group">
      <Card className="h-full overflow-hidden transition-shadow hover:shadow-md">
        {/* 커버 이미지 영역 */}
        {post.coverImage ? (
          <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
            <Image
              src={post.coverImage}
              alt={post.title}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        ) : (
          <div className="aspect-[4/3] w-full bg-muted flex items-center justify-center text-muted-foreground text-xs">
            이미지 없음
          </div>
        )}

        <CardHeader className="pb-2">
          {/* 카테고리 뱃지 */}
          {post.category && (
            <Badge variant="secondary" className="w-fit text-xs">
              {post.category}
            </Badge>
          )}

          {/* 제목 */}
          <h3 className="font-semibold text-base leading-tight line-clamp-2 group-hover:text-primary transition-colors">
            {post.title}
          </h3>
        </CardHeader>

        <CardContent className="pt-0">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            {/* 발행일 */}
            <div className="flex items-center gap-1">
              <Calendar className="size-3.5" />
              <span>{formatDate(post.published)}</span>
            </div>

            {/* 평점 */}
            {post.score > 0 && (
              <div className="flex items-center gap-1">
                <Star className="size-3.5 fill-yellow-400 text-yellow-400" />
                <span className="font-medium text-foreground">{post.score}</span>
                <span className="text-xs">/10</span>
              </div>
            )}
          </div>

          {/* 태그 목록 */}
          {post.tags.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1">
              {post.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                >
                  #{tag}
                </span>
              ))}
              {post.tags.length > 3 && (
                <span className="text-xs text-muted-foreground">+{post.tags.length - 3}</span>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}
