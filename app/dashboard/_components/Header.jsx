
'use client';
import { UserButton } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { IoMdMenu } from 'react-icons/io';

const Header = ({ isMobileSidebarOpen, setIsMobileSidebarOpen }) => {
  return (
    <div className="flex justify-between items-center p-5 shadow-sm relative">
      {/* Mobile Menu Button */}
      <button
        className="md:hidden text-2xl cursor-pointer"
        onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
        aria-label="Toggle Sidebar"
      >
        <IoMdMenu />
      </button>
      
      <Link href="/dashboard" className="md:hidden block">
        <Image src={"/Coursify.svg"} width={40} height={40} alt="logo" className="cursor-pointer"/>
      </Link>
      
      <Link href="/dashboard">
      <div className="hidden md:block">
        <Image src={"/Coursify.svg"} width={40} height={40} alt="logo" className="cursor-pointer"/>
      </div>
      </Link>
      
      <UserButton />
    </div>
  );
};

export default Header;