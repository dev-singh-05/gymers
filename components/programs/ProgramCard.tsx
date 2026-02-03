'use client';

import { motion } from 'framer-motion';

interface ProgramCardProps {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    index: number;
    onReadMore: () => void;
}

export function ProgramCard({
    title,
    description,
    imageUrl,
    index,
    onReadMore,
}: ProgramCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 70 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.03 }}
            transition={{
                duration: 0.6,
                delay: index * 0.12,
                ease: [0.25, 0.46, 0.45, 0.94],
                scale: { duration: 0.3 }
            }}
            className="relative overflow-hidden group cursor-pointer"
            style={{ minHeight: '420px' }}
        >
            {/* Background Image */}
            <div
                className="absolute inset-0"
                style={{
                    backgroundImage: `url(${imageUrl})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            />

            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-colors duration-300" />

            {/* Content - Stays Normal */}
            <div className="relative z-10 h-full flex flex-col justify-end p-6 md:p-8">
                {/* Title */}
                <h3 className="text-red-500 text-2xl md:text-3xl font-black italic uppercase tracking-wide mb-3">
                    {title}
                </h3>

                {/* Description */}
                <p className="text-neutral-300 text-sm md:text-base leading-relaxed mb-5 max-w-md">
                    {description}
                </p>

                {/* Read More Button */}
                <button
                    onClick={onReadMore}
                    className="read-more-btn relative overflow-hidden w-fit px-6 py-2.5 text-white text-sm font-bold uppercase tracking-wider border-2 border-red-600 bg-red-600 transition-colors duration-300 cursor-pointer"
                >
                    <span className="relative z-10">Read More</span>
                </button>
            </div>
        </motion.div>
    );
}
