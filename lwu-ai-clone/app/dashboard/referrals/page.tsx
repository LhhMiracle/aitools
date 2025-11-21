'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Gift,
  Copy,
  Users,
  Coins,
  Share2,
  Check,
  Loader2,
  Twitter,
  Facebook,
  Mail,
  Link as LinkIcon,
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import Header from '@/components/Header';
import Link from 'next/link';
import toast from 'react-hot-toast';

interface Referral {
  id: string;
  email: string;
  status: 'pending' | 'completed';
  creditsEarned: number;
  createdAt: string;
}

export default function ReferralsPage() {
  const { data: session, status } = useSession();
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  // Generate referral code from user ID
  const referralCode = session?.user?.id
    ? `REF${session.user.id.substring(0, 8).toUpperCase()}`
    : '';
  const referralLink = `https://lwu.ai/signup?ref=${referralCode}`;

  useEffect(() => {
    if (status === 'authenticated') {
      // Simulated referrals for demo
      setTimeout(() => {
        setReferrals([
          {
            id: '1',
            email: 'john@example.com',
            status: 'completed',
            creditsEarned: 50,
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: '2',
            email: 'sarah@example.com',
            status: 'completed',
            creditsEarned: 50,
            createdAt: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
          },
          {
            id: '3',
            email: 'mike@example.com',
            status: 'pending',
            creditsEarned: 0,
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          },
        ]);
        setLoading(false);
      }, 500);
    }
  }, [status]);

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error('Failed to copy');
    }
  };

  const shareOnTwitter = () => {
    const text = `Join me on LWU AI and get 50 free credits! Use my referral link: ${referralLink}`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
  };

  const shareOnFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralLink)}`, '_blank');
  };

  const shareByEmail = () => {
    const subject = 'Get 50 free credits on LWU AI!';
    const body = `Hey!\n\nI've been using LWU AI for creating amazing AI-generated content. Join using my referral link and get 50 free credits:\n\n${referralLink}\n\nBest,\n${session?.user?.name}`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const totalEarned = referrals.reduce((sum, r) => sum + r.creditsEarned, 0);
  const completedReferrals = referrals.filter(r => r.status === 'completed').length;

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

          <h1 className="text-4xl font-bold mb-2">Refer & Earn</h1>
          <p className="text-gray-400">
            Invite friends and earn 50 credits for each successful referral
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
              <Users className="w-5 h-5 text-indigo-400" />
              <span className="text-sm text-gray-400">Total Referrals</span>
            </div>
            <div className="text-3xl font-bold">{referrals.length}</div>
          </div>

          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-3 mb-2">
              <Check className="w-5 h-5 text-green-400" />
              <span className="text-sm text-gray-400">Completed</span>
            </div>
            <div className="text-3xl font-bold">{completedReferrals}</div>
          </div>

          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
            <div className="flex items-center gap-3 mb-2">
              <Coins className="w-5 h-5 text-yellow-400" />
              <span className="text-sm text-gray-400">Credits Earned</span>
            </div>
            <div className="text-3xl font-bold">{totalEarned}</div>
          </div>
        </motion.div>

        {/* Referral Link */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8 p-6 rounded-2xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-indigo-500/20"
        >
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Gift className="w-5 h-5 text-indigo-400" />
            Your Referral Link
          </h2>

          <div className="flex items-center gap-2 p-3 bg-black/30 rounded-lg mb-4">
            <LinkIcon className="w-4 h-4 text-gray-400" />
            <code className="flex-1 text-sm break-all">{referralLink}</code>
            <button
              onClick={() => copyToClipboard(referralLink)}
              className="p-2 hover:bg-white/10 rounded transition-colors"
            >
              {copied ? (
                <Check className="w-4 h-4 text-green-400" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>

          <div className="mb-4">
            <p className="text-sm text-gray-400 mb-2">Your referral code:</p>
            <span className="px-4 py-2 bg-white/10 rounded-lg font-mono font-bold">
              {referralCode}
            </span>
          </div>

          <div>
            <p className="text-sm text-gray-400 mb-3">Share via:</p>
            <div className="flex gap-3">
              <button
                onClick={shareOnTwitter}
                className="p-3 bg-[#1DA1F2]/20 hover:bg-[#1DA1F2]/30 rounded-xl transition-colors"
              >
                <Twitter className="w-5 h-5 text-[#1DA1F2]" />
              </button>
              <button
                onClick={shareOnFacebook}
                className="p-3 bg-[#4267B2]/20 hover:bg-[#4267B2]/30 rounded-xl transition-colors"
              >
                <Facebook className="w-5 h-5 text-[#4267B2]" />
              </button>
              <button
                onClick={shareByEmail}
                className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
              >
                <Mail className="w-5 h-5" />
              </button>
              <button
                onClick={() => copyToClipboard(referralLink)}
                className="p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* How it Works */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8 p-6 rounded-2xl bg-white/5 border border-white/10"
        >
          <h2 className="text-xl font-bold mb-4">How it Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center mx-auto mb-3">
                <span className="text-xl font-bold text-indigo-400">1</span>
              </div>
              <h3 className="font-semibold mb-2">Share Your Link</h3>
              <p className="text-sm text-gray-400">
                Send your unique referral link to friends
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center mx-auto mb-3">
                <span className="text-xl font-bold text-indigo-400">2</span>
              </div>
              <h3 className="font-semibold mb-2">They Sign Up</h3>
              <p className="text-sm text-gray-400">
                Your friends create an account using your link
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center mx-auto mb-3">
                <span className="text-xl font-bold text-indigo-400">3</span>
              </div>
              <h3 className="font-semibold mb-2">Both Earn Credits</h3>
              <p className="text-sm text-gray-400">
                You both get 50 free credits when they make their first purchase
              </p>
            </div>
          </div>
        </motion.div>

        {/* Referral History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-xl font-bold mb-4">Referral History</h2>

          {referrals.length > 0 ? (
            <div className="space-y-3">
              {referrals.map((referral) => (
                <div
                  key={referral.id}
                  className="p-4 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between"
                >
                  <div>
                    <p className="font-medium">{referral.email}</p>
                    <p className="text-sm text-gray-400">
                      {new Date(referral.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        referral.status === 'completed'
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-yellow-500/20 text-yellow-400'
                      }`}
                    >
                      {referral.status}
                    </span>
                    {referral.creditsEarned > 0 && (
                      <span className="flex items-center gap-1 text-yellow-400">
                        <Coins className="w-4 h-4" />
                        +{referral.creditsEarned}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 px-4 rounded-2xl bg-white/5 border border-white/10">
              <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">No referrals yet</h3>
              <p className="text-gray-400">
                Start sharing your referral link to earn credits!
              </p>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
