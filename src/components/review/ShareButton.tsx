"use client"

/**
 * URL 공유 버튼 컴포넌트
 * - Web Share API 지원 환경: navigator.share() 호출
 * - 미지원 환경: 클립보드에 URL 복사
 * Client Component: navigator API 접근 및 toast 사용
 */

import { Share2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"

interface ShareButtonProps {
  /** 공유 시 표시될 제목 (Web Share API용) */
  title?: string
}

export function ShareButton({ title }: ShareButtonProps) {
  /** 공유 버튼 클릭 핸들러 */
  const handleShare = async () => {
    const url = window.location.href
    const nav = navigator as Navigator & { share?: (data: ShareData) => Promise<void> }

    // Web Share API 지원 여부 확인
    if (typeof nav.share === "function") {
      try {
        await nav.share({ title, url })
        // Web Share API는 사용자가 직접 공유를 완료하므로 별도 toast 미표시
      } catch (error) {
        // 사용자가 공유 취소(AbortError)한 경우 toast 미표시
        if (error instanceof Error && error.name !== "AbortError") {
          toast.error("복사에 실패했습니다")
        }
      }
      return
    }

    // Web Share API 미지원 시 클립보드 복사
    try {
      await navigator.clipboard.writeText(url)
      toast.success("링크가 복사되었습니다")
    } catch {
      toast.error("복사에 실패했습니다")
    }
  }

  return (
    <Button variant="outline" size="sm" onClick={handleShare}>
      <Share2 className="size-4 mr-1.5" />
      공유
    </Button>
  )
}
