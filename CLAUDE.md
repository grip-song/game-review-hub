@AGENTS.md
@docs/PRD.md
@docs/ROADMAP.md

# CLAUDE.md

## Project Context

- PRD 문서: @docs/PRD.md
- 개발 로드맵: @docs/ROADMAP.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Next.js 버전 주의사항

이 프로젝트는 **Next.js 16.2.6** (React 19.2.4)을 사용합니다. 훈련 데이터와 다른 breaking change가 있으므로, 코드를 작성하기 전에 `node_modules/next/dist/docs/` 내 관련 가이드를 반드시 확인하세요.

### Next.js 16 주요 Breaking Change

- **Async Request APIs**: `cookies()`, `headers()`, `draftMode()`, `params`, `searchParams` 모두 비동기로만 접근 가능 (`await` 필수). 동기 접근은 완전히 제거됨.
- **Turbopack 기본 적용**: `next dev`와 `next build` 모두 Turbopack을 기본 사용. `webpack` 설정이 있으면 빌드 실패.
- **turbopack 설정 위치**: `experimental.turbopack` → `nextConfig.turbopack` (최상위 레벨).
- **ESLint**: `next lint` 대신 ESLint CLI(`eslint`) 직접 사용.

```tsx
// Next.js 16 올바른 패턴
export default async function Page({ params, searchParams }: PageProps<'/blog/[slug]'>) {
  const { slug } = await params
  const query = await searchParams
  // ...
}
```

## 개발 명령어

```bash
npm run dev      # 개발 서버 (Turbopack 기본)
npm run build    # 프로덕션 빌드 (Turbopack 기본)
npm run start    # 프로덕션 서버
npm run lint     # ESLint 검사 (eslint CLI 직접 호출)
```

## 프로젝트 구조

```
src/
├── app/                    # Next.js App Router 라우트
│   ├── layout.tsx          # 루트 레이아웃 (Providers, Header, Footer 포함)
│   ├── page.tsx            # 홈 페이지 (섹션 컴포넌트 조합)
│   ├── dashboard/page.tsx  # 대시보드 페이지 (Server Component)
│   └── showcase/page.tsx   # 컴포넌트 쇼케이스 (Client Component)
├── components/
│   ├── ui/                 # shadcn/ui 컴포넌트 (자동 생성, 직접 수정 주의)
│   ├── layout/             # Header, Footer, PageContainer
│   ├── sections/           # 홈페이지 섹션 (Hero, Features, TechStack, CTA)
│   ├── providers/          # ThemeProvider + TooltipProvider + Toaster 래퍼
│   └── theme-toggle.tsx    # 다크/라이트 모드 토글
└── lib/
    └── utils.ts            # cn() 유틸리티 (clsx + tailwind-merge)
```

## 아키텍처

**레이아웃 흐름**: `app/layout.tsx` → `<Providers>` (next-themes + TooltipProvider + Sonner) → `<Header>` → `<main>{children}` → `<Footer>`

**Server/Client 분리**: `dashboard/page.tsx`는 Server Component, `showcase/page.tsx`는 `"use client"`. `Header`도 `usePathname` 사용으로 Client Component.

**페이지 너비 제어**: `<PageContainer>`(`max-w-7xl mx-auto px-4`)로 콘텐츠 너비 통일.

## shadcn/ui 컴포넌트 추가

```bash
npx shadcn add <component-name>
```

`components.json` 설정: style `radix-nova`, alias `@/components/ui`, CSS 변수 기반 테마, `lucide-react` 아이콘.

## 타입 경로 별칭

`@/*` → `./src/*` (tsconfig.json `paths` 설정)
