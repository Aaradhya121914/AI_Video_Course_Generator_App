import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { db } from '../../../../configs/db';
import { UserCredits } from '../../../../configs/Schema';
import { eq, sql } from 'drizzle-orm';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

export async function POST(request) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature');
    
    let event;
    try {
      event = stripe.webhooks.constructEvent(
        body,
        signature,
        webhookSecret
      );
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // Handle the event
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      console.log('Checkout session completed!', session);
      
      const userEmail = session.customer_email;
      const creditsToAdd = parseInt(session.metadata.creditsToAdd, 10);
      
      if (userEmail && creditsToAdd) {
        // Add credits to user
        await addCreditsToUser(userEmail, creditsToAdd);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook error' }, { status: 500 });
  }
}

async function addCreditsToUser(email, creditsToAdd) {
  try {
    // Check if user exists
    let userCredits = await db.select().from(UserCredits).where(eq(UserCredits.email, email)).limit(1);
    
    if (userCredits.length === 0) {
      // Create new user with credits
      await db.insert(UserCredits).values({ email, credits: creditsToAdd });
    } else {
      // Update existing user's credits
      await db.update(UserCredits)
        .set({ credits: sql`${UserCredits.credits} + ${creditsToAdd}` })
        .where(eq(UserCredits.email, email));
    }
    
    console.log(`Added ${creditsToAdd} credits to ${email}`);
  } catch (error) {
    console.error('Error adding credits:', error);
    throw error;
  }
}