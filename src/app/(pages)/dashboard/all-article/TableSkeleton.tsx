export default function TableSkeleton({ rowCount }: { rowCount: number }) {
  return (
    <div className="overflow-hidden rounded-lg bg-white shadow-md">
      <div className="flex justify-between space-x-4 border-b border-gray-200 p-4">
        <div className="h-6 w-1/3 rounded bg-gray-300"></div>
        <div className="h-6 w-1/3 rounded bg-gray-300"></div>
        <div className="h-6 w-1/3 rounded bg-gray-300"></div>
      </div>
      {[...Array(rowCount)].map((_, index) => (
        <div
          key={index}
          className="flex justify-between space-x-4 border-b border-gray-200 p-4"
        >
          <div className="h-8 w-1/3 rounded bg-gray-200"></div>
          <div className="h-8 w-1/3 rounded bg-gray-200"></div>
          <div className="h-8 w-1/3 rounded bg-gray-200"></div>
        </div>
      ))}
    </div>
  );
}