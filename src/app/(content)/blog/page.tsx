import BlogFeed from "@/components/blog/BlogFeed"
import { getAllBlogPostsMeta } from "@/lib/blog"

export default async function BlogPage() {
  const blogPosts = await getAllBlogPostsMeta()

  return <BlogFeed posts={blogPosts} />
}
