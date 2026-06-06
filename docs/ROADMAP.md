# 게임 리뷰 블로그 개발 로드맵

> PRD 기반 개발 계획 | 총 예상 기간: **9~14일**

---

## 전체 타임라인

```
Phase 1  ──────  Phase 2  ──────────  Phase 3  ──────────────  Phase 4  ──────────  Phase 5
초기 설정          공통 모듈              핵심 기능               추가 기능              최적화·배포
 (1~2일)           (2~3일)               (3~4일)                 (2~3일)               (1~2일)
```

---

## Phase 1: 프로젝트 초기 설정 (1~2일)

### 목표

견고한 개발 기반을 마련해 이후 기능 개발이 원활하게 진행될 수 있도록 한다.

### 작업 목록

#### 1-1. 프로젝트 구조 정리

- [ ] `src/app/` 라우트 디렉터리 구성
  - `layout.tsx` — 루트 레이아웃
  - `page.tsx` — 홈 페이지 진입점
  - `category/[slug]/page.tsx` — 카테고리 페이지
  - `posts/[id]/page.tsx` — 글 상세 페이지
- [ ] `src/components/` 서브디렉터리 생성 (`layout/`, `review/`, `search/`)
- [ ] `src/lib/` 디렉터리 생성 (`notion.ts`, `utils.ts`)
- [ ] `src/types/` 디렉터리 생성 및 TypeScript 타입 파일 초기화

#### 1-2. Notion API 연동 환경 구축

- [ ] `@notionhq/client` 패키지 설치
  ```bash
  npm install @notionhq/client
  ```
- [ ] `.env.local` 파일 생성 및 환경 변수 설정
  ```
  NOTION_API_KEY=secret_xxxx
  NOTION_DATABASE_ID=xxxx
  ```
- [ ] `.env.local`을 `.gitignore`에 포함 확인

#### 1-3. 기본 레이아웃 구조 생성

- [ ] `app/layout.tsx` — Providers, Header, Footer 마운트 구조 확정
- [ ] `components/layout/Header.tsx` 스켈레톤 (로고 + 내비게이션 자리)
- [ ] `components/layout/Footer.tsx` 스켈레톤 (사이트명, 제작자 정보)

### 예상 소요 시간

| 작업 | 소요 시간 |
|------|----------|
| 프로젝트 구조 정리 | 2~3시간 |
| Notion API 환경 구축 | 1~2시간 |
| 기본 레이아웃 스켈레톤 | 2~3시간 |
| **합계** | **5~8시간 (1~2일)** |

### 완료 기준

- `npm run dev` 실행 시 에러 없이 빈 홈 페이지가 렌더링된다.
- `.env.local`의 `NOTION_API_KEY`로 Notion API 연결을 콘솔에서 확인할 수 있다.
- Header, Footer가 레이아웃에 포함되어 모든 페이지에 노출된다.

---

## Phase 2: 공통 모듈 개발 (2~3일)

### 목표

모든 기능에서 재사용되는 코어 코드를 먼저 작성해 이후 중복 개발을 방지한다.

### 작업 목록

#### 2-1. TypeScript 공통 타입 정의

- [ ] `src/types/notion.ts` 작성

  ```typescript
  interface ReviewPost {
    id: string
    title: string
    category: string
    tags: string[]
    published: string      // ISO 날짜 문자열
    status: 'draft' | 'published'
    score: number
    pros: string
    cons: string
  }

  interface ReviewPostDetail extends ReviewPost {
    blocks: NotionBlock[]  // 본문 블록 배열
  }
  ```

- [ ] 지원 Notion 블록 타입 유니온 정의
  (`paragraph` | `heading_1` | `heading_2` | `heading_3` | `bulleted_list_item` | `numbered_list_item` | `image` | `quote` | `code` | `divider`)

#### 2-2. Notion API 공통 함수 (`lib/notion.ts`)

- [ ] Notion 클라이언트 초기화 (싱글톤)
- [ ] `fetchPosts()` — Status="발행됨" 필터 + 발행일 내림차순, `revalidate: 60`
- [ ] `fetchPostById(id)` — 페이지 속성 조회, `revalidate: 300`
- [ ] `fetchPostBlocks(id)` — 페이지 블록 목록 조회
- [ ] Notion API 응답 → `ReviewPost` / `ReviewPostDetail` 변환 유틸리티

#### 2-3. 공통 UI 컴포넌트

- [ ] `components/review/ReviewCard.tsx`
  - 제목, 카테고리 뱃지(shadcn `Badge`), 발행일, 평점 표시
  - 클릭 시 `/posts/[id]` 이동
- [ ] `components/review/ReviewGrid.tsx`
  - `ReviewCard` 목록을 반응형 그리드로 배치 (모바일 1열 → 태블릿 2열 → 데스크톱 3열)
  - 빈 상태(empty state) 메시지 처리

#### 2-4. Header 카테고리 탭 연동 준비

- [ ] `Header.tsx`에 카테고리 목록을 props로 받을 수 있도록 구조화
- [ ] 활성 카테고리 하이라이트 스타일 적용

### 예상 소요 시간

| 작업 | 소요 시간 |
|------|----------|
| TypeScript 타입 정의 | 1~2시간 |
| Notion API 공통 함수 | 4~6시간 |
| ReviewCard / ReviewGrid | 3~4시간 |
| Header 카테고리 준비 | 1~2시간 |
| **합계** | **9~14시간 (2~3일)** |

### 완료 기준

- `fetchPosts()`를 호출하면 Notion DB에서 발행된 글 목록이 `ReviewPost[]` 형태로 반환된다.
- `fetchPostById(id)`를 호출하면 해당 글의 속성과 블록이 반환된다.
- `ReviewCard`가 Storybook 없이도 단독으로 임의 데이터로 렌더링된다.
- TypeScript 컴파일 에러 0건.

---

## Phase 3: 핵심 기능 개발 (3~4일)

### 목표

블로그의 본질인 글 목록 조회와 상세 읽기 기능을 완성한다. 이 Phase가 완료되면 실질적으로 동작하는 블로그가 된다.

### 작업 목록

#### 3-1. 홈 페이지 글 목록 (`F001`)

- [ ] `app/page.tsx` Server Component
  - `fetchPosts()` 호출 후 `ReviewGrid`에 전달
  - Notion에서 카테고리 목록 파생 (별도 API 호출 없음)
- [ ] ISR `revalidate: 60` 적용 확인

#### 3-2. 카테고리 페이지 (`F001`, `F003`)

- [ ] `app/category/[slug]/page.tsx` Server Component
  - `params.slug`로 카테고리 필터링
  - 해당 카테고리 글 없을 경우 empty state 표시
  - 현재 카테고리명 헤딩 표시
- [ ] `generateStaticParams()` 구현 (빌드 시 카테고리 슬러그 사전 생성)

#### 3-3. 글 상세 페이지 (`F002`)

- [ ] `app/posts/[id]/page.tsx` Server Component
  - `fetchPostById(id)` + `fetchPostBlocks(id)` 병렬 호출
  - ISR `revalidate: 300` 적용
- [ ] `components/review/ReviewDetail.tsx`
  - 제목, 카테고리 뱃지, 태그 목록, 발행일 헤더
  - 평점 섹션: Score를 10점 만점 시각화 (숫자 + 시각적 표시)
  - 장단점 섹션: Pros / Cons 블록 구분 표시
- [ ] **목록으로 돌아가기** 링크 구현

#### 3-4. Notion 블록 렌더러 (`F002`, `F010`)

- [ ] `components/review/NotionRenderer.tsx`
  - `paragraph` → `<p>`
  - `heading_1/2/3` → `<h1/h2/h3>`
  - `bulleted_list_item` → `<ul><li>`
  - `numbered_list_item` → `<ol><li>`
  - `image` → Next.js `<Image>` 컴포넌트
  - `quote` → `<blockquote>`
  - `code` → `<pre><code>`
  - `divider` → `<hr>`
  - 미지원 블록 타입은 무시 처리 (에러 방지)

### 예상 소요 시간

| 작업 | 소요 시간 |
|------|----------|
| 홈 페이지 글 목록 | 2~3시간 |
| 카테고리 페이지 | 3~4시간 |
| 글 상세 페이지 | 3~4시간 |
| NotionRenderer | 4~6시간 |
| **합계** | **12~17시간 (3~4일)** |

### 완료 기준

- 홈 페이지에서 Notion DB의 발행된 글이 카드로 표시된다.
- 카드 클릭 시 `/posts/[id]`로 이동해 Notion 본문이 렌더링된다.
- 카테고리 페이지에서 해당 카테고리 글만 필터링되어 표시된다.
- 8가지 Notion 블록 타입이 모두 올바르게 렌더링된다.
- 모바일(375px)과 데스크톱(1280px)에서 레이아웃 깨짐 없음.

---

## Phase 4: 추가 기능 개발 (2~3일)

### 목표

핵심 기능 위에 탐색 편의성을 높이는 부가 기능을 추가하고, 검색 엔진 노출을 위한 SEO를 적용한다.

### 작업 목록

#### 4-1. 카테고리 필터 탭 완성 (`F003`)

- [ ] `components/review/CategoryFilter.tsx` Client Component
  - Notion DB에서 파생된 카테고리 목록을 탭/버튼으로 표시
  - "전체" 탭 포함
  - 현재 선택된 카테고리 하이라이트
  - 탭 클릭 시 `/category/[slug]` 라우팅 또는 홈에서 인라인 필터링
- [ ] `Header.tsx`에 `CategoryFilter` 통합

#### 4-2. 키워드 검색 기능 (`F004`)

- [ ] `components/search/SearchBar.tsx` Client Component
  - 검색어 입력 시 제목 기준 실시간 클라이언트 사이드 필터링
  - 홈 페이지 글 목록 인라인 갱신 (페이지 이동 없음)
  - 검색 결과 없을 경우 안내 메시지 표시
- [ ] `Header.tsx`에 검색창 배치

#### 4-3. SEO 최적화

- [ ] `app/layout.tsx` 글로벌 메타데이터 설정 (`title`, `description`, `openGraph`)
- [ ] `app/posts/[id]/page.tsx` — `generateMetadata()` 구현
  - 글 제목을 `<title>`로, pros/cons 요약을 `description`으로 활용
- [ ] `app/category/[slug]/page.tsx` — 카테고리별 메타데이터
- [ ] `robots.txt`, `sitemap.xml` 생성 (`next/sitemap` 또는 수동)

### 예상 소요 시간

| 작업 | 소요 시간 |
|------|----------|
| CategoryFilter 완성 | 2~3시간 |
| SearchBar 구현 | 3~4시간 |
| SEO 최적화 | 2~3시간 |
| **합계** | **7~10시간 (2~3일)** |

### 완료 기준

- 검색창에 키워드 입력 시 홈 페이지 카드 목록이 실시간으로 필터링된다.
- 카테고리 탭 클릭 시 해당 카테고리 글만 표시된다 (홈 인라인 또는 카테고리 페이지).
- 글 상세 페이지의 `<title>`이 해당 게임 리뷰 제목으로 표시된다.
- Lighthouse SEO 점수 90점 이상.

---

## Phase 5: 최적화 및 배포 (1~2일)

### 목표

완성된 기능의 품질을 높이고 Vercel에 배포해 실제 서비스를 런칭한다.

### 작업 목록

#### 5-1. 성능 최적화

- [ ] Notion API 응답 캐싱 전략 검토 및 확정
  - 글 목록: `revalidate: 60` (1분)
  - 글 상세: `revalidate: 300` (5분)
- [ ] Next.js `<Image>` 컴포넌트로 이미지 최적화 적용 확인
- [ ] 불필요한 클라이언트 번들 최소화 (`"use client"` 범위 최소화)
- [ ] Lighthouse Performance 점수 측정 및 개선

#### 5-2. 반응형 디자인 최종 검증 (`F011`)

- [ ] 375px (모바일) — 단일 컬럼, 터치 타겟 크기 확인
- [ ] 768px (태블릿) — 2열 그리드, 헤더 레이아웃
- [ ] 1280px (데스크톱) — 3열 그리드, 최대 너비 제한
- [ ] 글 상세 본문 최대 너비 제한으로 가독성 확보

#### 5-3. Vercel 배포

- [ ] Vercel 프로젝트 연결 (GitHub 저장소 연동)
- [ ] Vercel 환경 변수 등록
  - `NOTION_API_KEY`
  - `NOTION_DATABASE_ID`
- [ ] 프로덕션 빌드 성공 확인 (`npm run build` 에러 0건)
- [ ] 배포 URL에서 전체 사용자 여정 E2E 검증
  1. 홈 페이지 → 카드 목록 표시 확인
  2. 카드 클릭 → 글 상세 렌더링 확인
  3. 카테고리 탭 → 필터링 확인
  4. 검색창 → 실시간 필터링 확인

### 예상 소요 시간

| 작업 | 소요 시간 |
|------|----------|
| 성능 최적화 | 2~3시간 |
| 반응형 최종 검증 | 1~2시간 |
| Vercel 배포 및 E2E 검증 | 2~3시간 |
| **합계** | **5~8시간 (1~2일)** |

### 완료 기준

- `npm run build` 에러 및 TypeScript 에러 0건.
- Vercel 배포 URL에서 전체 사용자 여정이 에러 없이 동작한다.
- 모바일(375px) / 데스크톱(1280px) 반응형 레이아웃 이상 없음.
- Lighthouse Performance 75점 이상, SEO 90점 이상.

---

## 기능 ID ↔ Phase 매핑

| 기능 ID | 기능명 | 구현 Phase |
|---------|--------|-----------|
| F010 | Notion API 연동 | Phase 1~2 |
| F001 | Notion 글 목록 조회 | Phase 3 |
| F002 | 글 상세 표시 | Phase 3 |
| F003 | 카테고리 필터링 | Phase 3~4 |
| F004 | 키워드 검색 | Phase 4 |
| F011 | 반응형 레이아웃 | Phase 3~5 |

---

## MVP 완료 후 백로그 (Phase 이후)

PRD에서 명시적으로 제외된 기능이며, MVP 검증 후 필요 시 추가한다.

- 댓글 기능
- 좋아요 / 북마크
- 회원가입 / 로그인
- RSS 피드
- 태그 기반 필터링
- 페이지네이션
- 다크모드 토글
