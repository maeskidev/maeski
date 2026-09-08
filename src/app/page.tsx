import PortfolioHome from "@/components/home/PortfolioHome";
import { getAllBlogPostsMeta } from "@/lib/blog";

export default async function Home() {
  const posts = await getAllBlogPostsMeta();
  const latestPost = posts[0] ?? null;

  return <PortfolioHome latestPost={latestPost} />;
}
