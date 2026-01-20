import Stripe from 'stripe';

// Initialize Stripe with fallback for development
const stripeKey = process.env.STRIPE_SECRET_KEY || 'sk_test_mock_key_for_development';
const stripe = new Stripe(stripeKey, {
  apiVersion: '2023-10-16',
} as any);

export async function createPaymentIntent(
  amount: number,
  orderId: string,
  customerEmail: string
) {
  try {
    // Check if using mock key
    if (!process.env.STRIPE_SECRET_KEY) {
      console.warn('Stripe not configured, returning mock payment intent');
      return {
        id: `pi_mock_${Date.now()}`,
        client_secret: `pi_mock_${Date.now()}_secret_mock`,
        status: 'requires_payment_method',
        amount: Math.round(amount * 100),
        currency: 'mwk',
        metadata: { orderId },
        receipt_email: customerEmail,
      } as any;
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'mwk',
      metadata: { orderId },
      receipt_email: customerEmail,
    });
    return paymentIntent;
  } catch (error) {
    console.error('Stripe payment intent error:', error);
    throw error;
  }
}

export async function confirmPayment(paymentIntentId: string) {
  try {
    // Return mock response if not configured
    if (!process.env.STRIPE_SECRET_KEY) {
      return {
        id: paymentIntentId,
        status: 'succeeded',
        amount: 0,
        currency: 'mwk',
      } as any;
    }

    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    return paymentIntent;
  } catch (error) {
    console.error('Stripe retrieve error:', error);
    throw error;
  }
}

export async function refundPayment(paymentIntentId: string) {
  try {
    if (!process.env.STRIPE_SECRET_KEY) {
      return { id: `ref_mock_${Date.now()}`, status: 'succeeded' };
    }

    const refund = await stripe.refunds.create({
      payment_intent: paymentIntentId,
    });
    return refund;
  } catch (error) {
    console.error('Stripe refund error:', error);
    throw error;
  }
}
