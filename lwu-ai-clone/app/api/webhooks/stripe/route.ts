import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { stripe } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = headers().get('stripe-signature');

  if (!signature) {
    return NextResponse.json(
      { error: 'No signature found' },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ''
    );
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
        break;

      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionUpdate(event.data.object as Stripe.Subscription);
        break;

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;

      case 'invoice.payment_succeeded':
        await handleInvoicePaymentSucceeded(event.data.object as Stripe.Invoice);
        break;

      case 'invoice.payment_failed':
        await handleInvoicePaymentFailed(event.data.object as Stripe.Invoice);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  const metadata = session.metadata;

  if (!metadata?.userId) {
    console.error('No userId in session metadata');
    return;
  }

  const userId = metadata.userId;
  const type = metadata.type;

  if (type === 'credits') {
    // Handle one-time credit purchase
    const credits = parseInt(metadata.credits || '0');
    if (credits <= 0) return;

    await prisma.$transaction([
      // Add credits to user
      prisma.user.update({
        where: { id: userId },
        data: {
          credits: {
            increment: credits,
          },
        },
      }),
      // Create transaction record
      prisma.transaction.create({
        data: {
          userId,
          type: 'purchase',
          amount: credits,
          description: `Purchased ${credits} credits`,
          metadata: JSON.stringify({
            sessionId: session.id,
            packageId: metadata.packageId,
          }),
        },
      }),
    ]);

    console.log(`Added ${credits} credits to user ${userId}`);
  } else if (type === 'subscription' && session.subscription) {
    // Handle subscription creation
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );
    await updateUserSubscription(userId, subscription);
  }
}

async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
  const userId = subscription.metadata.userId;
  if (!userId) return;

  await updateUserSubscription(userId, subscription);
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const userId = subscription.metadata.userId;
  if (!userId) return;

  await prisma.$transaction([
    // Update subscription status
    prisma.subscription.update({
      where: { userId },
      data: {
        status: 'canceled',
        cancelAtPeriodEnd: false,
      },
    }),
    // Downgrade user plan
    prisma.user.update({
      where: { id: userId },
      data: {
        plan: 'FREE',
      },
    }),
  ]);

  console.log(`Subscription canceled for user ${userId}`);
}

async function handleInvoicePaymentSucceeded(invoice: Stripe.Invoice) {
  if (!invoice.subscription || !invoice.customer) return;

  const subscription = await stripe.subscriptions.retrieve(
    invoice.subscription as string
  );

  const userId = subscription.metadata.userId;
  if (!userId) return;

  // Add monthly credits for subscription renewal
  const credits = parseInt(subscription.metadata.credits || '0');
  if (credits > 0) {
    await prisma.$transaction([
      prisma.user.update({
        where: { id: userId },
        data: {
          credits: {
            increment: credits,
          },
        },
      }),
      prisma.transaction.create({
        data: {
          userId,
          type: 'purchase',
          amount: credits,
          description: `Monthly subscription credits (${subscription.metadata.planId})`,
          metadata: JSON.stringify({
            subscriptionId: subscription.id,
            invoiceId: invoice.id,
          }),
        },
      }),
    ]);

    console.log(`Added ${credits} monthly credits to user ${userId}`);
  }
}

async function handleInvoicePaymentFailed(invoice: Stripe.Invoice) {
  if (!invoice.subscription) return;

  const subscription = await stripe.subscriptions.retrieve(
    invoice.subscription as string
  );

  const userId = subscription.metadata.userId;
  if (!userId) return;

  // Update subscription status to past_due
  await prisma.subscription.update({
    where: { userId },
    data: {
      status: 'past_due',
    },
  });

  console.log(`Payment failed for user ${userId} subscription`);
}

async function updateUserSubscription(
  userId: string,
  subscription: Stripe.Subscription
) {
  const planId = subscription.metadata.planId || 'pro';
  const planName = planId.toUpperCase();

  await prisma.$transaction([
    // Upsert subscription record
    prisma.subscription.upsert({
      where: { userId },
      create: {
        userId,
        plan: planName,
        status: subscription.status,
        stripeCustomerId: subscription.customer as string,
        stripeSubscriptionId: subscription.id,
        stripePriceId: subscription.items.data[0]?.price.id,
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
      },
      update: {
        plan: planName,
        status: subscription.status,
        stripePriceId: subscription.items.data[0]?.price.id,
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
      },
    }),
    // Update user plan
    prisma.user.update({
      where: { id: userId },
      data: {
        plan: planName,
      },
    }),
  ]);

  console.log(`Updated subscription for user ${userId} to ${planName}`);
}
