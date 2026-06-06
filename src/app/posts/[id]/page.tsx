/**
 * 게임 리뷰 글 상세 페이지 (F002)
 * - Notion 페이지 속성 (제목, 카테고리, 태그, 평점, 장단점) 표시
 * - Notion 본문 블록 렌더링
 * Server Component (기본)
 *
 * Next.js 16: params는 비동기로 접근 (await 필수)
 */

import type { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { PageContainer } from "@/components/layout/page-container"

interface PageProps {
  params: Promise<{ id: string }>
}

/** 동적 메타데이터 생성 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  // Next.js 16: params await 필수
  const { id } = await params

  /**
   * TODO (Phase 3): Notion API에서 글 메타데이터 페칭
   * const post = await fetchPostById(id)
   * if (!post) return { title: '글을 찾을 수 없습니다' }
   * return { title: post.title, description: post.pros }
   */

  return {
    title: "게임 리뷰",
    description: "게임 리뷰 상세 페이지",
  }
}

export default async function PostDetailPage({ params }: PageProps) {
  // Next.js 16: params await 필수
  const { id } = await params

  /**
   * TODO (Phase 3): Notion API에서 글 상세 + 블록 병렬 페칭
   * const postDetail = await fetchPostDetail(id)
   * if (!postDetail) notFound()
   */

  return (
    <PageContainer>
      <div className="py-12 max-w-3xl mx-auto">
        {/* 목록으로 돌아가기 */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
        >
          <ArrowLeft className="size-4" />
          목록으로 돌아가기
        </Link>

        {/* TODO (Phase 3): ReviewDetail + NotionRenderer 컴포넌트로 교체 */}
        <div className="rounded-lg border border-dashed p-12 text-center text-muted-foreground">
          <p className="text-sm">
            Notion API 연동 후 게임 리뷰 본문이 표시됩니다.
          </p>
          <p className="mt-1 text-xs font-mono">ID: {id}</p>
        </div>
      </div>
    </PageContainer>
  )
}
