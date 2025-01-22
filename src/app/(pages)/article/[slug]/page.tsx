import { RemoveHtmlTags } from "@/utils/slug";
import axios from "axios";
import type { Metadata, ResolvingMetadata } from "next";
import SingleDesign from "./SingleDesign";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

type Props = {
  params: Promise<{ slug: string }>;
};

// Utility to truncate strings to a specific length
function truncateString(str: string, maxLength: number): string {
  return str.length > maxLength ? `${str.slice(0, maxLength)}...` : str;
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  // read route params
  const postlink = (await params).slug;
  const id = postlink.split("_")[1];

  // fetch data
  const response = await axios.get(`${siteUrl}/api/post/singlepost?id=${id}`);

  const data = response.data;
  const title = data.title || "Blog Post";
  const rawDescription =
    RemoveHtmlTags(data.content) || "Explore this amazing design";
  const description = truncateString(rawDescription, 160); // Limit to 160 characters
  const imageUrl = data.image || `${siteUrl}/default-image.jpg`; // Fallback for image
  const pageUrl = `${siteUrl}/article/${postlink}`;

  return {
    title,
    description,
    alternates: {
      canonical: pageUrl,
    },
    keywords: data.tags?.length ? data.tags.join(", ") : "design, art, blog", // Comma-separated string

    openGraph: {
      title,
      description,
      type: "article",
      url: pageUrl,
      authors: data.author?.name || "Unknown Author",
      publishedTime: data.createdAt || null,
      modifiedTime: data.updatedAt || null,
      section: data.category || "Uncategorized",
      images: [
        {
          url: imageUrl,
          alt: title,
        },
      ],
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: imageUrl,
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;
  return <SingleDesign postlink={slug} />;
}
