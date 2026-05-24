# 게임 리뷰 블로그 MVP PRD

## 핵심 정보

**목적**: Notion을 CMS로 활용해 게임 리뷰를 작성하면 자동으로 블로그에 반영되는 개인 게임 리뷰 사이트를 제공한다
**사용자**: 게임 리뷰를 Notion에서 관리하고 싶은 1인 블로그 운영자

---

## 사용자 여정

```
1. 홈 페이지 (최근 게임 리뷰 목록)
   ↓ 카테고리 탭 클릭

2. 카테고리 페이지 (카테고리별 글 목록)
   ↓ 글 카드 클릭

   [카테고리 선택] → 카테고리 페이지 → 글 카드 클릭
   [검색어 입력]   → 검색 결과 인라인 표시 → 글 카드 클릭
   ↓

3. 글 상세 페이지 (Notion 본문 렌더링)
   ↓ 브라우저 뒤로가기 또는 홈/카테고리 링크 클릭

4. 홈 페이지 또는 카테고리 페이지로 복귀
```

---

## 기능 명세

### 1. MVP 핵심 기능

| ID | 기능명 | 설명 | MVP 필수 이유 | 관련 페이지 |
|----|--------|------|--------------|------------|
| **F001** | Notion 글 목록 조회 | Notion 데이터베이스에서 Status가 "발행됨"인 글을 최신순으로 가져와 카드 목록으로 표시 | 서비스의 핵심 콘텐츠 진입점 | 홈 페이지, 카테고리 페이지 |
| **F002** | 글 상세 표시 | 선택한 글의 Notion 페이지 본문을 HTML로 변환해 렌더링. 제목, 카테고리, 태그, 발행일, 평점, 장단점 표시 | 리뷰 핵심 내용 전달 | 글 상세 페이지 |
| **F003** | 카테고리 필터링 | 카테고리 탭/버튼을 클릭해 해당 카테고리의 글만 목록으로 표시 | 방문자가 원하는 장르 탐색 가능 | 홈 페이지, 카테고리 페이지 |
| **F004** | 키워드 검색 | 검색창에 키워드 입력 시 제목 기준으로 글 목록을 실시간 필터링 | 글이 많아질 경우 빠른 탐색 지원 | 홈 페이지 |

### 2. MVP 필수 지원 기능

| ID | 기능명 | 설명 | MVP 필수 이유 | 관련 페이지 |
|----|--------|------|--------------|------------|
| **F010** | Notion API 연동 | `@notionhq/client`로 데이터베이스 쿼리 및 페이지 블록 fetch. 환경 변수로 API 키/DB ID 관리 | 모든 기능의 데이터 공급원 | 서버 공통 (API 레이어) |
| **F011** | 반응형 레이아웃 | 모바일(375px) ~ 데스크톱(1280px) 해상도 대응. 카드 그리드, 본문 가독성 확보 | 다양한 디바이스에서 접근 가능해야 함 | 홈 페이지, 카테고리 페이지, 글 상세 페이지 |

### 3. MVP 이후 기능 (제외)

- 댓글 기능
- 좋아요 / 북마크
- 회원가입 / 로그인
- RSS 피드
- 다크모드 토글 (필요 시 추후 추가)
- 태그 기반 필터링 (카테고리 필터로 대체)
- 페이지네이션 (초기에는 전체 목록 표시)

---

## 메뉴 구조

```
게임 리뷰 블로그 내비게이션

헤더 메뉴 (항상 표시)
├── 로고 / 사이트명 → 홈 페이지 (F001)
├── 카테고리 탭 목록 (Notion DB에서 동적 생성) → 카테고리 페이지 (F003)
└── 검색창 → 홈 페이지 인라인 결과 (F004)

공통 푸터
└── 사이트명, 제작자 정보
```

---

## 페이지별 상세 기능

### 홈 페이지

> **구현 기능:** `F001`, `F003`, `F004`, `F011` | **인증:** 불필요

| 항목 | 내용 |
|------|------|
| **역할** | 사이트 진입점. 최근 발행된 게임 리뷰 목록을 카드 형태로 표시 |
| **진입 경로** | 로고 클릭, 브라우저 직접 접속, 뒤로가기 |
| **사용자 행동** | 최신 리뷰 카드 탐색, 카테고리 탭 클릭, 검색어 입력, 카드 클릭해 상세 페이지 이동 |
| **주요 기능** | 카드 그리드: 제목, 카테고리 뱃지, 발행일, 평점(별점 또는 숫자) 표시<br>카테고리 탭: 전체 / 각 카테고리 버튼 (F003)<br>검색창: 제목 기준 실시간 클라이언트 필터링 (F004)<br>Notion API 호출로 Status="발행됨" 글만 로드 (F001)<br>**글 카드 클릭** → 글 상세 페이지로 이동 |
| **다음 이동** | 카드 클릭 → 글 상세 페이지, 카테고리 탭 → 카테고리 페이지 |

---

### 카테고리 페이지

> **구현 기능:** `F001`, `F003`, `F011` | **인증:** 불필요

| 항목 | 내용 |
|------|------|
| **역할** | 선택한 카테고리에 속한 게임 리뷰 글만 필터링하여 목록 표시 |
| **진입 경로** | 홈 페이지의 카테고리 탭 클릭, 헤더 카테고리 메뉴 클릭 |
| **사용자 행동** | 특정 장르(예: RPG, 액션) 리뷰만 탐색, 카드 클릭해 상세 이동 |
| **주요 기능** | 현재 선택된 카테고리명 헤딩 표시<br>해당 카테고리 글 카드 그리드 (F001, F003)<br>글 없을 경우 빈 상태(empty state) 메시지 표시<br>반응형 카드 레이아웃 (F011)<br>**글 카드 클릭** → 글 상세 페이지로 이동 |
| **다음 이동** | 카드 클릭 → 글 상세 페이지, 다른 카테고리 탭 → 해당 카테고리 페이지 |

---

### 글 상세 페이지

> **구현 기능:** `F002`, `F010`, `F011` | **인증:** 불필요

| 항목 | 내용 |
|------|------|
| **역할** | 선택한 게임 리뷰의 전체 내용 표시. Notion 페이지 블록을 HTML로 변환해 렌더링 |
| **진입 경로** | 홈 페이지 또는 카테고리 페이지의 글 카드 클릭 |
| **사용자 행동** | 리뷰 본문 읽기, 평점 확인, 장단점 확인, 뒤로가기로 목록 복귀 |
| **주요 기능** | 제목, 카테고리 뱃지, 태그 목록, 발행일 헤더 영역 표시 (F002)<br>평점 섹션: Score 필드 값을 10점 만점으로 시각화 (F002)<br>장단점 섹션: Pros / Cons 필드를 구분된 블록으로 표시 (F002)<br>본문: Notion 페이지 블록을 순서대로 렌더링 (heading, paragraph, image, bulleted list 등) (F002, F010)<br>반응형 단일 컬럼 레이아웃, 최대 너비 제한으로 가독성 확보 (F011)<br>**목록으로 돌아가기** 링크 |
| **다음 이동** | 뒤로가기 링크 클릭 → 이전 목록 페이지 |

---

## 데이터 모델

Notion 데이터베이스를 직접 CMS로 사용하므로 별도 DB 없음. 아래는 Notion 데이터베이스 필드 기준 타입 정의입니다.

### ReviewPost (Notion 데이터베이스 행)

| 필드 | 설명 | Notion 타입 |
|------|------|------------|
| id | 페이지 고유 ID (라우팅에 사용) | UUID (Notion 자동 생성) |
| title | 게임 리뷰 제목 | title |
| category | 게임 장르 카테고리 (예: RPG, 액션, 전략) | select |
| tags | 세부 태그 목록 (예: 오픈월드, 멀티플레이어) | multi_select |
| published | 발행일 | date |
| status | 초안 / 발행됨 | select |
| score | 10점 만점 평점 | number |
| pros | 게임 장점 요약 | rich_text |
| cons | 게임 단점 요약 | rich_text |
| content | 리뷰 본문 (페이지 블록) | page content |

### 프론트엔드 타입 정의 (TypeScript)

```typescript
// Notion API 응답을 가공한 내부 타입
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

---

## Notion API 연동 명세

### 환경 변수

```
NOTION_API_KEY=secret_xxxx
NOTION_DATABASE_ID=xxxx
```

### 주요 API 호출 패턴

```typescript
// 글 목록 조회 (Status = "발행됨" 필터 + 발행일 내림차순 정렬)
const response = await notion.databases.query({
  database_id: process.env.NOTION_DATABASE_ID,
  filter: {
    property: 'Status',
    select: { equals: '발행됨' }
  },
  sorts: [{ property: 'Published', direction: 'descending' }]
})

// 글 상세 조회 (페이지 속성 + 블록 목록)
const page = await notion.pages.retrieve({ page_id: id })
const blocks = await notion.blocks.children.list({ block_id: id })
```

### 지원해야 하는 Notion 블록 타입

| 블록 타입 | 렌더링 방식 |
|-----------|------------|
| paragraph | `<p>` |
| heading_1 / 2 / 3 | `<h1>` / `<h2>` / `<h3>` |
| bulleted_list_item | `<ul><li>` |
| numbered_list_item | `<ol><li>` |
| image | `<img>` (Next.js Image 컴포넌트) |
| quote | `<blockquote>` |
| code | `<pre><code>` |
| divider | `<hr>` |

---

## 기술 스택

### 프론트엔드 프레임워크

- **Next.js 15** (App Router) - React 풀스택 프레임워크, ISR로 Notion 데이터 캐싱
- **TypeScript 5.6+** - 타입 안전성 보장
- **React 19** - UI 라이브러리

### 스타일링 & UI

- **TailwindCSS v4** (설정 파일 없는 새로운 엔진) - 유틸리티 CSS 프레임워크
- **shadcn/ui** - Badge, Card, Separator 등 컴포넌트
- **Lucide React** - 아이콘 라이브러리

### CMS 연동

- **@notionhq/client** - 공식 Notion API 클라이언트
- Notion 데이터베이스를 CMS로 활용 (별도 백엔드 없음)

### 데이터 페칭 전략

- **글 목록**: `fetch` with `revalidate: 60` (ISR, 1분 캐시)
- **글 상세**: `fetch` with `revalidate: 300` (ISR, 5분 캐시)
- **카테고리 목록**: 글 목록 응답에서 파생 (별도 API 호출 없음)

### 배포 & 호스팅

- **Vercel** - Next.js 15 최적화 배포 플랫폼, 환경 변수 관리

### 패키지 관리

- **npm** - 의존성 관리

---

## 파일 구조 (예상)

```
src/
├── app/
│   ├── layout.tsx               # 루트 레이아웃 (Header 포함)
│   ├── page.tsx                 # 홈 페이지 (F001, F003, F004)
│   ├── category/
│   │   └── [slug]/
│   │       └── page.tsx         # 카테고리 페이지 (F001, F003)
│   └── posts/
│       └── [id]/
│           └── page.tsx         # 글 상세 페이지 (F002)
├── components/
│   ├── layout/
│   │   └── Header.tsx           # 사이트 헤더 + 카테고리 탭
│   ├── review/
│   │   ├── ReviewCard.tsx       # 글 목록 카드 컴포넌트
│   │   ├── ReviewGrid.tsx       # 카드 그리드 레이아웃
│   │   ├── ReviewDetail.tsx     # 글 상세 (평점, 장단점)
│   │   ├── NotionRenderer.tsx   # Notion 블록 → HTML 렌더러
│   │   └── CategoryFilter.tsx   # 카테고리 필터 탭 (F003)
│   └── search/
│       └── SearchBar.tsx        # 검색창 (F004, Client Component)
└── lib/
    ├── notion.ts                # Notion API 클라이언트 래퍼
    └── utils.ts                 # cn() 유틸리티
```

---

## 개발 체크리스트

- [ ] `.env.local`에 `NOTION_API_KEY`, `NOTION_DATABASE_ID` 설정
- [ ] `npm install @notionhq/client` 설치
- [ ] `lib/notion.ts` - 글 목록 조회, 글 상세 조회 함수 구현
- [ ] `ReviewCard` 컴포넌트 구현 (제목, 카테고리, 발행일, 평점)
- [ ] 홈 페이지 글 목록 표시 (F001)
- [ ] 카테고리 필터 탭 구현 (F003)
- [ ] 검색창 구현 (F004, Client Component)
- [ ] 글 상세 페이지 구현 (F002)
- [ ] `NotionRenderer` - 블록 타입별 렌더링 구현
- [ ] 카테고리 페이지 구현 (F003)
- [ ] 반응형 레이아웃 검증 (375px ~ 1280px)
- [ ] Vercel 배포 및 환경 변수 등록
