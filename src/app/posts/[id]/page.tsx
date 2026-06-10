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
import { Separator } from "@/components/ui/separator"
import { PageContainer } from "@/components/layout/page-container"
import { ReviewDetail } from "@/components/review/ReviewDetail"
import { NotionRenderer } from "@/components/review/NotionRenderer"
import { fetchPostDetail, fetchPostById } from "@/lib/notion"

/** ISR: 5분 캐시 */
export const revalidate = 300

interface PageProps {
  params: Promise<{ id: string }>
}

/** 동적 메타데이터 생성 */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  // Next.js 16: params await 필수
  const { id } = await params

  try {
    const post = await fetchPostById(id)
    if (!post) {
      return { title: "글을 찾을 수 없습니다" }
    }
    return {
      title: post.title,
      description: post.pros || `${post.title} 게임 리뷰`,
    }
  } catch {
    return { title: "게임 리뷰" }
  }
}

export default async function PostDetailPage({ params }: PageProps) {
  // Next.js 16: params await 필수
  const { id } = await params

  // 글 속성과 본문 블록을 병렬로 조회
  const postDetail = await fetchPostDetail(id)

  // 글이 존재하지 않으면 404
  if (!postDetail) {
    notFound()
  }

  const { blocks, ...post } = postDetail

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

        {/* 글 헤더 (제목, 카테고리, 태그, 발행일, 평점, 장단점) */}
        <ReviewDetail post={post} />

        {/* 본문 Notion 블록 렌더링 */}
        <NotionRenderer blocks={blocks} />

        {blocks.length > 0 && <Separator className="my-12" />}

        {/* 하단 뒤로가기 링크 */}
        <div className="mt-8">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="size-4" />
            목록으로 돌아가기
          </Link>
        </div>
      </div>
    </PageContainer>
  )
}
