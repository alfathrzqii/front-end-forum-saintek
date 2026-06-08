export const ThreadCardSkeleton = () => (
  <div className="bg-white border border-gray-200 rounded-md shadow-sm mb-4 overflow-hidden animate-pulse">
    <div className="p-4">
      <div className="flex items-center mb-2 space-x-2">
        <div className="h-3 w-20 bg-gray-200 rounded"></div>
        <div className="h-3 w-1 bg-gray-200 rounded-full"></div>
        <div className="h-3 w-24 bg-gray-200 rounded"></div>
        <div className="h-3 w-1 bg-gray-200 rounded-full"></div>
        <div className="h-3 w-16 bg-gray-200 rounded"></div>
      </div>
      <div className="h-5 w-3/4 bg-gray-200 rounded mb-2"></div>
      <div className="space-y-2 mb-4">
        <div className="h-3 w-full bg-gray-100 rounded"></div>
        <div className="h-3 w-5/6 bg-gray-100 rounded"></div>
      </div>
      <div className="flex items-center space-x-4">
        <div className="h-6 w-24 bg-gray-200 rounded"></div>
        <div className="h-6 w-24 bg-gray-200 rounded"></div>
      </div>
    </div>
  </div>
);

export const SubforumSidebarSkeleton = () => (
  <div className="bg-white border border-gray-200 rounded-md shadow-sm overflow-hidden animate-pulse">
    <div className="bg-gray-200 h-14 w-full"></div>
    <div className="p-2">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex items-center p-3">
          <div className="h-4 w-32 bg-gray-100 rounded"></div>
        </div>
      ))}
    </div>
  </div>
);

export const ThreadDetailSkeleton = () => (
  <div className="max-w-4xl mx-auto px-4 py-8 animate-pulse">
    <div className="h-5 w-32 bg-gray-200 rounded mb-6"></div>
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex items-center mb-3 space-x-2">
          <div className="h-3 w-20 bg-gray-200 rounded"></div>
          <div className="h-3 w-1 bg-gray-200 rounded-full"></div>
          <div className="h-3 w-24 bg-gray-200 rounded"></div>
          <div className="h-3 w-1 bg-gray-200 rounded-full"></div>
          <div className="h-3 w-16 bg-gray-200 rounded"></div>
        </div>
        <div className="h-10 w-3/4 bg-gray-200 rounded mb-6"></div>
        <div className="space-y-3 mb-8">
          <div className="h-4 w-full bg-gray-100 rounded"></div>
          <div className="h-4 w-full bg-gray-100 rounded"></div>
          <div className="h-4 w-full bg-gray-100 rounded"></div>
          <div className="h-4 w-2/3 bg-gray-100 rounded"></div>
        </div>
        <div className="flex items-center space-x-4 border-t border-gray-100 pt-4">
          <div className="h-8 w-24 bg-gray-200 rounded-full"></div>
          <div className="h-8 w-24 bg-gray-200 rounded-full"></div>
        </div>
      </div>
    </div>
  </div>
);

export const CommentSkeleton = () => (
  <div className="mt-4 animate-pulse">
    <div className="flex items-center mb-2 space-x-2">
      <div className="h-3 w-24 bg-gray-200 rounded"></div>
      <div className="h-3 w-1 bg-gray-200 rounded-full"></div>
      <div className="h-3 w-20 bg-gray-200 rounded"></div>
    </div>
    <div className="space-y-2 mb-2">
      <div className="h-3 w-full bg-gray-100 rounded"></div>
      <div className="h-3 w-4/5 bg-gray-100 rounded"></div>
    </div>
    <div className="h-4 w-12 bg-gray-200 rounded"></div>
  </div>
);

export const SubforumBannerSkeleton = () => (
  <div className="bg-white border border-gray-200 rounded-md shadow-sm mb-8 overflow-hidden animate-pulse">
    <div className="h-24 bg-gray-200"></div>
    <div className="px-6 py-4 flex flex-col md:flex-row md:items-end -mt-12 md:-mt-8 gap-4">
      <div className="bg-white p-2 rounded-full border-4 border-white shadow-md inline-block">
        <div className="bg-gray-100 w-16 h-16 rounded-full"></div>
      </div>
      <div className="mb-2 space-y-2">
        <div className="h-8 w-48 bg-gray-200 rounded"></div>
        <div className="h-4 w-64 bg-gray-100 rounded"></div>
      </div>
    </div>
  </div>
);
