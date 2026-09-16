export interface ArticleListType {
  id: string;
  title: string;
  slug: string;
  coverImage: string;
  isFeatured: boolean;
  views: number;
  excerpt?: string;
  updatedAt: string;
  author: {
    id: string;
    name: string;
    image: string;
  };
  _count: {
    comments: number;
  };
  category: {
    name: string;
    slug: string;
  };
}
