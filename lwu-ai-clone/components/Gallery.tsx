'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

const galleryImages = [
  {
    id: 1,
    title: 'AI Portrait',
    category: 'Face Enhancement',
    gradient: 'from-pink-500 to-rose-500',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&h=800&fit=crop',
  },
  {
    id: 2,
    title: 'Landscape Art',
    category: 'Style Transfer',
    gradient: 'from-blue-500 to-cyan-500',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=800&fit=crop',
  },
  {
    id: 3,
    title: 'Abstract Creation',
    category: 'AI Generation',
    gradient: 'from-purple-500 to-indigo-500',
    image: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=800&h=800&fit=crop',
  },
  {
    id: 4,
    title: 'Product Photo',
    category: 'Background Removal',
    gradient: 'from-green-500 to-emerald-500',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&h=800&fit=crop',
  },
  {
    id: 5,
    title: 'Artistic Portrait',
    category: 'Style Transfer',
    gradient: 'from-orange-500 to-red-500',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=800&fit=crop',
  },
  {
    id: 6,
    title: 'Fantasy Scene',
    category: 'AI Generation',
    gradient: 'from-violet-500 to-purple-500',
    image: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&h=800&fit=crop',
  },
  {
    id: 7,
    title: 'Enhanced Photo',
    category: 'Image Upscaling',
    gradient: 'from-yellow-500 to-orange-500',
    image: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=800&h=800&fit=crop',
  },
  {
    id: 8,
    title: 'Creative Edit',
    category: 'Object Removal',
    gradient: 'from-teal-500 to-cyan-500',
    image: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&h=800&fit=crop',
  },
];

const categories = ['All', 'AI Generation', 'Face Enhancement', 'Style Transfer', 'Background Removal'];

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredImages = activeCategory === 'All'
    ? galleryImages
    : galleryImages.filter(img => img.category === activeCategory);

  return (
    <section id="gallery" className="py-24 relative">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            Creative{' '}
            <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
              Gallery
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto mb-8">
            Explore stunning creations made with our AI tools
          </p>

          {/* Category filter */}
          <div className="flex flex-wrap justify-center gap-3">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-6 py-2 rounded-full font-medium transition-all ${
                  activeCategory === category
                    ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white'
                    : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Gallery grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredImages.map((image, index) => (
            <motion.div
              key={image.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="group relative aspect-square rounded-2xl overflow-hidden cursor-pointer"
            >
              {/* Image */}
              <img
                src={image.image}
                alt={image.title}
                className="absolute inset-0 w-full h-full object-cover"
              />

              {/* Gradient overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${image.gradient} opacity-0 group-hover:opacity-30 transition-opacity`} />

              {/* Dark overlay */}
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors" />

              {/* Content */}
              <div className="absolute inset-0 p-6 flex flex-col justify-end">
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  whileHover={{ y: 0, opacity: 1 }}
                  className="transform transition-all"
                >
                  <div className="text-xs text-gray-300 mb-2">{image.category}</div>
                  <h3 className="text-xl font-semibold text-white">{image.title}</h3>
                </motion.div>
              </div>

              {/* Hover effect border */}
              <div className="absolute inset-0 rounded-2xl border-2 border-white/0 group-hover:border-white/20 transition-colors" />
            </motion.div>
          ))}
        </div>

        {/* Load more button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center mt-12"
        >
          <button className="px-8 py-4 bg-white/5 backdrop-blur-sm border border-white/10 rounded-full text-white font-semibold hover:bg-white/10 transition-all">
            Load More
          </button>
        </motion.div>
      </div>
    </section>
  );
}
