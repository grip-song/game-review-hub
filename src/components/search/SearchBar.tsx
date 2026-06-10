"use client"

import { useState, useMemo } from "react"
import { Search, X } from "lucide-react"
import { ReviewGrid } from "@/components/review/ReviewGrid"
import { cn } from "@/lib/utils"
import type { ReviewPost, CategoryItem } from "@/types/notion"

interface SearchBarProps {
  posts: ReviewPost[]
  categories?: CategoryItem[]
}

export function SearchBar({ posts, categories = [] }: SearchBarProps) {
  const [query, setQuery] = useState("")
  const [activeCategory, setActiveCategory] = useState<string | null>(null)

  const filtered = useMemo(() => {
    let result = posts
    if (activeCategory !== null) {
      result = result.filter(
        (post) => post.category.toLowerCase().replace(/\s+/g, "-") === activeCategory
      )
    }
    const trimmed = query.trim().toLowerCase()
    if (trimmed) {
      result = result.filter((post) => post.title.toLowerCase().includes(trimmed))
    }
    return result
  }, [posts, activeCategory, query])

  const allTabs = [
    { slug: null, label: "전체" },
    ...categories.map((cat) => ({ slug: cat.slug, label: cat.label })),
  ]

  return (
    <div>
      {/* 카테고리 탭 (인라인 필터링) */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-8">
          {allTabs.map((tab) => (
            <button
              key={tab.slug ?? "all"}
              onClick={() => setActiveCategory(tab.slug)}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                activeCategory === tab.slug
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      )}

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
            : activeCategory
            ? "해당 카테고리의 리뷰가 없습니다."
            : "아직 등록된 리뷰가 없습니다."
        }
      />
    </div>
  )
}
