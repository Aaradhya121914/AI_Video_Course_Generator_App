import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <div className="flex justify-between items-center p-5 shadow-sm">
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
  );
};

export default Header;
