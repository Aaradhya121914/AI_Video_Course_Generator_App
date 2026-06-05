import { UserButton } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'


const Header = () => {
  return (
    <div className="flex justify-between items-center p-5 shadow-sm">
      <Link href="/dashboard" className="block">
        <Image src={"/Coursify.svg"} width={40} height={40} alt="logo" className="cursor-pointer"/>
      </Link>
      <UserButton/>
      </div>
  )
}

export default Header