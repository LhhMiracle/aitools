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
  'image-upscale': ImageIcon,
  'background-removal': ImageIcon,
  'image-to-video': Video,
  'text-to-speech': Mic,
};

const TOOL_NAMES: Record<string, string> = {
  'image-generation': 'Image Generation',
  'image-upscale': 'Image Upscale',
  'background-removal': 'Background Removal',
  'image-to-video': 'Image to Video',
  'text-to-speech': 'Text to Speech',
};

export default function HistoryPage() {
  const { data: session, status } = useSession();
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

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

  const filteredGenerations =
    filter === 'all'
      ? generations
      : generations.filter(g => g.type === filter);

  const totalCreditsUsed = generations.reduce((sum, g) => sum + g.creditsUsed, 0);

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

        {/* Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
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
              All
            </button>
            {Object.entries(TOOL_NAMES).map(([key, name]) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === key
                    ? 'bg-indigo-500 text-white'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
              >
                {name}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Generations Grid */}
        {filteredGenerations.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {filteredGenerations.map((generation, index) => {
              const Icon = TOOL_ICONS[generation.type] || ImageIcon;

              return (
                <motion.div
                  key={generation.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + index * 0.05 }}
                  className="group rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all overflow-hidden"
                >
                  {/* Preview */}
                  <div className="relative aspect-square bg-white/5">
                    {generation.status === 'completed' && generation.resultUrl ? (
                      generation.type === 'text-to-speech' ? (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Mic className="w-16 h-16 text-gray-600" />
                        </div>
                      ) : generation.type === 'image-to-video' ? (
                        <video
                          src={generation.resultUrl}
                          className="w-full h-full object-cover"
                          muted
                          loop
                          onMouseEnter={(e) => e.currentTarget.play()}
                          onMouseLeave={(e) => e.currentTarget.pause()}
                        />
                      ) : (
                        <img
                          src={generation.resultUrl}
                          alt="Generation result"
                          className="w-full h-full object-cover"
                        />
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
    </div>
  );
}
