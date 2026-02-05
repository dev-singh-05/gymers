'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, LogIn } from 'lucide-react';
import { useProgramStore } from '@/lib/programStore';
import { useState, useEffect } from 'react';
import { getCurrentUser } from '@/lib/auth';
import { joinProgram, isUserJoined } from '@/lib/db';
import Link from 'next/link';
import type { User } from '@supabase/supabase-js';

interface Program {
    id: string;
    title: string;
    description: string;
    fullDescription: string;
    price: number;
    imageUrl: string;
}

interface ProgramModalProps {
    program: Program | null;
    isOpen: boolean;
    onClose: () => void;
}

export function ProgramModal({ program, isOpen, onClose }: ProgramModalProps) {
    const { addProgram, isJoined } = useProgramStore();
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(false);
    const [dbJoined, setDbJoined] = useState(false);

    useEffect(() => {
        getCurrentUser().then(setCurrentUser);
    }, []);

    // Check if user already joined this program in database
    useEffect(() => {
        if (currentUser && program) {
            isUserJoined(currentUser.id, program.id).then(setDbJoined);
        }
    }, [currentUser, program]);

    if (!program) return null;

    const localJoined = isJoined(program.id);
    const joined = localJoined || dbJoined;

    const handleJoin = async () => {
        if (!currentUser || joined) return;

        setLoading(true);
        try {
            // Save to database
            await joinProgram(currentUser.id, program.id, program.title, program.price);

            // Also save to local store for immediate UI update
            addProgram({
                id: program.id,
                name: program.title,
                price: program.price,
            });

            setDbJoined(true);
        } catch (error) {
            console.error('Error joining program:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(price);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
                        onClick={onClose}
                    />

                    {/* Modal */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
                    >
                        <div
                            className="relative bg-neutral-900 border border-neutral-800 rounded-lg w-full max-w-lg p-6 md:p-8 pointer-events-auto shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className="absolute top-4 right-4 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                            >
                                <X size={24} />
                            </button>

                            {/* Program Title */}
                            <h2 className="text-red-500 text-2xl md:text-3xl font-black italic uppercase tracking-wide mb-4">
                                {program.title}
                            </h2>

                            {/* Price Badge */}
                            <div className="inline-block bg-red-600/20 border border-red-600/40 text-red-400 px-4 py-1.5 rounded-full text-sm font-bold mb-5">
                                {formatPrice(program.price)}/month
                            </div>

                            {/* Full Description */}
                            <p className="text-neutral-300 text-base leading-relaxed mb-6">
                                {program.fullDescription}
                            </p>

                            {/* Action Button */}
                            {currentUser ? (
                                <button
                                    onClick={handleJoin}
                                    disabled={joined || loading}
                                    className={`
                                        w-full py-3 px-6 font-bold uppercase tracking-wider text-sm
                                        transition-all duration-300 cursor-pointer
                                        flex items-center justify-center gap-2
                                        ${joined
                                            ? 'bg-green-600 text-white cursor-default'
                                            : 'bg-red-600 hover:bg-red-700 text-white hover:scale-[1.02] active:scale-[0.98]'
                                        }
                                        disabled:opacity-70
                                    `}
                                >
                                    {loading ? (
                                        'Joining...'
                                    ) : joined ? (
                                        <>
                                            <Check size={18} />
                                            Already Joined
                                        </>
                                    ) : (
                                        'Join Now'
                                    )}
                                </button>
                            ) : (
                                <div className="space-y-3">
                                    <div className="bg-neutral-800/50 border border-white/10 rounded-lg p-4 text-center">
                                        <p className="text-neutral-400 text-sm mb-3">
                                            Sign in to join this program
                                        </p>
                                        <Link
                                            href="/login"
                                            onClick={onClose}
                                            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-6 py-2.5 rounded-lg font-bold transition-colors"
                                        >
                                            <LogIn size={18} />
                                            Sign In
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
