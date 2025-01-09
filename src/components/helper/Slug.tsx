// Helper function to slugify the name and subcategory (convert spaces to hyphens and lowercasing)
export const slugify = (text: string) => {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-") // Replace spaces and special characters with hyphens
    .replace(/^-+|-+$/g, ""); // Remove leading or trailing hyphens
};

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

  // Generate a URL-friendly slug from the name
  const nameSlug = slugify(name);

  // Return the formatted slug
  return `/article/${nameSlug}_${id}`;
};

/**
 * Converts a slug to human-readable text.
 *
 * @param slug - The slug string to convert.
 * @returns A formatted string with each word capitalized (numbers remain unchanged).
 */
export const SlugToText = (slug: string): string => {
  if (!slug.trim()) return ""; // Handle empty or whitespace-only strings

  return slug
    .split("-")
    .filter(Boolean) // Remove empty segments caused by consecutive dashes
    .map(
      (word) =>
        /^[0-9]+$/.test(word) // Check if the word is a number
          ? word // Leave numbers as they are
          : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase(), // Capitalize text
    )
    .join(" ");
};

export function RemoveHtmlTags(str: string) {
  if (str === null || str === "") return false;
  else str = str.toString();

  // Regular expression to identify HTML tags in
  // the input string. Replacing the identified
  // HTML tag with a null string.
  return str.replace(/(<([^>]+)>)/gi, "");
}
