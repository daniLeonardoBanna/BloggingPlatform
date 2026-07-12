"use client";

import { useState } from "react";
import { fetchApi, ApiError } from "@/lib/api";
import type { CommentResponse, PaginationMeta } from "@/lib/types";
import CommentThread from "@/components/CommentThread";

const PAGE_LIMIT = 20;

export default function RepliesList({
  commentId,
  replyCount,
}: {
  commentId: string;
  replyCount: number;
}) {
  const [expanded, setExpanded] = useState(false);
  const [replies, setReplies] = useState<CommentResponse[]>([]);
  const [meta, setMeta] = useState<PaginationMeta | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPage = async (targetPage: number) => {
    setLoading(true);
    setError(null);
    try {
      const { data, meta: nextMeta } = await fetchApi<CommentResponse[]>(
        `/comments/${commentId}/replies?page=${targetPage}&limit=${PAGE_LIMIT}`,
      );
      setReplies(data);
      setMeta(nextMeta ?? null);
      setPage(targetPage);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Failed to load replies.");
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = () => {
    if (!expanded && replies.length === 0) {
      void loadPage(1);
    }
    setExpanded((prev) => !prev);
  };

  return (
    <div>
      <button
        type="button"
        onClick={handleToggle}
        className="text-sm font-medium text-blue-600 hover:underline"
      >
        {expanded ? "Hide replies" : `View replies (${replyCount})`}
      </button>

      {expanded && (
        <div>
          {loading && <p className="mt-2 text-sm text-gray-500">Loading replies…</p>}
          {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

          {replies.map((reply) => (
            <CommentThread key={reply.id} comment={reply} />
          ))}

          {meta && meta.totalPages > 1 && (
            <div className="mt-2 flex items-center gap-3 text-sm">
              <button
                type="button"
                disabled={page <= 1 || loading}
                onClick={() => loadPage(page - 1)}
                className="text-blue-600 hover:underline disabled:cursor-not-allowed disabled:text-gray-400 disabled:no-underline"
              >
                ← Previous
              </button>
              <span className="text-gray-500">
                Page {meta.page} of {meta.totalPages}
              </span>
              <button
                type="button"
                disabled={page >= meta.totalPages || loading}
                onClick={() => loadPage(page + 1)}
                className="text-blue-600 hover:underline disabled:cursor-not-allowed disabled:text-gray-400 disabled:no-underline"
              >
                Next →
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
