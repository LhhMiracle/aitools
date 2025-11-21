'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Download,
  Share2,
  Grid,
  LayoutGrid,
  Image as ImageIcon,
  Loader2,
  Link as LinkIcon,
  Check,
  Star,
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import Header from '@/components/Header';
import Link from 'next/link';
import toast from 'react-hot-toast';

interface Generation {
  id: string;
  type: string;
  status: string;
  createdAt: string;
  resultUrl?: string;
  prompt?: string;
  creditsUsed: number;
}

export default function GalleryPage() {
  const { data: session, status } = useSession();
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [loading, setLoading] = useState(true);
  const [layout, setLayout] = useState<'grid' | 'masonry'>('grid');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchGenerations() {
      if (status === 'authenticated') {
        try {
          const response = await fetch('/api/generations');
          if (response.ok) {
            const data = await response.json();
            // Filter only completed image generations for gallery
            const imageGenerations = data.filter(
              (g: Generation) =>
                g.status === 'completed' &&
                g.resultUrl &&
                !['text-to-speech'].includes(g.type)
            );
            setGenerations(imageGenerations);
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

  const copyToClipboard = async (url: string, id: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(id);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      toast.error('Failed to copy link');
    }
  };

  const shareImage = async (generation: Generation) => {
    if (navigator.share && generation.resultUrl) {
      try {
        await navigator.share({
          title: `AI Creation - ${generation.type}`,
          text: generation.prompt || 'Check out my AI creation!',
          url: generation.resultUrl,
        });
      } catch (err) {
        // User cancelled or error
        copyToClipboard(generation.resultUrl, generation.id);
      }
    } else if (generation.resultUrl) {
      copyToClipboard(generation.resultUrl, generation.id);
    }
  };

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

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2">My Gallery</h1>
              <p className="text-gray-400">
                Showcase your best AI-generated creations
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setLayout('grid')}
                className={`p-2 rounded-lg transition-colors ${
                  layout === 'grid'
                    ? 'bg-indigo-500 text-white'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setLayout('masonry')}
                className={`p-2 rounded-lg transition-colors ${
                  layout === 'masonry'
                    ? 'bg-indigo-500 text-white'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10'
                }`}
              >
                <LayoutGrid className="w-5 h-5" />
              </button>
            </div>
          </div>
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
              <span className="text-sm text-gray-400">Total Artworks</span>
            </div>
            <div className="text-3xl font-bold">{generations.length}</div>
          </div>

          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-3 mb-2">
              <Star className="w-5 h-5 text-yellow-400" />
              <span className="text-sm text-gray-400">Unique Tools Used</span>
            </div>
            <div className="text-3xl font-bold">
              {new Set(generations.map(g => g.type)).size}
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-3 mb-2">
              <Share2 className="w-5 h-5 text-green-400" />
              <span className="text-sm text-gray-400">Ready to Share</span>
            </div>
            <div className="text-3xl font-bold">{generations.length}</div>
          </div>
        </motion.div>

        {/* Gallery Grid */}
        {generations.length > 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className={
              layout === 'grid'
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
                : 'columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6'
            }
          >
            {generations.map((generation, index) => (
              <motion.div
                key={generation.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + index * 0.03 }}
                className={`group relative rounded-2xl overflow-hidden bg-white/5 border border-white/10 hover:border-white/20 transition-all ${
                  layout === 'masonry' ? 'break-inside-avoid mb-6' : ''
                }`}
              >
                {generation.type === 'image-to-video' || generation.type === 'photo-animation' ? (
                  <video
                    src={generation.resultUrl}
                    className="w-full object-cover"
                    muted
                    loop
                    playsInline
                    onMouseEnter={(e) => e.currentTarget.play()}
                    onMouseLeave={(e) => e.currentTarget.pause()}
                  />
                ) : (
                  <img
                    src={generation.resultUrl}
                    alt={generation.prompt || 'AI creation'}
                    className="w-full object-cover"
                  />
                )}

                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    {generation.prompt && (
                      <p className="text-sm text-white/90 mb-3 line-clamp-2">
                        {generation.prompt}
                      </p>
                    )}

                    <div className="flex items-center gap-2">
                      <a
                        href={generation.resultUrl}
                        download
                        className="flex-1 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        Download
                      </a>
                      <button
                        onClick={() => shareImage(generation)}
                        className="py-2 px-3 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors flex items-center justify-center"
                      >
                        {copiedId === generation.id ? (
                          <Check className="w-4 h-4 text-green-400" />
                        ) : (
                          <LinkIcon className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Type badge */}
                <div className="absolute top-3 left-3">
                  <span className="px-3 py-1 bg-black/50 backdrop-blur-sm rounded-full text-xs">
                    {generation.type.replace(/-/g, ' ')}
                  </span>
                </div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center py-20 px-4 rounded-2xl bg-white/5 border border-white/10"
          >
            <ImageIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Your gallery is empty</h3>
            <p className="text-gray-400 mb-6">
              Create some AI artwork to build your gallery!
            </p>
            <Link
              href="/tools"
              className="inline-block px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full font-semibold hover:shadow-lg hover:shadow-indigo-500/50 transition-all"
            >
              Start Creating
            </Link>
          </motion.div>
        )}
      </main>
    </div>
  );
}
