---
name: project-architecture
description: Server/Client Component 분리 방식, 레이아웃 흐름, PageContainer 사용 패턴 — 리뷰 기준선으로 활용
metadata:
  type: project
---

이 프로젝트에서 관찰된 아키텍처 설계 결정들:

- **레이아웃 흐름**: `app/layout.tsx` → `<Providers>` → `<Header>` → `<main>` → `<Footer>`
- **Server Component 기본**: `app/page.tsx`, `app/dashboard/page.tsx`, 모든 sections/layout Server Component
- **Client Component 명시**: `providers.tsx`, `header.tsx`(usePathname), `theme-toggle.tsx`(useTheme), `showcase/page.tsx`(useState)
- **PageContainer 패턴**: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8` — 모든 페이지 콘텐츠 너비 통일
- **shadcn/ui 스타일**: radix-nova, CSS 변수 기반 테마, oklch 색상 시스템 사용
- **폰트**: Geist Sans + Geist Mono, CSS variable로 주입

**Why:** 스타터킷이므로 Server/Client 분리를 명확히 하여 학습 자료로서의 가치를 높임.
**How to apply:** 리뷰 시 불필요한 "use client" 사용 여부를 최우선으로 확인할 것.
