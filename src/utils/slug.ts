import { DomUtils, parseDocument } from "htmlparser2";
import slugify from "slugify";

/**
 * Generates a slugified version of the provided name.
 */
export const slugifyText = (text: string) => {
  return slugify(text, {
    lower: true,
    strict: true, // Removes special characters
  });
};

/**
 * Creates a slug using article id and name.
 */
export const createSlug = ({
  id,
  name,
}: {
  id: string;
  name: string;
}): string => {
  if (!id || !name) {
    throw new Error("Both 'id' and 'name' are required to create a slug.");
  }

  const nameSlug = slugifyText(name);
  return `/article/${nameSlug}_${id}`;
};

/**
 * Converts a slug into a human-readable format.
 */
export const SlugToText = (slug: string): string => {
  if (!slug.trim()) return "";
  return slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (match) => match.toUpperCase())
    .replace(/\b\w{1}/g, (match) => match.toLowerCase());
};

/**
 * Removes HTML tags from a string using htmlparser2.
 *
 * @param str - The string to sanitize.
 * @returns A string with all HTML tags removed.
 */
export function RemoveHtmlTags(str: string): string {
  if (typeof str !== "string" || !str.trim()) return ""; // Handle invalid or empty strings

  try {
    const document = parseDocument(str); // Parse the HTML string
    return DomUtils.getText(document).trim(); // Extract and trim text content
  } catch (error) {
    console.error("Error parsing string in RemoveHtmlTags:", error);
    return ""; // Return empty string in case of error
  }
}
