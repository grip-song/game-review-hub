# Development Guidelines — Game Review Blog

## 1. Project Overview

- **목적**: Notion DB를 CMS로 사용하는 개인 게임 리뷰 블로그
- **스택**: Next.js 16.2.6 (App Router) + React 19.2.4 + TypeScript strict + TailwindCSS v4 + shadcn/ui (radix-nova) + @notionhq/client
- **데이터 소스**: Notion API 단독 — 별도 DB/백엔드 없음
- **배포**: Vercel (ISR 전략 적용)

---

## 2. Project Architecture

```
src/
├── app/                          # App Router 라우트 (Server Component 기본)
│   ├── layout.tsx                # 루트 레이아웃 — Providers + Header + Footer
│   ├── page.tsx                  # 홈 (F001, F003, F004)
│   ├── category/[slug]/page.tsx  # 카테고리 필터 (F001, F003)
│   └── posts/[id]/page.tsx       # 글 상세 (F002)
├── components/
│   ├── ui/                       # shadcn/ui 자동생성 — 직접 수정 금지
│   ├── layout/                   # Header.tsx, Footer.tsx, page-container.tsx
│   ├── review/                   # ReviewCard, ReviewGrid, ReviewDetail, NotionRenderer, CategoryFilter
│   ├── search/                   # SearchBar.tsx (Client Component)
│   └── providers/                # ThemeProvider + TooltipProvider + Toaster 래퍼
├── lib/
│   ├── notion.ts                 # Notion API 함수 전용 — 유일한 API 호출 지점
│   └── utils.ts                  # cn() 유틸리티만
└── types/
    └── notion.ts                 # ReviewPost, ReviewPostDetail, NotionBlock 타입
```

---

## 3. Next.js 16 필수 규칙

### Async Request APIs

- `params`, `searchParams`, `cookies()`, `headers()`, `draftMode()` 모두 반드시 `await` 사용

```tsx
// ✅ 올바른 패턴
export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
}

// ❌ 금지 — 동기 접근 제거됨
export default function Page({ params }: { params: { slug: string } }) {
  const { slug } = params  // 런타임 에러
}
```

### Turbopack

- `next.config.ts`에 `webpack` 설정 절대 금지 — Turbopack과 충돌하여 빌드 실패
- `turbopack` 설정은 `experimental.turbopack` 아닌 최상위 `nextConfig.turbopack`에 작성

### ESLint

- `next lint` 사용 금지 → `eslint` CLI 직접 실행: `npm run lint`

---

## 4. Server / Client Component 규칙

- **기본값**: 모든 컴포넌트는 Server Component (파일 상단 `"use client"` 없음)
- **`"use client"` 허용 범위**:
  - `SearchBar.tsx` — 실시간 클라이언트 필터링 (F004)
  - `CategoryFilter.tsx` — 탭 클릭 상태 관리 (F003)
  - `Header.tsx` — `usePathname()` 사용 시
  - `providers/` 하위 파일들
- **금지**: `ReviewCard`, `ReviewGrid`, `ReviewDetail`, `NotionRenderer` 에 `"use client"` 추가 금지

---

## 5. TailwindCSS v4 규칙

- `tailwind.config.js` / `tailwind.config.ts` 생성 금지 — v4는 설정 파일 없는 엔진
- 테마 커스터마이징: `src/app/globals.css` 내 `@theme inline { }` 블록에만 추가
- CSS 변수 기반 색상 사용: `bg-background`, `text-foreground` 등 (직접 hex 값 하드코딩 금지)
- 새 CSS import 추가 시 `globals.css` 상단 `@import` 블록에만 추가

---

## 6. shadcn/ui 컴포넌트 규칙

- 새 컴포넌트 추가: `npx shadcn add <component-name>` 명령어만 사용
- `src/components/ui/` 파일 직접 수정 금지 — 명령어 재실행 시 덮어써짐
- style: `radix-nova`, icon: `lucide-react` — 다른 icon 라이브러리 추가 금지
- 현재 설치된 컴포넌트: `badge`, `button`, `card`, `separator`, `tabs`, `input`, `skeleton`, `progress` 등

---

## 7. Notion API 규칙

### 환경 변수 (서버사이드 전용)

```
NOTION_API_KEY=secret_xxxx        # 클라이언트 노출 절대 금지 (NEXT_PUBLIC_ 접두어 금지)
NOTION_DATABASE_ID=xxxx
```

### lib/notion.ts 함수 명세

| 함수 | ISR | 설명 |
|------|-----|------|
| `fetchPosts()` | `revalidate: 60` | Status="발행됨" 필터 + 발행일 내림차순 |
| `fetchPostById(id)` | `revalidate: 300` | 페이지 속성 조회 → ReviewPost 반환 |
| `fetchPostBlocks(id)` | `revalidate: 300` | 블록 목록 조회 → NotionBlock[] 반환 |

- 모든 Notion API 호출은 `lib/notion.ts`에만 작성 — 페이지/컴포넌트에서 직접 호출 금지
- `fetchPostById` + `fetchPostBlocks` 병렬 호출: `Promise.all([...])` 사용

### Notion DB 필드 매핑 (대소문자 일치 필수)

| 필드 | Notion 속성명 | Notion 타입 |
|------|-------------|-------------|
| title | `Name` | title |
| category | `Category` | select |
| tags | `Tags` | multi_select |
| published | `Published` | date |
| status | `Status` | select ("발행됨") |
| score | `Score` | number |
| pros | `Pros` | rich_text |
| cons | `Cons` | rich_text |

---

## 8. TypeScript 규칙

- `src/types/notion.ts` 파일에 도메인 타입 집중 관리
- `any` 타입 사용 금지 — `unknown` 후 타입 가드 사용
- Notion API 응답 타입: `@notionhq/client`의 `PageObjectResponse`, `BlockObjectResponse` 활용
- 타입 단언(`as`) 최소화 — 불가피한 경우 주석으로 이유 명시

---

## 9. 데이터 페칭 & ISR 규칙

- 글 목록 (`fetchPosts`): `revalidate: 60` — 페이지 상단 `export const revalidate = 60`
- 글 상세 (`fetchPostById`, `fetchPostBlocks`): `revalidate: 300`
- `generateStaticParams()`: `category/[slug]/page.tsx`에 반드시 구현
- `loading.tsx` / `error.tsx`: 각 라우트 세그먼트에 생성 권장

---

## 10. 파일 수정 연동 규칙

| 수정 대상 | 동시 수정 필요 파일 |
|-----------|-----------------|
| Notion 필드 추가/변경 | `src/types/notion.ts` + `src/lib/notion.ts` |
| 새 라우트 페이지 추가 | `src/components/layout/Header.tsx` (네비게이션 링크) |
| 새 shadcn 컴포넌트 사용 | `npx shadcn add` 실행 후 `src/components/ui/` 자동 생성 확인 |
| 환경변수 추가 | `.env.local` + Vercel 환경변수 설정 (배포 시) |
| `ReviewPost` 타입 변경 | `src/types/notion.ts` + `src/lib/notion.ts` 변환 함수 + 관련 컴포넌트 |

---

## 11. NotionRenderer 블록 지원 규칙

지원 블록만 렌더링, 미지원 블록은 `null` 반환 (에러 throw 금지):

| 블록 타입 | 렌더링 요소 |
|-----------|-----------|
| `paragraph` | `<p>` |
| `heading_1` / `heading_2` / `heading_3` | `<h1>` / `<h2>` / `<h3>` |
| `bulleted_list_item` | `<ul><li>` |
| `numbered_list_item` | `<ol><li>` |
| `image` | Next.js `<Image>` (외부 도메인 `next.config.ts`에 등록 필수) |
| `quote` | `<blockquote>` |
| `code` | `<pre><code>` |
| `divider` | `<hr>` |

---

## 12. 반응형 레이아웃 기준

- 모바일 (≤768px): 카드 1열, 단일 컬럼 레이아웃
- 태블릿 (768px~1024px): 카드 2열
- 데스크톱 (≥1024px): 카드 3열
- 글 상세 본문 최대 너비: `max-w-3xl mx-auto`
- 페이지 컨텐츠 최대 너비: `<PageContainer>` 사용 (`max-w-7xl mx-auto px-4`)

---

## 13. 금지 사항

- `tailwind.config.js` 생성 금지
- `webpack` 설정 추가 금지
- `NOTION_API_KEY`에 `NEXT_PUBLIC_` 접두어 사용 금지 (클라이언트 노출 보안 위반)
- `src/components/ui/` 직접 수정 금지
- Notion API를 `lib/notion.ts` 외 파일에서 직접 호출 금지
- `params` / `searchParams` 동기 접근 금지 (반드시 `await`)
- `any` 타입 사용 금지
- `console.log` 프로덕션 코드에 남기기 금지
- 새 컴포넌트에 불필요한 `"use client"` 추가 금지
