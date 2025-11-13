import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function LoginSkeleton() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-muted p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-3xl">
        <div className="flex flex-col gap-6">
          <Card className="overflow-hidden">
            <CardContent className="grid p-0 md:grid-cols-2">
              <div className="p-6 md:p-8">
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col items-center text-center">
                    <Skeleton className="mb-2 h-8 w-48" />
                    <Skeleton className="h-4 w-64" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                    <Skeleton className="h-10 w-full" />
                  </div>
                  <Skeleton className="h-10 w-full" />
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-px flex-grow" />
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-px flex-grow" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                  <div className="text-center">
                    <Skeleton className="mx-auto h-4 w-48" />
                  </div>
                </div>
              </div>
              <div className="relative hidden bg-muted md:block">
                <Skeleton className="absolute inset-0 h-full w-full" />
              </div>
            </CardContent>
          </Card>
          <Skeleton className="h-4 w-full" />
        </div>
      </div>
    </div>
  );
}
