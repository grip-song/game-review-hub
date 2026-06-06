"use client"

/**
 * 키워드 검색 컴포넌트 (F004)
 * - 검색어 입력 시 제목 기준 실시간 클라이언트 사이드 필터링
 * - 홈 페이지 글 목록을 인라인 갱신 (페이지 이동 없음)
 * - 검색 결과 없을 경우 안내 메시지 표시
 * Client Component: useState, 사용자 입력 처리
 */

import { useState, useMemo } from "react"
import { Search, X } from "lucide-react"
import { ReviewGrid } from "@/components/review/ReviewGrid"
import type { ReviewPost } from "@/types/notion"

interface SearchBarProps {
  /** 전체 게임 리뷰 목록 (서버에서 전달) */
  posts: ReviewPost[]
}

export function SearchBar({ posts }: SearchBarProps) {
  const [query, setQuery] = useState("")

  /** 검색어 기준 제목 필터링 (대소문자 무시) */
  const filtered = useMemo(() => {
    const trimmed = query.trim().toLowerCase()
    if (!trimmed) return posts
    return posts.filter((post) => post.title.toLowerCase().includes(trimmed))
  }, [posts, query])

  return (
    <div>
      {/* 검색 입력창 */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="게임 제목으로 검색..."
          className="w-full rounded-lg border bg-background pl-9 pr-9 py-2 text-sm outline-none focus:ring-2 focus:ring-ring focus:ring-offset-0 placeholder:text-muted-foreground"
        />
        {/* 검색어 초기화 버튼 */}
        {query && (
          <button
            onClick={() => setQuery("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            aria-label="검색어 초기화"
          >
            <X className="size-4" />
          </button>
        )}
      </div>

      {/* 검색 결과 상태 표시 */}
      {query.trim() && (
        <p className="mb-4 text-sm text-muted-foreground">
          <strong className="text-foreground">&quot;{query.trim()}&quot;</strong> 검색 결과:{" "}
          {filtered.length}건
        </p>
      )}

      {/* 게임 리뷰 그리드 */}
      <ReviewGrid
        posts={filtered}
        emptyMessage={
          query.trim()
            ? `"${query.trim()}"에 해당하는 리뷰가 없습니다.`
            : "아직 등록된 리뷰가 없습니다."
        }
      />
    </div>
  )
}
