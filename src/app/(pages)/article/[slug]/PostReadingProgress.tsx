"use client";
import { useEffect, useState } from "react";

function useProgress(containerSelector: string) {
  const [enable, setEnable] = useState<boolean>(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const container = document.body.querySelector(containerSelector || "");

    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!enable && entry.isIntersecting) setEnable(true);
        });
      },
      { rootMargin: `0px 0px -${window.innerHeight - 64}px 0px`, threshold: 0 },
    );

    observer.observe(container);

    return () => {
      observer.unobserve(container);
    };
  }, [containerSelector, enable]);

  useEffect(() => {
    const container = document.body.querySelector(containerSelector);

    if (!enable || !container) return;

    const headerHeight = 64;

    const calculateProgress = () => {
      const rect = container.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const contentHeight = rect.height;

      const scrolled = headerHeight - rect.top;
      const scrollable = contentHeight - viewportHeight;

      const progress = (scrolled / scrollable) * 100;

      setProgress(Math.min(100, Math.max(0, progress)));
    };

    window.addEventListener("scroll", calculateProgress);
    window.addEventListener("resize", calculateProgress);

    return () => {
      window.removeEventListener("scroll", calculateProgress);
      window.removeEventListener("resize", calculateProgress);
    };
  }, [enable, containerSelector]);

  return { enable, progress };
}

const PostReadingProgress = () => {
  const { progress, enable } = useProgress(".article-content");

  return enable ? (
    <div
      className="fixed inset-x-0 top-16 z-50 h-1 bg-primary"
      style={{ width: `${progress}%` }}
    />
  ) : null;
};

export default PostReadingProgress;