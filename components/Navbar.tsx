"use client";

import { motion } from "framer-motion";
import { User, Menu, ClipboardList } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Logo } from "@/components/ui/Logo";
import { cn } from "@/lib/utils";

const navItems = [
    { name: "Home", href: "/" },
    { name: "Program", href: "/program" },
    { name: "Grp", href: "/grp" },
    { name: "Plans", href: "/plans" },
    { name: "Testimonials", href: "/testimonials" },
];

export const Navbar = () => {
    const [active, setActive] = useState("Home");
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 py-2 px-6 md:px-12 transition-all duration-300">
            <div className="absolute inset-0 bg-neutral-950/80 backdrop-blur-md border-b border-white/5 shadow-xl" />

            <div className="relative mx-auto max-w-7xl flex items-center justify-between">
                {/* Left: Logo */}
                <Logo />

                {/* Center: Navigation - Desktop */}
                <div className="hidden md:flex items-center gap-1 bg-neutral-900/50 p-1 rounded-full border border-white/5 shadow-inner">
                    {navItems.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                "relative px-4 py-1.5 rounded-full text-sm font-medium transition-colors duration-200",
                                active === item.name ? "text-white" : "text-neutral-400 hover:text-white"
                            )}
                            onMouseEnter={() => setActive(item.name)}
                        >
                            {active === item.name && (
                                <motion.div
                                    layoutId="nav-pill"
                                    className="absolute inset-0 bg-red-600 rounded-full shadow-lg shadow-red-900/40"
                                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                                />
                            )}
                            <span className="relative z-10">{item.name}</span>
                        </Link>
                    ))}
                </div>

                {/* Right: Widgets & Actions */}
                <div className="flex items-center gap-4">
                    {/* Todo Icon Placeholder */}
                    <button className="p-2 rounded-full hover:bg-white/5 text-neutral-400 hover:text-white transition-colors" title="To-Do List">
                        <ClipboardList className="w-5 h-5" />
                    </button>

                    <button className="relative group p-2 rounded-full hover:bg-white/5 transition-colors">
                        <div className="absolute inset-0 bg-red-500/20 rounded-full blur opacity-0 group-hover:opacity-100 transition-opacity" />
                        <div className="w-9 h-9 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center overflow-hidden">
                            <User className="w-4 h-4 text-neutral-300" />
                        </div>
                        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-neutral-950 rounded-full" />
                    </button>

                    {/* Mobile Menu Toggle */}
                    <button
                        className="md:hidden p-2 text-white"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                </div>
            </div>
        </nav>
    );
};
