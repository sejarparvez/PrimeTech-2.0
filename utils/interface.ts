export interface articleInterFace {
  id: string;
  title: string;
  coverImage: string;
  updatedAt: string;
  category: string;
  status: string;
  author: {
    name: string;
    image: string;
  };

  _count: {
    comments: number;
  };
}
