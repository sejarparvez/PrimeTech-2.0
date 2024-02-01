import styles from "./PostContent.module.css";

export default function MainContent({ content }: { content: string }) {
  return (
    <div
      className={`mt-12 rounded-md border p-4 text-lg ${styles["post-content"]}`}
      dangerouslySetInnerHTML={{ __html: content }}
    />
  );
}
