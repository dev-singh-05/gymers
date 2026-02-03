'use client';

import { Navbar } from '@/components/Navbar';
import { ProgramsGrid } from '@/components/programs/ProgramsGrid';
import { motion } from 'framer-motion';

export default function ProgramsPage() {
    return (
        <main className="min-h-screen bg-neutral-950 text-white">
            {/* Navbar */}
            <Navbar />

            {/* Page Header */}
            <motion.section
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="pt-24 pb-10 px-4 md:px-12"
            >
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight">
                        Our <span className="text-red-600 italic">Programs</span>
                    </h1>
                    <p className="text-neutral-400 text-lg mt-4 max-w-2xl mx-auto">
                        Choose from our wide range of fitness programs designed to help you achieve your goals
                    </p>
                </div>
            </motion.section>

            {/* Programs Grid */}
            <section className="pb-16">
                <div className="max-w-7xl mx-auto">
                    <ProgramsGrid />
                </div>
            </section>
        </main>
    );
}
