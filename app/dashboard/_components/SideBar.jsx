"use client";
import React from "react";
import Image from "next/image";
import { IoMdHome } from "react-icons/io";
import { BsStack } from "react-icons/bs";
import { GrUpgrade } from "react-icons/gr";
import { RiLogoutCircleRLine } from "react-icons/ri";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { useClerk } from "@clerk/nextjs";

const SideBar = ({ setIsMobileSidebarOpen }) => {
  const router = useRouter();
  const { signOut } = useClerk();
  const Menu = [
    { id: 1, name: "Home", icon: <IoMdHome />, path: "/dashboard" },
    { id: 2, name: "Explore", icon: <BsStack />, path: "/dashboard/explore" },
    { id: 3, name: "Upgrade", icon: <GrUpgrade />, path: "/dashboard/upgrade" },
    {
      id: 4,
      name: "Logout",
      icon: <RiLogoutCircleRLine />,
      path: "/dashboard/logout",
    },
  ];
  const path = usePathname();

  const handleClick = () => {
    if (setIsMobileSidebarOpen) {
      setIsMobileSidebarOpen(false);
    }
  };

  return (
    <div className="fixed h-full w-full md:w-64 p-5 shadow-md bg-white">
      <Image
        src={"/Coursify.svg"}
        width={120}
        height={120}
        alt="logo"
        className="cursor-pointer"
      />
      <hr className="my-5 " />
      <div className="flex flex-col h-full">
        <ul className="flex-1">
          {Menu.map((item) =>
            item.name === "Logout" ? (
              <div
                key={item.id}
                onClick={async () => {
                  handleClick();
                  try {
                    await signOut();
                  } catch (e) {
                    console.error("signOut error", e);
                  }
                  router.push("/");
                }}
                role="button"
                tabIndex={0}
                className={`flex items-center gap-2 text-gray-600 p-3 cursor-pointer hover:bg-gray-100 hover:text-black rounded-lg mb-2 ${path == item.path && "bg-gray-100 text-black"}`}
              >
                <div className="text-2xl">{item.icon}</div>
                <h2 className="text-lg">{item.name}</h2>
              </div>
            ) : (
              <Link href={item.path} key={item.id} onClick={handleClick}>
                <div
                  className={`flex items-center gap-2 text-gray-600 p-3 cursor-pointer hover:bg-gray-100 hover:text-black rounded-lg mb-2 ${path == item.path && "bg-gray-100 text-black"}`}
                >
                  <div className="text-2xl">{item.icon}</div>
                  <h2 className="text-lg">{item.name}</h2>
                </div>
              </Link>
            ),
          )}
        </ul>

        {/* Upgrade section */}

        <div className="absolute bottom-10 w-[80%] p-2 bg-white rounded-xl">
          <Progress value={33} />
          <h2 className="text-sm my-2">3 Out of 5 Course created</h2>
          <h2 className="text-xs text-gray-500">
            Upgrade your plan for unlimited course generation
          </h2>
          <Button
            className="w-full mt-2 cursor-pointer hover:bg-purple-800 hover:text-white"
            onClick={() => router.push("/dashboard/upgrade")}
          >
            Upgrade
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SideBar;
