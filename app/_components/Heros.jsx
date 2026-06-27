"use client";
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import React, { useCallback } from 'react'
import { useUser } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'

export default function HeroSection() {
  const { isLoaded, isSignedIn } = useUser();
  const router = useRouter();

  const handleGetStarted = useCallback(() => {
    if (!isLoaded) return;
    if (isSignedIn) router.push('/dashboard');
    else router.push('/sign-in');
  }, [isLoaded, isSignedIn, router]);

  return (
    <section className="min-h-screen w-full relative overflow-hidden bg-white md:bg-transparent">
      {/* Dashboard Background Image (ONLY ON DESKTOP) */}
      <div className="absolute inset-0 hidden md:block">
        <Image
          src="/Dashboard_Background_Img.jpeg"
          alt="Dashboard Background"
          fill
          className="object-cover"
          priority
          unoptimized
        />
        
      </div>

      {/* Content Container */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 py-16 sm:px-6 sm:py-24 md:grid md:grid-cols-2 md:items-center md:gap-8 lg:px-8 lg:py-32">
        {/* Text Content (SHOWN ON BOTH MOBILE & DESKTOP) */}
        <div className="max-w-prose text-left">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:block">
            <strong className="text-purple-700 block mb-2"> AI Course Generator </strong>
            Custom Learning Paths, Powered by AI
          </h1>

          <p className="mt-4 text-base text-gray-800 sm:text-lg/relaxed">
            Creating engaging video courses has never been easier. Generate
            high-quality video content tailored to your needs with our
            intuitive AI Course Generator.
          </p>

          <div className="mt-4 flex gap-4 sm:mt-6">
            <Button
              onClick={handleGetStarted}
              className="flex items-center justify-center rounded border border-indigo-600 bg-indigo-600 px-5 py-3 font-medium text-white shadow-sm transition-colors hover:bg-indigo-700 cursor-pointer"
            >
              Get Started
            </Button>
          </div>
        </div>

        {/* Hero Image (ONLY ON MOBILE - HIDDEN ON DESKTOP) */}
        <div className="flex justify-center mt-12 md:mt-0 md:hidden">
          <Image
            src="/hero_ai_course.png"
            alt="AI Course Generator Dashboard"
            width={600}
            height={600}
            className="rounded-xl shadow-2xl mx-auto w-full max-w-md"
            priority
          />
        </div>
      </div>
    </section>
  );
}