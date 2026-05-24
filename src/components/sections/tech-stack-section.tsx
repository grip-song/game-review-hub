import { Badge } from "@/components/ui/badge"
import { PageContainer } from "@/components/layout/page-container"

const techStack = [
  { name: "Next.js 16", category: "Framework" },
  { name: "React 19", category: "Library" },
  { name: "TypeScript 5", category: "Language" },
  { name: "Tailwind CSS 4", category: "Styling" },
  { name: "shadcn/ui", category: "Components" },
  { name: "Radix UI", category: "Primitives" },
  { name: "lucide-react", category: "Icons" },
  { name: "next-themes", category: "Dark Mode" },
  { name: "react-hook-form", category: "Forms" },
  { name: "Zod", category: "Validation" },
  { name: "@tanstack/react-table", category: "Tables" },
  { name: "sonner", category: "Toast" },
]

export function TechStackSection() {
  return (
    <section className="py-20">
      <PageContainer>
        <div className="mb-10 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">기술 스택</h2>
          <p className="mt-3 text-muted-foreground">
            업계 표준 라이브러리로 구성된 안정적인 스택
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          {techStack.map((tech) => (
            <div key={tech.name} className="flex items-center gap-2 rounded-full border bg-muted/50 px-4 py-2">
              <Badge variant="secondary" className="text-xs">
                {tech.category}
              </Badge>
              <span className="text-sm font-medium">{tech.name}</span>
            </div>
          ))}
        </div>
      </PageContainer>
    </section>
  )
}
