'use client';
import { UserButton } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { IoMdMenu } from 'react-icons/io';
import { useCredits } from '../../_context/CreditsContext'; 
import { GiTwoCoins } from "react-icons/gi";

const Header = ({ isMobileSidebarOpen, setIsMobileSidebarOpen }) => {
  const { currentCredits } = useCredits(); 

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
      
      {/* Display currentCredits near UserButton */}
      <div className="flex items-center gap-3">
        <div className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1">
          <GiTwoCoins size={30} className="text-yellow-400"/>
          {currentCredits} Credits
        </div>
        <UserButton />
      </div>
    </div>
  );
};

export default Header;