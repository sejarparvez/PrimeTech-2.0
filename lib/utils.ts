import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
export function getInitials(name?: string | null): string {
  if (!name) {
    return '';
  }
  const words = name.trim().split(' ');
  if (words.length === 1) {
    return words[0][0].toUpperCase();
  } // Handles single-word names
  return `${words[0][0].toUpperCase()}${words[words.length - 1][0].toUpperCase()}`; // Handles multi-word names
}
