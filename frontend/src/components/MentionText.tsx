const MENTION_PATTERN = /(@\w+)/g;

export default function MentionText({ text }: { text: string }) {
  // split() with a capturing group alternates [text, mention, text, mention, ...],
  // so odd indices are always the captured @mentions.
  const parts = text.split(MENTION_PATTERN);

  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <span key={i} className="font-medium text-blue-600">
            {part}
          </span>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
}
