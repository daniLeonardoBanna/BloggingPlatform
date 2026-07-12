import Link from "next/link";

export default function PostNotFound() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Post not found</h1>
      <p className="mt-2 text-gray-500">
        This post doesn&apos;t exist or has been removed.
      </p>
      <Link href="/" className="mt-4 inline-block text-blue-600 hover:underline">
        ← Back to the feed
      </Link>
    </div>
  );
}
