import { DomUtils, parseDocument } from 'htmlparser2';
import slugify from 'slugify';

/**
 * Generates a slugified version of the provided name.
 */
export const slugifyText = (text: string) => {
  return slugify(text, {
    lower: true,
    strict: true,
  });
};

/**
 * Generates a unicode-safe slug, preserving non-Latin scripts like Bangla.
 */
export const slugifyUnicode = (text: string): string => {
  return text
    .trim()
    .normalize('NFC')
    .replace(/\s+/g, '-')
    .replace(/[^\p{L}\p{N}-]/gu, '')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();
};

/**
 * Converts a slug into a human-readable format.
 */
export const SlugToText = (slug: string): string => {
  if (!slug.trim()) return '';
  return slug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (match) => match.toUpperCase())
    .replace(/\b\w{1}/g, (match) => match.toLowerCase());
};

/**
 * Estimates reading time in minutes for HTML content (200 wpm, min 1).
 */
export function getReadingTime(html: string): number {
  const text = RemoveHtmlTags(html);
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}

/**
 * Removes HTML tags from a string using htmlparser2.
 */
export function RemoveHtmlTags(str: string): string {
  if (typeof str !== 'string' || !str.trim()) return '';
  try {
    const document = parseDocument(str);
    return DomUtils.getText(document).trim();
  } catch (_error) {
    return '';
  }
}
