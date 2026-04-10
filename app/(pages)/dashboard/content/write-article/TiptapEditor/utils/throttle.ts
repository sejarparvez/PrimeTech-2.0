export function throttle<T extends (...args: never[]) => void>(
  func: T,
  wait: number,
): T {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  let lastArgs: Parameters<T> | null = null;

  return ((...args: Parameters<T>) => {
    if (!timeout) {
      func(...args);
      timeout = setTimeout(() => {
        timeout = null;
        if (lastArgs) {
          func(...lastArgs);
          lastArgs = null;
        }
      }, wait);
    } else {
      lastArgs = args;
    }
  }) as T;
}
