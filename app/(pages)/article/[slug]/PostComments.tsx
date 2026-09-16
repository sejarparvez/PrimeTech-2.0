'use client';

import { formatDistanceToNow } from 'date-fns';
import { MessageCircle, Send } from 'lucide-react';
import Link from 'next/link';
import { type FormEvent, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { useSession } from '@/lib/auth-client';
import { useArticleComments, useCreateComment } from '@/services/article';

export default function PostComments({ slug }: { slug: string }) {
  const { data: session, isPending: isSessionPending } = useSession();
  const [content, setContent] = useState('');

  const { data: response, isLoading } = useArticleComments(slug);
  const { mutate, isPending: isPosting } = useCreateComment();

  const comments = response?.data ?? [];

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const text = content.trim();
    if (!text || isPosting) return;
    mutate({ slug, content: text }, { onSuccess: () => setContent('') });
  };

  return (
    <section id='comments' className='mx-auto mt-12 w-full max-w-5xl'>
      <h2 className='mb-6 flex items-center gap-2 text-2xl font-bold tracking-tight'>
        <MessageCircle className='h-6 w-6' />
        Comments ({comments.length})
      </h2>

      {isSessionPending ? (
        <Skeleton className='h-28 w-full rounded-xl' />
      ) : session?.user ? (
        <form onSubmit={handleSubmit} className='space-y-3'>
          <Textarea
            placeholder='Share your thoughts...'
            rows={4}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            maxLength={2000}
          />
          <div className='flex justify-end'>
            <Button type='submit' disabled={!content.trim() || isPosting}>
              <Send className='mr-2 h-4 w-4' />
              {isPosting ? 'Posting...' : 'Post Comment'}
            </Button>
          </div>
        </form>
      ) : (
        <div className='rounded-xl border-2 border-dashed p-6 text-center'>
          <p className='text-muted-foreground'>
            <Link href='/auth/signin' className='text-primary hover:underline'>
              Sign in
            </Link>{' '}
            to join the discussion.
          </p>
        </div>
      )}

      <div className='mt-8 space-y-6'>
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: static skeletons
            <div key={i} className='flex gap-3'>
              <Skeleton className='h-10 w-10 shrink-0 rounded-full' />
              <div className='flex-1 space-y-2'>
                <Skeleton className='h-4 w-32' />
                <Skeleton className='h-4 w-full' />
                <Skeleton className='h-4 w-2/3' />
              </div>
            </div>
          ))
        ) : comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className='flex gap-3'>
              <Avatar className='h-10 w-10 shrink-0'>
                <AvatarImage src={comment.author?.image ?? undefined} />
                <AvatarFallback>
                  {comment.author?.name?.charAt(0) ?? '?'}
                </AvatarFallback>
              </Avatar>
              <div className='min-w-0 flex-1'>
                <div className='flex flex-wrap items-baseline gap-x-2'>
                  <p className='text-sm font-bold'>{comment.author?.name}</p>
                  <time className='text-xs text-muted-foreground'>
                    {formatDistanceToNow(new Date(comment.createdAt), {
                      addSuffix: true,
                    })}
                  </time>
                </div>
                <p className='mt-1 text-sm leading-relaxed break-words whitespace-pre-wrap'>
                  {comment.content}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className='py-4 text-center text-sm text-muted-foreground'>
            No comments yet. Be the first to share your thoughts!
          </p>
        )}
      </div>
    </section>
  );
}
