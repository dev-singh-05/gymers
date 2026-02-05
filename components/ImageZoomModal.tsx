'use client';

import { useState } from 'react';
import Zoom from 'react-medium-image-zoom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import 'react-medium-image-zoom/dist/styles.css';

interface ImageZoomModalProps {
    imageUrl: string;
    isOpen: boolean;
    onClose: () => void;
    alt?: string;
}

export function ImageZoomModal({ imageUrl, isOpen, onClose, alt = 'Profile photo' }: ImageZoomModalProps) {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/95 backdrop-blur-sm z-[70]"
                        onClick={onClose}
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="fixed inset-0 z-[70] flex items-center justify-center p-4"
                        onClick={onClose}
                    >
                        <button
                            onClick={onClose}
                            className="absolute top-4 right-4 text-white/70 hover:text-white p-2 z-[71]"
                        >
                            <X className="w-8 h-8" />
                        </button>

                        <div onClick={(e) => e.stopPropagation()}>
                            <Zoom>
                                <img
                                    src={imageUrl}
                                    alt={alt}
                                    className="max-w-[90vw] max-h-[85vh] rounded-lg object-contain"
                                />
                            </Zoom>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}

// Simple zoomable image component for inline use
export function ZoomableImage({
    src,
    alt = 'Image',
    className = ''
}: {
    src: string;
    alt?: string;
    className?: string;
}) {
    return (
        <Zoom>
            <img src={src} alt={alt} className={className} />
        </Zoom>
    );
}
