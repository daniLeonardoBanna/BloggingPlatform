import Link from "next/link";
import type { PaginationMeta } from "@/lib/types";

export default function Pagination({
  meta,
  basePath,
  pageParam = "page",
}: {
  meta: PaginationMeta;
  basePath: string;
  pageParam?: string;
}) {
  if (meta.totalPages <= 1) return null;

  const hrefForPage = (page: number) => {
    const params = new URLSearchParams();
    params.set(pageParam, String(page));
    return `${basePath}?${params.toString()}`;
  };

  return (
    <nav className="flex items-center justify-between gap-4 py-3 text-sm">
      {meta.page > 1 ? (
        <Link
          href={hrefForPage(meta.page - 1)}
          className="text-blue-600 hover:underline"
        >
          ← Previous
        </Link>
      ) : (
        <span className="text-gray-400">← Previous</span>
      )}

      <span className="text-gray-500">
        Page {meta.page} of {meta.totalPages}
      </span>

      {meta.page < meta.totalPages ? (
        <Link
          href={hrefForPage(meta.page + 1)}
          className="text-blue-600 hover:underline"
        >
          Next →
        </Link>
      ) : (
        <span className="text-gray-400">Next →</span>
      )}
    </nav>
  );
}
