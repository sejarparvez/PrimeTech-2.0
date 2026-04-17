import Link from 'next/link';
import type React from 'react';
import type { JSX, ReactElement, ReactNode } from 'react';
import { slugifyUnicode } from '@/utils/slug'; // update path to match your utils file

interface HeadingWithAnchorProps {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  id?: string;
  children?: ReactNode;
}

const extractText = (node: ReactNode): string => {
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(extractText).join('');
  if (node !== null && typeof node === 'object' && 'props' in node) {
    const el = node as ReactElement<{ children?: ReactNode }>;
    return extractText(el.props.children);
  }
  return '';
};

const HeadingWithAnchor: React.FC<HeadingWithAnchorProps> = ({
  level,
  id,
  children,
}) => {
  const HeadingTag: keyof JSX.IntrinsicElements = `h${level}`;
  const headingId = id || slugifyUnicode(extractText(children));

  return (
    <HeadingTag id={headingId}>
      <Link
        href={`#${headingId}`}
        aria-label={`Link to ${headingId}`}
        className="not-prose font-inherit text-inherit group relative hover:before:absolute hover:before:-left-6 hover:before:top-1/2 hover:before:-translate-y-1/2 hover:before:text-[1em] hover:before:opacity-70 hover:before:content-['#']"
      >
        {children}
      </Link>
    </HeadingTag>
  );
};

export default HeadingWithAnchor;
