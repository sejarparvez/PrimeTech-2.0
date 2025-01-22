import { Skeleton } from "@/components/ui/skeleton";

export default function DesignSkeleton() {
  return (
    <div className="mx-10 my-10">
      <div className="columns-1 md:columns-3">
        {/* Skeleton loaders */}
        {[...Array(6)].map((_, index) => (
          <div key={index} className="image-container py-2">
            <Skeleton className="h-64 w-full bg-slate-300" />{" "}
            {/* Image skeleton */}
            <div className="mt-2">
              <Skeleton className="h-4 w-3/4 bg-slate-300" />{" "}
              {/* Name skeleton */}
              <Skeleton className="mt-2 h-4 w-1/2 bg-slate-300" />{" "}
              {/* Category skeleton */}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
