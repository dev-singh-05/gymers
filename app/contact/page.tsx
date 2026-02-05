'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Loader2, CheckCircle, ArrowLeft, MessageCircle, Clock } from 'lucide-react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';

export default function ContactPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!name.trim() || !email.trim() || !message.trim()) {
            setError('Please fill in all required fields');
            return;
        }

        setLoading(true);
        setError(null);

        // Create mailto link and open it
        const mailtoSubject = encodeURIComponent(subject || `Contact from ${name}`);
        const mailtoBody = encodeURIComponent(
            `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`
        );

        const mailtoLink = `mailto:satyamsoni1903@gmail.com?subject=${mailtoSubject}&body=${mailtoBody}`;

        // Open mail client
        window.location.href = mailtoLink;

        // Show success after a brief delay
        setTimeout(() => {
            setLoading(false);
            setSuccess(true);
        }, 1000);
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
                        <h1 className="text-3xl font-bold mb-3">Email Client Opened!</h1>
                        <p className="text-neutral-400 mb-8 max-w-sm">
                            Please send the email from your mail client. We&apos;ll get back to you soon!
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
                <div className="absolute top-1/3 left-1/3 w-[500px] h-[500px] bg-red-600/10 rounded-full blur-3xl" />
                <div className="absolute bottom-1/3 right-1/3 w-[400px] h-[400px] bg-red-600/5 rounded-full blur-3xl" />
            </div>

            <div className="relative pt-24 px-4 pb-12">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-12"
                    >
                        <div className="w-16 h-16 rounded-full bg-red-600/20 flex items-center justify-center mx-auto mb-4">
                            <MessageCircle className="w-8 h-8 text-red-500" />
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">Get In Touch</h1>
                        <p className="text-neutral-400 max-w-lg mx-auto">
                            Have questions or suggestions? We&apos;d love to hear from you. Send us a message and we&apos;ll respond as soon as possible.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
                        {/* Contact Info */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="space-y-6"
                        >
                            <div className="bg-neutral-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                                <h2 className="text-2xl font-bold mb-6">Contact Information</h2>

                                <div className="space-y-5">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-full bg-red-600/20 flex items-center justify-center flex-shrink-0">
                                            <Mail className="w-5 h-5 text-red-500" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-white">Email</p>
                                            <a
                                                href="mailto:satyamsoni1903@gmail.com"
                                                className="text-neutral-400 hover:text-red-400 transition-colors"
                                            >
                                                satyamsoni1903@gmail.com
                                            </a>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-full bg-red-600/20 flex items-center justify-center flex-shrink-0">
                                            <Clock className="w-5 h-5 text-red-500" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-white">Response Time</p>
                                            <p className="text-neutral-400">Within 24-48 hours</p>
                                        </div>
                                    </div>

                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-full bg-red-600/20 flex items-center justify-center flex-shrink-0">
                                            <MapPin className="w-5 h-5 text-red-500" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-white">Location</p>
                                            <p className="text-neutral-400">India</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Links */}
                            <div className="bg-gradient-to-br from-red-600/20 to-red-900/20 border border-red-500/20 rounded-2xl p-6">
                                <h3 className="font-bold mb-4">Quick Links</h3>
                                <div className="space-y-2">
                                    <Link href="/feedback" className="block text-neutral-300 hover:text-white transition-colors">
                                        → Give Feedback
                                    </Link>
                                    <Link href="/about" className="block text-neutral-300 hover:text-white transition-colors">
                                        → About Us
                                    </Link>
                                    <Link href="/programs" className="block text-neutral-300 hover:text-white transition-colors">
                                        → View Programs
                                    </Link>
                                </div>
                            </div>
                        </motion.div>

                        {/* Contact Form */}
                        <motion.form
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                            onSubmit={handleSubmit}
                            className="bg-neutral-900/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8"
                        >
                            <h2 className="text-2xl font-bold mb-6">Send a Message</h2>

                            <div className="space-y-5">
                                {/* Name */}
                                <div>
                                    <label className="block text-neutral-400 text-sm mb-2">
                                        Your Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="John Doe"
                                        className="w-full bg-neutral-800/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-neutral-500 focus:outline-none focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20 transition-all"
                                    />
                                </div>

                                {/* Email */}
                                <div>
                                    <label className="block text-neutral-400 text-sm mb-2">
                                        Your Email *
                                    </label>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="you@example.com"
                                        className="w-full bg-neutral-800/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-neutral-500 focus:outline-none focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20 transition-all"
                                    />
                                </div>

                                {/* Subject */}
                                <div>
                                    <label className="block text-neutral-400 text-sm mb-2">
                                        Subject
                                    </label>
                                    <input
                                        type="text"
                                        value={subject}
                                        onChange={(e) => setSubject(e.target.value)}
                                        placeholder="How can we help?"
                                        className="w-full bg-neutral-800/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-neutral-500 focus:outline-none focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20 transition-all"
                                    />
                                </div>

                                {/* Message */}
                                <div>
                                    <label className="block text-neutral-400 text-sm mb-2">
                                        Message *
                                    </label>
                                    <textarea
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        placeholder="Your message..."
                                        rows={5}
                                        className="w-full bg-neutral-800/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-neutral-500 focus:outline-none focus:border-red-500/50 focus:ring-2 focus:ring-red-500/20 transition-all resize-none"
                                    />
                                </div>

                                {/* Error */}
                                {error && (
                                    <div className="bg-red-500/20 border border-red-500/30 rounded-lg p-3">
                                        <p className="text-red-400 text-sm">{error}</p>
                                    </div>
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
                                            Send Message
                                        </>
                                    )}
                                </motion.button>
                            </div>
                        </motion.form>
                    </div>

                    {/* Back Link */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-center mt-10"
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
