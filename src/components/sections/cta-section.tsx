import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PageContainer } from "@/components/layout/page-container"

export function CtaSection() {
  return (
    <section className="py-20 bg-primary text-primary-foreground">
      <PageContainer>
        <div className="flex flex-col items-center gap-6 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            지금 바로 시작하세요
          </h2>
          <p className="max-w-xl text-primary-foreground/80">
            이 스타터킷을 기반으로 여러분의 프로젝트를 빠르게 구축하세요.
            모든 설정이 완료되어 있습니다.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/dashboard">
                대시보드 체험하기
                <ArrowRight className="ml-1 size-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-primary-foreground/30 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
              asChild
            >
              <Link href="/showcase">컴포넌트 보기</Link>
            </Button>
          </div>
        </div>
      </PageContainer>
    </section>
  )
}
