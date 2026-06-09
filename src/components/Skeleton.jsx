export const ThreadCardSkeleton = () => (
  <div className="bg-white border-2 border-plm-charcoal rounded-[32px] shadow-[8px_8px_0px_0px_rgba(33,33,33,1)] mb-8 overflow-hidden animate-pulse">
    <div className="p-8">
      <div className="flex items-center mb-4 space-x-2">
        <div className="h-4 w-16 bg-plm-charcoal/10 rounded-full"></div>
        <div className="h-1 w-1 bg-plm-charcoal/10 rounded-full"></div>
        <div className="h-3 w-24 bg-plm-charcoal/10 rounded"></div>
      </div>
      <div className="h-8 w-3/4 bg-plm-charcoal/10 rounded mb-4"></div>
      <div className="space-y-2 mb-6">
        <div className="h-4 w-full bg-plm-charcoal/5 rounded"></div>
        <div className="h-4 w-5/6 bg-plm-charcoal/5 rounded"></div>
      </div>
      <div className="flex items-center gap-4">
        <div className="h-8 w-20 bg-plm-charcoal/10 rounded-full"></div>
        <div className="h-8 w-24 bg-plm-charcoal/10 rounded-full"></div>
      </div>
    </div>
  </div>
);

export const SubforumSidebarSkeleton = () => (
  <div className="bg-white border-2 border-plm-charcoal rounded-[32px] shadow-[6px_6px_0px_0px_rgba(33,33,33,1)] overflow-hidden animate-pulse">
    <div className="bg-plm-pink/20 h-16 w-full"></div>
    <div className="p-4 space-y-2">
      {[1, 2, 3].map((i) => (
        <div key={i} className="h-10 w-full bg-plm-charcoal/5 rounded-2xl"></div>
      ))}
    </div>
  </div>
);

export const ThreadDetailSkeleton = () => (
  <div className="max-w-4xl mx-auto px-4 py-8 animate-pulse">
    <div className="h-4 w-24 bg-plm-charcoal/10 rounded mb-8"></div>
    <div className="bg-white border-2 border-plm-charcoal rounded-[40px] shadow-[12px_12px_0px_0px_rgba(33,33,33,1)] overflow-hidden mb-12">
      <div className="p-10">
        <div className="flex items-center mb-6 space-x-2">
          <div className="h-5 w-20 bg-plm-charcoal/10 rounded-full"></div>
          <div className="h-1 w-1 bg-plm-charcoal/10 rounded-full"></div>
          <div className="h-3 w-32 bg-plm-charcoal/10 rounded"></div>
        </div>
        <div className="h-12 w-3/4 bg-plm-charcoal/10 rounded mb-8"></div>
        <div className="space-y-4 mb-10">
          <div className="h-4 w-full bg-plm-charcoal/5 rounded"></div>
          <div className="h-4 w-full bg-plm-charcoal/5 rounded"></div>
          <div className="h-4 w-3/4 bg-plm-charcoal/5 rounded"></div>
        </div>
        <div className="flex items-center gap-4 border-t border-plm-charcoal/10 pt-8">
          <div className="h-10 w-24 bg-plm-charcoal/10 rounded-full"></div>
          <div className="h-10 w-32 bg-plm-charcoal/10 rounded-full"></div>
        </div>
      </div>
    </div>
  </div>
);

export const CommentSkeleton = () => (
  <div className="mt-6 animate-pulse">
    <div className="flex items-center mb-3 space-x-2">
      <div className="h-3 w-20 bg-plm-charcoal/10 rounded"></div>
      <div className="h-1 w-1 bg-plm-charcoal/10 rounded-full"></div>
      <div className="h-3 w-16 bg-plm-charcoal/10 rounded"></div>
    </div>
    <div className="space-y-2 mb-4">
      <div className="h-4 w-full bg-plm-charcoal/5 rounded"></div>
      <div className="h-4 w-4/5 bg-plm-charcoal/5 rounded"></div>
    </div>
    <div className="h-6 w-16 bg-plm-charcoal/10 rounded-full"></div>
  </div>
);

export const SubforumBannerSkeleton = () => (
  <div className="bg-plm-blue/10 border-2 border-plm-charcoal rounded-[40px] shadow-[8px_8px_0px_0px_rgba(33,33,33,1)] mb-12 overflow-hidden animate-pulse">
    <div className="px-8 py-10 flex flex-col md:flex-row md:items-center gap-6">
      <div className="bg-white border-2 border-plm-charcoal w-20 h-20 rounded-full"></div>
      <div className="space-y-3">
        <div className="h-10 w-48 bg-plm-charcoal/10 rounded"></div>
        <div className="h-4 w-64 bg-plm-charcoal/5 rounded"></div>
      </div>
    </div>
  </div>
);
