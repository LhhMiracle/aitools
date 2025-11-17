import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { stripe, CREDIT_PACKAGES, SUBSCRIPTION_PLANS } from '@/lib/stripe';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || !session.user.email) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { packageId, type } = body as {
      packageId: string;
      type: 'credits' | 'subscription';
    };

    if (!packageId || !type) {
      return NextResponse.json(
        { error: 'Missing package ID or type' },
        { status: 400 }
      );
    }

    let priceId: string;
    let metadata: Record<string, string>;

    if (type === 'credits') {
      const pkg = CREDIT_PACKAGES[packageId as keyof typeof CREDIT_PACKAGES];
      if (!pkg || !pkg.priceId) {
        return NextResponse.json(
          { error: 'Invalid package' },
          { status: 400 }
        );
      }
      priceId = pkg.priceId;
      metadata = {
        type: 'credits',
        packageId: pkg.id,
        credits: pkg.credits.toString(),
        userId: session.user.id,
      };
    } else {
      const plan = SUBSCRIPTION_PLANS[packageId as keyof typeof SUBSCRIPTION_PLANS];
      if (!plan || !plan.priceId) {
        return NextResponse.json(
          { error: 'Invalid subscription plan' },
          { status: 400 }
        );
      }
      priceId = plan.priceId;
      metadata = {
        type: 'subscription',
        planId: plan.id,
        credits: plan.credits.toString(),
        userId: session.user.id,
      };
    }

    // Get or create Stripe customer
    let customerId: string;

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { stripeCustomerId: true },
    });

    if (user?.stripeCustomerId) {
      customerId = user.stripeCustomerId;
    } else {
      const customer = await stripe.customers.create({
        email: session.user.email,
        metadata: {
          userId: session.user.id,
        },
      });
      customerId = customer.id;

      // Save customer ID to database
      await prisma.user.update({
        where: { id: session.user.id },
        data: { stripeCustomerId: customerId },
      });
    }

    // Create Checkout Session
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: type === 'credits' ? 'payment' : 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/payment/cancelled`,
      metadata,
    });

    return NextResponse.json({
      sessionId: checkoutSession.id,
      url: checkoutSession.url,
    });
  } catch (error) {
    console.error('Checkout error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}
