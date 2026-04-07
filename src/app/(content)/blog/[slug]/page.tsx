import Link from "next/link"
import { MDXRemote } from "next-mdx-remote/rsc"
import { notFound } from "next/navigation"

import { getAllBlogPostsMeta, getBlogPostBySlug } from "@/lib/blog"

type BlogPostPageProps = {
  params: Promise<{ slug: string }>
}

export function generateStaticParams() {
  return getAllBlogPostsMeta().then((posts) => posts.map((post) => ({ slug: post.slug })))
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug)

  if (!post) {
    notFound()
  }

  return (
    <main className="min-h-[calc(100vh-56px)] bg-neutral-950 text-neutral-100">
      <div className="mx-auto w-full max-w-3xl px-6 py-16">
        <Link href="/blog" className="mb-8 inline-block text-sm text-neutral-400 hover:text-neutral-200">
          Back to readme.md
        </Link>

        <div className="mb-4 text-xs text-neutral-400">{post.publishedAt}</div>
        <h1 className="mb-4 text-3xl font-semibold tracking-tight">{post.title}</h1>
        <p className="mb-10 text-neutral-300">{post.description}</p>

        <article className="space-y-4 leading-7 text-neutral-200">
          <MDXRemote source={post.content} />
        </article>
      </div>
    </main>
  )
}
