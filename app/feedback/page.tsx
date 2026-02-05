'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Star, Send, Loader2, CheckCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { supabase } from '@/lib/supabase';
import { getCurrentUser } from '@/lib/auth';

export default function FeedbackPage() {
    const [rating, setRating] = useState(0);
    const [hoveredRating, setHoveredRating] = useState(0);
    const [message, setMessage] = useState('');
    const [category, setCategory] = useState('general');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const categories = [
        { value: 'general', label: 'General' },
        { value: 'feature', label: 'Feature Request' },
        { value: 'bug', label: 'Bug Report' },
        { value: 'improvement', label: 'Improvement' },
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim()) {
            setError('Please enter your feedback');
            return;
        }
        if (rating === 0) {
            setError('Please select a rating');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const user = await getCurrentUser();

            const { error: insertError } = await supabase
                .from('feedbacks')
                .insert({
                    user_id: user?.id || null,
                    user_email: user?.email || 'Anonymous',
                    rating,
                    category,
                    message: message.trim(),
                });

            if (insertError) throw insertError;

            setSuccess(true);
            setRating(0);
            setMessage('');
        } catch (err: any) {
            console.error('Error submitting feedback:', err);
            setError('Failed to submit feedback. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <main className="min-h-screen bg-neutral-950 text-white">
                <Navbar />
                <div className="pt-24 flex flex-col items-center justify-center min-h-[80vh] px-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center"
                    >
                        <div className="w-20 h-20 rounded-full bg-green-600/20 flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="w-10 h-10 text-green-500" />
                        </div>
                        <h1 className="text-3xl font-bold mb-3">Thank You!</h1>
                        <p className="text-neutral-400 mb-8 max-w-sm">
                            Your feedback has been submitted successfully. We appreciate your input!
                        </p>
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-8 py-3 rounded-full font-bold transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Back to Home
                        </Link>
                    </motion.div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-neutral-950 text-white">
            <Navbar />

            {/* Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-red-600/5 rounded-full blur-3xl" />
            </div>

            <div className="relative pt-24 px-4 pb-12">
                <div className="max-w-xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-10"
                    >
                        <div className="w-16 h-16 rounded-full bg-red-600/20 flex items-center justify-center mx-auto mb-4">
                            <MessageSquare className="w-8 h-8 text-red-500" />
                        </div>
                        <h1 className="text-4xl font-bold mb-3">Give Feedback</h1>
                        <p className="text-neutral-400">
                            Help us improve GYMERS with your valuable feedback
                        </p>
                    </motion.div>

                    <motion.form
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        onSubmit={handleSubmit}
                        className="bg-neutral-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8"
                    >
                        {/* Rating */}
                        <div className="mb-6">
                            <label className="block text-neutral-300 font-medium mb-3">
                                How would you rate your experience?
                            </label>
                            <div className="flex gap-2 justify-center">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => setRating(star)}
                                        onMouseEnter={() => setHoveredRating(star)}
                                        onMouseLeave={() => setHoveredRating(0)}
                                        className="p-1 transition-transform hover:scale-110"
                                    >
                                        <Star
                                            className={`w-10 h-10 transition-colors ${star <= (hoveredRating || rating)
                                                    ? 'fill-yellow-500 text-yellow-500'
                                                    : 'text-neutral-600'
                                                }`}
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Category */}
                        <div className="mb-6">
                            <label className="block text-neutral-300 font-medium mb-3">
                                Category
                            </label>
                            <div className="flex flex-wrap gap-2">
                                {categories.map((cat) => (
                                    <button
                                        key={cat.value}
                                        type="button"
                                        onClick={() => setCategory(cat.value)}
                                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${category === cat.value
                                                ? 'bg-red-600 text-white'
                                                : 'bg-neutral-800 text-neutral-400 hover:text-white'
                                            }`}
                                    >
                                        {cat.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Message */}
                        <div className="mb-6">
                            <label className="block text-neutral-300 font-medium mb-3">
                                Your Feedback
                            </label>
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Tell us what you think..."
                                rows={5}
                                className="w-full bg-neutral-800/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-neutral-500 focus:outline-none focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20 transition-all resize-none"
                            />
                        </div>

                        {/* Error */}
                        {error && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="bg-red-500/20 border border-red-500/30 rounded-lg p-3 mb-6"
                            >
                                <p className="text-red-400 text-sm">{error}</p>
                            </motion.div>
                        )}

                        {/* Submit */}
                        <motion.button
                            type="submit"
                            disabled={loading}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-red-900/30 transition-all disabled:opacity-50"
                        >
                            {loading ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <>
                                    <Send className="w-5 h-5" />
                                    Submit Feedback
                                </>
                            )}
                        </motion.button>
                    </motion.form>

                    {/* Back Link */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-center mt-6"
                    >
                        <Link
                            href="/"
                            className="text-neutral-500 hover:text-white text-sm transition-colors"
                        >
                            ← Back to Home
                        </Link>
                    </motion.div>
                </div>
            </div>
        </main>
    );
}
