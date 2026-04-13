/** biome-ignore-all lint/suspicious/noExplicitAny: this is fine */

import * as prod from 'react/jsx-runtime';
import rehypeParse from 'rehype-parse';
import rehypeReact, { type Components } from 'rehype-react';
import { unified } from 'unified';
import { visit } from 'unist-util-visit';
import { slugifyUnicode } from '@/utils/slug'; // update path to match your utils file

interface ProcessorOptions {
  components?: Partial<Components>;
}

const addHeadingIds = () => {
  return (tree: any) => {
    visit(tree, 'element', (node) => {
      if (['h2', 'h3', 'h4'].includes(node.tagName)) {
        const textContent = getTextContent(node).trim();
        if (textContent) {
          node.properties = {
            ...node.properties,
            id: slugifyUnicode(textContent),
          };
        }
      }
    });
    return tree;
  };
};

const removeColGroupWhitespace = () => {
  return (tree: any) => {
    visit(tree, 'element', (node) => {
      if (node.tagName === 'colgroup') {
        node.children = node.children.filter(
          (child: any) =>
            !(child.type === 'text' && child.value?.trim() === ''),
        );
      }
    });
  };
};

function getTextContent(node: any): string {
  if (node.type === 'text') return node.value;
  if (node.children && Array.isArray(node.children)) {
    return node.children.map(getTextContent).join('');
  }
  return '';
}

export function createProcessor({ components }: ProcessorOptions = {}) {
  return unified()
    .use(rehypeParse, { fragment: true })
    .use(addHeadingIds)
    .use(removeColGroupWhitespace)
    .use(rehypeReact, {
      Fragment: prod.Fragment,
      jsx: prod.jsx,
      jsxs: prod.jsxs,
      components,
    });
}
