import Stripe from 'stripe';

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder', {
  apiVersion: '2024-11-20.acacia',
});

export const plans = {
  free: {
    name: 'Free',
    price: 0,
    credits: 10,
    priceId: null,
  },
  pro: {
    name: 'Pro',
    price: 19,
    credits: 500,
    priceId: process.env.STRIPE_PRO_PRICE_ID || 'price_pro_placeholder',
  },
  enterprise: {
    name: 'Enterprise',
    price: 99,
    credits: 3000,
    priceId: process.env.STRIPE_ENTERPRISE_PRICE_ID || 'price_enterprise_placeholder',
  },
};
