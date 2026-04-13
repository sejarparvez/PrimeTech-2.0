/** biome-ignore-all lint/suspicious/noExplicitAny: this is fine */

import { toJsxRuntime } from 'hast-util-to-jsx-runtime';
import type { JSX } from 'react';
import * as prod from 'react/jsx-runtime';
import { codeToHast } from '@/tiptap-editor/lib/shiki';

export async function highlight(code: string, lang: string) {
  const out = await codeToHast(code, {
    lang,
    themes: {
      light: 'github-light',
      dark: 'github-dark',
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
