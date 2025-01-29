'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';

interface TocItem {
  id: string;
  text: string;
  level: number;
  node: Element;
}

interface UseTocOptions {
  containerSelector: string;
  headingSelector?: string;
  observerOptions?: IntersectionObserverInit;
}

function useToc(options: UseTocOptions) {
  const {
    containerSelector,
    headingSelector = 'h2, h3, h4',
    observerOptions,
  } = options;

  const [items, setItems] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const container = document.body.querySelector(containerSelector);

    if (!container) return;

    const mutationObserver = new MutationObserver(() => {
      const headings = container.querySelectorAll(headingSelector);

      const items = Array.from(headings).map((heading) => ({
        id: heading.id,
        text: heading.textContent || '',
        level: parseInt(heading.tagName[1]),
        node: heading,
      }));

      setItems(items);
    });

    mutationObserver.observe(container, {
      childList: true,
      subtree: true,
    });

    return () => mutationObserver.disconnect();
  }, [containerSelector, headingSelector]);

  useEffect(() => {
    const elements = items.map((item) => item.node);
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id);
        }
      });
    }, observerOptions);

    elements.forEach((element) => observer.observe(element));

    return () => {
      elements.forEach((element) => observer.unobserve(element));
    };
  }, [items, observerOptions]);

  return { items, activeId };
}

const PostToc = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { items, activeId } = useToc({
    containerSelector: '.article-content',
    headingSelector: 'h2, h3',
    observerOptions: { rootMargin: '0px 0px -75% 0px', threshold: 1 },
  });

  const scrollToHeading = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    router.push(`${pathname}#${id}`, { scroll: false });
  };

  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) {
      document.getElementById(hash)?.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  if (!items.length) return null;

  return (
    <div className="order-1 lg:order-3">
      <div className="overflow-auto lg:sticky lg:top-24 lg:h-[calc(100vh-120px)]">
        <h2 className="text-sm font-bold uppercase">On this page</h2>
        <ul className="mt-4 space-y-3.5 text-sm">
          {items.map((item) => (
            <li
              key={item.id}
              style={{
                paddingLeft: `${(item.level - 2) * 1}rem`,
              }}
            >
              <Link
                href={`#${item.id}`}
                onClick={scrollToHeading(item.id)}
                className={`transition-all hover:font-bold hover:tracking-wider hover:text-primary ${
                  activeId === item.id
                    ? 'font-bold tracking-wider text-primary'
                    : ''
                }`}
              >
                {item.text}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PostToc;
