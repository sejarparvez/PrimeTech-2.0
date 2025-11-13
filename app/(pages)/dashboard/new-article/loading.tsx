import { Skeleton } from '@/components/ui/skeleton';

export default function ArticleSkeleton() {
  return (
    <div className="min-h-screen p-4 md:p-6">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-6" /> {/* Back button */}
          <Skeleton className="h-8 w-32" /> {/* Title */}
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-24" /> {/* Discard button */}
          <Skeleton className="h-9 w-28" /> {/* Save button */}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-[1fr,300px]">
        <div className="space-y-6">
          {/* Article Title */}
          <div className="space-y-2">
            <Skeleton className="h-5 w-24" /> {/* Label */}
            <Skeleton className="h-10 w-full" /> {/* Input */}
          </div>

          {/* Editor Toolbar */}
          <Skeleton className="h-10 w-full" />

          {/* Content Area */}
          <div className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[90%]" />
            <Skeleton className="h-4 w-[95%]" />
            <Skeleton className="h-4 w-[85%]" />
          </div>

          {/* Word Count */}
          <Skeleton className="mt-4 h-4 w-40" />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Cover Image Section */}
          <div className="space-y-2">
            <Skeleton className="h-5 w-28" /> {/* Label */}
            <Skeleton className="h-[200px] w-full rounded-lg" />{' '}
            {/* Image placeholder */}
            <Skeleton className="h-4 w-48" /> {/* Help text */}
          </div>

          {/* Category Section */}
          <div className="space-y-2">
            <Skeleton className="h-5 w-32" /> {/* Label */}
            <Skeleton className="h-10 w-full" /> {/* Select */}
          </div>

          {/* Tags Section */}
          <div className="space-y-2">
            <Skeleton className="h-5 w-16" /> {/* Label */}
            <div className="flex gap-2">
              <Skeleton className="h-10 flex-1" /> {/* Input */}
              <Skeleton className="h-10 w-16" /> {/* Add button */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
