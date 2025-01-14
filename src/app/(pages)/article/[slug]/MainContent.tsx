"use client";

import { cn } from "@/components/lib/utils";
import React from "react";
import CodeBlock from "./CodeBlock";

interface BlogPostContentProps {
  content: string;
}

const BlogPostContent: React.FC<BlogPostContentProps> = ({ content }) => {
  const processContent = (htmlContent: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, "text/html");

    const processNode = (node: Node): React.ReactNode => {
      if (node.nodeType === Node.TEXT_NODE) {
        return node.textContent;
      }

      if (node.nodeType === Node.ELEMENT_NODE) {
        const element = node as Element;
        const children = Array.from(element.childNodes).map(processNode);

        if (
          element.tagName === "PRE" &&
          element.classList.contains("ql-syntax")
        ) {
          const code = element.textContent || "";
          let language = "javascript"; // Default language

          if (
            code.includes("npm") ||
            code.includes("npx") ||
            code.includes("yarn") ||
            code.includes("pnpm")
          ) {
            language = "bash";
          } else if (
            code.includes("import React") ||
            code.includes("export default")
          ) {
            language = "tsx";
          }

          return (
            <CodeBlock
              code={code}
              language={language}
              className="my-6 overflow-hidden rounded-lg shadow-lg"
            />
          );
        }

        const props: { [key: string]: string | React.CSSProperties } = {};
        Array.from(element.attributes).forEach((attr) => {
          if (attr.name === "style") {
            const styleObj: { [key: string]: string } = {};
            attr.value.split(";").forEach((style) => {
              const [property, value] = style.split(":");
              if (property && value) {
                const camelCaseProperty = property
                  .trim()
                  .replace(/-([a-z])/g, (g) => g[1].toUpperCase());
                styleObj[camelCaseProperty] = value.trim();
              }
            });
            props.style = styleObj;
          } else {
            props[attr.name] = attr.value;
          }
        });

        // Apply Tailwind classes based on element type
        const className = cn({
          "text-4xl font-bold mb-6 text-gray-900 dark:text-gray-100":
            element.tagName === "H1",
          "text-3xl font-semibold mt-8 mb-4 text-gray-800 dark:text-gray-200":
            element.tagName === "H2",
          "text-2xl font-semibold mt-6 mb-3 text-gray-700 dark:text-gray-300":
            element.tagName === "H3",
          "mb-4 text-gray-700 dark:text-gray-300 leading-relaxed":
            element.tagName === "P",
          "list-disc list-inside mb-4 pl-4": element.tagName === "UL",
          "list-decimal list-inside mb-4 pl-4": element.tagName === "OL",
          "mb-2": element.tagName === "LI",
          "text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-200 underline":
            element.tagName === "A",
          "font-semibold": element.tagName === "STRONG",
          "bg-gray-100 dark:bg-gray-800 rounded px-1 py-0.5 font-mono text-sm":
            element.tagName === "CODE" &&
            element.parentElement?.tagName !== "PRE",
          "border-l-4 border-gray-300 dark:border-gray-700 pl-4 italic my-4 text-gray-600 dark:text-gray-400":
            element.tagName === "BLOCKQUOTE",
          "w-full h-auto my-6 rounded-lg shadow-lg": element.tagName === "IMG",
          "my-6 border-t border-gray-300 dark:border-gray-700":
            element.tagName === "HR",
          "font-mono bg-gray-100 dark:bg-gray-800 rounded px-1 py-0.5":
            element.tagName === "KBD",
          underline: element.tagName === "U",
          italic: element.tagName === "I" || element.tagName === "EM",
          "line-through": element.tagName === "S" || element.tagName === "DEL",
          "border-collapse border border-gray-300 dark:border-gray-700":
            element.tagName === "TABLE",
          "border border-gray-300 dark:border-gray-700 px-4 py-2":
            element.tagName === "TH" || element.tagName === "TD",
        });

        return React.createElement(
          element.tagName.toLowerCase(),
          { ...props, className: cn(props.className, className) },
          ...children,
        );
      }

      return null;
    };

    return Array.from(doc.body.childNodes).map((node, index) => (
      <React.Fragment key={index}>{processNode(node)}</React.Fragment>
    ));
  };

  return (
    <article className="mx-auto max-w-5xl px-4 py-8 font-sans text-gray-800 dark:text-gray-200">
      {processContent(content)}
    </article>
  );
};

export default BlogPostContent;
