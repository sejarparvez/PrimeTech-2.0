/** biome-ignore-all lint/suspicious/noExplicitAny: this is fine */
import dynamic from 'next/dynamic';
import Image from 'next/image';
import type React from 'react';
import type { ReactElement } from 'react';
import type { Components } from 'rehype-react';
import CopyButton from './copy-button';
import HeadingWithAnchor from './heading-with-anchor';

const SyntaxHighlighter = dynamic(() => import('./syntax-highlighter'));

interface PreProps {
  children?: React.ReactNode;
  [key: string]: any;
}

interface CodeProps {
  children?: React.ReactNode;
  className?: string;
  [key: string]: any;
}

interface ImageProps {
  src: string;
  alt?: string;
  width: string | number;
  'data-width': string | number;
  'data-height': string | number;
  [key: string]: any;
}

export const components: Partial<Components> = {
  h2: (props) => <HeadingWithAnchor level={2} {...props} />,
  h3: (props) => <HeadingWithAnchor level={3} {...props} />,
  h4: (props) => <HeadingWithAnchor level={4} {...props} />,

  img: ({ src, alt, ...props }: ImageProps) => (
    <Image
      src={src}
      alt={alt || ''}
      width={+props['data-width']}
      height={+props['data-height']}
      className='mx-auto rounded-lg'
    />
  ),

  iframe: ({ allowFullScreen, ...props }) => (
    <iframe
      {...props}
      className='mx-auto aspect-video h-full w-full rounded-lg'
      allowFullScreen={true}
    />
  ),

  pre: ({ children, ...props }: PreProps) => {
    // @ts-expect-error
    const code = (children as ReactElement).props.children;
    return (
      <div className='not-prose group relative overflow-hidden rounded-lg border border-[#d1d9e0] dark:border-[#3d444d]'>
        <CopyButton code={String(code)} />
        <pre {...(props as any)}>{children}</pre>
      </div>
    );
  },

  code: ({ children, ...props }: CodeProps) => {
    const match = /language-(\w+)/.exec(props.className || '');
    const code = String(children).replace(/\n$/, '');
    return match ? (
      <SyntaxHighlighter language={match[1]} content={code} />
    ) : (
      <code {...props}>{children}</code>
    );
  },

  // Fix: filter whitespace text nodes from colgroup
  colgroup: ({ children, ...props }: any) => {
    const filtered = Array.isArray(children)
      ? children.filter(
          (child) => typeof child !== 'string' || child.trim() !== '',
        )
      : children;
    return <colgroup {...props}>{filtered}</colgroup>;
  },

  table: (props: any) => (
    <table
      className='not-prose mx-auto w-full table-auto border-collapse text-sm'
      {...props}
    />
  ),

  tr: (props: any) => (
    <tr
      className='border-b border-b-[#d1d9e0] last:border-b-0 dark:border-b-[#3d444d]'
      {...props}
    />
  ),

  td: (props: any) => <td className='px-2.5 py-3.5' {...props} />,
  th: (props: any) => <th className='px-2.5 py-3.5 font-bold' {...props} />,
};
