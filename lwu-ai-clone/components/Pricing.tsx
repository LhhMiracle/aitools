'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Zap, Crown, Rocket, Loader2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

const plans = [
  {
    name: 'Free',
    icon: Zap,
    price: 0,
    credits: 10,
    description: 'Perfect for trying out our AI tools',
    features: [
      '10 credits per month',
      'Access to basic AI tools',
      'Standard processing speed',
      'Watermark on exports',
      'Community support',
    ],
    cta: 'Get Started',
    popular: false,
  },
  {
    name: 'Pro',
    icon: Crown,
    price: 19,
    credits: 500,
    description: 'Best for professionals and creators',
    features: [
      '500 credits per month',
      'Access to all AI tools',
      'Priority processing',
      'No watermarks',
      'HD exports',
      'Priority support',
      'Commercial usage rights',
    ],
    cta: 'Start Free Trial',
    popular: true,
  },
  {
    name: 'Enterprise',
    icon: Rocket,
    price: 99,
    credits: 3000,
    description: 'For teams and high-volume users',
    features: [
      '3000 credits per month',
      'All Pro features',
      'Lightning-fast processing',
      'API access',
      'Custom AI model training',
      'Dedicated account manager',
      'SLA guarantee',
      'Volume discounts',
    ],
    cta: 'Contact Sales',
    popular: false,
  },
];

export default function Pricing() {
  const { data: session, status } = useSession();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);

  const handleUpgrade = async (planName: string) => {
    if (planName === 'Free') {
      window.location.href = '/dashboard';
      return;
    }

    if (status !== 'authenticated' || !session?.user) {
      toast.error('Please sign in first to upgrade your plan');
      return;
    }

    setLoadingPlan(planName.toLowerCase());

    try {
      // Call Stripe Checkout API
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          packageId: planName.toLowerCase(),
          type: 'subscription',
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      // Redirect to Stripe Checkout
      if (data.url) {
        toast.success('Redirecting to checkout...');
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error(error instanceof Error ? error.message : 'Something went wrong. Please try again.');
      setLoadingPlan(null);
    }
  };

  return (
    <section id="pricing" className="py-24 relative">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            Simple, Transparent{' '}
            <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
              Pricing
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Choose the perfect plan for your creative needs. All plans include a 7-day free trial.
          </p>
        </motion.div>

        {/* Pricing cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {plans.map((plan, index) => {
            const Icon = plan.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className={`relative ${plan.popular ? 'lg:scale-105' : ''}`}
              >
                {/* Popular badge */}
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                    <div className="px-4 py-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full text-sm font-semibold text-white">
                      Most Popular
                    </div>
                  </div>
                )}

                <div className={`h-full p-8 rounded-2xl backdrop-blur-sm transition-all ${
                  plan.popular
                    ? 'bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border-2 border-indigo-500/50'
                    : 'bg-white/5 border border-white/10 hover:border-white/20'
                }`}>
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-xl ${
                    plan.popular
                      ? 'bg-gradient-to-br from-indigo-500 to-purple-500'
                      : 'bg-white/10'
                  } p-2.5 mb-6`}>
                    <Icon className="w-full h-full text-white" />
                  </div>

                  {/* Plan name */}
                  <h3 className="text-2xl font-bold text-white mb-2">{plan.name}</h3>
                  <p className="text-gray-400 mb-6">{plan.description}</p>

                  {/* Price */}
                  <div className="mb-6">
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-bold text-white">${plan.price}</span>
                      <span className="text-gray-400">/month</span>
                    </div>
                    <div className="text-indigo-400 mt-2">{plan.credits} credits/month</div>
                  </div>

                  {/* CTA Button */}
                  <button
                    onClick={() => handleUpgrade(plan.name)}
                    disabled={loadingPlan === plan.name.toLowerCase()}
                    className={`w-full py-3 px-6 rounded-xl font-semibold transition-all mb-8 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${
                    plan.popular
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:shadow-xl hover:shadow-indigo-500/50'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}>
                    {loadingPlan === plan.name.toLowerCase() ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      plan.cta
                    )}
                  </button>

                  {/* Features */}
                  <ul className="space-y-4">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-3">
                        <Check className={`w-5 h-5 mt-0.5 flex-shrink-0 ${
                          plan.popular ? 'text-indigo-400' : 'text-gray-400'
                        }`} />
                        <span className="text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center mt-12 text-gray-400"
        >
          <p>All plans include secure payment processing and instant access.</p>
          <p className="mt-2">Need more credits? <span className="text-indigo-400 hover:text-indigo-300 cursor-pointer">Contact us</span> for custom plans.</p>
        </motion.div>
      </div>
    </section>
  );
}
