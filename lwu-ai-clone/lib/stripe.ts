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
  free: {
    id: 'free',
    name: 'Free',
    price: 0,
    yearlyPrice: 0,
    credits: 10,
    priceId: '',
    yearlyPriceId: '',
    interval: 'month' as const,
    features: [
      '10 credits per month',
      'Access to basic AI tools',
      'Standard processing speed',
      'Watermark on exports',
      'Community support',
    ],
    limitations: [
      'No API access',
      'No priority support',
      'Watermarked exports',
    ],
    order: 0,
  },
  pro: {
    id: 'pro',
    name: 'Pro',
    price: 19.99,
    yearlyPrice: 191.88, // 20% discount
    credits: 500,
    priceId: process.env.STRIPE_PRICE_PRO_MONTHLY || '',
    yearlyPriceId: process.env.STRIPE_PRICE_PRO_YEARLY || '',
    interval: 'month' as const,
    features: [
      '500 credits per month',
      'Access to all AI tools',
      'Priority processing',
      'No watermarks',
      'HD exports',
      'Email support',
      'Commercial usage rights',
    ],
    limitations: [
      'No API access',
      'No custom models',
    ],
    popular: true,
    order: 1,
  },
  enterprise: {
    id: 'enterprise',
    name: 'Enterprise',
    price: 99.99,
    yearlyPrice: 959.88, // 20% discount
    credits: 3000,
    priceId: process.env.STRIPE_PRICE_ENTERPRISE_MONTHLY || '',
    yearlyPriceId: process.env.STRIPE_PRICE_ENTERPRISE_YEARLY || '',
    interval: 'month' as const,
    features: [
      '3000 credits per month',
      'All Pro features',
      'Lightning-fast processing',
      'API access',
      'Custom AI model training',
      'Dedicated account manager',
      'SLA guarantee',
      'Priority support',
      'Volume discounts',
      'Team management',
    ],
    limitations: [],
    order: 2,
  },
} as const;

// Plan comparison features for display
export const PLAN_FEATURES_COMPARISON = {
  credits: {
    label: 'Monthly Credits',
    free: '10',
    pro: '500',
    enterprise: '3,000',
  },
  processing: {
    label: 'Processing Speed',
    free: 'Standard',
    pro: 'Priority',
    enterprise: 'Lightning',
  },
  tools: {
    label: 'AI Tools Access',
    free: 'Basic (5)',
    pro: 'All (13+)',
    enterprise: 'All + Custom',
  },
  exports: {
    label: 'Export Quality',
    free: 'SD + Watermark',
    pro: 'HD',
    enterprise: '4K',
  },
  api: {
    label: 'API Access',
    free: false,
    pro: false,
    enterprise: true,
  },
  support: {
    label: 'Support',
    free: 'Community',
    pro: 'Email',
    enterprise: 'Dedicated Manager',
  },
  commercial: {
    label: 'Commercial Use',
    free: false,
    pro: true,
    enterprise: true,
  },
  team: {
    label: 'Team Members',
    free: '1',
    pro: '1',
    enterprise: 'Unlimited',
  },
  storage: {
    label: 'Cloud Storage',
    free: '1 GB',
    pro: '50 GB',
    enterprise: '500 GB',
  },
  history: {
    label: 'History Retention',
    free: '7 days',
    pro: '90 days',
    enterprise: 'Unlimited',
  },
} as const;

export type CreditPackageId = keyof typeof CREDIT_PACKAGES;
export type SubscriptionPlanId = keyof typeof SUBSCRIPTION_PLANS;
