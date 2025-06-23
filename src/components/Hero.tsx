"use client";

import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { motion } from "motion/react";
import Link from "next/link";

export function HeroSectionOne() {
  return (
    <div className="relative mx-auto my-10 flex max-w-7xl flex-col items-center justify-center">
      <Navbar />
      <div className="px-4 py-10 md:py-20">
        <h1 className="relative z-10 mx-auto max-w-4xl text-center text-2xl font-bold text-black md:text-4xl lg:text-7xl dark:text-black">
          {"Supercharge your learning with your own AI by HelperAi"
            .split(" ")
            .map((word, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, filter: "blur(4px)", y: 10 }}
                animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.1,
                  ease: "easeInOut",
                }}
                className="mr-2 inline-block"
              >
                {word}
              </motion.span>
            ))}
        </h1>
        <motion.p
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            duration: 0.3,
            delay: 0.8,
          }}
          className="relative z-10 mx-auto max-w-xl py-4 text-center text-lg font-normal text-neutral-600 dark:text-neutral-400"
        >
          AI-Powered Learning Companion: Upload Videos or PDFs and Instantly Receive Multilingual, Voice-Narrated Explanations to Deepen Understanding.
        </motion.p>
        <motion.div
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            duration: 0.3,
            delay: 1,
          }}
          className="relative z-10 mt-8 flex flex-wrap items-center justify-center gap-4"
        >
          <button className="w-60 transform rounded-lg bg-black px-6 py-2 font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200">
            Explore Now
          </button>
          <button className="w-60 transform rounded-lg border border-gray-300 bg-white px-6 py-2 font-medium text-black transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-100 dark:border-gray-700 dark:bg-black dark:text-white dark:hover:bg-gray-900">
            Contact Support
          </button>
        </motion.div>
        <motion.div
          initial={{
            opacity: 0,
            y: 10,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 0.3,
            delay: 1.2,
          }}
          className="relative z-10 mt-20 rounded-3xl border border-neutral-200 bg-neutral-100 p-4 shadow-md dark:border-neutral-800 dark:bg-neutral-900"
        >
          <div className="w-full overflow-hidden rounded-xl border border-gray-300 dark:border-gray-700">
            <img
              src="https://assets.aceternity.com/pro/aceternity-landing.webp"
              alt="Landing page preview"
              className="aspect-[16/9] h-auto w-full object-cover"
              height={1000}
              width={1000}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}

const Navbar = () => {
  return (
    <nav className="flex w-full items-center justify-between px-6 py-4">
      {/* Logo Section */}
      <div className="flex items-center gap-3">
        <div className="size-8 rounded-full bg-gradient-to-br from-violet-500 to-pink-500 shadow-lg" />
        <h1 className="text-lg font-bold text-gray-900 md:text-2xl ">
          HelperAi
        </h1>
      </div>

      {/* Right Section */}
      <div className="flex items-center">
        <SignedIn>
          <div className="flex items-center gap-4">
            <Link 
              href="/dashboard"
              className="rounded-lg px-4 py-2 text-sm font-medium text-black transition-all duration-200 hover:bg-gray-100 hover:text-gray-900 md:text-base dark:text-black dark:hover:bg-gray-800 dark:hover:text-white"
            >
              Dashboard
            </Link>
            <div className="ml-2">
              <UserButton />
            </div>
          </div>
        </SignedIn>

        <SignedOut>
          <Link href="/sign-up">
            <button className="min-w-[100px] transform rounded-lg bg-black px-6 py-2.5 text-sm font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-gray-800 hover:shadow-lg md:min-w-[120px] md:text-base dark:bg-white dark:text-black dark:hover:bg-gray-200">
              Sign In
            </button>
          </Link>
        </SignedOut>
      </div>
    </nav>
  );
};