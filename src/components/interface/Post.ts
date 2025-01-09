export interface PostInterface {
  id: string;
  title: string;
  content: string;
  coverImage: string;
  updatedAt: string;
  author: { name: string; image: string };
  category: string;
  commentCount: number;
}
