'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Coins,
  Crown,
  Image,
  Clock,
  TrendingUp,
  Zap,
  Sparkles,
  GalleryVerticalEnd,
  Settings,
  Key,
  Gift,
  CreditCard,
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
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [generations, setGenerations] = useState<Generation[]>([]);
  const [loading, setLoading] = useState(true);

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
          <div className="animate-pulse">
            <div className="h-12 bg-white/5 rounded-lg w-1/3 mb-12"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-32 bg-white/5 rounded-2xl"></div>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!session?.user) {
    return null;
  }

  const user = session.user;
  const recentCreations = generations.slice(0, 6);

  const stats = [
    {
      label: 'Total Credits',
      value: user.credits,
      icon: Coins,
      color: 'from-yellow-500 to-orange-500',
    },
    {
      label: 'Current Plan',
      value: user.plan?.toUpperCase() || 'FREE',
      icon: Crown,
      color: 'from-purple-500 to-pink-500',
    },
    {
      label: 'Creations',
      value: generations.length,
      icon: Image,
      color: 'from-blue-500 to-cyan-500',
    },
    {
      label: 'This Month',
      value: generations.filter(c => {
        const now = new Date();
        const createdAt = new Date(c.createdAt);
        return createdAt.getMonth() === now.getMonth() &&
               createdAt.getFullYear() === now.getFullYear();
      }).length,
      icon: TrendingUp,
      color: 'from-green-500 to-emerald-500',
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold mb-2">
            Welcome back, {user.name}! 👋
          </h1>
          <p className="text-gray-400">
            Here's what's happening with your AI creations today.
          </p>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} p-2.5 mb-4`}>
                  <Icon className="w-full h-full text-white" />
                </div>
                <div className="text-3xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </motion.div>
            );
          })}
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-12"
        >
          <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link
              href="/tools"
              className="group p-6 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 hover:border-indigo-500/40 transition-all"
            >
              <Sparkles className="w-8 h-8 text-indigo-400 mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-semibold mb-1">Create New</h3>
              <p className="text-sm text-gray-400">Start a new AI creation</p>
            </Link>

            <Link
              href="/dashboard/history"
              className="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all"
            >
              <Clock className="w-8 h-8 text-gray-400 mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-semibold mb-1">View History</h3>
              <p className="text-sm text-gray-400">Browse past creations</p>
            </Link>

            <Link
              href="/dashboard/gallery"
              className="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all"
            >
              <GalleryVerticalEnd className="w-8 h-8 text-purple-400 mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-semibold mb-1">My Gallery</h3>
              <p className="text-sm text-gray-400">Showcase your best work</p>
            </Link>

            <Link
              href="/dashboard/referrals"
              className="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all"
            >
              <Gift className="w-8 h-8 text-pink-400 mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-semibold mb-1">Refer & Earn</h3>
              <p className="text-sm text-gray-400">Invite friends, earn credits</p>
            </Link>

            <Link
              href="/dashboard/api-keys"
              className="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all"
            >
              <Key className="w-8 h-8 text-cyan-400 mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-semibold mb-1">API Keys</h3>
              <p className="text-sm text-gray-400">Manage your API access</p>
            </Link>

            <Link
              href="/dashboard/billing"
              className="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all"
            >
              <CreditCard className="w-8 h-8 text-green-400 mb-3 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-semibold mb-1">Billing</h3>
              <p className="text-sm text-gray-400">Manage subscription</p>
            </Link>
          </div>
        </motion.div>

        {/* Recent Creations */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Recent Creations</h2>
            {generations.length > 6 && (
              <Link
                href="/dashboard/history"
                className="text-indigo-400 hover:text-indigo-300 text-sm font-medium"
              >
                View All
              </Link>
            )}
          </div>

          {recentCreations.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentCreations.map((creation, index) => (
                <motion.div
                  key={creation.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  className="group relative aspect-square rounded-2xl overflow-hidden bg-white/5 border border-white/10 hover:border-white/20 transition-all"
                >
                  {/* Placeholder - in real app, this would be the actual image */}
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20" />

                  <div className="absolute inset-0 p-4 flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <span className="px-3 py-1 bg-black/50 backdrop-blur-sm rounded-full text-xs">
                        {creation.type.replace('-', ' ')}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs ${
                        creation.status === 'completed'
                          ? 'bg-green-500/20 text-green-400'
                          : creation.status === 'processing'
                          ? 'bg-yellow-500/20 text-yellow-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {creation.status}
                      </span>
                    </div>

                    <div className="text-sm text-gray-300">
                      {new Date(creation.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 px-4 rounded-2xl bg-white/5 border border-white/10">
              <Image className="w-16 h-16 text-gray-600 mx-auto mb-4" />
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
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
