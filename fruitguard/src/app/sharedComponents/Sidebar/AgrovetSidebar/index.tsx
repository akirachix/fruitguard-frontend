"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Button from "../../Button";
import {
  HomeIcon,
  UserIcon,
  ArrowLeftEndOnRectangleIcon,
} from "@heroicons/react/24/outline";
import { usePathname } from "next/navigation";

export default function AgrovetSidebar() {
  const pathname = usePathname();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const navItems = [
    { id: "home", label: "Home", icon: HomeIcon, href: "/farmer-registration" },
    { id: "profile", label: "Profile", icon: UserIcon, href: "/agrovet-profile" },
  ];

  const handleLogoutProceed = () => {
  };

  return (
    <>
      <aside
        className="fixed top-0 left-0 bg-[#683929] text-gray-100 text-[20px] w-72 p-6 z-40 flex flex-col h-screen"
      >
        <div className="flex flex-col h-full overflow-auto">
        
          <div className="flex flex-col items-center mb-10 lg:pb-8">
            <div className="w-30 h-12 mt-15 rounded-full flex items-center justify-center mb-3">
              <Image
                src="/Images/fruitguard.png"
                alt="FruitGuard logo"
                width={800}
                height={200}
                priority
                className="object-contain"
              />
            </div>
            <h1 className="text-[25px] font-semibold mt-5  text-[#FFC661]">
              FruitGuard
            </h1>
          </div>

          <nav className="flex flex-col space-y-10 justify-start ">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`flex items-center gap-3 font-semibold border-b border-gray-400 pb-8 w-[85%]
                    hover:text-[#FFC661] transition-colors duration-200
                    ${isActive ? "text-[#FFC661]" : "text-white"}`}
                  aria-current={isActive ? "page" : undefined}
                >
                  <span
                    className={`p-1 rounded-full border transition-colors duration-200 ${isActive
                      ? "border-[#FFC661] text-[#FFC661]"
                      : "border-white text-white"
                    }`}
                  >
                    <item.icon className="w-10 h-10" />
                  </span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <button
            onClick={() => setShowLogoutConfirm(true)}
            className="flex flex-grow items-center text-[20px] gap-3 font-bold text-white hover:text-[#FFC661] transition-colors duration-200"
          >
            <ArrowLeftEndOnRectangleIcon className="w-10 h-10" />
            Log out
          </button>
        </div>
      </aside>

      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 w-100 text-center">
            <h2 className="text-xl font-semibold mb-6 text-[#683929]">
              Do you want to logout?
            </h2>
            <div className="flex justify-center gap-6">
              <Button
                buttonText="Cancel"
                variant="secondary"
                onClickHandler={() => setShowLogoutConfirm(false)}
                className="hover:bg-[#683929] hover:text-white w-[88px] h-[50px]  mr-4 flex transition-colors duration-300"
              />
              <Link
                href="/Login"
              >
                <Button
                  buttonText="Proceed"
                  variant="default"
                  onClickHandler={handleLogoutProceed}
                  className="w-[88px] h-[50px] hover:text-white hover:bg-[#683929] transition-colors duration-300 rounded flex justify-center items-center"
                />
              </Link>

            </div>
          </div>
        </div>
      )}
    </>
  );
}
