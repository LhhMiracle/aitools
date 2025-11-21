'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, X, Zap, Crown, Rocket, Loader2, ArrowRight } from 'lucide-react';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { SUBSCRIPTION_PLANS, PLAN_FEATURES_COMPARISON } from '@/lib/stripe';

export default function PricingPage() {
  const { data: session, status } = useSession();
  const [isYearly, setIsYearly] = useState(false);
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const plans = [
    {
      ...SUBSCRIPTION_PLANS.free,
      icon: Zap,
      description: 'Perfect for trying out our AI tools',
      cta: 'Get Started',
    },
    {
      ...SUBSCRIPTION_PLANS.pro,
      icon: Crown,
      description: 'Best for professionals and creators',
      cta: 'Start Free Trial',
    },
    {
      ...SUBSCRIPTION_PLANS.enterprise,
      icon: Rocket,
      description: 'For teams and high-volume users',
      cta: 'Contact Sales',
    },
  ];

  const handleUpgrade = async (planId: string) => {
    if (planId === 'free') {
      window.location.href = '/dashboard';
      return;
    }

    if (planId === 'enterprise') {
      window.location.href = 'mailto:sales@lwu.ai?subject=Enterprise Plan Inquiry';
      return;
    }

    if (status !== 'authenticated' || !session?.user) {
      toast.error('Please sign in first to upgrade your plan');
      return;
    }

    setLoadingPlan(planId);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          packageId: planId,
          type: 'subscription',
          interval: isYearly ? 'year' : 'month',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      if (data.url) {
        toast.success('Redirecting to checkout...');
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error(error instanceof Error ? error.message : 'Something went wrong');
      setLoadingPlan(null);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="pt-24 pb-12 text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl sm:text-6xl font-bold mb-4"
        >
          Choose Your{' '}
          <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
            Plan
          </span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-xl text-gray-400 max-w-2xl mx-auto px-4"
        >
          Simple, transparent pricing. All plans include a 7-day free trial.
        </motion.p>

        {/* Billing Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-8 flex items-center justify-center gap-4"
        >
          <span className={`text-sm ${!isYearly ? 'text-white' : 'text-gray-400'}`}>Monthly</span>
          <button
            onClick={() => setIsYearly(!isYearly)}
            className="relative w-14 h-7 rounded-full bg-white/10 transition-colors"
          >
            <div
              className={`absolute top-1 w-5 h-5 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all ${
                isYearly ? 'left-8' : 'left-1'
              }`}
            />
          </button>
          <span className={`text-sm ${isYearly ? 'text-white' : 'text-gray-400'}`}>
            Yearly <span className="text-green-400 ml-1">Save 20%</span>
          </span>
        </motion.div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            const price = isYearly ? plan.yearlyPrice / 12 : plan.price;
            const isPopular = 'popular' in plan && plan.popular;

            return (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                className={`relative ${isPopular ? 'lg:scale-105' : ''}`}
              >
                {isPopular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <div className="px-4 py-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full text-sm font-semibold">
                      Most Popular
                    </div>
                  </div>
                )}

                <div
                  className={`h-full p-8 rounded-2xl backdrop-blur-sm ${
                    isPopular
                      ? 'bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-2 border-indigo-500/50'
                      : 'bg-white/5 border border-white/10'
                  }`}
                >
                  <div
                    className={`w-12 h-12 rounded-xl ${
                      isPopular ? 'bg-gradient-to-br from-indigo-500 to-purple-500' : 'bg-white/10'
                    } p-2.5 mb-6`}
                  >
                    <Icon className="w-full h-full text-white" />
                  </div>

                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-gray-400 mb-6">{plan.description}</p>

                  <div className="mb-6">
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-bold">${price.toFixed(0)}</span>
                      <span className="text-gray-400">/month</span>
                    </div>
                    {isYearly && plan.price > 0 && (
                      <div className="text-sm text-gray-500 mt-1">
                        Billed ${plan.yearlyPrice}/year
                      </div>
                    )}
                    <div className="text-indigo-400 mt-2">{plan.credits} credits/month</div>
                  </div>

                  <button
                    onClick={() => handleUpgrade(plan.id)}
                    disabled={loadingPlan === plan.id}
                    className={`w-full py-3 px-6 rounded-xl font-semibold transition-all mb-8 flex items-center justify-center gap-2 ${
                      isPopular
                        ? 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:shadow-xl hover:shadow-indigo-500/25'
                        : 'bg-white/10 hover:bg-white/20'
                    } disabled:opacity-50`}
                  >
                    {loadingPlan === plan.id ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        {plan.cta}
                        <ArrowRight className="w-4 h-4" />
                      </>
                    )}
                  </button>

                  <ul className="space-y-3">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <Check
                          className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                            isPopular ? 'text-indigo-400' : 'text-gray-400'
                          }`}
                        />
                        <span className="text-gray-300 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Feature Comparison Table */}
      <div className="max-w-5xl mx-auto px-4 pb-24">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl font-bold text-center mb-12"
        >
          Compare Plans
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden"
        >
          {/* Table Header */}
          <div className="grid grid-cols-4 bg-white/5 border-b border-white/10">
            <div className="p-4 font-semibold">Features</div>
            <div className="p-4 text-center font-semibold">Free</div>
            <div className="p-4 text-center font-semibold text-indigo-400">Pro</div>
            <div className="p-4 text-center font-semibold">Enterprise</div>
          </div>

          {/* Table Rows */}
          {Object.entries(PLAN_FEATURES_COMPARISON).map(([key, feature], index) => (
            <div
              key={key}
              className={`grid grid-cols-4 ${
                index % 2 === 0 ? 'bg-white/[0.02]' : ''
              } border-b border-white/5 last:border-0`}
            >
              <div className="p-4 text-gray-300">{feature.label}</div>
              {(['free', 'pro', 'enterprise'] as const).map((plan) => {
                const value = feature[plan];
                return (
                  <div key={plan} className="p-4 text-center">
                    {typeof value === 'boolean' ? (
                      value ? (
                        <Check className="w-5 h-5 text-green-400 mx-auto" />
                      ) : (
                        <X className="w-5 h-5 text-gray-600 mx-auto" />
                      )
                    ) : (
                      <span className={plan === 'pro' ? 'text-indigo-400' : 'text-gray-400'}>
                        {value}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </motion.div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-3xl mx-auto px-4 pb-24">
        <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>

        <div className="space-y-6">
          {[
            {
              q: 'What happens when I run out of credits?',
              a: "You can purchase additional credit packs or upgrade your plan. Your current creations won't be affected.",
            },
            {
              q: 'Can I switch plans at any time?',
              a: 'Yes! You can upgrade or downgrade your plan at any time. Changes take effect on your next billing cycle.',
            },
            {
              q: 'Is there a free trial?',
              a: 'Yes, all paid plans include a 7-day free trial. Cancel anytime during the trial and you won\'t be charged.',
            },
            {
              q: 'What payment methods do you accept?',
              a: 'We accept all major credit cards, PayPal, and bank transfers for Enterprise plans.',
            },
            {
              q: 'Do unused credits roll over?',
              a: 'Credits roll over for up to one month for Pro and Enterprise plans. Free plan credits reset monthly.',
            },
          ].map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white/5 rounded-xl p-6 border border-white/10"
            >
              <h3 className="font-semibold mb-2">{faq.q}</h3>
              <p className="text-gray-400 text-sm">{faq.a}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 py-16">
        <div className="max-w-3xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold mb-4">Still have questions?</h2>
          <p className="text-gray-400 mb-8">
            Our team is here to help you choose the right plan for your needs.
          </p>
          <Link
            href="mailto:support@lwu.ai"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white/10 rounded-xl hover:bg-white/20 transition-colors"
          >
            Contact Support
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
