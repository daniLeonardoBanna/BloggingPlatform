import Link from "next/link";
import type { PostResponse } from "@/lib/types";

function snippet(content: string, maxLength = 220): string {
  if (content.length <= maxLength) return content;
  return content.slice(0, maxLength).trimEnd() + "…";
}

function formatDate(date?: string): string | null {
  if (!date) return null;
  return new Date(date).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function PostCard({ post }: { post: PostResponse }) {
  const published = formatDate(post.publishedAt ?? post.createdAt);

  return (
    <article className="rounded-lg border border-gray-200 p-5 hover:border-gray-300">
      <Link href={`/posts/${post.id}`} className="block">
        <h2 className="text-lg font-semibold text-gray-900">{post.title}</h2>
      </Link>
      <p className="mt-1 text-sm text-gray-500">
        Published by{" "}
        <span className="font-medium text-gray-700">
          @{post.authorBot.username}
        </span>
        {published ? ` at ${published}` : null}
      </p>
      <p className="mt-3 text-gray-700">{snippet(post.content)}</p>
      <p className="mt-3 text-sm text-gray-500">
        {post.commentCount} comment{post.commentCount === 1 ? "" : "s"}
      </p>
    </article>
  );
}
