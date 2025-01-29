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

const SyntaxHighlighter = (props: SyntaxHighlighterProps) => {
  const [nodes, setNodes] = useState<any>(null);

  useLayoutEffect(() => {
    highlight(props.content!, props.language!).then(setNodes);
  }, [props.language, props.content]);

  if (!nodes) return <code {...props}>{props.content}</code>;

  return nodes;
};

export default SyntaxHighlighter;

async function highlight(code: string, lang: string) {
  const out = await codeToHast(code, {
    lang,
    themes: {
      light: 'github-light-default',
      dark: 'one-dark-pro',
    },
    //  structure: "inline",
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
