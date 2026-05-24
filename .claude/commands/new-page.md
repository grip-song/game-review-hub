---
description: 'Next.js 16 App Router 페이지를 올바른 패턴으로 스캐폴딩합니다'
allowed-tools:
  [
    'Bash(New-Item:*)',
    'Bash(Test-Path:*)',
    'Read',
    'Write',
    'Edit',
    'AskUserQuestion',
  ]
---

# Claude 명령어: New Page

`$ARGUMENTS`로 전달된 경로에 Next.js 16 App Router 페이지를 생성합니다.

## 사용법

```
/new-page <경로>
```

예시:
- `/new-page settings` → `src/app/settings/page.tsx`
- `/new-page dashboard/users` → `src/app/dashboard/users/page.tsx`
- `/new-page blog/[slug]` → `src/app/blog/[slug]/page.tsx` (동적 라우트)

## 프로세스

### 1단계: 경로 파싱

`$ARGUMENTS`에서 경로를 읽어 다음을 결정합니다:

- **파일 경로**: `src/app/{경로}/page.tsx`
- **컴포넌트명**: 경로 세그먼트를 PascalCase로 변환 + `Page` 접미사
  - `settings` → `SettingsPage`
  - `dashboard/users` → `DashboardUsersPage`
  - `blog/[slug]` → `BlogSlugPage`
- **동적 라우트 여부**: 경로에 `[` 포함 여부로 판단

### 2단계: 사용자에게 2가지 질문

`AskUserQuestion`으로 아래 두 항목을 동시에 질문합니다:

**Q1. 컴포넌트 타입**
- Server Component (기본) — 데이터 fetch, DB 접근 등 서버 로직 포함 시
- Client Component (`"use client"`) — useState, useEffect, 브라우저 이벤트 등 필요 시

**Q2. Header 네비게이션 등록**
- 등록 — `src/components/layout/header.tsx`의 `navLinks` 배열에 추가
- 등록 안 함

### 3단계: 페이지 파일 생성

답변에 따라 아래 템플릿 중 하나를 사용합니다.

#### Server Component (동적 라우트 없음)

```tsx
import { PageContainer } from "@/components/layout/page-container"

export default function {컴포넌트명}() {
  return (
    <div className="py-8">
      <PageContainer>
        <div className="space-y-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{페이지 제목}</h1>
            <p className="text-muted-foreground">페이지 설명을 입력하세요.</p>
          </div>
        </div>
      </PageContainer>
    </div>
  )
}
```

#### Server Component (동적 라우트 — Next.js 16 필수 패턴)

```tsx
import { PageContainer } from "@/components/layout/page-container"

interface PageProps {
  params: Promise<{ {파라미터명}: string }>
}

export default async function {컴포넌트명}({ params }: PageProps) {
  const { {파라미터명} } = await params

  return (
    <div className="py-8">
      <PageContainer>
        <div className="space-y-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{페이지 제목}</h1>
            <p className="text-muted-foreground">{파라미터명}: {`{${파라미터명}}`}</p>
          </div>
        </div>
      </PageContainer>
    </div>
  )
}
```

#### Client Component

```tsx
"use client"

import { PageContainer } from "@/components/layout/page-container"

export default function {컴포넌트명}() {
  return (
    <div className="py-8">
      <PageContainer>
        <div className="space-y-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{페이지 제목}</h1>
            <p className="text-muted-foreground">페이지 설명을 입력하세요.</p>
          </div>
        </div>
      </PageContainer>
    </div>
  )
}
```

### 4단계: 디렉토리 생성 후 파일 쓰기

PowerShell로 디렉토리를 먼저 생성한 뒤 파일을 씁니다:

```powershell
New-Item -ItemType Directory -Force -Path "src/app/{경로}"
```

### 5단계: Header nav 등록 (선택한 경우만)

`src/components/layout/header.tsx`의 `navLinks` 배열에 항목 추가:

```ts
const navLinks = [
  { href: "/", label: "홈" },
  { href: "/dashboard", label: "대시보드" },
  { href: "/showcase", label: "쇼케이스" },
  { href: "/{경로}", label: "{페이지명}" },  // ← 추가
]
```

## 완료 후 출력

생성된 파일 경로와 접속 URL을 안내합니다:

```
✅ 페이지 생성 완료
- 파일: src/app/{경로}/page.tsx
- URL:  http://localhost:3000/{경로}
- 타입: Server Component | Client Component
- Nav:  등록됨 | 등록 안 함
```

## 주의사항

- `params`, `searchParams`는 반드시 `await`로 접근 (Next.js 16 필수)
- 동적 라우트가 아닌 경우 `async` 키워드 불필요
- `"use client"` 선언은 반드시 파일 최상단 첫 줄에 위치
- `PageContainer`로 콘텐츠 너비를 통일 (`max-w-7xl`)
