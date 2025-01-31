'use client';
import debounce from 'lodash.debounce';
import { useEffect, useState } from 'react';

// Custom Hook for Debounced Value
export const useDebouncedValue = (value: string, delay: number = 300) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = debounce(() => setDebouncedValue(value), delay);
    handler();
    return () => handler.cancel();
  }, [value, delay]);

  return debouncedValue;
};
