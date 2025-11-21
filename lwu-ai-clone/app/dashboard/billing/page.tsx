'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CreditCard,
  Download,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  CheckCircle,
  AlertCircle,
  Loader2,
  FileText,
  Settings,
  RefreshCw,
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { SUBSCRIPTION_PLANS } from '@/lib/stripe';

interface Invoice {
  id: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
  description: string;
  downloadUrl: string;
}

export default function BillingPage() {
  const { data: session } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  // Mock data - in production, fetch from API
  const currentPlan = 'pro';
  const subscriptionStatus = 'active';
  const nextBillingDate = '2024-02-15';
  const credits = 342;
  const maxCredits = 500;

  const paymentMethod = {
    brand: 'Visa',
    last4: '4242',
    expMonth: 12,
    expYear: 2025,
  };

  const invoices: Invoice[] = [
    {
      id: 'INV-001',
      date: '2024-01-15',
      amount: 19.99,
      status: 'paid',
      description: 'Pro Plan - Monthly',
      downloadUrl: '#',
    },
    {
      id: 'INV-002',
      date: '2023-12-15',
      amount: 19.99,
      status: 'paid',
      description: 'Pro Plan - Monthly',
      downloadUrl: '#',
    },
    {
      id: 'INV-003',
      date: '2023-11-15',
      amount: 19.99,
      status: 'paid',
      description: 'Pro Plan - Monthly',
      downloadUrl: '#',
    },
  ];

  const handleManagePayment = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/stripe/portal', {
        method: 'POST',
      });
      const data = await response.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        throw new Error('Failed to open billing portal');
      }
    } catch (error) {
      toast.error('Failed to open billing portal');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/stripe/cancel', {
        method: 'POST',
      });

      if (response.ok) {
        toast.success('Subscription cancelled. You\'ll have access until the end of your billing period.');
        setShowCancelModal(false);
      } else {
        throw new Error('Failed to cancel subscription');
      }
    } catch (error) {
      toast.error('Failed to cancel subscription');
    } finally {
      setIsLoading(false);
    }
  };

  const plan = SUBSCRIPTION_PLANS[currentPlan as keyof typeof SUBSCRIPTION_PLANS];

  return (
    <div className="min-h-screen bg-black text-white p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Billing & Subscription</h1>
          <p className="text-gray-400">Manage your subscription and payment methods</p>
        </div>

        {/* Current Plan Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-2xl border border-indigo-500/30 p-6 mb-6"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-xl font-semibold">{plan?.name || 'Pro'} Plan</h2>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  subscriptionStatus === 'active'
                    ? 'bg-green-500/20 text-green-400'
                    : 'bg-yellow-500/20 text-yellow-400'
                }`}>
                  {subscriptionStatus === 'active' ? 'Active' : 'Cancelled'}
                </span>
              </div>
              <p className="text-gray-400 text-sm">
                ${plan?.price || 19.99}/month • {plan?.credits || 500} credits included
              </p>
            </div>
            <div className="flex gap-3">
              <Link
                href="/pricing"
                className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors text-sm flex items-center gap-2"
              >
                <ArrowUpRight className="w-4 h-4" />
                Change Plan
              </Link>
            </div>
          </div>

          {/* Credits Usage */}
          <div className="mt-6 pt-6 border-t border-white/10">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-400">Credits Used</span>
              <span>{credits} / {maxCredits}</span>
            </div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full"
                style={{ width: `${(credits / maxCredits) * 100}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Resets on {new Date(nextBillingDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })}
            </p>
          </div>
        </motion.div>

        {/* Billing Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Payment Method */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/5 rounded-xl border border-white/10 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-indigo-400" />
                Payment Method
              </h3>
              <button
                onClick={handleManagePayment}
                disabled={isLoading}
                className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                Update
              </button>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-12 h-8 bg-white/10 rounded flex items-center justify-center">
                <span className="text-xs font-bold">{paymentMethod.brand}</span>
              </div>
              <div>
                <p className="font-medium">•••• {paymentMethod.last4}</p>
                <p className="text-sm text-gray-400">
                  Expires {paymentMethod.expMonth}/{paymentMethod.expYear}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Next Billing */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/5 rounded-xl border border-white/10 p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-400" />
                Next Billing
              </h3>
            </div>
            <p className="text-2xl font-bold mb-1">${plan?.price || 19.99}</p>
            <p className="text-sm text-gray-400">
              {new Date(nextBillingDate).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </p>
          </motion.div>
        </div>

        {/* Invoice History */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white/5 rounded-xl border border-white/10 overflow-hidden"
        >
          <div className="p-6 border-b border-white/10">
            <h3 className="font-semibold flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-400" />
              Invoice History
            </h3>
          </div>

          <div className="divide-y divide-white/5">
            {invoices.map((invoice) => (
              <div key={invoice.id} className="p-4 flex items-center justify-between hover:bg-white/5">
                <div className="flex items-center gap-4">
                  <div className={`w-2 h-2 rounded-full ${
                    invoice.status === 'paid'
                      ? 'bg-green-400'
                      : invoice.status === 'pending'
                      ? 'bg-yellow-400'
                      : 'bg-red-400'
                  }`} />
                  <div>
                    <p className="font-medium">{invoice.description}</p>
                    <p className="text-sm text-gray-400">
                      {new Date(invoice.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-medium">${invoice.amount.toFixed(2)}</span>
                  <button
                    onClick={() => window.open(invoice.downloadUrl, '_blank')}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    title="Download Invoice"
                  >
                    <Download className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {invoices.length === 0 && (
            <div className="p-8 text-center text-gray-400">
              No invoices yet
            </div>
          )}
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-6 flex flex-wrap gap-4"
        >
          <button
            onClick={handleManagePayment}
            disabled={isLoading}
            className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors text-sm flex items-center gap-2"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Settings className="w-4 h-4" />
            )}
            Manage Billing
          </button>
          <Link
            href="/dashboard/api-keys"
            className="px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors text-sm flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            API Usage
          </Link>
          {subscriptionStatus === 'active' && currentPlan !== 'free' && (
            <button
              onClick={() => setShowCancelModal(true)}
              className="px-4 py-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors text-sm"
            >
              Cancel Subscription
            </button>
          )}
        </motion.div>

        {/* Cancel Modal */}
        {showCancelModal && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gray-900 rounded-2xl p-6 max-w-md w-full border border-white/10"
            >
              <div className="flex items-center gap-3 mb-4">
                <AlertCircle className="w-6 h-6 text-red-400" />
                <h3 className="text-xl font-semibold">Cancel Subscription?</h3>
              </div>
              <p className="text-gray-400 mb-6">
                Are you sure you want to cancel your subscription? You&apos;ll lose access to:
              </p>
              <ul className="space-y-2 mb-6">
                <li className="flex items-center gap-2 text-sm text-gray-300">
                  <span className="w-1.5 h-1.5 bg-red-400 rounded-full" />
                  {plan?.credits || 500} monthly credits
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-300">
                  <span className="w-1.5 h-1.5 bg-red-400 rounded-full" />
                  Priority processing
                </li>
                <li className="flex items-center gap-2 text-sm text-gray-300">
                  <span className="w-1.5 h-1.5 bg-red-400 rounded-full" />
                  HD exports without watermark
                </li>
              </ul>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="flex-1 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
                >
                  Keep Subscription
                </button>
                <button
                  onClick={handleCancelSubscription}
                  disabled={isLoading}
                  className="flex-1 py-2 bg-red-500 rounded-lg hover:bg-red-600 transition-colors flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    'Cancel'
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
