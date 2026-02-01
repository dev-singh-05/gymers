import Link from "next/link";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export const Logo = ({ className }: { className?: string }) => {
    return (
        <Link href="/" className={cn("flex items-center gap-2 group", className)}>
            <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
                className="relative flex items-center justify-center w-10 h-10 bg-gradient-to-br from-red-600 to-red-900 rounded-lg shadow-lg"
            >
                <span className="text-2xl font-black text-white italic tracking-tighter" style={{ fontFamily: 'var(--font-geist-sans)' }}>G</span>
            </motion.div>
            <span className="text-xl font-bold tracking-tight text-white uppercase italic">
                The <span className="text-red-500">Gymers</span>
            </span>
        </Link>
    );
};
