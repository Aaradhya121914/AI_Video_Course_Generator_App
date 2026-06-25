"use client"
import React from 'react';
import { Button } from '@/components/ui/button';
import { useUser } from '@clerk/nextjs';
import { loadStripe } from '@stripe/stripe-js';

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

const Upgrade = () => {
  const { user } = useUser();

  const plans = [
    {
      name: "Basic",
      price: "$5",
      description: "100 credits",
      priceId: "price_1Tm257PgfYkfncmQdSoWhDTC", 
      features: [
        "Start now, no credit card",
        "Upto 50 Predictions",
        "Basic AI Models",
        "Email support"
      ],
      popular: false
    },
    {
      name: "Pro",
      price: "$19",
      description: "300 credits",
      priceId: "price_1Tm26OPgfYkfncmQDT1ykLit", 
      features: [
        "Add credits to create more projects",
        "Upto 200 Predictions",
        "Advanced AI Models",
        "Priority support"
      ],
      popular: true
    },
    {
      name: "Enterprise",
      price: "$49",
      description: "500 credits",
      priceId: "price_1Tm27OPgfYkfncmQmsLhahrn", 
      features: [
        "Add credits to create more projects",
        "Upto 500 Predictions",
        "All Advanced AI Models",
        "24/7 dedicated support"
      ],
      popular: false
    }
  ];

  const handleBuyNow = async (priceId) => {
    try {
      const stripe = await stripePromise;
      if (!stripe) return;

      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          userId: user.id,
          userEmail: user.primaryEmailAddress.emailAddress,
        }),
      });

      const { url, error } = await response.json();
      if (error) throw new Error(error);
      if (url) window.location.href = url;
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to start checkout process');
    }
  };

  return (
    <div className="py-10 px-4">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold mb-3">Choose Your Plan</h1>
        <p className="text-gray-600">
          Start for free. Upgrade when you need to. Cancel anytime.
          <br />
          No hidden fees. No credit card required.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan, index) => (
          <div 
            key={index}
            className={`
              relative bg-white rounded-xl p-8 shadow-md 
              ${plan.popular ? 'border-2 border-purple-600 shadow-lg scale-105 z-10' : 'border border-gray-200'}
              hover:border-primary hover:transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-lg cursor-pointer
            `}
          >
            {plan.popular && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                Most Popular
              </div>
            )}
            
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
              <div className="flex items-baseline justify-center gap-1 mb-1">
                <span className="text-4xl font-bold">{plan.price}</span>
              </div>
              <p className="text-gray-500 text-sm">{plan.description}</p>
            </div>

            <ul className="space-y-3 mb-8">
              {plan.features.map((feature, idx) => (
                <li key={idx} className="flex items-center gap-2">
                  <div className="text-purple-600">✓</div>
                  <span className="text-sm text-gray-600">{feature}</span>
                </li>
              ))}
            </ul>

            <Button 
              onClick={() => handleBuyNow(plan.priceId)}
              className={`
                w-full py-2 
                ${plan.popular 
                  ? 'bg-purple-600 hover:bg-purple-700 text-white' 
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-800 border border-purple-200'
                }
                transition-colors cursor-pointer
              `}
            >
              Buy Now
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Upgrade;