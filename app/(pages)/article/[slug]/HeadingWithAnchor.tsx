import Link from 'next/link';
import React, { JSX, ReactNode } from 'react';

interface HeadingWithAnchorProps {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  id?: string;
  children: ReactNode;
}

const HeadingWithAnchor: React.FC<HeadingWithAnchorProps> = ({
  level,
  id,
  children,
}) => {
  const HeadingTag: keyof JSX.IntrinsicElements = `h${level}`;

  const generateId = (text: ReactNode): string => {
    if (typeof text === 'string') {
      return text
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9\-]/g, '');
    }
    return 'heading';
  };

  const headingId = id || generateId(children);

  return (
    <HeadingTag id={headingId}>
      <Link
        href={`#${headingId}`}
        aria-label={`Link to ${headingId}`}
        className="not-prose font-inherit group relative hover:before:absolute hover:before:-left-6 hover:before:top-1/2 hover:before:-translate-y-1/2 hover:before:text-[1em] hover:before:opacity-70 hover:before:content-['#']"
      >
        {children}
      </Link>
    </HeadingTag>
  );
};

export default HeadingWithAnchor;
