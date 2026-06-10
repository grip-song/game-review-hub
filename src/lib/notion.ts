/**
 * Notion API 클라이언트 래퍼
 * 게임 리뷰 블로그의 모든 데이터 페칭 로직을 담당
 *
 * 환경 변수:
 *   NOTION_API_KEY       - Notion Integration 시크릿 키
 *   NOTION_DATABASE_ID   - 게임 리뷰 Notion 데이터베이스 ID
 */

import { Client } from '@notionhq/client'
import type { PageObjectResponse, BlockObjectResponse } from '@notionhq/client/build/src/api-endpoints'
import type { ReviewPost, ReviewPostDetail, NotionBlock, NotionRichText, CategoryItem } from '@/types/notion'

// ──────────────────────────────────────────────
// Notion 클라이언트 싱글톤 초기화
// ──────────────────────────────────────────────

/** Notion API 클라이언트 (서버 전용 — 클라이언트 번들 포함 금지) */
const notion = new Client({
  auth: process.env.NOTION_API_KEY,
})

/** 게임 리뷰 Notion 데이터베이스 ID */
const DATABASE_ID = process.env.NOTION_DATABASE_ID ?? ''

// ──────────────────────────────────────────────
// 내부 유틸리티 함수
// ──────────────────────────────────────────────

/**
 * Notion rich_text 배열에서 순수 텍스트를 추출
 */
function extractPlainText(richText: NotionRichText[]): string {
  return richText.map((t) => t.plain_text).join('')
}

/**
 * Notion 페이지 속성(properties)을 ReviewPost 내부 타입으로 변환
 */
function mapPageToReviewPost(page: PageObjectResponse): ReviewPost {
  const props = page.properties as Record<string, unknown>

  /**
   * 특정 타입의 속성 값을 안전하게 꺼내는 헬퍼
   */
  function getProp<T>(key: string, type: string, fallback: T): T {
    const prop = props[key] as Record<string, unknown> | undefined
    if (!prop || prop.type !== type) return fallback
    return prop[type] as T
  }

  // Title 속성 (배열)
  const titleArr = getProp<Array<{ plain_text: string }>>('Title', 'title', [])
  const title = titleArr.map((t) => t.plain_text).join('')

  // Category select 속성
  const categorySelect = getProp<{ name: string } | null>('Category', 'select', null)
  const category = categorySelect?.name ?? ''

  // Tags multi_select 속성
  const tagsArr = getProp<Array<{ name: string }>>('Tags', 'multi_select', [])
  const tags = tagsArr.map((t) => t.name)

  // Published date 속성
  const dateObj = getProp<{ start: string } | null>('Published', 'date', null)
  const published = dateObj?.start ?? ''

  // Status select 속성
  const statusSelect = getProp<{ name: string } | null>('Status', 'select', null)
  const statusRaw = statusSelect?.name ?? ''
  const status: 'draft' | 'published' = statusRaw === '발행됨' ? 'published' : 'draft'

  // Score select 속성 (예: "7", "8.5" → number로 파싱)
  const scoreSelect = getProp<{ name: string } | null>('Score', 'select', null)
  const score = scoreSelect ? (parseFloat(scoreSelect.name) || 0) : 0

  // Pros rich_text 속성
  const prosArr = getProp<NotionRichText[]>('Pros', 'rich_text', [])
  const pros = extractPlainText(prosArr)

  // Cons rich_text 속성
  const consArr = getProp<NotionRichText[]>('Cons', 'rich_text', [])
  const cons = extractPlainText(consArr)

  // Thumbnail URL 속성 (DB 필드 우선, 없으면 페이지 커버 폴백)
  const thumbnailUrl = getProp<string | null>('Thumbnail', 'url', null)

  let coverImage: string | undefined
  if (thumbnailUrl) {
    coverImage = thumbnailUrl
  } else if (page.cover) {
    if (page.cover.type === 'external') {
      coverImage = page.cover.external.url
    } else if (page.cover.type === 'file') {
      coverImage = page.cover.file.url
    }
  }

  return {
    id: page.id,
    title,
    category,
    tags,
    published,
    status,
    score,
    pros,
    cons,
    coverImage,
  }
}

/**
 * Notion 블록 객체를 내부 NotionBlock 타입으로 변환
 * 미지원 블록 타입은 'unsupported'로 처리해 렌더러에서 무시
 */
function mapBlockToNotionBlock(block: BlockObjectResponse): NotionBlock {
  const supportedTypes = new Set([
    'paragraph',
    'heading_1',
    'heading_2',
    'heading_3',
    'bulleted_list_item',
    'numbered_list_item',
    'image',
    'quote',
    'code',
    'divider',
  ])

  if (!supportedTypes.has(block.type)) {
    return {
      id: block.id,
      type: 'unsupported',
      has_children: block.has_children,
    }
  }

  // 지원 블록은 원본 구조 그대로 반환 (렌더러에서 타입 가드로 접근)
  return block as unknown as NotionBlock
}

// ──────────────────────────────────────────────
// Public API 함수
// ──────────────────────────────────────────────

/**
 * 발행된 게임 리뷰 목록 조회
 * - Status = "발행됨" 필터 적용
 * - 발행일 내림차순 정렬
 * - ISR: 60초 캐시
 */
export async function fetchPosts(): Promise<ReviewPost[]> {
  const response = await notion.databases.query({
    database_id: DATABASE_ID,
    filter: {
      property: 'Status',
      select: { equals: '발행됨' },
    },
    sorts: [{ property: 'Published', direction: 'descending' }],
  })

  return response.results
    .filter((page): page is PageObjectResponse => page.object === 'page' && 'properties' in page)
    .map(mapPageToReviewPost)
}

/**
 * 특정 게임 리뷰 페이지 속성 조회
 * @param id Notion 페이지 UUID
 */
export async function fetchPostById(id: string): Promise<ReviewPost | null> {
  try {
    const page = await notion.pages.retrieve({ page_id: id })
    if (page.object !== 'page' || !('properties' in page)) return null
    return mapPageToReviewPost(page as PageObjectResponse)
  } catch {
    // 페이지를 찾을 수 없는 경우 null 반환
    return null
  }
}

/**
 * 특정 게임 리뷰 페이지의 본문 블록 목록 조회
 * @param id Notion 페이지 UUID
 */
export async function fetchPostBlocks(id: string): Promise<NotionBlock[]> {
  const blocks: NotionBlock[] = []
  let cursor: string | undefined

  // 블록이 많을 경우 페이지네이션 처리
  do {
    const response = await notion.blocks.children.list({
      block_id: id,
      start_cursor: cursor,
      page_size: 100,
    })

    const mapped = response.results
      .filter((b): b is BlockObjectResponse => b.object === 'block' && 'type' in b)
      .map(mapBlockToNotionBlock)

    blocks.push(...mapped)
    cursor = response.has_more ? (response.next_cursor ?? undefined) : undefined
  } while (cursor)

  return blocks
}

/**
 * 발행된 글 목록에서 카테고리 목록을 파생
 * 별도 API 호출 없이 fetchPosts() 응답에서 추출
 */
export async function fetchCategories(): Promise<CategoryItem[]> {
  const posts = await fetchPosts()

  const categoryMap = new Map<string, number>()
  for (const post of posts) {
    if (!post.category) continue
    categoryMap.set(post.category, (categoryMap.get(post.category) ?? 0) + 1)
  }

  return Array.from(categoryMap.entries())
    .map(([label, count]) => ({
      // URL 슬러그: 소문자 + 공백을 하이픈으로 변환
      slug: label.toLowerCase().replace(/\s+/g, '-'),
      label,
      count,
    }))
    .sort((a, b) => b.count - a.count)
}

/**
 * 글 속성과 본문 블록을 병렬로 조회해 ReviewPostDetail 반환
 * @param id Notion 페이지 UUID
 */
export async function fetchPostDetail(id: string): Promise<ReviewPostDetail | null> {
  const [post, blocks] = await Promise.all([
    fetchPostById(id),
    fetchPostBlocks(id),
  ])

  if (!post) return null

  return { ...post, blocks }
}
