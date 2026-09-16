import { formatDistanceToNow, parseISO } from 'date-fns';
import { Clock, Eye } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

interface PostHeaderProps {
  title: string;
  cover: string;
  authorName: string;
  authorId?: string;
  updatedAt: string;
  readingTime?: number | null;
  views?: number;
}

const PostHeader = ({
  title,
  cover,
  updatedAt,
  authorName,
  authorId,
  readingTime,
  views,
}: PostHeaderProps) => {
  const formattedDate = formatDistanceToNow(parseISO(updatedAt), {
    addSuffix: true,
  });
  return (
    <div className='mx-auto max-w-5xl'>
      <h1 className='text-2xl font-bold leading-snug md:text-4xl md:leading-normal'>
        {title}
      </h1>
      <div className='mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground'>
        <span>
          Updated {formattedDate} by{' '}
          {authorId ? (
            <Link
              href={`/author/${authorId}`}
              className='font-medium text-foreground hover:text-primary hover:underline'
            >
              {authorName}
            </Link>
          ) : (
            <span className='font-medium text-foreground'>{authorName}</span>
          )}
        </span>
        {readingTime != null && (
          <span className='flex items-center gap-1.5'>
            <Clock className='h-4 w-4' />
            {readingTime} min read
          </span>
        )}
        {views != null && (
          <span className='flex items-center gap-1.5'>
            <Eye className='h-4 w-4' />
            {views.toLocaleString()} {views === 1 ? 'view' : 'views'}
          </span>
        )}
      </div>

      <Image
        src={cover}
        alt={title}
        width={1932}
        height={1087}
        className='my-10 rounded-lg'
        priority
      />
    </div>
  );
};

export default PostHeader;
