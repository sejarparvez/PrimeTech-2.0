import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function ArticleListSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <Card key={i} className="relative overflow-hidden">
          <div className="relative aspect-[16/10]">
            <Skeleton className="absolute inset-0" />
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <Skeleton className="mb-2 h-5 w-20" />
            <Skeleton className="mb-1 h-6 w-3/4" />
            <div className="mt-2 flex items-center">
              <Skeleton className="mr-2 h-6 w-6 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
