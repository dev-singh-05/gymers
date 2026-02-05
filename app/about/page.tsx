'use client';

import { motion } from 'framer-motion';
import { Heart, Target, Dumbbell, Users, Award, Instagram, Twitter, Linkedin, Github, Mail, ArrowLeft, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';

const stats = [
    { label: 'Active Members', value: '500+' },
    { label: 'Programs', value: '10+' },
    { label: 'Success Stories', value: '100+' },
    { label: 'Expert Coaches', value: '20+' },
];

const values = [
    {
        icon: Target,
        title: 'Mission Driven',
        description: 'Empowering individuals to achieve their fitness goals through innovative technology and personalized guidance.',
    },
    {
        icon: Heart,
        title: 'Passion for Fitness',
        description: 'We believe fitness is not just a routine, but a lifestyle that transforms lives and builds confidence.',
    },
    {
        icon: Users,
        title: 'Community First',
        description: 'Building a supportive community where members motivate each other and celebrate every achievement.',
    },
    {
        icon: Award,
        title: 'Excellence',
        description: 'Committed to delivering the best experience with cutting-edge features and premium quality.',
    },
];

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-neutral-950 text-white">
            <Navbar />

            {/* Hero Section */}
            <section className="relative pt-24 pb-20 px-4 overflow-hidden">
                {/* Background Effects */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-red-600/20 to-transparent rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-1/4 w-[600px] h-[300px] bg-red-600/10 rounded-full blur-3xl" />
                </div>

                <div className="relative max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-red-600/20 rounded-full text-red-400 text-sm font-medium mb-6"
                    >
                        <Sparkles className="w-4 h-4" />
                        About GYMERS
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="text-5xl md:text-7xl font-black mb-6"
                    >
                        BUILD YOUR
                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-700">
                            BEST SELF
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-xl text-neutral-400 max-w-2xl mx-auto mb-10"
                    >
                        GYMERS is more than a fitness platform – it&apos;s a movement. We combine cutting-edge technology with personalized workout programs to help you achieve your fitness dreams.
                    </motion.p>

                    {/* Stats */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="grid grid-cols-2 md:grid-cols-4 gap-4"
                    >
                        {stats.map((stat, index) => (
                            <div
                                key={stat.label}
                                className="bg-neutral-900/60 backdrop-blur-sm border border-white/10 rounded-xl p-4"
                            >
                                <p className="text-3xl md:text-4xl font-black text-red-500">{stat.value}</p>
                                <p className="text-neutral-400 text-sm">{stat.label}</p>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-20 px-4 bg-gradient-to-b from-transparent via-neutral-900/50 to-transparent">
                <div className="max-w-6xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-14"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Core Values</h2>
                        <p className="text-neutral-400 max-w-lg mx-auto">
                            The principles that drive everything we do at GYMERS
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {values.map((value, index) => (
                            <motion.div
                                key={value.title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-neutral-900/80 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:border-red-500/30 transition-colors group"
                            >
                                <div className="w-14 h-14 rounded-xl bg-red-600/20 flex items-center justify-center mb-4 group-hover:bg-red-600/30 transition-colors">
                                    <value.icon className="w-7 h-7 text-red-500" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">{value.title}</h3>
                                <p className="text-neutral-400 text-sm">{value.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Creator Section */}
            <section className="py-20 px-4">
                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="bg-gradient-to-br from-neutral-900 via-neutral-900 to-red-950/30 border border-white/10 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden"
                    >
                        {/* Glow Effect */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/20 rounded-full blur-3xl" />

                        <div className="relative">
                            <motion.div
                                initial={{ scale: 0.9 }}
                                whileInView={{ scale: 1 }}
                                viewport={{ once: true }}
                                className="w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-red-600 mx-auto mb-6 shadow-2xl shadow-red-900/50"
                            >
                                <img
                                    src="/creator_photo.jpeg"
                                    alt="Satyam Soni"
                                    className="w-full h-full object-cover"
                                />
                            </motion.div>

                            <p className="text-red-400 text-sm font-medium mb-2 uppercase tracking-wider">
                                Creator & Developer
                            </p>

                            <h3 className="text-4xl md:text-5xl font-black mb-4">
                                SATYAM SONI
                            </h3>

                            <p className="text-neutral-400 max-w-lg mx-auto mb-8">
                                Passionate about fitness and technology, I created GYMERS to help people achieve their fitness goals with a modern, user-friendly platform. Every feature is crafted with love and dedication.
                            </p>

                            {/* Social Links */}
                            <div className="flex items-center justify-center gap-4">
                                <a
                                    href="mailto:satyamsoni1903@gmail.com"
                                    className="w-12 h-12 rounded-full bg-neutral-800 hover:bg-red-600 flex items-center justify-center transition-colors"
                                >
                                    <Mail className="w-5 h-5" />
                                </a>
                                <a
                                    href="#"
                                    className="w-12 h-12 rounded-full bg-neutral-800 hover:bg-red-600 flex items-center justify-center transition-colors"
                                >
                                    <Instagram className="w-5 h-5" />
                                </a>
                                <a
                                    href="#"
                                    className="w-12 h-12 rounded-full bg-neutral-800 hover:bg-red-600 flex items-center justify-center transition-colors"
                                >
                                    <Linkedin className="w-5 h-5" />
                                </a>
                                <a
                                    href="#"
                                    className="w-12 h-12 rounded-full bg-neutral-800 hover:bg-red-600 flex items-center justify-center transition-colors"
                                >
                                    <Github className="w-5 h-5" />
                                </a>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="max-w-4xl mx-auto text-center"
                >
                    <Dumbbell className="w-12 h-12 text-red-500 mx-auto mb-6" />
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Ready to Start Your Journey?
                    </h2>
                    <p className="text-neutral-400 mb-8 max-w-lg mx-auto">
                        Join THE GYMERS community today and transform your life with our expert-designed programs.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            href="/programs"
                            className="px-8 py-3.5 bg-red-600 hover:bg-red-500 rounded-full font-bold transition-colors"
                        >
                            Explore Programs
                        </Link>
                        <Link
                            href="/grp"
                            className="px-8 py-3.5 bg-neutral-800 hover:bg-neutral-700 border border-white/10 rounded-full font-bold transition-colors"
                        >
                            Join Community
                        </Link>
                    </div>
                </motion.div>
            </section>

            {/* Back Link */}
            <div className="text-center pb-12">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-neutral-500 hover:text-white text-sm transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Home
                </Link>
            </div>
        </main>
    );
}
