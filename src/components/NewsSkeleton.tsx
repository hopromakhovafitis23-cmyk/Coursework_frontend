export default function NewsSkeleton() {
  return (
    <div className="rounded-lg overflow-hidden bg-gray-800 shadow-sm animate-pulse h-full flex flex-col">
      <div className="aspect-video bg-gray-700 w-full"></div>
      <div className="p-4 space-y-4 flex flex-col flex-grow">
        <div className="space-y-2">
          <div className="h-5 bg-gray-700 rounded w-full"></div>
          <div className="h-5 bg-gray-700 rounded w-3/4"></div>
        </div>
        <div className="space-y-2 flex-grow">
          <div className="h-4 bg-gray-700 rounded w-full"></div>
          <div className="h-4 bg-gray-700 rounded w-5/6"></div>
        </div>
        <div className="flex justify-between pt-2 border-t border-gray-700 mt-auto">
          <div className="h-3 bg-gray-700 rounded w-1/4"></div>
          <div className="h-3 bg-gray-700 rounded w-1/4"></div>
        </div>
      </div>
    </div>
  );
}
