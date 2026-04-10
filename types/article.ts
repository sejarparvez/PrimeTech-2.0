export interface ArticleListType {
  id: string;
  title: string;
  slug: string;
  coverImage: string;
  isFeatured: boolean;
  updatedAt: string;
  author: {
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
