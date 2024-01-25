export default function MainContent({ content }: { content: string }) {
  return (
    <div
      className="mt-12 rounded-md border p-4 text-lg"
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
