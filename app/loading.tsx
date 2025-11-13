import { Skeleton } from '@/components/ui/skeleton';

export default function HomeSkeleton() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto h-16 px-4">
          <div className="flex h-full items-center justify-between">
            {/* Logo */}
            <Skeleton className="h-8 w-32" />

            {/* Nav - Hidden on mobile */}
            <div className="hidden items-center gap-6 md:flex">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-4 w-16" />
              ))}
            </div>

            {/* Search and Actions */}
            <div className="flex items-center gap-4">
              <div className="hidden items-center gap-2 md:flex">
                <Skeleton className="h-9 w-[200px]" /> {/* Search input */}
                <Skeleton className="h-9 w-24" /> {/* Search button */}
              </div>
              <Skeleton className="h-8 w-8 rounded-full" /> {/* Theme toggle */}
              <Skeleton className="h-8 w-8 rounded-full" /> {/* Avatar */}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-[2fr,1fr]">
          {/* Featured Article */}
          <div className="space-y-4">
            <Skeleton className="aspect-[16/9] w-full rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-8 w-3/4" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-32" />
              </div>
            </div>
          </div>

          {/* Sidebar Articles */}
          <div className="space-y-6">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="aspect-video w-full rounded-lg" />
                <div className="space-y-2">
                  <Skeleton className="h-6 w-full" />
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Latest Articles Section */}
        <div className="mt-12">
          <div className="mb-6 flex items-center justify-between">
            <Skeleton className="h-8 w-40" /> {/* Section title */}
            <Skeleton className="h-9 w-24" /> {/* View All button */}
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="aspect-video w-full rounded-lg" />
                <div className="space-y-2">
                  <Skeleton className="h-6 w-[85%]" />
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-8 w-8 rounded-full" />
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
