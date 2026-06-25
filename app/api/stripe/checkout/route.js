import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Map price IDs to credit amounts (match your plans)
const PRICE_TO_CREDITS = {
  'price_1Tm257PgfYkfncmQdSoWhDTC': 100, // Basic
  'price_1Tm26OPgfYkfncmQDT1ykLit': 300, // Pro
  'price_1Tm27OPgfYkfncmQmsLhahrn': 500  // Enterprise
};

export async function POST(request) {
  try {
    const { priceId, userId, userEmail } = await request.json();
    const creditsToAdd = PRICE_TO_CREDITS[priceId] || 0;

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${request.headers.get('origin')}/dashboard?success=true`,
      cancel_url: `${request.headers.get('origin')}/dashboard/upgrade?canceled=true`,
      customer_email: userEmail,
      metadata: {
        userId,
        userEmail,
        creditsToAdd: creditsToAdd.toString() 
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Stripe error:', error);
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 });
  }
}