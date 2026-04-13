/** biome-ignore-all lint/suspicious/noExplicitAny: this is fine */
'use client';

import { toJsxRuntime } from 'hast-util-to-jsx-runtime';
import type { JSX } from 'react';
import { useLayoutEffect, useState } from 'react';
import * as prod from 'react/jsx-runtime';
import { codeToHast } from 'shiki/bundle/full';

interface SyntaxHighlighterProps {
  content?: string;
  language?: string;
}

const SyntaxHighlighter = ({ content, language }: SyntaxHighlighterProps) => {
  const [nodes, setNodes] = useState<JSX.Element | null>(null);

  useLayoutEffect(() => {
    if (!content || !language) return;
    highlight(content, language).then(setNodes);
  }, [content, language]);

  if (!nodes) return <code>{content}</code>;
  return nodes;
};

export default SyntaxHighlighter;

async function highlight(code: string, lang: string): Promise<JSX.Element> {
  const out = await codeToHast(code, {
    lang,
    themes: {
      light: 'github-light-default',
      dark: 'one-dark-pro',
    },
  });

  return toJsxRuntime(out as any, {
    Fragment: prod.Fragment,
    jsx: prod.jsx,
    jsxs: prod.jsxs,
    components: {
      pre: ({ children }) => children as any,
    },
  }) as JSX.Element;
}
