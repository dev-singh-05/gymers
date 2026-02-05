'use client';

import { useState, useRef, useCallback } from 'react';
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, RotateCcw, Loader2 } from 'lucide-react';
import 'react-image-crop/dist/ReactCrop.css';

interface ImageCropModalProps {
    imageUrl: string;
    isOpen: boolean;
    onClose: () => void;
    onCropComplete: (croppedBlob: Blob) => void;
    loading?: boolean;
}

function centerAspectCrop(mediaWidth: number, mediaHeight: number, aspect: number) {
    return centerCrop(
        makeAspectCrop(
            {
                unit: '%',
                width: 90,
            },
            aspect,
            mediaWidth,
            mediaHeight
        ),
        mediaWidth,
        mediaHeight
    );
}

export function ImageCropModal({ imageUrl, isOpen, onClose, onCropComplete, loading }: ImageCropModalProps) {
    const [crop, setCrop] = useState<Crop>();
    const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
    const imgRef = useRef<HTMLImageElement>(null);
    const aspect = 1; // 1:1 for profile photos

    const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
        const { width, height } = e.currentTarget;
        setCrop(centerAspectCrop(width, height, aspect));
    }, []);

    const handleCropConfirm = async () => {
        if (!completedCrop || !imgRef.current) return;

        const image = imgRef.current;
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;

        const pixelRatio = window.devicePixelRatio || 1;
        const cropWidth = completedCrop.width * scaleX;
        const cropHeight = completedCrop.height * scaleY;

        canvas.width = cropWidth * pixelRatio;
        canvas.height = cropHeight * pixelRatio;

        ctx.scale(pixelRatio, pixelRatio);
        ctx.imageSmoothingQuality = 'high';

        ctx.drawImage(
            image,
            completedCrop.x * scaleX,
            completedCrop.y * scaleY,
            cropWidth,
            cropHeight,
            0,
            0,
            cropWidth,
            cropHeight
        );

        canvas.toBlob(
            (blob) => {
                if (blob) {
                    onCropComplete(blob);
                }
            },
            'image/jpeg',
            0.9
        );
    };

    const handleReset = () => {
        if (imgRef.current) {
            const { width, height } = imgRef.current;
            setCrop(centerAspectCrop(width, height, aspect));
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[60]"
                        onClick={onClose}
                    />
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="fixed inset-0 z-[60] flex items-center justify-center p-4"
                    >
                        <div
                            className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 max-w-md w-full"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="font-bold text-lg">Adjust Photo</h3>
                                <button
                                    onClick={onClose}
                                    className="text-neutral-400 hover:text-white p-1"
                                    disabled={loading}
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>

                            <div className="flex justify-center mb-4 bg-neutral-800 rounded-lg overflow-hidden">
                                <ReactCrop
                                    crop={crop}
                                    onChange={(_, percentCrop) => setCrop(percentCrop)}
                                    onComplete={(c) => setCompletedCrop(c)}
                                    aspect={aspect}
                                    circularCrop
                                    className="max-h-[60vh]"
                                >
                                    <img
                                        ref={imgRef}
                                        src={imageUrl}
                                        alt="Crop preview"
                                        onLoad={onImageLoad}
                                        className="max-h-[60vh] object-contain"
                                        crossOrigin="anonymous"
                                    />
                                </ReactCrop>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={handleReset}
                                    disabled={loading}
                                    className="flex-1 py-2.5 px-4 bg-neutral-800 hover:bg-neutral-700 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    <RotateCcw className="w-4 h-4" />
                                    Reset
                                </button>
                                <button
                                    onClick={handleCropConfirm}
                                    disabled={loading || !completedCrop}
                                    className="flex-1 py-2.5 px-4 bg-red-600 hover:bg-red-500 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {loading ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Uploading...
                                        </>
                                    ) : (
                                        <>
                                            <Check className="w-4 h-4" />
                                            Apply
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
