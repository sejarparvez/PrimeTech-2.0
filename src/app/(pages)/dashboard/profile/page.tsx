'use client';

import { useUserProfile } from '@/app/services/profile';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { articleInterFace } from '@/utils/interface';
import { CalendarIcon, ImageIcon, UserIcon } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { Suspense, useState } from 'react';
import { PostCard, PostSkeleton } from '../../(home)/RecentPost';
import ProfileSkeleton from './ProfileSkeleton';

export default function Page() {
  return (
    <Suspense fallback={<ProfileSkeleton />}>
      <ProfileContent />
    </Suspense>
  );
}

function ProfileContent() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id');
  const [take, setTake] = useState(6);

  const { isLoading, data, isError } = useUserProfile({ id: id || '' });

  if (!id) return <div className="p-4 text-center">No ID provided</div>;
  if (isLoading) return <ProfileSkeleton />;
  if (isError)
    return (
      <div className="p-4 text-center text-destructive">
        Error loading profile
      </div>
    );

  const totalArticleCount = data.posts.length;

  function handleLoadMore() {
    setTake((prevTake) => prevTake + 6);
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader className="pb-0">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <Avatar className="h-24 w-24 sm:h-32 sm:w-32">
              <AvatarImage src={data.image} alt={data.name} />
              <AvatarFallback className="text-3xl font-medium">
                {data.name
                  .split(' ')
                  .map((n: string) => n[0])
                  .join('')}
              </AvatarFallback>
            </Avatar>
            <div className="text-center sm:text-left space-y-2">
              <h1 className="text-2xl sm:text-3xl font-bold">{data.name}</h1>
              <Badge variant="secondary">{data.status}</Badge>
              <p className="text-muted-foreground max-w-2xl">{data.bio}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Separator className="my-6" />
          <div className="flex flex-wrap justify-center sm:justify-start gap-6 text-sm text-muted-foreground">
            <div className="flex items-center">
              <CalendarIcon className="mr-2 h-4 w-4" />
              Joined {new Date(data.createdAt).toLocaleDateString()}
            </div>
            <div className="flex items-center">
              <ImageIcon className="mr-2 h-4 w-4" />
              {totalArticleCount} Articles
            </div>
            <div className="flex items-center">
              <UserIcon className="mr-2 h-4 w-4" />
              {data._count?.followers || 0} Followers
            </div>
          </div>
        </CardContent>
      </Card>

      <h2 className="text-2xl font-bold mt-12 mb-6">Articles</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading
          ? Array.from({ length: 6 }).map((_, index) => (
              <PostSkeleton key={index} />
            ))
          : data.posts
              .slice(0, take)
              .map((post: articleInterFace) => (
                <PostCard key={post.id} data={post} />
              ))}
      </div>
      {take < totalArticleCount && (
        <div className="mt-8 text-center">
          <Button onClick={handleLoadMore} variant="outline">
            Load More
          </Button>
        </div>
      )}
    </div>
  );
}
