import { SignUp } from "@clerk/nextjs";
import Image from "next/image";
import React from "react";

export default function Page() {
  return (
    <section className="bg-gradient-to-r from-[#040717] to-[#172554] lg:bg-none lg:bg-white min-h-screen grid grid-cols-1 lg:grid-cols-12">
      <div className="flex items-center justify-center px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:col-span-6 xl:col-span-3 2xl:col-span-3">
        <SignUp />
      </div>

      <div className="hidden lg:block relative h-full w-full lg:col-span-6 xl:col-span-9 2xl:col-span-9">
        <Image
          src="/login_page_img.png"
          alt="AI Course Generator Dashboard"
          fill
          className="object-cover"
          priority
          unoptimized
        />
      </div>
    </section>
  );
}
