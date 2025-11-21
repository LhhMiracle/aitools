import { Skeleton } from '@/components/Skeleton';

export default function PricingLoading() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="pt-24 pb-12 text-center px-4">
        <Skeleton className="h-14 w-64 mx-auto mb-4" />
        <Skeleton className="h-6 w-96 mx-auto mb-8" />
        <div className="flex items-center justify-center gap-4">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-7 w-14 rounded-full" />
          <Skeleton className="h-5 w-32" />
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-8 rounded-2xl bg-white/5 border border-white/10">
              <Skeleton className="w-12 h-12 rounded-xl mb-6" />
              <Skeleton className="h-7 w-24 mb-2" />
              <Skeleton className="h-5 w-full mb-6" />
              <Skeleton className="h-12 w-32 mb-2" />
              <Skeleton className="h-5 w-28 mb-6" />
              <Skeleton className="h-12 w-full rounded-xl mb-8" />
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((j) => (
                  <div key={j} className="flex items-center gap-3">
                    <Skeleton className="w-5 h-5 rounded" />
                    <Skeleton className="h-4 flex-1" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
