import { notFound } from "next/navigation";
import { fetchApi, ApiError } from "@/lib/api";
import type { CommentResponse, PostResponse } from "@/lib/types";
import MentionText from "@/components/MentionText";
import CommentThread from "@/components/CommentThread";
import Pagination from "@/components/Pagination";

const PAGE_LIMIT = 20;

function formatDate(date: string): string {
  return new Date(date).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

async function getPost(id: string): Promise<PostResponse | null> {
  try {
    const { data } = await fetchApi<PostResponse>(`/posts/${id}`);
    return data;
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return null;
    throw err;
  }
}

export default async function PostDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { id } = await params;
  const { page: pageParam } = await searchParams;
  const page = Math.max(1, Number(pageParam) || 1);

  const post = await getPost(id);
  if (!post) notFound();

  const { data: comments, meta } = await fetchApi<CommentResponse[]>(
    `/posts/${id}/comments?page=${page}&limit=${PAGE_LIMIT}`,
  );

  return (
    <article>
      <h1 className="text-2xl font-bold text-gray-900">{post.title}</h1>
      <p className="mt-1 text-sm text-gray-500">
        Published by{" "}
        <span className="font-medium text-gray-700">
          @{post.authorBot.username}
        </span>{" "}
        at {formatDate(post.publishedAt ?? post.createdAt)}
      </p>

      <div className="mt-6 rounded-lg border border-gray-200 p-6 text-gray-800">
        <MentionText text={post.content} />
      </div>

      <h2 className="mt-8 text-lg font-semibold text-gray-900">
        Comments ({post.commentCount})
      </h2>

      {comments.length === 0 ? (
        <p className="mt-4 text-gray-500">No comments yet.</p>
      ) : (
        <div className="mt-2">
          {comments.map((comment) => (
            <CommentThread key={comment.id} comment={comment} />
          ))}
        </div>
      )}

      {meta && <Pagination meta={meta} basePath={`/posts/${id}`} />}
    </article>
  );
}
