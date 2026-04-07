import Link from "next/link"

import { getAllBlogPostsMeta } from "@/lib/blog"

export default async function BlogPage() {
  const blogPosts = await getAllBlogPostsMeta()

  return (
    <main className="min-h-[calc(100vh-56px)] bg-neutral-950 text-neutral-100">
      <div className="mx-auto w-full max-w-5xl px-6 py-16">
        <div className="mb-10 flex items-center justify-between gap-4">
          <h1 className="text-3xl font-semibold tracking-tight font-mono">00.README.MD</h1>
          <Link
            href="/"
            className="rounded-full border border-neutral-700 px-4 py-2 text-sm transition-colors hover:bg-neutral-800"
          >
            Back to landing
          </Link>
        </div>

        <div className="grid gap-4">
          {blogPosts.map((post) => (
            <article
              key={post.slug}
              className="rounded-2xl border border-neutral-800 bg-neutral-900/60 p-5 transition-colors hover:bg-neutral-900"
            >
              <div className="mb-3 flex items-center gap-3 text-xs text-neutral-400">
                <span>{post.publishedAt}</span>
                <span>•</span>
                <span>{post.tags.join(" / ")}</span>
              </div>
              <h2 className="mb-2 text-xl font-medium">{post.title}</h2>
              <p className="mb-4 text-neutral-300">{post.description}</p>
              <Link href={`/blog/${post.slug}`} className="text-sm text-emerald-300 hover:text-emerald-200">
                Read post
              </Link>
            </article>
          ))}
        </div>
      </div>
    </main>
  )
}
