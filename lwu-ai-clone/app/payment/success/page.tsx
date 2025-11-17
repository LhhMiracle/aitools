'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle, Loader2, ArrowRight } from 'lucide-react';
import Header from '@/components/Header';
import Link from 'next/link';

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      setError('No session ID found');
      setLoading(false);
      return;
    }

    // Give the webhook some time to process
    setTimeout(() => {
      setLoading(false);
    }, 2000);
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <div className="max-w-2xl mx-auto">
          {loading ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <Loader2 className="w-16 h-16 animate-spin text-indigo-400 mx-auto mb-6" />
              <h1 className="text-3xl font-bold mb-2">Processing Payment...</h1>
              <p className="text-gray-400">
                Please wait while we confirm your payment
              </p>
            </motion.div>
          ) : error ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-3xl">⚠️</span>
              </div>
              <h1 className="text-3xl font-bold mb-2">Payment Error</h1>
              <p className="text-gray-400 mb-8">{error}</p>
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 rounded-full font-semibold transition-colors"
              >
                Go to Dashboard
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="mb-8"
              >
                <CheckCircle className="w-24 h-24 text-green-400 mx-auto" />
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-4xl font-bold mb-4"
              >
                Payment Successful! 🎉
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl text-gray-400 mb-8"
              >
                Your credits have been added to your account
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col sm:flex-row gap-4 justify-center"
              >
                <Link
                  href="/dashboard"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 rounded-full font-semibold transition-colors"
                >
                  View Dashboard
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/tools"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full font-semibold hover:shadow-lg hover:shadow-indigo-500/50 transition-all"
                >
                  Start Creating
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-12 p-6 rounded-2xl bg-white/5 border border-white/10"
              >
                <h3 className="text-lg font-semibold mb-2">What's next?</h3>
                <p className="text-gray-400 text-sm">
                  Start using your credits to create amazing AI-powered content with our tools.
                  You can check your credit balance anytime from your dashboard.
                </p>
              </motion.div>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
}
