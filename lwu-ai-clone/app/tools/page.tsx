'use client';

import { motion } from 'framer-motion';
import {
  Image,
  Wand2,
  Eraser,
  Video,
  Mic,
  ArrowRight,
  Sparkles,
  Scissors,
  Palette,
  User,
  Users,
  Trash2,
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import Header from '@/components/Header';
import Link from 'next/link';

const tools = [
  {
    id: 'image-generation',
    name: 'Image Generation',
    description: 'Create stunning images from text descriptions',
    icon: Image,
    color: 'from-blue-500 to-cyan-500',
    credits: 2,
  },
  {
    id: 'image-upscale',
    name: 'Image Upscale',
    description: 'Enhance and upscale your images with AI',
    icon: Wand2,
    color: 'from-purple-500 to-pink-500',
    credits: 1,
  },
  {
    id: 'background-removal',
    name: 'Background Removal',
    description: 'Remove backgrounds from images automatically',
    icon: Eraser,
    color: 'from-green-500 to-emerald-500',
    credits: 1,
  },
  {
    id: 'image-to-video',
    name: 'Image to Video',
    description: 'Transform static images into dynamic videos',
    icon: Video,
    color: 'from-orange-500 to-red-500',
    credits: 3,
  },
  {
    id: 'text-to-speech',
    name: 'Text to Speech',
    description: 'Convert text into natural-sounding speech',
    icon: Mic,
    color: 'from-indigo-500 to-purple-500',
    credits: 1,
  },
  {
    id: 'hair-style',
    name: 'Hair Style Transform',
    description: 'Transform hair styles with AI - try different hairstyles instantly',
    icon: Scissors,
    color: 'from-pink-500 to-rose-500',
    credits: 4,
  },
  {
    id: 'cartoon-style',
    name: 'Cartoon Style',
    description: 'Convert photos to cartoon/anime style',
    icon: Palette,
    color: 'from-yellow-500 to-orange-500',
    credits: 3,
  },
  {
    id: 'portrait-enhance',
    name: 'Portrait Enhance',
    description: 'Enhance and beautify portraits with AI',
    icon: User,
    color: 'from-cyan-500 to-blue-500',
    credits: 2,
  },
  {
    id: 'face-swap',
    name: 'Face Swap',
    description: 'Swap faces between two photos',
    icon: Users,
    color: 'from-violet-500 to-purple-500',
    credits: 4,
  },
  {
    id: 'object-removal',
    name: 'Object Removal',
    description: 'Remove unwanted objects from images',
    icon: Trash2,
    color: 'from-red-500 to-pink-500',
    credits: 3,
  },
];

export default function ToolsPage() {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <span className="text-sm text-indigo-300">AI-Powered Tools</span>
          </div>
          <h1 className="text-5xl font-bold mb-4">
            Choose Your <span className="text-gradient">Creative Tool</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Select from our collection of AI-powered tools to bring your ideas to life
          </p>
          {session?.user && (
            <p className="text-sm text-gray-500 mt-4">
              Available Credits: <span className="text-yellow-400 font-semibold">{session.user.credits}</span>
            </p>
          )}
        </motion.div>

        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {tools.map((tool, index) => {
            const Icon = tool.icon;
            return (
              <motion.div
                key={tool.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  href={`/tools/${tool.id}`}
                  className="group block p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all hover:scale-[1.02]"
                >
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${tool.color} p-3 mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-full h-full text-white" />
                  </div>

                  <h3 className="text-xl font-bold mb-2">{tool.name}</h3>
                  <p className="text-gray-400 text-sm mb-4">{tool.description}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">Cost:</span>
                      <span className="text-yellow-400 font-semibold">
                        {tool.credits} {tool.credits === 1 ? 'credit' : 'credits'}
                      </span>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Info Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="mt-12 p-6 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 max-w-4xl mx-auto"
        >
          <h3 className="text-xl font-bold mb-2">Need More Credits?</h3>
          <p className="text-gray-400 mb-4">
            Upgrade your plan to get more credits and unlock unlimited creative potential.
          </p>
          <Link
            href="/#pricing"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full font-semibold hover:shadow-lg hover:shadow-indigo-500/50 transition-all"
          >
            View Pricing
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </main>

      <style jsx global>{`
        .text-gradient {
          background: linear-gradient(to right, #818cf8, #c084fc, #e879f9);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
      `}</style>
    </div>
  );
}
