import axios from 'axios';
import type { Metadata, ResolvingMetadata } from 'next';
import { RemoveHtmlTags } from '@/utils/slug'; // Ensure this path is correct
import SingleArticle from './SingleArticle';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

type Props = {
  params: Promise<{ slug: string }>;
};

function truncateString(str: string, maxLength: number): string {
  return str.length > maxLength ? `${str.slice(0, maxLength)}...` : str;
}

async function fetchArticleData(slug: string) {
  try {
    // Calling your dynamic API route using the slug
    const response = await axios.get(
      `${siteUrl}/api/article/single-article/${slug}`,
    );
    return response.data;
  } catch (_error) {
    return null;
  }
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const slug = (await params).slug;
  const data = await fetchArticleData(slug);

  if (!data) {
    return {
      title: 'Article Not Found',
      description: 'The requested blog post could not be found.',
    };
  }

  const title = data.title;
  // Use the helper to clean the Tiptap HTML content for the description tag
  const rawDescription = RemoveHtmlTags(data.content || '');
  const description = truncateString(rawDescription, 160);
  const imageUrl = data.coverImage || `${siteUrl}/default-image.jpg`;
  const pageUrl = `${siteUrl}/article/${slug}`;

  return {
    title,
    description,
    alternates: { canonical: pageUrl },
    keywords: data.tags?.join(', '),
    openGraph: {
      title,
      description,
      type: 'article',
      url: pageUrl,
      publishedTime: data.createdAt,
      authors: [data.author?.name || 'Author'],
      images: [{ url: imageUrl, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const slug = (await params).slug;
  return <SingleArticle slug={slug} />;
}
