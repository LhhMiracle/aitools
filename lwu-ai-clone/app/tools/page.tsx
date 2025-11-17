'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ImagePlus,
  Eraser,
  Wand2,
  Palette,
  Zap,
  Scissors,
  Sparkles,
  Loader2,
  Download,
  ArrowLeft,
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import Header from '@/components/Header';
import FileUpload from '@/components/FileUpload';
import Link from 'next/link';
import { Creation } from '@/types';

const aiTools = [
  {
    id: 'image-generation',
    name: 'AI Image Generation',
    description: 'Create images from text descriptions',
    icon: ImagePlus,
    color: 'from-blue-500 to-cyan-500',
    credits: 5,
    requiresUpload: false,
  },
  {
    id: 'background-removal',
    name: 'Background Removal',
    description: 'Remove backgrounds with precision',
    icon: Eraser,
    color: 'from-purple-500 to-pink-500',
    credits: 2,
    requiresUpload: true,
  },
  {
    id: 'face-enhancement',
    name: 'Face Enhancement',
    description: 'Enhance facial features automatically',
    icon: Wand2,
    color: 'from-green-500 to-emerald-500',
    credits: 3,
    requiresUpload: true,
  },
  {
    id: 'style-transfer',
    name: 'Style Transfer',
    description: 'Transform photos into artwork',
    icon: Palette,
    color: 'from-orange-500 to-red-500',
    credits: 4,
    requiresUpload: true,
  },
  {
    id: 'upscaling',
    name: 'Image Upscaling',
    description: 'Enhance image resolution',
    icon: Zap,
    color: 'from-yellow-500 to-orange-500',
    credits: 3,
    requiresUpload: true,
  },
  {
    id: 'object-removal',
    name: 'Object Removal',
    description: 'Remove unwanted objects',
    icon: Scissors,
    color: 'from-pink-500 to-rose-500',
    credits: 3,
    requiresUpload: true,
  },
];

export default function ToolsPage() {
  const router = useRouter();
  const { user, isAuthenticated, updateCredits, addCreation } = useStore();

  const [selectedTool, setSelectedTool] = useState<typeof aiTools[0] | null>(null);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated || !user) {
    return null;
  }

  const handleToolSelect = (tool: typeof aiTools[0]) => {
    setSelectedTool(tool);
    setResult(null);
    setUploadedFile(null);
    setPrompt('');
  };

  const handleProcess = async () => {
    if (!selectedTool) return;

    if (selectedTool.requiresUpload && !uploadedFile) {
      alert('Please upload an image first');
      return;
    }

    if (!selectedTool.requiresUpload && !prompt) {
      alert('Please enter a prompt');
      return;
    }

    if (user.credits < selectedTool.credits) {
      alert('Insufficient credits! Please upgrade your plan.');
      return;
    }

    setIsProcessing(true);

    // Simulate AI processing
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Deduct credits
    updateCredits(-selectedTool.credits);

    // Create a mock result (in real app, this would be the AI API response)
    const mockResult = uploadedFile ? URL.createObjectURL(uploadedFile) : 'https://placehold.co/800x600/6366f1/white?text=AI+Generated';

    setResult(mockResult);

    // Add to creations
    const creation: Creation = {
      id: Math.random().toString(36).substr(2, 9),
      userId: user.id,
      type: selectedTool.id as any,
      originalUrl: uploadedFile ? URL.createObjectURL(uploadedFile) : undefined,
      resultUrl: mockResult,
      prompt: prompt || undefined,
      creditsUsed: selectedTool.credits,
      status: 'completed',
      createdAt: new Date(),
    };

    addCreation(creation);
    setIsProcessing(false);
  };

  const handleReset = () => {
    setSelectedTool(null);
    setResult(null);
    setUploadedFile(null);
    setPrompt('');
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        {!selectedTool ? (
          <>
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
              <h1 className="text-4xl font-bold mb-2">AI Tools</h1>
              <p className="text-gray-400">
                Choose a tool to start creating. You have{' '}
                <span className="text-indigo-400 font-semibold">{user.credits} credits</span> remaining.
              </p>
            </motion.div>

            {/* Tools Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {aiTools.map((tool, index) => {
                const Icon = tool.icon;
                const canAfford = user.credits >= tool.credits;

                return (
                  <motion.button
                    key={tool.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => canAfford && handleToolSelect(tool)}
                    disabled={!canAfford}
                    className={`group relative text-left p-6 rounded-2xl transition-all ${
                      canAfford
                        ? 'bg-white/5 border border-white/10 hover:border-white/20 hover:-translate-y-1 cursor-pointer'
                        : 'bg-white/5 border border-white/5 opacity-50 cursor-not-allowed'
                    }`}
                  >
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${tool.color} p-2.5 mb-4 ${
                      canAfford ? 'group-hover:scale-110' : ''
                    } transition-transform`}>
                      <Icon className="w-full h-full text-white" />
                    </div>

                    <h3 className="text-xl font-semibold mb-2">{tool.name}</h3>
                    <p className="text-gray-400 text-sm mb-4">{tool.description}</p>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-indigo-400 font-medium">
                        {tool.credits} credits
                      </span>
                      {!canAfford && (
                        <span className="text-xs text-red-400">
                          Insufficient credits
                        </span>
                      )}
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </>
        ) : (
          <>
            {/* Tool Interface */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl mx-auto"
            >
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Tools
              </button>

              <div className="bg-white/5 border border-white/10 rounded-2xl p-8 mb-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${selectedTool.color} p-3`}>
                    {/* @ts-ignore */}
                    <selectedTool.icon className="w-full h-full text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">{selectedTool.name}</h2>
                    <p className="text-gray-400">{selectedTool.description}</p>
                  </div>
                </div>

                {!result ? (
                  <>
                    {selectedTool.requiresUpload ? (
                      <div className="mb-6">
                        <label className="block text-sm font-medium mb-3">Upload Image</label>
                        <FileUpload onFileSelect={setUploadedFile} />
                      </div>
                    ) : (
                      <div className="mb-6">
                        <label className="block text-sm font-medium mb-3">Enter Prompt</label>
                        <textarea
                          value={prompt}
                          onChange={(e) => setPrompt(e.target.value)}
                          placeholder="Describe what you want to create..."
                          rows={4}
                          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                        />
                      </div>
                    )}

                    <button
                      onClick={handleProcess}
                      disabled={isProcessing || (selectedTool.requiresUpload ? !uploadedFile : !prompt)}
                      className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl font-semibold hover:shadow-lg hover:shadow-indigo-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5" />
                          Generate ({selectedTool.credits} credits)
                        </>
                      )}
                    </button>
                  </>
                ) : (
                  <>
                    {/* Result */}
                    <div className="mb-6">
                      <label className="block text-sm font-medium mb-3">Result</label>
                      <div className="relative rounded-xl overflow-hidden bg-white/5 border border-white/10">
                        <img src={result} alt="Result" className="w-full" />
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <button
                        onClick={() => {
                          // In real app, this would trigger a download
                          const link = document.createElement('a');
                          link.href = result;
                          link.download = 'lwu-ai-result.png';
                          link.click();
                        }}
                        className="flex-1 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
                      >
                        <Download className="w-5 h-5" />
                        Download
                      </button>
                      <button
                        onClick={handleReset}
                        className="flex-1 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl font-semibold hover:shadow-lg hover:shadow-indigo-500/50 transition-all flex items-center justify-center gap-2"
                      >
                        <Sparkles className="w-5 h-5" />
                        Create Another
                      </button>
                    </div>
                  </>
                )}
              </div>

              {/* Info */}
              <div className="text-center text-sm text-gray-400">
                <p>
                  This will cost {selectedTool.credits} credits. You have {user.credits} credits remaining.
                </p>
              </div>
            </motion.div>
          </>
        )}
      </main>
    </div>
  );
}
