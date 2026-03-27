import fs from "node:fs/promises"
import path from "node:path"

import matter from "gray-matter"

export type BlogPostMeta = {
  slug: string
  title: string
  description: string
  publishedAt: string
  tags: string[]
}

export type BlogPost = BlogPostMeta & {
  content: string
}

type Frontmatter = {
  title?: string
  description?: string
  publishedAt?: string | Date
  tags?: string[]
}

const BLOG_CONTENT_DIR = path.join(process.cwd(), "src", "content", "blog")

function sortByDateDesc(posts: BlogPostMeta[]) {
  return posts.sort((a, b) => {
    const aDate = new Date(a.publishedAt).getTime()
    const bDate = new Date(b.publishedAt).getTime()
    return bDate - aDate
  })
}

function fileNameToSlug(fileName: string) {
  return fileName.replace(/\.mdx$/, "")
}

function normalizePublishedAt(value: string | Date | undefined) {
  if (!value) return "1970-01-01"
  if (value instanceof Date) return value.toISOString().slice(0, 10)
  return value
}

export async function getAllBlogPostsMeta(): Promise<BlogPostMeta[]> {
  const entries = await fs.readdir(BLOG_CONTENT_DIR)
  const mdxFiles = entries.filter((entry) => entry.endsWith(".mdx"))

  const posts = await Promise.all(
    mdxFiles.map(async (fileName) => {
      const slug = fileNameToSlug(fileName)
      const fullPath = path.join(BLOG_CONTENT_DIR, fileName)
      const source = await fs.readFile(fullPath, "utf8")
      const { data } = matter(source)
      const frontmatter = data as Frontmatter

      return {
        slug,
        title: frontmatter.title ?? slug,
        description: frontmatter.description ?? "",
        publishedAt: normalizePublishedAt(frontmatter.publishedAt),
        tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : [],
      }
    })
  )

  return sortByDateDesc(posts)
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  const fullPath = path.join(BLOG_CONTENT_DIR, `${slug}.mdx`)

  try {
    const source = await fs.readFile(fullPath, "utf8")
    const { data, content } = matter(source)
    const frontmatter = data as Frontmatter

    return {
      slug,
      title: frontmatter.title ?? slug,
      description: frontmatter.description ?? "",
      publishedAt: normalizePublishedAt(frontmatter.publishedAt),
      tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : [],
      content,
    }
  } catch {
    return null
  }
}
