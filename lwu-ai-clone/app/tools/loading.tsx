import { ToolCardSkeleton } from '@/components/Skeleton';
import Header from '@/components/Header';

export default function ToolsLoading() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        {/* Header Skeleton */}
        <div className="text-center mb-16">
          <div className="h-12 bg-white/5 rounded-lg w-64 mx-auto mb-4 animate-pulse" />
          <div className="h-6 bg-white/5 rounded-lg w-96 mx-auto animate-pulse" />
        </div>

        {/* Tools Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => (
            <ToolCardSkeleton key={i} />
          ))}
        </div>
      </main>
    </div>
  );
}
