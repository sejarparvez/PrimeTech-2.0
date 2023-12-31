export default function Loading() {
  return (
    <div className="mx-auto flex flex-col items-center justify-center gap-5 rounded-2xl bg-white p-2 shadow-lg dark:bg-gray-900  sm:flex-row sm:p-4 ">
      <div className=" animate-pulse rounded-xl bg-gray-300  dark:bg-gray-700"></div>
      <div className="flex flex-1 flex-col gap-5 sm:p-2">
        <div className="flex flex-1 flex-col gap-3">
          <div className="h-14 w-full animate-pulse rounded-2xl bg-gray-300 dark:bg-gray-700"></div>
          <div className="h-3 w-full animate-pulse rounded-2xl bg-gray-300 dark:bg-gray-700"></div>
          <div className="h-3 w-full animate-pulse rounded-2xl bg-gray-300 dark:bg-gray-700"></div>
          <div className="h-3 w-full animate-pulse rounded-2xl bg-gray-300 dark:bg-gray-700"></div>
          <div className="h-3 w-full animate-pulse rounded-2xl bg-gray-300 dark:bg-gray-700"></div>
        </div>
        <div className="mt-auto flex justify-around">
          <div className="h-8 w-20 animate-pulse rounded-full bg-gray-300 dark:bg-gray-700"></div>
          <div className="h-8 w-20 animate-pulse rounded-full bg-gray-300 dark:bg-gray-700"></div>
          <div className=" h-8 w-20 animate-pulse rounded-full bg-gray-300 dark:bg-gray-700"></div>
        </div>
      </div>
    </div>
  );
}
