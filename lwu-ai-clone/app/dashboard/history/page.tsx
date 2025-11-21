'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Download,
  Calendar,
  Coins,
  Filter,
  Image as ImageIcon,
  Video,
  Mic,
  Loader2,
  Search,
  Trash2,
  Star,
  Scissors,
  Palette,
  User,
  Users,
  MapPin,
  Film,
  Flame,
  Wand2,
  Eraser,
  X,
  ZoomIn,
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import Header from '@/components/Header';
import Link from 'next/link';

interface Generation {
  id: string;
  type: string;
  status: string;
  createdAt: string;
  resultUrl?: string;
  prompt?: string;
  creditsUsed: number;
}

const TOOL_ICONS: Record<string, any> = {
  'image-generation': ImageIcon,
  'image-upscale': Wand2,
  'background-removal': Eraser,
  'image-to-video': Video,
  'text-to-speech': Mic,
  'hair-style': Scissors,
  'cartoon-style': Palette,
  'portrait-enhance': User,
  'face-swap': Users,
  'object-removal': Trash2,
  'scene-composite': MapPin,
  'photo-animation': Film,
  'special-effects': Flame,
};

const TOOL_NAMES: Record<string, string> = {
  'image-generation': 'Image Generation',
  'image-upscale': 'Image Upscale',
  'background-removal': 'Background Removal',
  'image-to-video': 'Image to Video',
  'text-to-speech': 'Text to Speech',
  'hair-style': 'Hair Style',
  'cartoon-style': 'Cartoon Style',
  'portrait-enhance': 'Portrait Enhance',
  'face-swap': 'Face Swap',
  'object-removal': 'Object Removal',
  'scene-composite': 'Scene Composite',
  'photo-animation': 'Photo Animation',
  'special-effects': 'Special Effects',
};

export default function HistoryPage() {
  const { data: session, status } = useSession();
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [previewImage, setPreviewImage] = useState<Generation | null>(null);
  const itemsPerPage = 12;

  useEffect(() => {
    async function fetchGenerations() {
      if (status === 'authenticated') {
        try {
          const response = await fetch('/api/generations');
          if (response.ok) {
            const data = await response.json();
            setGenerations(data);
          }
        } catch (error) {
          console.error('Failed to fetch generations:', error);
        } finally {
          setLoading(false);
        }
      }
    }
    fetchGenerations();
  }, [status]);

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Header />
        <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
          </div>
        </main>
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  // Filter by type and search
  const filteredGenerations = generations.filter(g => {
    const matchesFilter = filter === 'all' || g.type === filter;
    const matchesSearch = !searchQuery ||
      g.prompt?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      TOOL_NAMES[g.type]?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Pagination
  const totalPages = Math.ceil(filteredGenerations.length / itemsPerPage);
  const paginatedGenerations = filteredGenerations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalCreditsUsed = generations.reduce((sum, g) => sum + g.creditsUsed, 0);

  // Reset to page 1 when filter or search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [filter, searchQuery]);

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>

          <h1 className="text-4xl font-bold mb-2">Generation History</h1>
          <p className="text-gray-400">
            View all your AI-generated creations
          </p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8"
        >
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-3 mb-2">
              <ImageIcon className="w-5 h-5 text-indigo-400" />
              <span className="text-sm text-gray-400">Total Creations</span>
            </div>
            <div className="text-3xl font-bold">{generations.length}</div>
          </div>

          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-3 mb-2">
              <Coins className="w-5 h-5 text-yellow-400" />
              <span className="text-sm text-gray-400">Credits Used</span>
            </div>
            <div className="text-3xl font-bold">{totalCreditsUsed}</div>
          </div>

          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-3 mb-2">
              <Calendar className="w-5 h-5 text-green-400" />
              <span className="text-sm text-gray-400">This Month</span>
            </div>
            <div className="text-3xl font-bold">
              {generations.filter(g => {
                const now = new Date();
                const createdAt = new Date(g.createdAt);
                return (
                  createdAt.getMonth() === now.getMonth() &&
                  createdAt.getFullYear() === now.getFullYear()
                );
              }).length}
            </div>
          </div>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by prompt or tool name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-indigo-500 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </motion.div>

        {/* Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <Filter className="w-5 h-5 text-gray-400" />
            <span className="text-sm font-medium text-gray-400">Filter by type:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-indigo-500 text-white'
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              All ({generations.length})
            </button>
            {Object.entries(TOOL_NAMES).map(([key, name]) => {
              const count = generations.filter(g => g.type === key).length;
              if (count === 0) return null;
              return (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    filter === key
                      ? 'bg-indigo-500 text-white'
                      : 'bg-white/5 text-gray-400 hover:bg-white/10'
                  }`}
                >
                  {name} ({count})
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Results count */}
        <div className="mb-4 text-sm text-gray-400">
          Showing {paginatedGenerations.length} of {filteredGenerations.length} results
        </div>

        {/* Generations Grid */}
        {paginatedGenerations.length > 0 ? (
          <>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {paginatedGenerations.map((generation, index) => {
                const Icon = TOOL_ICONS[generation.type] || ImageIcon;

                return (
                  <motion.div
                    key={generation.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.03 }}
                    className="group rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all overflow-hidden"
                  >
                    {/* Preview */}
                    <div className="relative aspect-square bg-white/5">
                      {generation.status === 'completed' && generation.resultUrl ? (
                        generation.type === 'text-to-speech' ? (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Mic className="w-16 h-16 text-gray-600" />
                          </div>
                        ) : generation.type === 'image-to-video' || generation.type === 'photo-animation' ? (
                          <video
                            src={generation.resultUrl}
                            className="w-full h-full object-cover"
                            muted
                            loop
                            onMouseEnter={(e) => e.currentTarget.play()}
                            onMouseLeave={(e) => e.currentTarget.pause()}
                          />
                        ) : (
                          <>
                            <img
                              src={generation.resultUrl}
                              alt="Generation result"
                              className="w-full h-full object-cover cursor-pointer"
                              onClick={() => setPreviewImage(generation)}
                            />
                            {/* Zoom overlay on hover */}
                            <div
                              className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                              onClick={() => setPreviewImage(generation)}
                            >
                              <ZoomIn className="w-8 h-8 text-white" />
                            </div>
                          </>
                        )
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          {generation.status === 'processing' ? (
                            <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
                          ) : (
                            <div className="text-center px-4">
                              <Icon className="w-12 h-12 text-gray-600 mx-auto mb-2" />
                              <p className="text-sm text-gray-500 capitalize">
                                {generation.status}
                              </p>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Status Badge */}
                      <div className="absolute top-3 right-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            generation.status === 'completed'
                              ? 'bg-green-500/20 text-green-400'
                              : generation.status === 'processing'
                              ? 'bg-yellow-500/20 text-yellow-400'
                              : 'bg-red-500/20 text-red-400'
                          }`}
                        >
                          {generation.status}
                        </span>
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <Icon className="w-4 h-4 text-gray-400" />
                        <h3 className="text-sm font-semibold">
                          {TOOL_NAMES[generation.type] || generation.type}
                        </h3>
                      </div>

                      {generation.prompt && (
                        <p className="text-sm text-gray-400 mb-3 line-clamp-2">
                          {generation.prompt}
                        </p>
                      )}

                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(generation.createdAt).toLocaleDateString()}
                        </div>
                        <div className="flex items-center gap-1">
                          <Coins className="w-3 h-3 text-yellow-400" />
                          {generation.creditsUsed}
                        </div>
                      </div>

                      {generation.status === 'completed' && generation.resultUrl && (
                        <a
                          href={generation.resultUrl}
                          download
                          className="mt-3 w-full py-2 bg-white/5 hover:bg-white/10 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                        >
                          <Download className="w-4 h-4" />
                          Download
                        </a>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Pagination */}
            {totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mt-8 flex items-center justify-center gap-2"
              >
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-colors bg-white/5 text-gray-400 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                          currentPage === pageNum
                            ? 'bg-indigo-500 text-white'
                            : 'bg-white/5 text-gray-400 hover:bg-white/10'
                        }`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-colors bg-white/5 text-gray-400 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </motion.div>
            )}
          </>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-center py-20 px-4 rounded-2xl bg-white/5 border border-white/10"
          >
            <ImageIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">No creations yet</h3>
            <p className="text-gray-400 mb-6">
              Start creating amazing AI-powered content!
            </p>
            <Link
              href="/tools"
              className="inline-block px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full font-semibold hover:shadow-lg hover:shadow-indigo-500/50 transition-all"
            >
              Create Now
            </Link>
          </motion.div>
        )}
      </main>

      {/* Image Preview Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div
            className="relative max-w-4xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setPreviewImage(null)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <X className="w-8 h-8" />
            </button>

            <img
              src={previewImage.resultUrl}
              alt="Preview"
              className="w-full rounded-2xl"
            />

            <div className="mt-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">
                  {TOOL_NAMES[previewImage.type] || previewImage.type}
                </h3>
                {previewImage.prompt && (
                  <p className="text-sm text-gray-400 mt-1">{previewImage.prompt}</p>
                )}
                <p className="text-xs text-gray-500 mt-2">
                  {new Date(previewImage.createdAt).toLocaleString()}
                </p>
              </div>

              <a
                href={previewImage.resultUrl}
                download
                className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl font-semibold hover:shadow-lg hover:shadow-indigo-500/50 transition-all flex items-center gap-2"
              >
                <Download className="w-5 h-5" />
                Download
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
