"use client";
import Image from "next/image";
import Link from "next/link";
import Button from "./sharedComponents/Button";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Splash() {
    const router = useRouter();

    useEffect(() => {
        const isAuthenticated = Boolean(localStorage.getItem("authToken"));
        const userRole = localStorage.getItem("userRole")
        if (isAuthenticated) {
            if (userRole === "admin") {
                router.push("/home")
            } else if (userRole === "agrovet") {
                router.push("/dashboard")
            }
        }
    }, [router])

    const handleClick = () => { };
    return (
        <div className="min-h-screen">
            <div className="relative bg-[url('/Images/trap.jpg')] bg-cover bg-center min-h-screen flex flex-col justify-center">
                <div className="absolute inset-0 bg-[#683929]/70"></div>
                <div className="relative flex flex-col items-center text-center px-4 sm:px-6 md:px-8 lg:px-10 max-w-4xl -mt-35 mx-auto">

                    <div className="max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg mb-8 mt-6 sm:mt-10 md:mt-14">
                        <Image
                            src="/Images/fruitguard.png"
                            alt="FruitGuard logo"
                            width={200}
                            height={150}
                            className="w-full h-auto"
                        />
                    </div>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-4xl font-extrabold text-[#FFC661] mb-4 -mt-14 sm:mb-6">
                        FruitGuard
                    </h1>

                    <p className="text-white text-xl sm:text-2xl md:text-3xl mb-8 px-2 sm:px-6 md:px-8 max-w-1xl leading-relaxed line-clamp-2">
                        Monitor trap fill status and receive real-time alerts with FruitGuards advanced IoT technology.
                    </p>

                    <Link href="/roles" className="w-full sm:w-auto">
                        <Button
                            buttonText="Get Started"
                            variant="primary"
                            onClickHandler={handleClick}
                            className="w-full sm:w-auto py-3 sm:py-4 px-6 sm:px-8 text-base sm:text-lg md:text-xl font-semibold rounded-xl transition-all duration-300 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[#FFC661] focus:ring-offset-2 focus:ring-offset-[#683929]"
                        />
                    </Link>
                </div>
            </div>
        </div>
    );

}
