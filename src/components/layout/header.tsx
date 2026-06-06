"use client"

/**
 * 게임 리뷰 블로그 헤더 컴포넌트
 * - 로고 (홈 링크)
 * - 카테고리 탭 네비게이션 (동적 데이터는 부모에서 props로 전달)
 * - 모바일 햄버거 메뉴
 * Client Component: usePathname 훅 사용
 */

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Menu, X, Gamepad2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import type { CategoryItem } from "@/types/notion"

interface HeaderProps {
  /** Notion DB에서 파생된 카테고리 목록 (Server Component에서 전달) */
  categories?: CategoryItem[]
}

export function Header({ categories = [] }: HeaderProps) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  /** 카테고리 탭 활성 여부 판별 */
  const isActive = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname.startsWith(href)
  }

  /** 전체 + 카테고리 탭 목록 */
  const navLinks = [
    { href: "/", label: "전체" },
    ...categories.map((cat) => ({
      href: `/category/${cat.slug}`,
      label: cat.label,
    })),
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* 로고 */}
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <Gamepad2 className="size-5 text-primary" />
          <span>게임 리뷰</span>
        </Link>

        {/* 데스크탑 카테고리 탭 */}
        <nav className="hidden md:flex items-center gap-1 overflow-x-auto">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground whitespace-nowrap",
                isActive(link.href)
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* 모바일 메뉴 */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              {mobileOpen ? <X className="size-4" /> : <Menu className="size-4" />}
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-64 pt-10">
            <SheetHeader className="sr-only">
              <SheetTitle>카테고리 메뉴</SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted",
                    isActive(link.href)
                      ? "bg-muted text-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
