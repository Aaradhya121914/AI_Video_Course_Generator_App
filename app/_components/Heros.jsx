import { Button } from '@/components/ui/button';
import Image from 'next/image';
import React from 'react'

export default function HeroSection() {
  return (
    <section className="bg-white lg:grid lg:place-content-center">
      <div className="mx-auto w-screen max-w-7xl px-4 py-16 sm:px-6 sm:py-24 md:grid md:grid-cols-2 md:items-center md:gap-8 lg:px-8 lg:py-32">
        
        {/* Text Content - Ordered last on medium screens so it goes to the right */}
        <div className="max-w-prose text-left md:order-first">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:block">
            <strong className="text-primary block mb-2"> AI Course Generator </strong>
            Custom Learning Paths, Powered by AI
          </h1>

          <p className="mt-4 text-base text-pretty text-gray-700 sm:text-lg/relaxed">
            Creating engaging video courses has never been easier. Generate
            high-quality video content tailored to your needs with our
            intuitive AI Course Generator.
          </p>

          <div className="mt-4 flex gap-4 sm:mt-6">
            <Button
              className="inline-block rounded border border-indigo-600 bg-indigo-600 px-5 py-3 font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 justify-center items-center"
            >
              Get Started
            </Button>
          </div>
        </div>

        {/* Hero Image - Ordered first on medium screens so it goes to the left */}
        <div className="md:order-last flex justify-center hidden md:block">
          <Image
            src="/hero_ai_course.png"
            alt="AI Course Generator Dashboard"
            width={600}
            height={600}
            className="rounded-xl shadow-2xl mx-auto w-full max-w-md md:max-w-none"
            priority
          />
        </div>

      </div>
    </section>
  );
}