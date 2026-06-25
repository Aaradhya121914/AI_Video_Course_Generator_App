"use client";
import { useUser } from "@clerk/nextjs";
import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import Link from "next/link";


const Addcourse = () => {
  const { user } = useUser();
  return (
    <div>
   
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div>
        <h2 className="text-2xl">
          Hello,
          <span className="font-bold"> {user?.fullName}</span>
        </h2>
        <p className="text-gray-500 mt-2 text-sm">Create new Course</p>
      </div>
      <Link href={"/create-course"}>
        <Button className={"cursor-pointer hover:bg-purple-800"}>
          <Plus className="h-4 w-4 mr-2" />
          Create AI Course
        </Button>
      </Link>
    </div>
    </div>
  );
};

export default Addcourse;