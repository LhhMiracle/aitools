import { StatSkeleton, CardSkeleton, ImageSkeleton } from '@/components/Skeleton';
import Header from '@/components/Header';

export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        {/* Welcome Section Skeleton */}
        <div className="mb-12">
          <div className="h-10 bg-white/5 rounded-lg w-64 mb-2 animate-pulse" />
          <div className="h-5 bg-white/5 rounded-lg w-96 animate-pulse" />
        </div>

        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[1, 2, 3, 4].map((i) => (
            <StatSkeleton key={i} />
          ))}
        </div>

        {/* Quick Actions Skeleton */}
        <div className="mb-12">
          <div className="h-8 bg-white/5 rounded-lg w-40 mb-6 animate-pulse" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        </div>

        {/* Recent Creations Skeleton */}
        <div>
          <div className="h-8 bg-white/5 rounded-lg w-48 mb-6 animate-pulse" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <ImageSkeleton key={i} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
