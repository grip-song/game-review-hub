/**
 * 게임 리뷰 블로그 루트 레이아웃
 * - 전역 메타데이터 설정
 * - Providers (ThemeProvider + TooltipProvider + Toaster)
 * - Header: Notion DB에서 카테고리 목록을 서버에서 페칭 후 전달
 * - Footer: 공통 푸터
 * Server Component (기본)
 */

import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import "./globals.css"
import { Providers } from "@/components/providers/providers"
import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: {
    default: "게임 리뷰",
    template: "%s | 게임 리뷰",
  },
  description: "Notion으로 관리하는 개인 게임 리뷰 블로그. RPG, 액션, 전략 등 다양한 장르의 솔직한 리뷰.",
  openGraph: {
    title: "게임 리뷰",
    description: "Notion으로 관리하는 개인 게임 리뷰 블로그",
    type: "website",
    locale: "ko_KR",
  },
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  /**
   * 카테고리 목록을 서버에서 페칭해 Header에 전달
   * Notion API 키가 없는 개발 초기에는 빈 배열로 폴백
   */
  let categories: import("@/types/notion").CategoryItem[] = []
  if (process.env.NOTION_API_KEY && process.env.NOTION_DATABASE_ID) {
    try {
      const { fetchCategories } = await import("@/lib/notion")
      categories = await fetchCategories()
    } catch {
      // Notion API 연결 실패 시 빈 카테고리로 폴백 (개발 환경 대비)
      categories = []
    }
  }

  return (
    <html
      lang="ko"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>
          <Header categories={categories} />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  )
}
