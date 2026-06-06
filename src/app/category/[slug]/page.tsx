/**
 * 카테고리별 게임 리뷰 목록 페이지 (F001, F003)
 * - URL 파라미터의 slug로 카테고리 필터링
 * - 해당 카테고리 글 없을 경우 empty state 표시
 * Server Component (기본)
 *
 * Next.js 16: params는 비동기로 접근 (await 필수)
 */

import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { PageContainer } from "@/components/layout/page-container"

interface PageProps {
  params: Promise<{ slug: string }>
}

/** 동적 메타데이터 생성 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  // Next.js 16: params await 필수
  const { slug } = await params
  // slug를 사람이 읽을 수 있는 레이블로 변환 (예: "role-playing" → "Role Playing")
  const label = slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ")

  return {
    title: `${label} 리뷰`,
    description: `${label} 장르 게임 리뷰 목록`,
  }
}

export default async function CategoryPage({ params }: PageProps) {
  // Next.js 16: params await 필수
  const { slug } = await params

  /**
   * TODO (Phase 3): Notion API에서 해당 카테고리 글 목록 페칭
   * const posts = await fetchPosts()
   * const filtered = posts.filter(p => p.category.toLowerCase().replace(/\s+/g, '-') === slug)
   * if (filtered.length === 0 && ...) notFound()
   */

  // 카테고리 레이블 복원 (slug → 표시용 텍스트)
  const categoryLabel = slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ")

  return (
    <PageContainer>
      <div className="py-12">
        {/* 페이지 제목 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">{categoryLabel}</h1>
          <p className="mt-2 text-muted-foreground">
            {categoryLabel} 장르 게임 리뷰 목록
          </p>
        </div>

        {/* TODO (Phase 3): ReviewGrid 컴포넌트로 교체 */}
        <div className="rounded-lg border border-dashed p-12 text-center text-muted-foreground">
          <p className="text-sm">
            Notion API 연동 후 <strong>{categoryLabel}</strong> 카테고리 리뷰가 표시됩니다.
          </p>
        </div>
      </div>
    </PageContainer>
  )
}
