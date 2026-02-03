'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X, Check } from 'lucide-react';
import { useProgramStore } from '@/lib/programStore';

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

    if (!program) return null;

    const joined = isJoined(program.id);

    const handleJoin = () => {
        if (!joined) {
            addProgram({
                id: program.id,
                name: program.title,
                price: program.price,
            });
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

                            {/* Join Button */}
                            <button
                                onClick={handleJoin}
                                disabled={joined}
                                className={`
                                    w-full py-3 px-6 font-bold uppercase tracking-wider text-sm
                                    transition-all duration-300 cursor-pointer
                                    flex items-center justify-center gap-2
                                    ${joined
                                        ? 'bg-green-600 text-white cursor-default'
                                        : 'bg-red-600 hover:bg-red-700 text-white hover:scale-[1.02] active:scale-[0.98]'
                                    }
                                `}
                            >
                                {joined ? (
                                    <>
                                        <Check size={18} />
                                        Already Joined
                                    </>
                                ) : (
                                    'Join Now'
                                )}
                            </button>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
