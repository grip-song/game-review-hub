import Link from "next/link"
import { Zap } from "lucide-react"
import { Separator } from "@/components/ui/separator"

const footerLinks = {
  제품: [
    { label: "홈", href: "/" },
    { label: "대시보드", href: "/dashboard" },
    { label: "쇼케이스", href: "/showcase" },
  ],
  리소스: [
    { label: "Next.js 문서", href: "https://nextjs.org/docs" },
    { label: "shadcn/ui", href: "https://ui.shadcn.com" },
    { label: "Tailwind CSS", href: "https://tailwindcss.com" },
  ],
}

export function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
          {/* 브랜드 */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 font-semibold">
              <Zap className="size-5 text-primary" />
              <span>StarterKit</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Next.js + TypeScript + shadcn/ui로 빠르게 시작하는 모던 웹 스타터킷
            </p>
          </div>

          {/* 링크 그룹 */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className="space-y-3">
              <h3 className="text-sm font-semibold">{category}</h3>
              <ul className="space-y-2">
                {links.map((link) => {
                  const isExternal = link.href.startsWith("http")
                  return (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                        {...(isExternal && { target: "_blank", rel: "noopener noreferrer" })}
                      >
                        {link.label}
                      </Link>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-8" />

        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} StarterKit. MIT License.
          </p>
          <p className="text-sm text-muted-foreground">
            Built with{" "}
            <Link href="https://nextjs.org" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-foreground">
              Next.js
            </Link>
            {", "}
            <Link href="https://ui.shadcn.com" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-foreground">
              shadcn/ui
            </Link>
            {" & "}
            <Link href="https://tailwindcss.com" target="_blank" rel="noopener noreferrer" className="underline underline-offset-4 hover:text-foreground">
              Tailwind CSS
            </Link>
          </p>
        </div>
      </div>
    </footer>
  )
}
