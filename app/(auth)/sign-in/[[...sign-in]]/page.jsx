"use client";
import { SignIn } from "@clerk/nextjs";
import Image from "next/image";
import React from "react";

export default function Page() {
  return (
    <section className="bg-gradient-to-r from-[#040717] to-[#172554] lg:bg-none lg:bg-white h-screen w-screen grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
      {/* Sign-in Column */}
      <div className="flex items-center justify-center px-4 lg:px-8 lg:col-span-5">
        <SignIn />
      </div>

      {/* Image Column */}
      <div className="hidden lg:block relative h-full w-full lg:col-span-7 bg-gradient-to-r from-[#040717] to-[#172554]">
        <Image
          src="/login_page_img.png"
          alt="AI Course Generator Dashboard"
          fill
          className="object-contain p-8"
          priority
          unoptimized
        />
      </div>
    </section>
  );
}