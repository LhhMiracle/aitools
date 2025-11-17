'use client';

import { Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Header() {
  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-lg bg-black/50 border-b border-white/10"
    >
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-indigo-500" />
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
              LWU AI
            </span>
          </div>

          {/* Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-gray-300 hover:text-white transition-colors">
              Features
            </a>
            <a href="#pricing" className="text-gray-300 hover:text-white transition-colors">
              Pricing
            </a>
            <a href="#gallery" className="text-gray-300 hover:text-white transition-colors">
              Gallery
            </a>
          </div>

          {/* CTA Buttons */}
          <div className="flex items-center gap-4">
            <button className="hidden sm:block px-4 py-2 text-gray-300 hover:text-white transition-colors">
              Sign In
            </button>
            <button className="px-6 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full text-white font-medium hover:shadow-lg hover:shadow-indigo-500/50 transition-all">
              Get Started
            </button>
          </div>
        </div>
      </nav>
    </motion.header>
  );
}
