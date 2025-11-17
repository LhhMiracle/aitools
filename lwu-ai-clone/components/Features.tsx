'use client';

import { motion } from 'framer-motion';
import {
  Wand2,
  ImagePlus,
  Scissors,
  Sparkles,
  Video,
  Palette,
  Eraser,
  Zap,
  RefreshCw
} from 'lucide-react';

const features = [
  {
    icon: ImagePlus,
    title: 'AI Image Generation',
    description: 'Create stunning images from text descriptions using advanced AI models',
    color: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Eraser,
    title: 'Background Removal',
    description: 'Remove backgrounds instantly with pixel-perfect precision',
    color: 'from-purple-500 to-pink-500',
  },
  {
    icon: Wand2,
    title: 'Face Enhancement',
    description: 'Enhance facial features and improve portrait quality automatically',
    color: 'from-green-500 to-emerald-500',
  },
  {
    icon: Palette,
    title: 'Style Transfer',
    description: 'Transform your photos into artistic masterpieces',
    color: 'from-orange-500 to-red-500',
  },
  {
    icon: Video,
    title: 'Photo to Video',
    description: 'Bring your photos to life with AI-powered animation',
    color: 'from-indigo-500 to-purple-500',
  },
  {
    icon: Zap,
    title: 'Image Upscaling',
    description: 'Enhance image resolution without losing quality',
    color: 'from-yellow-500 to-orange-500',
  },
  {
    icon: Scissors,
    title: 'Object Removal',
    description: 'Remove unwanted objects from photos seamlessly',
    color: 'from-pink-500 to-rose-500',
  },
  {
    icon: RefreshCw,
    title: 'Image Restoration',
    description: 'Restore old or damaged photos to their former glory',
    color: 'from-teal-500 to-cyan-500',
  },
  {
    icon: Sparkles,
    title: 'AI Filters',
    description: 'Apply intelligent filters that enhance your photos naturally',
    color: 'from-violet-500 to-purple-500',
  },
];

export default function Features() {
  return (
    <section id="features" className="py-24 relative">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            Powerful AI Tools at Your{' '}
            <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
              Fingertips
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Everything you need to create, edit, and enhance your visual content
          </p>
        </motion.div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="group relative"
              >
                <div className="h-full p-6 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-white/20 transition-all">
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} p-2.5 mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className="w-full h-full text-white" />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold mb-2 text-white">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed">
                    {feature.description}
                  </p>

                  {/* Hover effect */}
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity -z-10`} />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center mt-16"
        >
          <button className="px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full text-white font-semibold text-lg hover:shadow-2xl hover:shadow-indigo-500/50 transition-all">
            Explore All Features
          </button>
        </motion.div>
      </div>
    </section>
  );
}
