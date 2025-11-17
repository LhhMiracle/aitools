'use client';

import { motion } from 'framer-motion';
import { XCircle, ArrowRight, ArrowLeft } from 'lucide-react';
import Header from '@/components/Header';
import Link from 'next/link';

export default function PaymentCancelledPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <div className="max-w-2xl mx-auto">
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
              <XCircle className="w-24 h-24 text-yellow-400 mx-auto" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-4xl font-bold mb-4"
            >
              Payment Cancelled
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl text-gray-400 mb-8"
            >
              You have cancelled the payment process. No charges were made.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link
                href="/#pricing"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full font-semibold hover:shadow-lg hover:shadow-indigo-500/50 transition-all"
              >
                <ArrowLeft className="w-4 h-4" />
                View Pricing
              </Link>
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/10 hover:bg-white/20 rounded-full font-semibold transition-colors"
              >
                Go to Dashboard
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-12 p-6 rounded-2xl bg-white/5 border border-white/10"
            >
              <h3 className="text-lg font-semibold mb-2">Need help?</h3>
              <p className="text-gray-400 text-sm mb-4">
                If you encountered any issues during the payment process or have questions about our pricing,
                feel free to contact our support team.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 text-sm">
                <a
                  href="mailto:support@lwu.ai"
                  className="text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  support@lwu.ai
                </a>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
