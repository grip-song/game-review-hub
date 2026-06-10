/**
 * Next.js 16 설정 파일
 * - Turbopack: next dev / next build 모두 기본 적용
 * - 이미지 최적화: Notion 이미지 도메인 허용
 * - 보안 헤더 설정
 */

import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  // Turbopack 최상위 레벨 설정 (Next.js 16: experimental.turbopack 제거됨)
  turbopack: {},

  // 이미지 최적화
  // unoptimized: 나무위키 등 핫링킹 차단 사이트는 Vercel 서버가 fetch할 때 차단됨.
  // 브라우저가 직접 이미지 URL에 접근하도록 최적화 비활성화.
  images: {
    unoptimized: true,
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      // Notion 파일 저장소 (페이지 내 이미지)
      {
        protocol: "https",
        hostname: "prod-files-secure.s3.us-west-2.amazonaws.com",
      },
      // Notion 외부 이미지 (커버 등)
      {
        protocol: "https",
        hostname: "www.notion.so",
      },
      {
        protocol: "https",
        hostname: "notion.so",
      },
      // S3 기반 이미지 (Notion 업로드)
      {
        protocol: "https",
        hostname: "*.amazonaws.com",
      },
      // 나무위키 이미지
      {
        protocol: "https",
        hostname: "i.namu.wiki",
      },
    ],
  },

  // 보안 헤더
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ]
  },
}

export default nextConfig
