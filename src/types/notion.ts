/**
 * Notion API 연동에 사용되는 TypeScript 타입 정의
 * Notion 데이터베이스를 CMS로 활용하는 게임 리뷰 블로그 전용 타입
 */

// ──────────────────────────────────────────────
// 게임 리뷰 도메인 타입
// ──────────────────────────────────────────────

/** Notion 데이터베이스 행 하나를 가공한 게임 리뷰 타입 */
export interface ReviewPost {
  id: string
  title: string
  /** 게임 장르 카테고리 (예: RPG, 액션, 전략) */
  category: string
  /** 세부 태그 목록 (예: 오픈월드, 멀티플레이어) */
  tags: string[]
  /** 발행일 ISO 날짜 문자열 */
  published: string
  status: 'draft' | 'published'
  /** 10점 만점 평점 */
  score: number
  /** 게임 장점 요약 */
  pros: string
  /** 게임 단점 요약 */
  cons: string
  /** 커버 이미지 URL (선택) */
  coverImage?: string
}

/** 글 상세 페이지에서 사용하는 타입 (본문 블록 포함) */
export interface ReviewPostDetail extends ReviewPost {
  /** Notion 페이지 본문 블록 배열 */
  blocks: NotionBlock[]
}

// ──────────────────────────────────────────────
// Notion 블록 타입
// ──────────────────────────────────────────────

/** 지원하는 Notion 블록 타입 유니온 */
export type NotionBlockType =
  | 'paragraph'
  | 'heading_1'
  | 'heading_2'
  | 'heading_3'
  | 'bulleted_list_item'
  | 'numbered_list_item'
  | 'image'
  | 'quote'
  | 'code'
  | 'divider'
  | 'unsupported'

/** Notion rich_text 단일 항목 */
export interface NotionRichText {
  type: 'text' | 'mention' | 'equation'
  plain_text: string
  href: string | null
  annotations: {
    bold: boolean
    italic: boolean
    strikethrough: boolean
    underline: boolean
    code: boolean
    color: string
  }
}

/** 공통 블록 인터페이스 */
interface NotionBlockBase {
  id: string
  type: NotionBlockType
  has_children: boolean
}

/** 텍스트 기반 블록 (paragraph, heading, list item, quote 등) */
interface NotionTextBlock extends NotionBlockBase {
  type: 'paragraph' | 'heading_1' | 'heading_2' | 'heading_3' | 'bulleted_list_item' | 'numbered_list_item' | 'quote'
  [key: string]: unknown
}

/** 코드 블록 */
interface NotionCodeBlock extends NotionBlockBase {
  type: 'code'
  code: {
    rich_text: NotionRichText[]
    language: string
  }
}

/** 이미지 블록 */
interface NotionImageBlock extends NotionBlockBase {
  type: 'image'
  image: {
    type: 'external' | 'file'
    external?: { url: string }
    file?: { url: string; expiry_time: string }
    caption: NotionRichText[]
  }
}

/** 구분선 블록 */
interface NotionDividerBlock extends NotionBlockBase {
  type: 'divider'
}

/** 미지원 블록 */
interface NotionUnsupportedBlock extends NotionBlockBase {
  type: 'unsupported'
}

/** Notion 블록 유니온 타입 */
export type NotionBlock =
  | NotionTextBlock
  | NotionCodeBlock
  | NotionImageBlock
  | NotionDividerBlock
  | NotionUnsupportedBlock

// ──────────────────────────────────────────────
// API 응답 보조 타입
// ──────────────────────────────────────────────

/** 카테고리 목록 (글 목록에서 파생) */
export interface CategoryItem {
  slug: string
  label: string
  count: number
}
