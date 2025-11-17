'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { ArrowLeft, Download, Trash2, Filter } from 'lucide-react';
import { useStore } from '@/store/useStore';
import Header from '@/components/Header';
import Link from 'next/link';

export default function HistoryPage() {
  const router = useRouter();
  const { user, isAuthenticated, creations } = useStore();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">Creation History</h1>
              <p className="text-gray-400">
                {creations.length} total creations
              </p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
              <Filter className="w-4 h-4" />
              Filter
            </button>
          </div>
        </motion.div>

        {/* Creations Grid */}
        {creations.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {creations.map((creation, index) => (
              <motion.div
                key={creation.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
                className="group relative rounded-2xl overflow-hidden bg-white/5 border border-white/10 hover:border-white/20 transition-all"
              >
                {/* Image */}
                <div className="relative aspect-square bg-gradient-to-br from-indigo-500/20 to-purple-500/20">
                  {creation.resultUrl && (
                    <img
                      src={creation.resultUrl}
                      alt={creation.type}
                      className="w-full h-full object-cover"
                    />
                  )}

                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <button
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = creation.resultUrl;
                        link.download = `creation-${creation.id}.png`;
                        link.click();
                      }}
                      className="p-3 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                      title="Download"
                    >
                      <Download className="w-5 h-5" />
                    </button>
                    <button
                      className="p-3 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-colors text-red-400"
                      title="Delete"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Info */}
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium capitalize">
                      {creation.type.replace('-', ' ')}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      creation.status === 'completed'
                        ? 'bg-green-500/20 text-green-400'
                        : creation.status === 'processing'
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : 'bg-red-500/20 text-red-400'
                    }`}>
                      {creation.status}
                    </span>
                  </div>

                  {creation.prompt && (
                    <p className="text-sm text-gray-400 mb-2 line-clamp-2">
                      {creation.prompt}
                    </p>
                  )}

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{new Date(creation.createdAt).toLocaleDateString()}</span>
                    <span>{creation.creditsUsed} credits</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-24 px-4 rounded-2xl bg-white/5 border border-white/10"
          >
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-white/5 flex items-center justify-center">
              <ArrowLeft className="w-12 h-12 text-gray-600 rotate-180" />
            </div>
            <h3 className="text-2xl font-semibold mb-2">No creations yet</h3>
            <p className="text-gray-400 mb-8">
              Start creating amazing AI-powered content!
            </p>
            <Link
              href="/tools"
              className="inline-block px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full font-semibold hover:shadow-lg hover:shadow-indigo-500/50 transition-all"
            >
              Start Creating
            </Link>
          </motion.div>
        )}
      </main>
    </div>
  );
}
