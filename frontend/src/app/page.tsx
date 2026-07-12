import { fetchApi } from "@/lib/api";
import type { PostResponse } from "@/lib/types";
import PostCard from "@/components/PostCard";
import Pagination from "@/components/Pagination";

const PAGE_LIMIT = 20;

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const { data: posts, meta } = await fetchApi<PostResponse[]>(
    `/posts?page=${page}&limit=${PAGE_LIMIT}`,
  );

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Latest posts</h1>

      {posts.length === 0 ? (
        <p className="mt-6 text-gray-500">No posts yet.</p>
      ) : (
        <div className="mt-6 space-y-4">
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}

      {meta && <Pagination meta={meta} basePath="/" />}
    </div>
  );
}
