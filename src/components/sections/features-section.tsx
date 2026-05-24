import { Zap, Palette, Shield, LayoutTemplate, Package, Code2 } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { PageContainer } from "@/components/layout/page-container"

const features = [
  {
    icon: Zap,
    title: "빠른 개발",
    description: "설정 없이 바로 시작. Next.js App Router와 TypeScript로 생산성을 극대화합니다.",
  },
  {
    icon: Palette,
    title: "다크모드",
    description: "next-themes 기반 깜박임 없는 다크모드. CSS 변수로 테마를 자유롭게 커스터마이징.",
  },
  {
    icon: Shield,
    title: "TypeScript",
    description: "엄격한 타입 시스템으로 버그를 사전 차단. 자동완성과 타입 추론으로 개발 경험 향상.",
  },
  {
    icon: LayoutTemplate,
    title: "반응형 디자인",
    description: "모바일 퍼스트 레이아웃. 모든 화면 크기에서 완벽하게 동작하는 UI.",
  },
  {
    icon: Package,
    title: "shadcn/ui 컴포넌트",
    description: "20개 이상의 접근성 높은 UI 컴포넌트. 복사 붙여넣기 방식으로 완전한 제어권.",
  },
  {
    icon: Code2,
    title: "검증된 라이브러리",
    description: "react-hook-form, zod, @tanstack/react-table 등 업계 표준 라이브러리 사전 구성.",
  },
]

export function FeaturesSection() {
  return (
    <section className="py-20 bg-muted/30">
      <PageContainer>
        <div className="mb-12 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">모든 것이 준비되어 있습니다</h2>
          <p className="mt-3 text-muted-foreground">
            프로덕션에 필요한 모든 기능을 사전 구성했습니다.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <Card key={feature.title} className="border-border/50 bg-background/60 backdrop-blur">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="size-5 text-primary" />
                    </div>
                    <h3 className="font-semibold">{feature.title}</h3>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </PageContainer>
    </section>
  )
}
