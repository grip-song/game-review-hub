/**
 * Notion 블록 렌더러 (F002, F010)
 * - Notion 페이지 블록을 HTML 요소로 변환
 * - 미지원 블록 타입은 무시 처리 (에러 방지)
 * Server Component (상태 없음)
 *
 * 지원 블록 타입:
 *   paragraph, heading_1/2/3, bulleted_list_item,
 *   numbered_list_item, image, quote, code, divider
 */

import Image from "next/image"
import type { NotionBlock, NotionRichText } from "@/types/notion"

// ──────────────────────────────────────────────
// Rich Text 렌더러
// ──────────────────────────────────────────────

/**
 * Notion rich_text 배열을 인라인 HTML 요소로 변환
 * bold, italic, code, strikethrough 어노테이션 지원
 */
function RichText({ richTexts }: { richTexts: NotionRichText[] }) {
  return (
    <>
      {richTexts.map((text, i) => {
        const { annotations, plain_text, href } = text
        let node: React.ReactNode = plain_text

        if (annotations.code) {
          node = (
            <code className="rounded bg-muted px-1 py-0.5 font-mono text-sm text-foreground">
              {node}
            </code>
          )
        }
        if (annotations.bold) {
          node = <strong>{node}</strong>
        }
        if (annotations.italic) {
          node = <em>{node}</em>
        }
        if (annotations.strikethrough) {
          node = <s>{node}</s>
        }
        if (annotations.underline) {
          node = <u>{node}</u>
        }
        if (href) {
          node = (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-4 hover:text-primary"
            >
              {node}
            </a>
          )
        }

        return <span key={i}>{node}</span>
      })}
    </>
  )
}

// ──────────────────────────────────────────────
// 개별 블록 렌더러
// ──────────────────────────────────────────────

/**
 * 블록 타입별 렌더링 함수
 * 미지원 타입은 null을 반환해 조용히 무시
 */
function NotionBlockRenderer({ block }: { block: NotionBlock }) {
  const raw = block as Record<string, unknown>

  switch (block.type) {
    case "paragraph": {
      const richText = (raw["paragraph"] as { rich_text: NotionRichText[] })?.rich_text ?? []
      return (
        <p className="leading-7 [&:not(:first-child)]:mt-4">
          <RichText richTexts={richText} />
        </p>
      )
    }

    case "heading_1": {
      const richText = (raw["heading_1"] as { rich_text: NotionRichText[] })?.rich_text ?? []
      return (
        <h1 className="mt-8 scroll-m-20 text-2xl font-bold tracking-tight first:mt-0">
          <RichText richTexts={richText} />
        </h1>
      )
    }

    case "heading_2": {
      const richText = (raw["heading_2"] as { rich_text: NotionRichText[] })?.rich_text ?? []
      return (
        <h2 className="mt-8 scroll-m-20 text-xl font-semibold tracking-tight first:mt-0">
          <RichText richTexts={richText} />
        </h2>
      )
    }

    case "heading_3": {
      const richText = (raw["heading_3"] as { rich_text: NotionRichText[] })?.rich_text ?? []
      return (
        <h3 className="mt-6 scroll-m-20 text-lg font-semibold tracking-tight first:mt-0">
          <RichText richTexts={richText} />
        </h3>
      )
    }

    case "bulleted_list_item": {
      const richText =
        (raw["bulleted_list_item"] as { rich_text: NotionRichText[] })?.rich_text ?? []
      return (
        <li className="mt-1">
          <RichText richTexts={richText} />
        </li>
      )
    }

    case "numbered_list_item": {
      const richText =
        (raw["numbered_list_item"] as { rich_text: NotionRichText[] })?.rich_text ?? []
      return (
        <li className="mt-1">
          <RichText richTexts={richText} />
        </li>
      )
    }

    case "quote": {
      const richText = (raw["quote"] as { rich_text: NotionRichText[] })?.rich_text ?? []
      return (
        <blockquote className="mt-4 border-l-4 border-primary pl-4 italic text-muted-foreground">
          <RichText richTexts={richText} />
        </blockquote>
      )
    }

    case "code": {
      const codeBlock = raw["code"] as { rich_text: NotionRichText[]; language: string }
      const richText = codeBlock?.rich_text ?? []
      const language = codeBlock?.language ?? "text"
      return (
        <pre className="mt-4 overflow-x-auto rounded-lg bg-muted p-4">
          <code className={`font-mono text-sm language-${language}`}>
            <RichText richTexts={richText} />
          </code>
        </pre>
      )
    }

    case "image": {
      const imageBlock = raw["image"] as {
        type: "external" | "file"
        external?: { url: string }
        file?: { url: string }
        caption: NotionRichText[]
      }
      const url =
        imageBlock?.type === "external"
          ? imageBlock.external?.url
          : imageBlock?.file?.url
      const caption = imageBlock?.caption ?? []

      if (!url) return null

      return (
        <figure className="mt-6">
          <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-muted">
            <Image
              src={url}
              alt={caption.map((t) => t.plain_text).join("") || "게임 이미지"}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 65vw"
              referrerPolicy="no-referrer"
            />
          </div>
          {caption.length > 0 && (
            <figcaption className="mt-2 text-center text-sm text-muted-foreground">
              <RichText richTexts={caption} />
            </figcaption>
          )}
        </figure>
      )
    }

    case "divider":
      return <hr className="my-8 border-border" />

    case "unsupported":
    default:
      // 미지원 블록 타입은 조용히 무시
      return null
  }
}

// ──────────────────────────────────────────────
// 블록 그루핑 유틸리티
// ──────────────────────────────────────────────

/**
 * 연속된 bulleted_list_item / numbered_list_item을 <ul>/<ol>로 그루핑
 */
function groupBlocks(
  blocks: NotionBlock[]
): Array<NotionBlock | { type: "bulleted_list" | "numbered_list"; items: NotionBlock[] }> {
  const result: Array<
    NotionBlock | { type: "bulleted_list" | "numbered_list"; items: NotionBlock[] }
  > = []

  let i = 0
  while (i < blocks.length) {
    const block = blocks[i]

    if (block.type === "bulleted_list_item") {
      const items: NotionBlock[] = []
      while (i < blocks.length && blocks[i].type === "bulleted_list_item") {
        items.push(blocks[i])
        i++
      }
      result.push({ type: "bulleted_list", items })
    } else if (block.type === "numbered_list_item") {
      const items: NotionBlock[] = []
      while (i < blocks.length && blocks[i].type === "numbered_list_item") {
        items.push(blocks[i])
        i++
      }
      result.push({ type: "numbered_list", items })
    } else {
      result.push(block)
      i++
    }
  }

  return result
}

// ──────────────────────────────────────────────
// 메인 렌더러 컴포넌트
// ──────────────────────────────────────────────

interface NotionRendererProps {
  blocks: NotionBlock[]
}

export function NotionRenderer({ blocks }: NotionRendererProps) {
  const grouped = groupBlocks(blocks)

  return (
    <div className="prose prose-neutral dark:prose-invert max-w-none">
      {grouped.map((item, index) => {
        // 리스트 그룹 처리
        if (item.type === "bulleted_list") {
          return (
            <ul key={index} className="mt-4 list-disc pl-6 space-y-1">
              {item.items.map((block) => (
                <NotionBlockRenderer key={block.id} block={block} />
              ))}
            </ul>
          )
        }
        if (item.type === "numbered_list") {
          return (
            <ol key={index} className="mt-4 list-decimal pl-6 space-y-1">
              {item.items.map((block) => (
                <NotionBlockRenderer key={block.id} block={block} />
              ))}
            </ol>
          )
        }

        // 일반 블록 처리 (NotionBlock 타입)
        const block = item as NotionBlock
        return <NotionBlockRenderer key={block.id} block={block} />
      })}
    </div>
  )
}
