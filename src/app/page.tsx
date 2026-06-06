/**
 * 홈 페이지 (F001, F003, F004)
 * - 최신 게임 리뷰 목록을 Notion DB에서 서버에서 페칭해 표시
 * - 카테고리 필터 탭 (F003)
 * - 검색창은 Client Component로 분리 (F004)
 * Server Component (기본)
 */

import { PageContainer } from "@/components/layout/page-container"

export default async function HomePage() {
  /**
   * Notion API 키가 설정되면 여기서 fetchPosts()를 호출합니다.
   * Phase 3에서 ReviewGrid 컴포넌트 구현 후 교체 예정.
   */

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

        {/* TODO (Phase 3): SearchBar + CategoryFilter + ReviewGrid 컴포넌트 추가 */}
        <div className="rounded-lg border border-dashed p-12 text-center text-muted-foreground">
          <p className="text-sm">
            Notion API 연동 후 게임 리뷰 목록이 표시됩니다.
          </p>
          <p className="mt-1 text-xs">
            .env.local에 NOTION_API_KEY와 NOTION_DATABASE_ID를 설정하세요.
          </p>
        </div>
      </div>
    </PageContainer>
  )
}
