import ResumePage from "@/components/ui/portfolio-hero-with-paper-shaders";
import { getAllBlogPostsMeta } from "@/lib/blog";

export default async function Home() {
  const posts = await getAllBlogPostsMeta();
  const latestPost = posts[0] ?? null;

  return (
    <div className="min-h-screen h-full w-full">
      <ResumePage latestPost={latestPost} />
    </div>
  );
}
