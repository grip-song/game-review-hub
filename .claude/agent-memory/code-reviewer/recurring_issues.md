---
name: recurring-issues
description: 2026-05-16 초기 전체 코드 리뷰에서 발견된 주요 이슈 패턴
metadata:
  type: project
---

2026-05-16 전체 리뷰에서 확인된 반복 이슈:

**Major 이슈 패턴:**
- `recentActivity` 배열의 map key로 인덱스(`key={i}`) 사용 — `dashboard/page.tsx:110`. 데이터에 고유 식별자 추가 권장.
- `AvatarImage`에 `alt` prop 누락 — `showcase/page.tsx:262`. 접근성 위반.
- `ThemeToggle` 마운트 시 hydration mismatch 가능성 — `resolvedTheme`이 서버에서 undefined일 때 아이콘 전환 로직이 CSS transition에 의존하지만 초기 렌더링 불일치 가능.
- `footer.tsx`의 외부 링크에 `target="_blank"` 및 `rel="noopener noreferrer"` 누락.
- `features-section.tsx`의 "react-hook-form, zod, @tanstack/react-table 사전 구성" 문구는 실제로 설치만 됐고 예시 코드가 없어 과장 표현.

**Minor 이슈 패턴:**
- `showcase/page.tsx`의 `SectionTitle` 컴포넌트가 같은 파일 내에 인라인 정의됨 — 재사용 가능하면 공통 컴포넌트로 분리 고려.
- `dashboard/page.tsx`의 trend 타입이 문자열 리터럴(`"up" | "down"`)로 명시되지 않고 암묵적 string 추론.
- `header.tsx` Sheet에 `SheetTitle` 누락 — Radix Sheet 접근성 요구사항.

**Why:** 스타터킷으로서 학습 목적 코드가 많아 실제 프로덕션 패턴보다 단순화된 부분이 있음.
**How to apply:** 향후 컴포넌트 추가 시 위 패턴이 반복되지 않도록 지적할 것. 특히 key prop과 접근성 속성.
