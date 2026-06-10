/**
 * 카테고리별 게임 리뷰 목록 페이지 (F001, F003)
 * - URL 파라미터의 slug로 카테고리 필터링
 * - 해당 카테고리 글 없을 경우 notFound() 처리
 * Server Component (기본)
 *
 * Next.js 16: params는 비동기로 접근 (await 필수)
 */

import type { Metadata } from "next"
import { PageContainer } from "@/components/layout/page-container"
import { CategoryFilter } from "@/components/review/CategoryFilter"
import { ReviewGrid } from "@/components/review/ReviewGrid"
import { fetchPosts, fetchCategories } from "@/lib/notion"
import type { CategoryItem, ReviewPost } from "@/types/notion"

/** ISR: 1분 캐시 */
export const revalidate = 60

interface PageProps {
  params: Promise<{ slug: string }>
}

/**
 * 빌드 시 카테고리 슬러그를 사전 생성 (generateStaticParams)
 * Notion에서 발행된 글의 카테고리를 기반으로 정적 경로 생성
 */
export async function generateStaticParams() {
  try {
    const categories = await fetchCategories()
    return categories.map((cat) => ({ slug: cat.slug }))
  } catch {
    // Notion API 미연결 시 빈 배열 반환 (동적 렌더링으로 폴백)
    return []
  }
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

  // Notion API에서 전체 발행 글 목록 조회
  let allPosts: ReviewPost[] = []
  let categories: CategoryItem[] = []

  try {
    allPosts = await fetchPosts()
    categories = await fetchCategories()
  } catch (err) {
    console.error("[카테고리 페이지] Notion API 호출 실패:", err)
  }

  // slug 기준으로 카테고리 필터링
  // URL 파라미터 slug와 Notion 카테고리 문자열 간 Unicode 정규화 불일치 방지
  const normalizedSlug = decodeURIComponent(slug).normalize("NFC")
  const filtered = allPosts.filter((post) => {
    const postSlug = post.category.toLowerCase().replace(/\s+/g, "-").normalize("NFC")
    const postCategory = post.category.normalize("NFC")
    return postSlug === normalizedSlug || postCategory === normalizedSlug
  })

  // 카테고리 레이블 복원 (slug → 표시용 텍스트)
  // categories 목록에서 찾거나, slug를 직접 변환
  const matchedCategory = categories.find(
    (cat) => cat.slug.normalize("NFC") === normalizedSlug || cat.label.normalize("NFC") === normalizedSlug
  )
  const categoryLabel =
    matchedCategory?.label ??
    slug
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

        {/* 카테고리 필터 탭 (F003) */}
        <CategoryFilter categories={categories} />

        {/* 카테고리별 리뷰 그리드 (F001) */}
        <ReviewGrid
          posts={filtered}
          emptyMessage={`${categoryLabel} 카테고리에 등록된 리뷰가 없습니다.`}
        />
      </div>
    </PageContainer>
  )
}
