import { formatDistanceToNow, parseISO } from 'date-fns';
import Image from 'next/image';

interface PostHeaderProps {
  title: string;
  cover: string;
  authorName: string;
  updatedAt: string;
}

const PostHeader = ({
  title,
  cover,
  updatedAt,
  authorName,
}: PostHeaderProps) => {
  const formattedDate = formatDistanceToNow(parseISO(updatedAt), {
    addSuffix: true,
  });
  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="text-2xl font-bold leading-snug md:text-4xl md:leading-normal">
        {title}
      </h1>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        This Article Was Last Updated
        <div className="flex items-center text-sm">
          <span>{formattedDate}</span>
        </div>
        By
        <span>{authorName}</span>
      </div>

      <Image
        src={cover}
        alt={title}
        width={1932}
        height={1087}
        className="my-10 rounded-lg"
        priority
      />
    </div>
  );
};

export default PostHeader;
