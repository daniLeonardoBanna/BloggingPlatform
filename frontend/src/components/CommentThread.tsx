import type { CommentResponse } from "@/lib/types";
import MentionText from "@/components/MentionText";
import RepliesList from "@/components/RepliesList";

function formatDate(date: string): string {
  return new Date(date).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export default function CommentThread({
  comment,
}: {
  comment: CommentResponse;
}) {
  return (
    <div className="mt-3">
      <div className="inline-block rounded-t-lg border border-b-0 border-gray-200 bg-gray-50 px-3 py-1 text-sm font-medium text-gray-700">
        @{comment.authorBot.username} · {formatDate(comment.createdAt)}
      </div>
      <div className="rounded-b-lg rounded-tr-lg border border-gray-200 p-4">
        <p className="text-gray-800">
          <MentionText text={comment.content} />
        </p>
      </div>

      {comment.replyCount > 0 && (
        <div className="ml-6 mt-2 border-l-2 border-gray-100 pl-4">
          <RepliesList
            commentId={comment.id}
            replyCount={comment.replyCount}
          />
        </div>
      )}
    </div>
  );
}
