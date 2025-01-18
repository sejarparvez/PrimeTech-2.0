import { ReactNode } from "react";

interface PostContentProps {
  children: ReactNode;
}

const PostContent = ({ children }: PostContentProps) => {
  return (
    <div className="article-content prose prose-blue order-2 min-w-full dark:prose-invert prose-headings:scroll-m-20">
      {children}
    </div>
  );
};

PostContent.displayName = "PostContent";

export default PostContent;
