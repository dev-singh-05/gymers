'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, Star, X } from 'lucide-react';
import { Navbar } from '@/components/Navbar';

interface Testimonial {
    id: string;
    name: string;
    role: string;
    avatar: string;
    rating: number;
    shortQuote: string;
    fullQuote: string;
    program: string;
    imageUrl: string;
}

const testimonials: Testimonial[] = [
    {
        id: '1',
        name: 'Rahul Sharma',
        role: 'Software Engineer',
        avatar: 'RS',
        rating: 5,
        shortQuote: 'Lost 15kg in 3 months! The trainers here are absolutely amazing.',
        fullQuote: 'I was skeptical at first, but THE GYMERS completely transformed my life. Lost 15kg in just 3 months with their personalized training program. The trainers are supportive, knowledgeable, and always push you to do your best. Best decision I ever made!',
        program: 'Weight Loss',
        imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80',
    },
    {
        id: '2',
        name: 'Priya Patel',
        role: 'Marketing Manager',
        avatar: 'PP',
        rating: 5,
        shortQuote: 'The yoga classes here brought peace to my chaotic life.',
        fullQuote: 'As a busy marketing professional, I was stressed out constantly. The yoga program at THE GYMERS helped me find balance. Sofia is an incredible instructor who truly understands what each student needs. My flexibility and mental health have improved dramatically.',
        program: 'Yoga',
        imageUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80',
    },
    {
        id: '3',
        name: 'Amit Kumar',
        role: 'Business Owner',
        avatar: 'AK',
        rating: 5,
        shortQuote: 'Built serious muscle mass with their bodybuilding program.',
        fullQuote: 'Coach David knows exactly what he\'s doing. I went from skinny to having a physique I\'m proud of. The personalized meal plans and workout routines are top-notch. The gym equipment is world-class and always clean. Highly recommend!',
        program: 'Body Building',
        imageUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80',
    },
    {
        id: '4',
        name: 'Sneha Reddy',
        role: 'Doctor',
        avatar: 'SR',
        rating: 5,
        shortQuote: 'CrossFit here is challenging but incredibly rewarding!',
        fullQuote: 'Matt\'s CrossFit classes are intense but in the best way possible. As a doctor, I understand the importance of functional fitness. The community here is supportive and everyone pushes each other to be better. I\'ve never been stronger or more confident.',
        program: 'CrossFit',
        imageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80',
    },
    {
        id: '5',
        name: 'Vikram Singh',
        role: 'Athlete',
        avatar: 'VS',
        rating: 5,
        shortQuote: 'The strength training program elevated my game completely.',
        fullQuote: 'As a competitive athlete, I needed a gym that could keep up with my intensity. THE GYMERS exceeded my expectations. James helped me add 50kg to my deadlift in just 4 months. The facility has everything I need and more.',
        program: 'Strength Training',
        imageUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80',
    },
    {
        id: '6',
        name: 'Ananya Gupta',
        role: 'College Student',
        avatar: 'AG',
        rating: 5,
        shortQuote: 'HIIT sessions helped me get in the best shape of my life!',
        fullQuote: 'Emma\'s HIIT classes are absolutely killer! I\'ve tried many gyms but nothing compares to THE GYMERS. The energy in every session is unmatched. Lost fat, gained muscle, and made amazing friends. Affordable student rates too!',
        program: 'HIIT',
        imageUrl: 'https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=200&q=80',
    },
    {
        id: '7',
        name: 'Rajesh Menon',
        role: 'Retired Teacher',
        avatar: 'RM',
        rating: 5,
        shortQuote: 'Great for all ages! Found a new passion for fitness at 60.',
        fullQuote: 'I thought I was too old to start working out, but THE GYMERS proved me wrong. The trainers are patient and modified exercises for my needs. My blood pressure is down, energy is up, and I feel 20 years younger. Age is just a number!',
        program: 'Cardio',
        imageUrl: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=200&q=80',
    },
    {
        id: '8',
        name: 'Meera Joshi',
        role: 'Nutritionist',
        avatar: 'MJ',
        rating: 5,
        shortQuote: 'Their holistic approach to fitness is exactly what people need.',
        fullQuote: 'As a nutritionist, I appreciate that THE GYMERS understands fitness is more than just exercise. Lisa and the team provide comprehensive wellness guidance. I refer all my clients here knowing they\'ll be in good hands. Professional and caring staff!',
        program: 'Fitness',
        imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80',
    },
    {
        id: '9',
        name: 'Arjun Nair',
        role: 'IT Professional',
        avatar: 'AN',
        rating: 4,
        shortQuote: 'Fixed my posture issues from years of desk work!',
        fullQuote: 'Years of sitting at a desk destroyed my back. The team at THE GYMERS created a program specifically for my issues. Sarah\'s Pilates helped strengthen my core and the improvement is remarkable. No more back pain!',
        program: 'Pilates',
        imageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&q=80',
    },
    {
        id: '10',
        name: 'Kavya Krishnan',
        role: 'Dancer',
        avatar: 'KK',
        rating: 5,
        shortQuote: 'Perfect supplement to my dance training. Flexibility improved 100%!',
        fullQuote: 'As a professional dancer, I need to maintain peak flexibility and strength. THE GYMERS yoga and Pilates programs are perfect for what I need. The trainers understand my unique requirements and adapt accordingly. My performances have improved significantly!',
        program: 'Yoga',
        imageUrl: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=200&q=80',
    },
    {
        id: '11',
        name: 'Suresh Iyer',
        role: 'Entrepreneur',
        avatar: 'SI',
        rating: 5,
        shortQuote: 'Invested in my health, best ROI I ever got!',
        fullQuote: 'Running a business is stressful and I neglected my health for years. THE GYMERS boxing program with Chris is my stress relief and cardio wrapped in one. I\'m sharper in meetings and have more energy throughout the day. Worth every rupee!',
        program: 'Boxing',
        imageUrl: 'https://images.unsplash.com/photo-1480455624313-e29b44bbfde1?w=200&q=80',
    },
    {
        id: '12',
        name: 'Deepika Rao',
        role: 'New Mother',
        avatar: 'DR',
        rating: 5,
        shortQuote: 'Got my pre-pregnancy body back and then some!',
        fullQuote: 'After having my baby, I felt like I\'d never get back in shape. Rosy designed a post-pregnancy program that was safe and effective. The gym has excellent childcare options too! I\'m now stronger than I was before pregnancy. So grateful!',
        program: 'Fitness',
        imageUrl: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&q=80',
    },
    {
        id: '13',
        name: 'Karan Malhotra',
        role: 'Film Actor',
        avatar: 'KM',
        rating: 5,
        shortQuote: 'Got screen-ready in 8 weeks for my action role!',
        fullQuote: 'Needed to transform for a movie role and had only 8 weeks. THE GYMERS team created an intensive program combining weight training, HIIT, and strict nutrition. The results were phenomenal and got praised by the director. My go-to gym now!',
        program: 'Body Building',
        imageUrl: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=200&q=80',
    },
    {
        id: '14',
        name: 'Aisha Khan',
        role: 'Fashion Designer',
        avatar: 'AK',
        rating: 4,
        shortQuote: 'Love the vibe here! Working out finally feels fun.',
        fullQuote: 'I always hated gyms - too boring, too intimidating. THE GYMERS changed that completely. The atmosphere is welcoming, the music is great, and the group classes are so fun! I actually look forward to working out now. Who knew that was possible?',
        program: 'HIIT',
        imageUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80',
    },
    {
        id: '15',
        name: 'Nikhil Agarwal',
        role: 'Pilot',
        avatar: 'NA',
        rating: 5,
        shortQuote: 'Essential for maintaining the fitness required for my job.',
        fullQuote: 'Pilots need to maintain strict health standards. THE GYMERS helps me stay in peak condition with their comprehensive cardio program. Michael understands the specific requirements of my profession and tailors workouts accordingly. Indispensable for my career!',
        program: 'Cardio',
        imageUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200&q=80',
    },
    {
        id: '16',
        name: 'Ritu Bhatia',
        role: 'Homemaker',
        avatar: 'RB',
        rating: 5,
        shortQuote: 'Finally made time for myself and the results are incredible!',
        fullQuote: 'As a homemaker, I always put others first. THE GYMERS flexible timings allowed me to finally prioritize my health. Nicole\'s weight loss program gave me structure and accountability. I\'ve lost 12kg and gained so much confidence. My family is so proud!',
        program: 'Weight Loss',
        imageUrl: 'https://images.unsplash.com/photo-1558898479-33c0057a5d12?w=200&q=80',
    },
];

export default function TestimonialsPage() {
    const [selectedTestimonial, setSelectedTestimonial] = useState<Testimonial | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleCardClick = (testimonial: Testimonial) => {
        setSelectedTestimonial(testimonial);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setTimeout(() => setSelectedTestimonial(null), 300);
    };

    return (
        <main className="min-h-screen bg-neutral-950 text-white">
            <Navbar />

            {/* Page Header */}
            <motion.section
                initial={{ opacity: 0, y: -30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="pt-28 pb-12 px-4 md:px-12"
            >
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black uppercase tracking-tight">
                        What Our <span className="text-red-600 italic">Members</span> Say
                    </h1>
                    <p className="text-neutral-400 text-lg mt-4 max-w-2xl mx-auto">
                        Real stories from real people who transformed their lives with THE GYMERS
                    </p>
                </div>
            </motion.section>

            {/* Testimonials Grid */}
            <section className="px-4 md:px-12 pb-20">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {testimonials.map((testimonial, index) => (
                            <motion.div
                                key={testimonial.id}
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.5,
                                    delay: index * 0.08,
                                    ease: [0.25, 0.46, 0.45, 0.94],
                                }}
                                whileHover={{ y: -8, scale: 1.02 }}
                                onClick={() => handleCardClick(testimonial)}
                                className="group relative bg-neutral-900 rounded-xl p-6 border border-neutral-800 hover:border-red-600/50 transition-all duration-300 cursor-pointer"
                            >
                                {/* Quote Icon */}
                                <Quote className="absolute top-4 right-4 w-8 h-8 text-red-600/20 group-hover:text-red-600/40 transition-colors" />

                                {/* Avatar & Name */}
                                <div className="flex items-center gap-4 mb-4">
                                    <div
                                        className="w-14 h-14 rounded-full bg-cover bg-center border-2 border-red-600"
                                        style={{ backgroundImage: `url(${testimonial.imageUrl})` }}
                                    />
                                    <div>
                                        <h3 className="font-bold text-white">{testimonial.name}</h3>
                                        <p className="text-neutral-500 text-sm">{testimonial.role}</p>
                                    </div>
                                </div>

                                {/* Rating */}
                                <div className="flex gap-1 mb-3">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`w-4 h-4 ${i < testimonial.rating
                                                ? 'text-yellow-500 fill-yellow-500'
                                                : 'text-neutral-700'
                                                }`}
                                        />
                                    ))}
                                </div>

                                {/* Short Quote */}
                                <p className="text-neutral-300 text-sm leading-relaxed mb-4">
                                    "{testimonial.shortQuote}"
                                </p>

                                {/* Program Badge */}
                                <span className="inline-block px-3 py-1 bg-red-600/20 text-red-500 text-xs font-semibold rounded-full">
                                    {testimonial.program}
                                </span>

                                {/* Read More Hint */}
                                <p className="text-neutral-500 text-xs mt-4 group-hover:text-red-500 transition-colors">
                                    Click to read more →
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonial Modal */}
            <AnimatePresence>
                {isModalOpen && selectedTestimonial && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.25 }}
                            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
                            onClick={handleCloseModal}
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
                                className="relative bg-neutral-900 border border-neutral-800 rounded-xl w-full max-w-lg p-8 pointer-events-auto shadow-2xl"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {/* Close Button */}
                                <button
                                    onClick={handleCloseModal}
                                    className="absolute top-4 right-4 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                                >
                                    <X size={24} />
                                </button>

                                {/* Quote Icon */}
                                <Quote className="w-12 h-12 text-red-600 mb-6" />

                                {/* Full Quote */}
                                <p className="text-white text-lg leading-relaxed mb-8">
                                    "{selectedTestimonial.fullQuote}"
                                </p>

                                {/* Rating */}
                                <div className="flex gap-1 mb-6">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`w-5 h-5 ${i < selectedTestimonial.rating
                                                ? 'text-yellow-500 fill-yellow-500'
                                                : 'text-neutral-700'
                                                }`}
                                        />
                                    ))}
                                </div>

                                {/* Author Info */}
                                <div className="flex items-center gap-4">
                                    <div
                                        className="w-16 h-16 rounded-full bg-cover bg-center border-2 border-red-600"
                                        style={{ backgroundImage: `url(${selectedTestimonial.imageUrl})` }}
                                    />
                                    <div>
                                        <h3 className="font-bold text-white text-xl">
                                            {selectedTestimonial.name}
                                        </h3>
                                        <p className="text-neutral-400">{selectedTestimonial.role}</p>
                                        <span className="inline-block mt-2 px-3 py-1 bg-red-600/20 text-red-500 text-xs font-semibold rounded-full">
                                            {selectedTestimonial.program} Program
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </main>
    );
}
