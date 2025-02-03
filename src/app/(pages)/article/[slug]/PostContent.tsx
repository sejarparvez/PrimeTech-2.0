import { ReactNode } from 'react';

interface PostContentProps {
  children: ReactNode;
}

const PostContent = ({ children }: PostContentProps) => {
  return (
    <>
      <style>{`
        .article-content blockquote p:first-of-type::before,
        .article-content blockquote p:first-of-type::after {
          content: unset;
        }

        .dark .article-content pre code .line span {
          color: var(--shiki-dark) !important;
          background-color: var(--shiki-dark-bg) !important;
          font-style: var(--shiki-dark-font-style) !important;
          font-weight: var(--shiki-dark-font-weight) !important;
          text-decoration: var(--shiki-dark-text-decoration) !important;
        }
      `}</style>

      <div
        className="article-content prose prose-neutral order-2 min-w-full dark:prose-invert prose-headings:scroll-m-20
        [&_li_p]:!m-0
        [&_pre]:relative [&_pre]:bg-[hsl(224,19%,97%)] [&_pre]:py-4 [&_pre]:overflow-x-auto
        [&_pre_code]:px-5 [&_pre_code]:block [&_pre_code]:w-fit [&_pre_code]:min-w-full [&_pre_code]:text-sm [&_pre_code]:leading-7
        dark:[&_pre]:bg-[hsl(224,14%,16%)]"
      >
        {children}
      </div>
    </>
  );
};

PostContent.displayName = 'PostContent';

export default PostContent;
