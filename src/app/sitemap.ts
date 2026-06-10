import type { MetadataRoute } from "next"
import { fetchPosts } from "@/lib/notion"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://game-review-hub.vercel.app"

  let posts: import("@/types/notion").ReviewPost[] = []
  try {
    if (process.env.NOTION_API_KEY && process.env.NOTION_DATABASE_ID) {
      posts = await fetchPosts()
    }
  } catch {
    // Notion API 미연결 시 정적 경로만 포함
  }

  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/posts/${post.id}`,
    lastModified: post.published ? new Date(post.published) : new Date(),
    changeFrequency: "monthly",
    priority: 0.8,
  }))

  const uniqueCategories = [...new Set(posts.map((p) => p.category).filter(Boolean))]
  const categoryEntries: MetadataRoute.Sitemap = uniqueCategories.map((cat) => ({
    url: `${baseUrl}/category/${cat.toLowerCase().replace(/\s+/g, "-")}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.6,
  }))

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    ...categoryEntries,
    ...postEntries,
  ]
}
