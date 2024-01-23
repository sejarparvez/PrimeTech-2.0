interface FeaturedPostType {
  _id: string;
  coverImage: string;
  title: string;
  author: {
    name: string;
    image: string;
  };
  _count: {
    comments: number;
  };
  updatedAt: string;
}

export default FeaturedPostType;
