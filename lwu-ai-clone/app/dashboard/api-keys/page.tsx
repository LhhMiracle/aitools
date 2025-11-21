'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Key,
  Copy,
  Trash2,
  Plus,
  Eye,
  EyeOff,
  Loader2,
  Check,
  AlertCircle,
  Calendar,
  Activity,
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import Header from '@/components/Header';
import Link from 'next/link';
import toast from 'react-hot-toast';

interface ApiKey {
  id: string;
  name: string;
  key: string;
  createdAt: string;
  lastUsed?: string;
  usageCount: number;
}

export default function ApiKeysPage() {
  const { data: session, status } = useSession();
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [newKeyName, setNewKeyName] = useState('');
  const [showNewKey, setShowNewKey] = useState<string | null>(null);
  const [visibleKeys, setVisibleKeys] = useState<Set<string>>(new Set());

  // Simulated API keys for demo
  useEffect(() => {
    if (status === 'authenticated') {
      // In production, this would fetch from API
      setTimeout(() => {
        setApiKeys([
          {
            id: '1',
            name: 'Production Key',
            key: 'lwu_live_sk_1234567890abcdef1234567890abcdef',
            createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            lastUsed: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
            usageCount: 156,
          },
          {
            id: '2',
            name: 'Development Key',
            key: 'lwu_test_sk_abcdef1234567890abcdef1234567890',
            createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            lastUsed: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
            usageCount: 42,
          },
        ]);
        setLoading(false);
      }, 500);
    }
  }, [status]);

  const generateApiKey = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let key = 'lwu_live_sk_';
    for (let i = 0; i < 32; i++) {
      key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return key;
  };

  const handleCreateKey = async () => {
    if (!newKeyName.trim()) {
      toast.error('Please enter a name for the API key');
      return;
    }

    setCreating(true);
    try {
      // In production, this would call the API
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newKey: ApiKey = {
        id: Date.now().toString(),
        name: newKeyName,
        key: generateApiKey(),
        createdAt: new Date().toISOString(),
        usageCount: 0,
      };

      setApiKeys([newKey, ...apiKeys]);
      setShowNewKey(newKey.key);
      setNewKeyName('');
      toast.success('API key created successfully!');
    } catch (error) {
      toast.error('Failed to create API key');
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteKey = async (id: string) => {
    if (!confirm('Are you sure you want to delete this API key? This action cannot be undone.')) {
      return;
    }

    try {
      // In production, this would call the API
      await new Promise(resolve => setTimeout(resolve, 500));
      setApiKeys(apiKeys.filter(k => k.id !== id));
      toast.success('API key deleted');
    } catch (error) {
      toast.error('Failed to delete API key');
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Copied to clipboard!');
    } catch (err) {
      toast.error('Failed to copy');
    }
  };

  const toggleKeyVisibility = (id: string) => {
    const newVisible = new Set(visibleKeys);
    if (newVisible.has(id)) {
      newVisible.delete(id);
    } else {
      newVisible.add(id);
    }
    setVisibleKeys(newVisible);
  };

  const maskKey = (key: string) => {
    return key.substring(0, 12) + '••••••••••••••••••••••••••••••••';
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

          <h1 className="text-4xl font-bold mb-2">API Keys</h1>
          <p className="text-gray-400">
            Manage your API keys for programmatic access to LWU AI
          </p>
        </motion.div>

        {/* New Key Created Alert */}
        {showNewKey && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 p-6 rounded-2xl bg-green-500/10 border border-green-500/20"
          >
            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="font-semibold text-green-400 mb-2">
                  Your new API key has been created
                </h3>
                <p className="text-sm text-gray-400 mb-4">
                  Make sure to copy your API key now. You won't be able to see it again!
                </p>
                <div className="flex items-center gap-2 p-3 bg-black/30 rounded-lg font-mono text-sm">
                  <code className="flex-1 break-all">{showNewKey}</code>
                  <button
                    onClick={() => copyToClipboard(showNewKey)}
                    className="p-2 hover:bg-white/10 rounded transition-colors"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
                <button
                  onClick={() => setShowNewKey(null)}
                  className="mt-4 text-sm text-gray-400 hover:text-white"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Create New Key */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 p-6 rounded-2xl bg-white/5 border border-white/10"
        >
          <h2 className="text-xl font-bold mb-4">Create New API Key</h2>
          <div className="flex gap-4">
            <input
              type="text"
              value={newKeyName}
              onChange={(e) => setNewKeyName(e.target.value)}
              placeholder="Key name (e.g., Production, Development)"
              className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-indigo-500 transition-colors"
            />
            <button
              onClick={handleCreateKey}
              disabled={creating}
              className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl font-semibold hover:shadow-lg hover:shadow-indigo-500/50 transition-all disabled:opacity-50 flex items-center gap-2"
            >
              {creating ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Plus className="w-5 h-5" />
              )}
              Create Key
            </button>
          </div>
        </motion.div>

        {/* API Keys List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-xl font-bold mb-4">Your API Keys</h2>

          {apiKeys.length > 0 ? (
            <div className="space-y-4">
              {apiKeys.map((apiKey) => (
                <div
                  key={apiKey.id}
                  className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-colors"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="font-semibold flex items-center gap-2">
                        <Key className="w-4 h-4 text-indigo-400" />
                        {apiKey.name}
                      </h3>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          Created {new Date(apiKey.createdAt).toLocaleDateString()}
                        </div>
                        {apiKey.lastUsed && (
                          <div className="flex items-center gap-1">
                            <Activity className="w-3 h-3" />
                            Last used {new Date(apiKey.lastUsed).toLocaleDateString()}
                          </div>
                        )}
                        <div>
                          {apiKey.usageCount} requests
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteKey(apiKey.id)}
                      className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2 p-3 bg-black/30 rounded-lg font-mono text-sm">
                    <code className="flex-1">
                      {visibleKeys.has(apiKey.id) ? apiKey.key : maskKey(apiKey.key)}
                    </code>
                    <button
                      onClick={() => toggleKeyVisibility(apiKey.id)}
                      className="p-2 hover:bg-white/10 rounded transition-colors"
                    >
                      {visibleKeys.has(apiKey.id) ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={() => copyToClipboard(apiKey.key)}
                      className="p-2 hover:bg-white/10 rounded transition-colors"
                    >
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 px-4 rounded-2xl bg-white/5 border border-white/10">
              <Key className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No API keys yet</h3>
              <p className="text-gray-400">
                Create your first API key to start using the LWU AI API
              </p>
            </div>
          )}
        </motion.div>

        {/* API Documentation Link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20"
        >
          <h3 className="text-xl font-bold mb-2">API Documentation</h3>
          <p className="text-gray-400 mb-4">
            Learn how to integrate LWU AI into your applications with our comprehensive API documentation.
          </p>
          <code className="block p-4 bg-black/30 rounded-lg text-sm mb-4">
            curl -X POST https://api.lwu.ai/v1/generate \<br />
            &nbsp;&nbsp;-H "Authorization: Bearer YOUR_API_KEY" \<br />
            &nbsp;&nbsp;-H "Content-Type: application/json" \<br />
            &nbsp;&nbsp;-d '&#123;"tool": "image-generation", "prompt": "..."&#125;'
          </code>
          <button className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl font-semibold transition-colors">
            View Full Documentation
          </button>
        </motion.div>
      </main>
    </div>
  );
}
