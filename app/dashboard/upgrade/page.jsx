// "use client"
// import React from 'react';
// import { Button } from '@/components/ui/button';
// import { useUser } from '@clerk/nextjs';
// import { loadStripe } from '@stripe/stripe-js';

// // Initialize Stripe
// const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY);

// const Upgrade = () => {
//   const { user } = useUser();

//   const plans = [
//     {
//       name: "Basic",
//       price: "$5",
//       description: "100 credits",
//       priceId: "price_1Tm257PgfYkfncmQdSoWhDTC", 
//       features: [
//         "Start now, no credit card",
//         "Upto 50 Predictions",
//         "Basic AI Models",
//         "Email support"
//       ],
//       popular: false
//     },
//     {
//       name: "Pro",
//       price: "$19",
//       description: "300 credits",
//       priceId: "price_1Tm26OPgfYkfncmQDT1ykLit", 
//       features: [
//         "Add credits to create more projects",
//         "Upto 200 Predictions",
//         "Advanced AI Models",
//         "Priority support"
//       ],
//       popular: true
//     },
//     {
//       name: "Enterprise",
//       price: "$49",
//       description: "500 credits",
//       priceId: "price_1Tm27OPgfYkfncmQmsLhahrn", 
//       features: [
//         "Add credits to create more projects",
//         "Upto 500 Predictions",
//         "All Advanced AI Models",
//         "24/7 dedicated support"
//       ],
//       popular: false
//     }
//   ];

//   const handleBuyNow = async (priceId) => {
//     try {
//       const stripe = await stripePromise;
//       if (!stripe) return;

//       const response = await fetch('/api/stripe/checkout', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           priceId,
//           userId: user.id,
//           userEmail: user.primaryEmailAddress.emailAddress,
//         }),
//       });

//       const { url, error } = await response.json();
//       if (error) throw new Error(error);
//       if (url) window.location.href = url;
//     } catch (error) {
//       console.error('Checkout error:', error);
//       alert('Failed to start checkout process');
//     }
//   };

//   return (
//     <div className="py-10 px-4">
//       {/* Header */}
//       <div className="text-center mb-12">
//         <h1 className="text-3xl md:text-4xl font-bold mb-3">Choose Your Plan</h1>
//         <p className="text-gray-600">
//           Start for free. Upgrade when you need to. Cancel anytime.
//           <br />
//           No hidden fees. No credit card required.
//         </p>
//       </div>

//       {/* Pricing Cards */}
//       <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
//         {plans.map((plan, index) => (
//           <div 
//             key={index}
//             className={`
//               relative bg-white rounded-xl p-8 shadow-md 
//               ${plan.popular ? 'border-2 border-purple-600 shadow-lg scale-105 z-10' : 'border border-gray-200'}
//               hover:border-primary hover:transition-all duration-300 ease-out hover:-translate-y-2 hover:shadow-lg cursor-pointer
//             `}
//           >
//             {plan.popular && (
//               <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-purple-600 text-white px-4 py-1 rounded-full text-sm font-medium">
//                 Most Popular
//               </div>
//             )}
            
//             <div className="text-center mb-6">
//               <h3 className="text-xl font-semibold mb-2">{plan.name}</h3>
//               <div className="flex items-baseline justify-center gap-1 mb-1">
//                 <span className="text-4xl font-bold">{plan.price}</span>
//               </div>
//               <p className="text-gray-500 text-sm">{plan.description}</p>
//             </div>

//             <ul className="space-y-3 mb-8">
//               {plan.features.map((feature, idx) => (
//                 <li key={idx} className="flex items-center gap-2">
//                   <div className="text-purple-600">✓</div>
//                   <span className="text-sm text-gray-600">{feature}</span>
//                 </li>
//               ))}
//             </ul>

//             <Button 
//               onClick={() => handleBuyNow(plan.priceId)}
//               className={`
//                 w-full py-2 
//                 ${plan.popular 
//                   ? 'bg-purple-600 hover:bg-purple-700 text-white' 
//                   : 'bg-gray-100 hover:bg-gray-200 text-gray-800 border border-purple-200'
//                 }
//                 transition-colors cursor-pointer
//               `}
//             >
//               Buy Now
//             </Button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Upgrade;

"use client";
import React from 'react';
import { Button } from '@/components/ui/button';
import { useUser } from '@clerk/nextjs';
import { loadStripe } from '@stripe/stripe-js';
import { Star, Diamond, Briefcase, Check } from 'lucide-react';

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
      icon: <Star className="w-8 h-8 text-purple-500" />,
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
      icon: <Diamond className="w-8 h-8 text-purple-600" />,
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
      icon: <Briefcase className="w-8 h-8 text-purple-500" />,
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
    <div className="min-h-screen w-full bg-white">
      <div className="py-12 px-4 md:py-20">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <h1 className="text-3xl md:text-5xl font-extrabold mb-4 text-gray-900">
            Choose <span className="text-purple-600">Your</span> Plan
          </h1>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto leading-relaxed">
            Start for free. Upgrade when you need to. Cancel anytime.
            <br className="hidden md:block" />
            No hidden fees. No credit card required.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6">
          {plans.map((plan, index) => (
            <div 
              key={index}
              className={`
                relative bg-white rounded-3xl p-8 shadow-lg
                ${plan.popular 
                  ? 'border-2 border-purple-600 shadow-xl transform scale-105 z-10 md:-mt-4' 
                  : 'border border-gray-200'
                }
                transition-all duration-300 ease-out hover:shadow-2xl cursor-pointer
              `}
            >
              {/* Popular Badge */}
              {plan.popular && (
                <div className="absolute -top-5 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-2 rounded-full text-base font-bold shadow-lg">
                  Most Popular 👑
                </div>
              )}

              {/* Plan Icon */}
              <div className="flex justify-center mb-6">
                <div className={`
                  w-16 h-16 rounded-full flex items-center justify-center
                  ${plan.popular ? 'bg-gradient-to-br from-purple-100 to-indigo-100' : 'bg-gradient-to-br from-gray-100 to-purple-50'}
                `}>
                  {plan.icon}
                </div>
              </div>

              {/* Plan Name & Price */}
              <div className="text-center mb-8">
                <h3 className={`text-2xl font-extrabold mb-2 ${plan.popular ? 'text-gray-900' : 'text-gray-800'}`}>
                  {plan.name}
                </h3>
                <div className="flex items-baseline justify-center gap-1 mb-2">
                  <span className={`text-5xl font-black ${plan.popular ? 'text-purple-600' : 'text-gray-900'}`}>
                    {plan.price}
                  </span>
                </div>
                <p className="text-gray-500 text-base">{plan.description}</p>
                <hr className="my-6 border-gray-200" />
              </div>

              {/* Features List */}
              <ul className="space-y-4 mb-10">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <div className={`
                      flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center
                      ${plan.popular ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-600'}
                    `}>
                      <Check className="w-4 h-4" />
                    </div>
                    <span className={`text-base ${plan.popular ? 'text-gray-800 font-medium' : 'text-gray-700'}`}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              {/* Buy Button */}
              <Button 
                onClick={() => handleBuyNow(plan.priceId)}
                className={`
                  w-full py-4 rounded-2xl text-lg font-bold transition-all duration-300 cursor-pointer
                  ${plan.popular 
                    ? 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-lg hover:shadow-xl' 
                    : 'bg-gray-100 hover:bg-purple-50 text-purple-700 border border-purple-200 hover:border-purple-300'
                  }
                `}
              >
                Buy Now
              </Button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Upgrade;