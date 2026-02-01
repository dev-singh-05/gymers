"use client";

import { Navbar } from "@/components/Navbar";
import { HeartBrokenButton } from "@/components/ui/HeartBrokenButton";
import Image from "next/image";
import { motion } from "framer-motion";
import { useState } from "react";

export default function Home() {
    const [activeWord, setActiveWord] = useState<string | null>(null);

    const wordBase =
        "relative block cursor-zoom-in transition-all duration-300";

    const spotlight =
        "before:absolute before:inset-[-20%] before:rounded-full before:bg-[radial-gradient(circle,rgba(255,255,255,0.15),transparent_70%)] before:opacity-0 before:transition-opacity before:duration-300";

    const isDimmed = (word: string) =>
        activeWord && activeWord !== word ? "opacity-40" : "opacity-100";

    return (
        <main className="relative h-screen bg-neutral-950 text-white overflow-hidden font-[family-name:var(--font-geist-sans)]">
            {/* Background Image */}
            <div className="absolute inset-0 z-0 overflow-hidden">
                <Image
                    src="/bg.png"
                    alt="Bodybuilder background"
                    fill
                    priority
                    className="
            object-cover
            opacity-60
            object-[40%_center]
            md:object-[65%_center]
          "
                />

                <div className="absolute inset-0 bg-gradient-to-l from-neutral-950/90 via-neutral-950/50 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent" />
            </div>

            {/* Navbar */}
            <Navbar />

            {/* Hero Content */}
            <section
                className="
          relative z-10
          h-[calc(100vh-72px)]
          flex items-center
          px-4 md:px-12
        "
            >
                <div className="w-full max-w-7xl mx-auto">
                    <div
                        className="
              max-w-3xl
              flex flex-col gap-6
              text-left
              items-start
              translate-y-6
              md:translate-y-12
              md:ml-[42%]
            "
                    >
                        {/* HEADLINE */}
                        <h1 className="uppercase font-black tracking-tighter leading-[0.82] text-5xl sm:text-6xl md:text-7xl lg:text-8xl">
                            {/* BUILT BY */}
                            <motion.span
                                onHoverStart={() => setActiveWord("built")}
                                onHoverEnd={() => setActiveWord(null)}
                                whileHover={{ scale: 1.08 }}
                                className={`
                  ${wordBase}
                  ${spotlight}
                  ${isDimmed("built")}
                  before:opacity-100
                `}
                            >
                                BUILT BY
                            </motion.span>

                            {/* DISCIPLINE */}
                            <motion.span
                                onHoverStart={() => setActiveWord("discipline")}
                                onHoverEnd={() => setActiveWord(null)}
                                whileHover={{ scale: 1.08 }}
                                className={`
                  ${wordBase}
                  ${spotlight}
                  ${isDimmed("discipline")}
                  text-red-600
                `}
                            >
                                DISCIPLINE
                            </motion.span>

                            {/* NOT LUCK */}
                            <motion.span
                                onHoverStart={() => setActiveWord("luck")}
                                onHoverEnd={() => setActiveWord(null)}
                                whileHover={{ scale: 1.08 }}
                                className={`
                  ${wordBase}
                  ${spotlight}
                  ${isDimmed("luck")}
                `}
                            >
                                NOT{" "}
                                <span className="text-red-600 italic">
                                    LUCK
                                </span>
                            </motion.span>
                        </h1>

                        {/* Description */}
                        <p className="text-neutral-300 text-base sm:text-lg md:text-xl font-light max-w-xl">
                            Join the elite community of fitness enthusiasts. Transform your
                            body and mind with our premium programs.
                        </p>

                        {/* Buttons */}
                        <div className="flex flex-wrap gap-4 mt-4">
                            <HeartBrokenButton />
                            <button
                                className="
                  px-8 py-3
                  bg-transparent
                  border border-white/20
                  text-white
                  font-bold
                  rounded-full
                  uppercase
                  tracking-wide
                  text-sm md:text-base
                  backdrop-blur-sm
                  transition-all duration-300
                  hover:bg-white/10 hover:border-white/40 hover:scale-105
                  active:scale-95
                  cursor-pointer
                "
                            >
                                About Us
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
