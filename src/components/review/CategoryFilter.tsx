"use client"

/**
 * 카테고리 필터 탭 컴포넌트 (F003)
 * - 카테고리 탭/버튼 클릭 시 /category/[slug] 라우팅
 * - "전체" 탭 포함
 * - 현재 선택된 카테고리 하이라이트
 * Client Component: useRouter, usePathname 사용
 */

import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import type { CategoryItem } from "@/types/notion"

interface CategoryFilterProps {
  categories: CategoryItem[]
}

export function CategoryFilter({ categories }: CategoryFilterProps) {
  const pathname = usePathname()
  const router = useRouter()

  /** 현재 경로에서 활성 카테고리 슬러그 추출 */
  const activeSlug = pathname.startsWith("/category/")
    ? pathname.replace("/category/", "")
    : null

  const allTabs = [
    { slug: null, label: "전체" },
    ...categories.map((cat) => ({ slug: cat.slug, label: cat.label })),
  ]

  const handleClick = (slug: string | null) => {
    if (slug === null) {
      router.push("/")
    } else {
      router.push(`/category/${slug}`)
    }
  }

  return (
    <div className="flex flex-wrap gap-2 mb-8">
      {allTabs.map((tab) => {
        const isActive = tab.slug === activeSlug
        return (
          <button
            key={tab.slug ?? "all"}
            onClick={() => handleClick(tab.slug)}
            className={cn(
              "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
              isActive
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground"
            )}
          >
            {tab.label}
          </button>
        )
      })}
    </div>
  )
}
