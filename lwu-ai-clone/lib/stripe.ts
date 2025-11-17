import Stripe from 'stripe';

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn('STRIPE_SECRET_KEY is not set. Payment features will not work.');
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2024-11-20.acacia',
  typescript: true,
});

// Credit packages (one-time purchases)
export const CREDIT_PACKAGES = {
  starter: {
    id: 'starter',
    name: 'Starter Pack',
    credits: 50,
    price: 9.99,
    priceId: process.env.STRIPE_PRICE_STARTER || '',
    popular: false,
  },
  professional: {
    id: 'professional',
    name: 'Professional Pack',
    credits: 150,
    price: 24.99,
    priceId: process.env.STRIPE_PRICE_PROFESSIONAL || '',
    popular: true,
    savings: '17%',
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise Pack',
    credits: 500,
    price: 79.99,
    priceId: process.env.STRIPE_PRICE_ENTERPRISE || '',
    popular: false,
    savings: '20%',
  },
} as const;

// Subscription plans (recurring)
export const SUBSCRIPTION_PLANS = {
  pro: {
    id: 'pro',
    name: 'Pro',
    price: 19.99,
    credits: 100,
    priceId: process.env.STRIPE_PRICE_PRO_MONTHLY || '',
    interval: 'month' as const,
    features: [
      '100 credits per month',
      'Priority processing',
      'Advanced AI models',
      'Email support',
    ],
  },
  premium: {
    id: 'premium',
    name: 'Premium',
    price: 49.99,
    credits: 300,
    priceId: process.env.STRIPE_PRICE_PREMIUM_MONTHLY || '',
    interval: 'month' as const,
    features: [
      '300 credits per month',
      'Highest priority',
      'All AI models',
      'Priority support',
      'API access',
    ],
  },
} as const;

export type CreditPackageId = keyof typeof CREDIT_PACKAGES;
export type SubscriptionPlanId = keyof typeof SUBSCRIPTION_PLANS;
