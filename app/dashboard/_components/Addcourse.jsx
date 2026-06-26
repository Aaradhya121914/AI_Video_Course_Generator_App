"use client";
import { useUser } from "@clerk/nextjs";
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const Addcourse = () => {
  const { user } = useUser();
  return (
    <div className="w-full mb-8">
      {/* Desktop Only Background Section */}
      <div className="hidden md:block relative w-full h-[400px] rounded-2xl overflow-hidden">
        {/* Background Image */}
        <Image
          src="/Main_Dashboard_page_Img.jpeg" // Make sure filename matches your public folder!
          alt="Dashboard Background"
          fill
          className="object-cover"
          priority
          unoptimized
        />
      

        {/* Content on Left Side */}
        <div className="absolute left-8 top-1/2 -translate-y-1/2 max-w-md z-10">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Hello, <span className="text-purple-700">{user?.fullName}</span> 👋
          </h2>
          <p className="text-gray-600 mb-6">Create new Course</p>
         <p className="text-xl font-semibold text-gray-800 ">
            Turn your ideas into
          </p>
          <p className="text-xl font-semibold text-gray-800 mb-2">
            powerful courses with AI
          </p>
          <p className="text-gray-500 mb-6 text-sm">
            Create, customize and launch engaging courses in minutes.
          </p>
          <Link href={"/create-course"}>
            <Button className="cursor-pointer hover:bg-purple-800 bg-purple-600 px-8 py-6 text-lg">
              <Plus className="h-5 w-5 mr-2" />
              Create AI Course
            </Button>
          </Link>
        </div>
      </div>

      {/* Mobile Only Simple Section (Keep original for mobile) */}
      <div className="md:hidden">
        <div className="flex flex-col gap-4">
          <div>
            <h2 className="text-2xl">
              Hello,
              <span className="font-bold"> {user?.fullName}</span>
            </h2>
            <p className="text-gray-500 mt-2 text-sm">Create new Course</p>
          </div>
          <Link href={"/create-course"}>
            <Button className={"cursor-pointer hover:bg-purple-800 w-full"}>
              <Plus className="h-4 w-4 mr-2" />
              Create AI Course
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Addcourse;