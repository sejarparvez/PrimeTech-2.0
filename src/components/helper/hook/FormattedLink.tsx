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
    const day = ("0" + postDate.getDate()).slice(-2);
    const month = ("0" + (postDate.getMonth() + 1)).slice(-2);
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
  const postLink = `${formattedCategory}/${formattedDate}/${formattedTitle}/`;

  return { postLink };
};
