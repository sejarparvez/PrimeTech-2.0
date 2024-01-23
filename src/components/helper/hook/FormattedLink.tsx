import { useEffect, useState } from "react";

interface FormattedPostResult {
  postLink: string;
}

const useFormattedPost = (
  timestamp: string,
  title: string,
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

  // Create the post link
  const postLink = `/blog/${formattedDate}/${formattedTitle}/`;

  return { postLink };
};

export default useFormattedPost;
