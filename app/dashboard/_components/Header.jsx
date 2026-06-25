// 'use client';
// import { UserButton, useUser } from '@clerk/nextjs'; // Added useUser
// import Image from 'next/image';
// import Link from 'next/link';
// import React, { useEffect, useState } from 'react';
// import { IoMdMenu } from 'react-icons/io';
// import { useCredits } from '../../_context/CreditsContext';

// const Header = ({ isMobileSidebarOpen, setIsMobileSidebarOpen }) => {
//    const { currentCredits } = useCredits();
//   const { user } = useUser();
//   const [currentCredits, setCurrentCredits] = useState(0);
 

//   // Fetch user credits when component mounts or user changes
//   useEffect(() => {
//     const fetchCredits = async () => {
//       if (!user?.primaryEmailAddress?.emailAddress) return;
      
//       try {
//         const response = await fetch('/api/get-user-credits', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ email: user.primaryEmailAddress.emailAddress }),
//         });
        
//         if (response.ok) {
//           const data = await response.json();
//           setCurrentCredits(data.credits);
//         }
//       } catch (error) {
//         console.error('Error fetching credits:', error);
//       }
//     };
    
//     fetchCredits();
//   }, [user?.primaryEmailAddress?.emailAddress]);

//   return (
//     <div className="flex justify-between items-center p-5 shadow-sm relative">
//       {/* Mobile Menu Button */}
//       <button
//         className="md:hidden text-2xl cursor-pointer"
//         onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
//         aria-label="Toggle Sidebar"
//       >
//         <IoMdMenu />
//       </button>
      
//       <Link href="/dashboard" className="md:hidden block">
//         <Image src={"/Coursify.svg"} width={40} height={40} alt="logo" className="cursor-pointer"/>
//       </Link>
      
//       <Link href="/dashboard">
//         <div className="hidden md:block">
//           <Image src={"/Coursify.svg"} width={40} height={40} alt="logo" className="cursor-pointer"/>
//         </div>
//       </Link>
      
//       {/* Display currentCredits near UserButton */}
//       <div className="flex items-center gap-3">
//         <div className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
//           {currentCredits} Credits
//         </div>
//         <UserButton />
//       </div>
//     </div>
//   );
// };

// export default Header;

'use client';
import { UserButton } from '@clerk/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { IoMdMenu } from 'react-icons/io';
import { useCredits } from '../../_context/CreditsContext'; 

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
        <div className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-medium">
          {currentCredits} Credits
        </div>
        <UserButton />
      </div>
    </div>
  );
};

export default Header;