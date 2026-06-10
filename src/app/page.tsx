/**
 * 홈 페이지 (F001, F003, F004)
 * - 최신 게임 리뷰 목록을 Notion DB에서 서버에서 페칭해 표시
 * - 카테고리 필터 탭 (F003)
 * - 검색창은 Client Component로 분리 (F004)
 * Server Component (기본)
 */

import { PageContainer } from "@/components/layout/page-container"
import { SearchBar } from "@/components/search/SearchBar"
import { fetchPosts } from "@/lib/notion"
import type { CategoryItem, ReviewPost } from "@/types/notion"

/** ISR: 1분 캐시 */
export const revalidate = 60

export default async function HomePage() {
  // Notion API 키 미설정 시 빈 배열로 폴백
  let posts: ReviewPost[] = []
  if (process.env.NOTION_API_KEY && process.env.NOTION_DATABASE_ID) {
    try {
      posts = await fetchPosts()
    } catch (err) {
      console.error("[홈 페이지] Notion API 호출 실패:", err)
    }
  }

  // 글 목록에서 카테고리 목록 파생 (별도 API 호출 없음)
  const categoryMap = new Map<string, number>()
  for (const post of posts) {
    if (!post.category) continue
    categoryMap.set(post.category, (categoryMap.get(post.category) ?? 0) + 1)
  }
  const categories: CategoryItem[] = Array.from(categoryMap.entries())
    .map(([label, count]) => ({
      slug: label.toLowerCase().replace(/\s+/g, "-"),
      label,
      count,
    }))
    .sort((a, b) => b.count - a.count)

  return (
    <PageContainer>
      <div className="py-12">
        {/* 페이지 제목 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">게임 리뷰</h1>
          <p className="mt-2 text-muted-foreground">
            솔직하고 깊이 있는 게임 리뷰를 만나보세요
          </p>
        </div>

        {/* 카테고리 탭 + 검색창 + 리뷰 그리드 (F003, F004, F001) */}
        <SearchBar posts={posts} categories={categories} />
      </div>
    </PageContainer>
  )
}
