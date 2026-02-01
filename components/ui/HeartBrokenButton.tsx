"use client";

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

interface HeartBrokenButtonProps {
    className?: string;
    onClick?: () => void;
}

export const HeartBrokenButton: React.FC<HeartBrokenButtonProps> = ({
    className,
    onClick,
}) => {
    const router = useRouter();
    const buttonRef = useRef<HTMLButtonElement>(null);
    const [isBreaking, setIsBreaking] = useState(false);
    const [size, setSize] = useState<{ width: number; height: number } | null>(
        null
    );

    // Jagged heart-break clip paths
    const leftClip =
        "polygon(0% 0%, 50% 0%, 46% 38%, 55% 60%, 50% 100%, 0% 100%)";
    const rightClip =
        "polygon(50% 0%, 100% 0%, 100% 100%, 50% 100%, 55% 60%, 46% 38%)";

    const handleClick = () => {
        if (!buttonRef.current) return;

        const rect = buttonRef.current.getBoundingClientRect();
        setSize({ width: rect.width, height: rect.height });
        setIsBreaking(true);

        onClick?.();
    };

    return (
        <div
            className={`relative inline-block ${className}`}
            style={size ? { width: size.width, height: size.height } : undefined}
        >
            {/* Original Button (stays mounted, just hidden) */}
            <motion.button
                ref={buttonRef}
                className="px-8 py-3 bg-red-600 text-white font-bold rounded-full uppercase tracking-wide text-sm md:text-base shadow-lg shadow-red-900/40 w-full h-full cursor-pointer"
                whileHover={!isBreaking ? { scale: 1.05 } : {}}
                whileTap={!isBreaking ? { scale: 0.95 } : {}}
                onClick={handleClick}
                animate={{ opacity: isBreaking ? 0 : 1 }}
                transition={{ duration: 0.15 }}
            >
                Get Started
            </motion.button>

            {/* Broken Halves */}
            {isBreaking && size && (
                <>
                    {/* Left Half */}
                    <motion.div
                        className="absolute inset-0 bg-red-600 rounded-full flex items-center justify-center text-white font-bold uppercase tracking-wide shadow-lg shadow-red-900/40 cursor-pointer"
                        style={{ clipPath: leftClip }}
                        initial={{ x: 0, rotate: 0 }}
                        animate={{ x: -30, rotate: -18, opacity: 0 }}
                        transition={{ duration: 0.6, ease: "easeIn" }}
                    >
                        Get Started
                    </motion.div>

                    {/* Right Half */}
                    <motion.div
                        className="absolute inset-0 bg-red-600 rounded-full flex items-center justify-center text-white font-bold uppercase tracking-wide shadow-lg shadow-red-900/40"
                        style={{ clipPath: rightClip }}
                        initial={{ x: 0, rotate: 0 }}
                        animate={{ x: 30, rotate: 18, opacity: 0 }}
                        transition={{ duration: 0.6, ease: "easeIn" }}
                        onAnimationComplete={() => router.push("/programs")}
                    >
                        Get Started
                    </motion.div>
                </>
            )}
        </div>
    );
};
