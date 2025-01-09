interface FeaturedPostType {
  id: string;
  coverImage: string;
  title: string;
  category: string;
  author: {
    name: string;
    image: string;
  };
  _count: {
    comments: number;
  };
  updatedAt: string;
  createdAt: string;
  content: string;
}

export default FeaturedPostType;
