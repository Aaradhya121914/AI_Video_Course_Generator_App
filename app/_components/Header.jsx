import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <div className="w-full bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex justify-between items-center py-4">
        <Image
          src={"/Coursify.svg"}
          width={60}
          height={60}
          alt="Coursify Logo"
        />
        <Button asChild>
          <Link href="/sign-in">Login</Link>
        </Button>
      </div>
    </div>
  );
};

export default Header;