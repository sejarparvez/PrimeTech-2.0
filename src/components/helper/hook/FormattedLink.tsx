import { useEffect, useState } from "react";

interface FormattedPostResult {
  postLink: string;
}

export const useFormattedPostLink = (
  timestamp: string,
  title: string,
  category: string,
): FormattedPostResult => {
  const [formattedDate, setFormattedDate] = useState("");

  useEffect(() => {
    // Parse the timestamp using Date object
    const postDate = new Date(timestamp);

    // Extract date components
    const day = postDate.getDate();
    const month = postDate.getMonth() + 1; // Month is zero-based
    const year = postDate.getFullYear();

    // Format the date as needed
    const formattedDateStr = `${day}/${month}/${year}`;

    // Set the formatted date
    setFormattedDate(formattedDateStr);
  }, [timestamp]);

  // Format the title as a slug
  const formattedTitle = title.replace(/\s+/g, "-").toLowerCase();
  const formattedCategory = category.replace(/\s+/g, "-").toLowerCase();

  // Create the post link
  const postLink = `/blog/${formattedCategory}/${formattedDate}/${formattedTitle}/`;

  return { postLink };
};
