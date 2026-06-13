# 게임 리뷰 블로그 고도화 로드맵

> MVP 완료 이후 고도화 개발 계획 | 대상 Phase: **Phase 6 ~ 8** | 총 예상 기간: **5~9일**

게임 리뷰 블로그의 MVP(Phase 1~5)가 완료된 상태에서, 사용자 경험 개선·운영 편의성·확장성을 높이기 위한 고도화 단계를 정의합니다.

---

## 전체 타임라인

```
[MVP 완료 ✅]                       [고도화 단계 — 본 문서 범위]
Phase 1~5                Phase 6  ──────────  Phase 7  ──────────────  Phase 8
초기설정·공통·핵심·       다크모드 + 공유링크    관리자 레이아웃           확장 기능
추가기능·배포             (UI/UX 개선)          (어드민 기능)            (인증·필터·페이지네이션)
(완료)                    (1~2일)               (2~3일)                 (2~4일)
```

| 단계 | 핵심 주제 | 예상 기간 | 상태 |
|------|----------|----------|------|
| Phase 1~5 | MVP (글 목록·상세·카테고리·검색·배포) | 9~14일 | ✅ 완료 |
| **Phase 6** | 다크모드 + 리뷰 공유 링크 | 1~2일 | ⬜ 예정 |
| **Phase 7** | 관리자 레이아웃 (리뷰 목록 뷰) | 2~3일 | ⬜ 예정 |
| **Phase 8** | 확장 기능 (인증·태그 필터·페이지네이션) | 2~4일 | ⬜ 예정 |

> MVP 상세 히스토리는 `docs/roadmaps/ROADMAP_v1.md`를 참고하세요.

---

## 기술 스택 (현행 유지)

- **Next.js 16.2.6** (App Router, Turbopack 기본) — `params`/`searchParams`/`cookies()`/`headers()` 모두 비동기 접근 (`await` 필수)
- **React 19.2.4**, **TypeScript 5.6+**
- **TailwindCSS v4** (설정 파일 없는 엔진), **shadcn/ui** (`radix-nova` 스타일), **Lucide React**
- **next-themes** (다크모드, 이미 설치·`Providers`에 마운트됨)
- **Sonner** (토스트, 이미 `Providers`에 `<Toaster />` 마운트됨)
- **@notionhq/client** (Notion CMS 연동)
- **Vercel** 배포

---

## Phase 6: 다크모드 + 리뷰 공유 링크 (1~2일)

### 목표

이미 설치·마운트되어 있으나 UI에 노출되지 않은 다크모드 토글을 활성화하고, 글 상세 페이지에 공유 링크 복사 기능을 추가해 사용자 경험을 개선한다. 인프라(`ThemeProvider`, `Toaster`)가 이미 갖춰져 있어 비교적 빠르게 완료 가능하다.

### 작업 목록

#### 6-1. 다크모드 토글 헤더 적용

- [ ] `src/components/theme-toggle.tsx` 동작 검증 (`next-themes`의 `useTheme` 사용, 라이트/다크/시스템 순환 또는 토글)
- [ ] `src/components/layout/header.tsx`에 `<ThemeToggle />` 배치
  - 데스크톱: 카테고리 탭 우측 영역에 아이콘 버튼으로 배치
  - 모바일: `SheetContent` 내부 하단 또는 헤더 우측에 배치
- [ ] 하이드레이션 불일치 방지 (`next-themes`는 클라이언트에서만 테마 확정 → `mounted` 가드 또는 `suppressHydrationWarning` 확인)
- [ ] `src/app/layout.tsx`의 `<html>` 태그에 `suppressHydrationWarning` 적용 여부 확인

#### 6-2. TailwindCSS v4 다크모드 스타일 점검

- [ ] `Providers`의 `ThemeProvider attribute="class"` 설정과 Tailwind v4 다크 변형 연동 확인
- [ ] 전역 CSS(`globals.css`)에 `.dark` CSS 변수 토큰 정의 확인 (배경·전경·뱃지·카드 색상)
- [ ] 주요 컴포넌트 다크모드 가독성 검수
  - `ReviewCard`, `ReviewGrid`, `ReviewDetail`, `NotionRenderer`
  - `Header`, `Footer`, `Badge`, `Separator`
  - 본문 코드 블록(`<pre><code>`)·인용(`<blockquote>`) 대비 확인

#### 6-3. 리뷰 공유 링크 복사 기능

- [ ] `src/components/review/ShareButton.tsx` 신규 생성 (Client Component, `"use client"`)
  - 현재 페이지 URL을 `navigator.clipboard.writeText()`로 복사
  - 복사 성공 시 Sonner `toast.success("링크가 복사되었습니다")` 호출
  - 복사 실패 시 `toast.error()` 폴백 처리
- [ ] 모바일 Web Share API 분기 처리
  - `navigator.share` 지원 시 네이티브 공유 시트 호출 (제목·URL 전달)
  - 미지원 시 클립보드 복사로 폴백
- [ ] `src/components/review/ReviewDetail.tsx` 헤더 영역에 `<ShareButton />` 통합
- [ ] 소셜 공유 확장 대비 구조 설계 (props로 공유 채널 확장 가능하도록 인터페이스 정의 — 실제 구현은 백로그)

### 예상 소요 시간

| 작업 | 소요 시간 |
|------|----------|
| 다크모드 토글 헤더 적용 | 2~3시간 |
| TailwindCSS v4 다크모드 점검 | 2~3시간 |
| 공유 링크 복사 기능 | 3~4시간 |
| **합계** | **7~10시간 (1~2일)** |

### 완료 기준

- 헤더의 토글 버튼으로 라이트/다크 모드가 전환되며, 새로고침 후에도 선택이 유지된다.
- 다크모드에서 모든 페이지(홈·카테고리·상세)의 텍스트·뱃지·카드 대비가 충분하다 (가독성 깨짐 없음).
- 하이드레이션 경고가 콘솔에 출력되지 않는다.
- 글 상세 페이지에서 공유 버튼 클릭 시 URL이 클립보드에 복사되고 토스트가 표시된다.
- 모바일 환경(Web Share API 지원)에서 네이티브 공유 시트가 정상 호출된다.

---

## Phase 7: 관리자 레이아웃 — 리뷰 목록 뷰 (2~3일)

### 목표

블로그 운영자가 Notion DB의 전체 리뷰(초안 포함)를 한눈에 관리할 수 있는 관리자 전용 화면을 제공한다. 일반 블로그 레이아웃과 분리된 `(admin)` Route Group을 구성하고, 간단한 환경변수 기반 패스워드 보호를 적용한다.

### 작업 목록

#### 7-1. Route Group 및 관리자 레이아웃 골격

- [ ] `src/app/(admin)/` Route Group 디렉터리 생성 (URL 경로에 `(admin)` 미포함)
- [ ] `src/app/(admin)/layout.tsx` — 관리자 전용 레이아웃
  - 일반 블로그 `Header`/`Footer` 제외, 관리자 전용 사이드바/헤더 구성
  - `src/components/admin/AdminSidebar.tsx` (네비게이션: 리뷰 목록 등)
  - `src/components/admin/AdminHeader.tsx` (관리자 표시, 로그아웃 자리)
- [ ] `src/app/(admin)/admin/reviews/page.tsx` — 리뷰 목록 페이지 (Server Component)

#### 7-2. 전체 리뷰 조회 (초안 포함) Notion 함수

- [ ] `src/lib/notion.ts`에 `fetchAllPosts()` 추가
  - 기존 `fetchPosts()`와 달리 Status 필터 없이 전체 행 조회 (초안 + 발행됨)
  - 발행일 내림차순 정렬 유지
  - 관리자 화면은 최신 데이터가 중요 → `revalidate` 짧게 또는 `cache: 'no-store'` 검토
- [ ] Notion 페이지 URL 파생 유틸 추가 (`notion.so/{id}` 형태 바로가기 링크 생성)
- [ ] `src/types/notion.ts`에 관리자용 타입 확장 (`AdminReviewRow` 등, Notion 페이지 URL 포함)

#### 7-3. 리뷰 목록 테이블 UI

- [ ] shadcn `Table` 컴포넌트 설치 (`npx shadcn add table`)
- [ ] `src/components/admin/ReviewTable.tsx` 구현
  - 컬럼: 제목 / 카테고리 / 상태(초안·발행됨 뱃지) / 발행일 / 평점 / Notion 바로가기
  - 상태별 뱃지 색상 구분 (발행됨=primary, 초안=muted)
  - "Notion에서 열기" 외부 링크 버튼 (`target="_blank"`, `rel="noopener noreferrer"`)
  - 빈 상태(empty state) 메시지 처리
- [ ] 글 상세 미리보기 링크 (발행됨 글은 `/posts/[id]`로 연결)

#### 7-4. 환경변수 기반 패스워드 보호

- [ ] `.env.local`에 `ADMIN_PASSWORD` 추가 (`.env.local.example`에도 키 반영)
- [ ] `src/middleware.ts` 또는 라우트 가드로 `(admin)` 경로 보호
  - 쿠키 기반 간단 세션 (`cookies()`는 비동기 → `await cookies()`)
  - Next.js 16 비동기 API 패턴 준수
- [ ] `src/app/(admin)/admin/login/page.tsx` — 간단 패스워드 입력 화면
  - Server Action으로 패스워드 검증 후 인증 쿠키 설정
  - 실패 시 에러 메시지 표시
- [ ] 미인증 접근 시 로그인 페이지로 리다이렉트

#### 7-5. 테스트 체크리스트 (Playwright MCP)

- [ ] 미인증 상태에서 `/admin/reviews` 접근 → 로그인 페이지 리다이렉트 검증
- [ ] 올바른 패스워드 입력 → 리뷰 목록 진입 검증
- [ ] 잘못된 패스워드 입력 → 에러 메시지 표시 검증
- [ ] 리뷰 목록 테이블에 초안 + 발행됨 글이 모두 표시되는지 검증
- [ ] "Notion에서 열기" 링크가 올바른 URL을 가리키는지 검증

### 예상 소요 시간

| 작업 | 소요 시간 |
|------|----------|
| Route Group · 관리자 레이아웃 골격 | 2~3시간 |
| 전체 리뷰 조회 Notion 함수 | 2~3시간 |
| 리뷰 목록 테이블 UI | 3~4시간 |
| 패스워드 보호 (미들웨어·로그인) | 3~5시간 |
| Playwright MCP 테스트 | 2~3시간 |
| **합계** | **12~18시간 (2~3일)** |

### 완료 기준

- `(admin)` Route Group이 일반 블로그 레이아웃과 분리되어 독립 레이아웃으로 렌더링된다.
- `/admin/reviews`에서 초안 포함 전체 리뷰가 테이블로 표시된다.
- 각 행에서 Notion 원본 페이지로 바로 이동할 수 있다.
- 환경변수 패스워드 없이는 관리자 페이지에 접근할 수 없다.
- Playwright MCP E2E 테스트 시나리오가 모두 통과한다.
- `npm run build` 에러 및 TypeScript 에러 0건.

---

## Phase 8: 확장 기능 (2~4일)

### 목표

백로그 항목 중 운영 가치가 높은 기능을 선별해 구현한다. 콘텐츠 누적에 따른 탐색성·접근 제어를 강화한다. 작업 단위가 독립적이므로 우선순위에 따라 부분 선택 적용 가능하다.

### 작업 목록

#### 8-1. 정식 관리자 인증 도입 (선택)

- [ ] Phase 7의 간이 패스워드 보호를 정식 인증으로 승격 검토
  - 옵션 A: `next-auth`(Auth.js) 도입 — Credentials 또는 OAuth
  - 옵션 B: 환경변수 다중 계정 + 세션 강화
- [ ] 세션 만료·로그아웃 처리 구현
- [ ] **테스트 체크리스트 (Playwright MCP)**: 로그인 → 세션 유지 → 로그아웃 → 재인증 플로우 검증

#### 8-2. 태그 기반 필터링 (`F003` 확장)

- [ ] `src/components/review/TagFilter.tsx` 신규 (Client Component)
  - Notion `multi_select` 태그 목록을 파생해 필터 칩으로 표시
  - 다중 태그 선택 시 AND/OR 동작 정의
- [ ] 홈/카테고리 페이지에서 태그 필터와 카테고리 필터 조합 동작
- [ ] URL 쿼리스트링 연동 (`?tag=오픈월드`) — `searchParams`는 비동기 (`await searchParams`)
- [ ] **테스트 체크리스트 (Playwright MCP)**: 태그 선택 → 목록 필터링 → URL 동기화 검증

#### 8-3. 페이지네이션 / 무한 스크롤

- [ ] 글 수 증가 대비 목록 분할 전략 결정 (페이지네이션 vs 무한 스크롤)
- [ ] Notion `databases.query`의 `start_cursor`·`page_size` 기반 커서 페이징 구현
- [ ] `src/components/review/Pagination.tsx` 또는 무한 스크롤 로더 구현
- [ ] 홈·카테고리·관리자 목록에 적용
- [ ] **테스트 체크리스트 (Playwright MCP)**: 다음 페이지 로드 → 누적 표시 → 마지막 페이지 처리 검증

#### 8-4. 성능·SEO 재점검

- [ ] 신규 기능 추가 후 Lighthouse 재측정 (Performance 75+, SEO 90+ 유지)
- [ ] 관리자 페이지 `noindex` 메타데이터 적용 (검색 노출 차단)
- [ ] 다크모드 OG 이미지·테마 컬러 메타 점검

### 예상 소요 시간

| 작업 | 소요 시간 |
|------|----------|
| 정식 관리자 인증 (선택) | 4~6시간 |
| 태그 기반 필터링 | 3~5시간 |
| 페이지네이션 / 무한 스크롤 | 4~6시간 |
| 성능·SEO 재점검 | 2~3시간 |
| **합계** | **13~20시간 (2~4일, 선택 적용 시 단축)** |

### 완료 기준

- (인증 적용 시) 정식 로그인/로그아웃 플로우가 동작하고 세션이 안전하게 관리된다.
- 태그 필터로 글 목록이 정확히 필터링되고 URL과 동기화된다.
- 글이 많아져도 페이지네이션/무한 스크롤로 목록이 끊김 없이 탐색된다.
- 관리자 페이지가 검색 엔진에 노출되지 않는다.
- Lighthouse Performance 75점 이상, SEO 90점 이상 유지.
- Playwright MCP E2E 테스트 시나리오가 모두 통과한다.

---

## 신규 파일 구조 (고도화 추가분)

```
src/
├── app/
│   └── (admin)/                       # [Phase 7] 관리자 Route Group (URL 경로 미포함)
│       ├── layout.tsx                 # 관리자 전용 레이아웃 (블로그 레이아웃과 분리)
│       └── admin/
│           ├── login/page.tsx         # [Phase 7] 패스워드 로그인 화면
│           └── reviews/page.tsx       # [Phase 7] 리뷰 목록 (초안 포함)
├── components/
│   ├── theme-toggle.tsx               # [Phase 6] 기존 컴포넌트 → 헤더에 적용
│   ├── review/
│   │   ├── ShareButton.tsx            # [Phase 6] 공유 링크 복사 버튼
│   │   ├── TagFilter.tsx              # [Phase 8] 태그 필터 (선택)
│   │   └── Pagination.tsx             # [Phase 8] 페이지네이션 (선택)
│   └── admin/                         # [Phase 7] 관리자 전용 컴포넌트
│       ├── AdminSidebar.tsx
│       ├── AdminHeader.tsx
│       └── ReviewTable.tsx
├── lib/
│   └── notion.ts                      # [Phase 7] fetchAllPosts() 추가
├── types/
│   └── notion.ts                      # [Phase 7] AdminReviewRow 타입 추가
└── middleware.ts                      # [Phase 7] (admin) 경로 보호
```

---

## Phase ↔ 주제 매핑

| Phase | 주제 | 신규 주요 산출물 | 의존성 |
|-------|------|-----------------|--------|
| Phase 6 | 다크모드 + 공유 링크 | `theme-toggle` 적용, `ShareButton.tsx` | MVP 인프라(Providers) 재사용 |
| Phase 7 | 관리자 레이아웃 | `(admin)` Route Group, `ReviewTable.tsx`, `middleware.ts` | `lib/notion.ts` 확장 |
| Phase 8 | 확장 기능 | `TagFilter`, `Pagination`, 정식 인증 | Phase 7 인증 골격 위에 확장 |

---

## MVP 완료 후 전체 백로그

PRD에서 명시적으로 제외되었거나 고도화 Phase에 일부 포함된 항목입니다. 우선순위에 따라 위 Phase로 승격합니다.

| 항목 | 상태 | 비고 |
|------|------|------|
| 다크모드 토글 | 🔜 Phase 6 | 본 로드맵에서 구현 |
| 리뷰 공유 링크 | 🔜 Phase 6 | 본 로드맵에서 구현 |
| 관리자 리뷰 목록 | 🔜 Phase 7 | 본 로드맵에서 구현 |
| 회원가입 / 로그인 (인증) | 🔜 Phase 7~8 | 간이 → 정식 단계적 도입 |
| 태그 기반 필터링 | 🔜 Phase 8 | 선택 적용 |
| 페이지네이션 | 🔜 Phase 8 | 선택 적용 |
| 댓글 기능 | ⬜ 백로그 | 외부 서비스(Giscus 등) 검토 |
| 좋아요 / 북마크 | ⬜ 백로그 | 사용자 상태 저장소 필요 |
| RSS 피드 | ⬜ 백로그 | `app/feed.xml/route.ts` 검토 |
| 소셜 공유 확장 (X·카카오톡) | ⬜ 백로그 | Phase 6 `ShareButton` 구조 위에 확장 |

---

## 개발 워크플로우 (고도화 단계 공통)

1. **작업 계획** — 기존 코드베이스 현황 파악 후 본 `ROADMAP.md`에 작업 반영
2. **작업 구현** — Next.js 16 비동기 API 패턴(`await params`/`searchParams`/`cookies()`) 준수
3. **테스트** — API 연동·비즈니스 로직·인증 플로우는 Playwright MCP로 E2E 검증 필수
4. **로드맵 업데이트** — 완료 작업을 ✅로 표시하고 상태 표를 갱신
5. **빌드 검증** — `npm run build`(Turbopack) 에러 0건 확인 후 Vercel 배포

> ⚠️ Next.js 16 주의: `webpack` 설정 금지(Turbopack 기본), `next lint` 대신 `eslint` CLI 직접 호출, turbopack 설정은 `nextConfig.turbopack` 최상위 레벨.
