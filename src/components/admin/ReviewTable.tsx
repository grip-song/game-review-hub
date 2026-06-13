/**
 * 관리자 리뷰 목록 테이블 컴포넌트
 * - 초안 포함 전체 리뷰를 표시
 * - Notion 바로가기 링크 제공
 * Server Component
 */

import Link from 'next/link'
import { ExternalLink } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import type { AdminReviewRow } from '@/types/notion'

interface ReviewTableProps {
  rows: AdminReviewRow[]
}

export function ReviewTable({ rows }: ReviewTableProps) {
  // 빈 상태 처리
  if (rows.length === 0) {
    return (
      <div className="flex items-center justify-center py-16 text-muted-foreground text-sm">
        등록된 리뷰가 없습니다.
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="min-w-[200px]">제목</TableHead>
          <TableHead>카테고리</TableHead>
          <TableHead>상태</TableHead>
          <TableHead>발행일</TableHead>
          <TableHead>평점</TableHead>
          <TableHead>액션</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.id}>
            {/* 제목: 발행됨이면 상세 페이지 링크, 초안이면 일반 텍스트 */}
            <TableCell className="font-medium max-w-[300px] truncate">
              {row.status === 'published' ? (
                <Link
                  href={`/posts/${row.id}`}
                  className="hover:underline text-foreground"
                >
                  {row.title}
                </Link>
              ) : (
                <span className="text-muted-foreground">{row.title}</span>
              )}
            </TableCell>

            {/* 카테고리 뱃지 */}
            <TableCell>
              {row.category ? (
                <Badge variant="secondary">{row.category}</Badge>
              ) : (
                <span className="text-muted-foreground text-xs">-</span>
              )}
            </TableCell>

            {/* 상태 뱃지 */}
            <TableCell>
              {row.status === 'published' ? (
                <Badge>발행됨</Badge>
              ) : (
                <Badge variant="outline">초안</Badge>
              )}
            </TableCell>

            {/* 발행일 */}
            <TableCell className="text-muted-foreground text-sm">
              {row.published
                ? new Date(row.published).toLocaleDateString('ko-KR')
                : '-'}
            </TableCell>

            {/* 평점 */}
            <TableCell className="text-sm">
              {row.score > 0 ? `${row.score}/10` : '-'}
            </TableCell>

            {/* Notion 바로가기 */}
            <TableCell>
              <a
                href={row.notionUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Notion
              </a>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
