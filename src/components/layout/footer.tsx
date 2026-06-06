/**
 * 게임 리뷰 블로그 푸터 컴포넌트
 * - 사이트명 + 간단한 소개
 * - 제작자 정보
 * Server Component (상태 없음)
 */

import Link from "next/link"
import { Gamepad2 } from "lucide-react"
import { Separator } from "@/components/ui/separator"

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
          {/* 브랜드 */}
          <div className="flex items-center gap-2 font-bold">
            <Gamepad2 className="size-5 text-primary" />
            <span>게임 리뷰</span>
          </div>
          <p className="text-sm text-muted-foreground text-center sm:text-left">
            Notion을 CMS로 활용하는 개인 게임 리뷰 블로그
          </p>
        </div>

        <Separator className="my-6" />

        <div className="flex flex-col items-center justify-between gap-2 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} 게임 리뷰. All rights reserved.
          </p>
          <p className="text-sm text-muted-foreground">
            Powered by{" "}
            <Link
              href="https://nextjs.org"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4 hover:text-foreground"
            >
              Next.js
            </Link>
            {" & "}
            <Link
              href="https://notion.so"
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4 hover:text-foreground"
            >
              Notion
            </Link>
          </p>
        </div>
      </div>
    </footer>
  )
}
