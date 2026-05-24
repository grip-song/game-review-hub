import Link from "next/link"
import { ArrowRight, Layers } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PageContainer } from "@/components/layout/page-container"

export function HeroSection() {
  return (
    <section className="py-20 md:py-32">
      <PageContainer>
        <div className="flex flex-col items-center gap-6 text-center">
          <Badge variant="secondary" className="gap-1.5">
            <span className="size-1.5 rounded-full bg-primary" />
            Next.js 16 · React 19 · Tailwind CSS 4
          </Badge>

          <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            모던 웹 개발을
            <br />
            <span className="text-muted-foreground">빠르게 시작하세요</span>
          </h1>

          <p className="max-w-xl text-lg text-muted-foreground">
            Next.js App Router, TypeScript, Tailwind CSS, shadcn/ui가 완벽하게 구성된
            프로덕션 레디 스타터킷. 설정 없이 바로 개발을 시작하세요.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button size="lg" asChild>
              <Link href="/dashboard">
                대시보드 보기
                <ArrowRight className="ml-1 size-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/showcase">
                <Layers className="mr-1 size-4" />
                컴포넌트 쇼케이스
              </Link>
            </Button>
          </div>
        </div>
      </PageContainer>
    </section>
  )
}
