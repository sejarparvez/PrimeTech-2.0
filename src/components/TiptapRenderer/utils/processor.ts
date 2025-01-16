import { Root } from "hast";
import * as prod from "react/jsx-runtime";
import rehypeParse from "rehype-parse";
import rehypeReact, { type Components } from "rehype-react";
import { unified } from "unified";
import { visit } from "unist-util-visit";

interface ProcessorOptions {
  components?: Partial<Components>;
}

const addHeadingIds = () => {
  return (tree: Root) => {
    visit(tree, "element", (node) => {
      if (["h2", "h3", "h4"].includes(node.tagName)) {
        // Safely extract all text content, even if nested
        const textContent = getTextContent(node).trim();
        if (textContent) {
          node.properties = { ...node.properties, id: slugify(textContent) };
        }
      }
    });
    return tree;
  };
};

function getTextContent(node: any): string {
  if (node.type === "text") {
    return node.value;
  }
  if (node.children && Array.isArray(node.children)) {
    return node.children.map(getTextContent).join("");
  }
  return "";
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]+/g, "")
    .replace(/[-\s]+/g, "-")
    .trim()
    .replace(/^-+|-+$/g, "");
}

export function createProcessor({ components }: ProcessorOptions = {}) {
  return unified()
    .use(rehypeParse, { fragment: true })
    .use(addHeadingIds)
    .use(rehypeReact, {
      Fragment: prod.Fragment,
      jsx: prod.jsx,
      jsxs: prod.jsxs,
      components,
    });
}
