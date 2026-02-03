'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, X, Phone } from 'lucide-react';
import { Navbar } from '@/components/Navbar';

interface Trainer {
    id: string;
    name: string;
    role: string;
    description: string;
    fullBio: string;
    phone: string;
    imageUrl: string;
}

const trainers: Trainer[] = [
    {
        id: '1',
        name: 'David Williams',
        role: 'Body Builder Coach',
        description: 'Expert in muscle building and strength training with 10+ years of experience.',
        fullBio: 'David is a certified bodybuilding coach with over 10 years of experience helping athletes achieve their physique goals. He specializes in hypertrophy training, contest prep, and natural bodybuilding techniques.',
        phone: '+91 98765 43210',
        imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&q=80',
    },
    {
        id: '2',
        name: 'Rosy Rivera',
        role: 'Fitness Coach',
        description: 'Specializing in functional fitness and women\'s health programs.',
        fullBio: 'Rosy brings passion and energy to every session. With certifications in functional fitness and women\'s health, she creates personalized programs that empower women to reach their fitness potential.',
        phone: '+91 98765 43211',
        imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&q=80',
    },
    {
        id: '3',
        name: 'Matt Stone',
        role: 'CrossFit Trainer',
        description: 'CrossFit Level 3 certified trainer focused on functional movements.',
        fullBio: 'Matt is a CrossFit Level 3 trainer who believes in building strength through functional movements. He has competed in regional CrossFit competitions and brings that competitive spirit to his training sessions.',
        phone: '+91 98765 43212',
        imageUrl: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=400&q=80',
    },
    {
        id: '4',
        name: 'Sofia Lauren',
        role: 'Yoga Instructor',
        description: 'Certified yoga instructor with expertise in Vinyasa and Hatha yoga.',
        fullBio: 'Sofia has been practicing yoga for 15 years and teaching for 8. She specializes in Vinyasa flow and Hatha yoga, helping students find balance, flexibility, and inner peace through their practice.',
        phone: '+91 98765 43213',
        imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&q=80',
    },
    {
        id: '5',
        name: 'James Carter',
        role: 'Strength Coach',
        description: 'Olympic weightlifting specialist and powerlifting champion.',
        fullBio: 'James is a former national powerlifting champion with expertise in Olympic lifting. He focuses on proper technique and progressive overload to help clients build raw strength safely.',
        phone: '+91 98765 43214',
        imageUrl: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=400&q=80',
    },
    {
        id: '6',
        name: 'Emma Wilson',
        role: 'HIIT Specialist',
        description: 'High-intensity training expert for maximum calorie burn.',
        fullBio: 'Emma specializes in High Intensity Interval Training that maximizes calorie burn and improves cardiovascular health. Her energetic sessions keep clients motivated and seeing results fast.',
        phone: '+91 98765 43215',
        imageUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&q=80',
    },
    {
        id: '7',
        name: 'Michael Brown',
        role: 'Cardio Trainer',
        description: 'Endurance specialist focused on cardiovascular health.',
        fullBio: 'Michael is passionate about cardiovascular fitness. He designs programs that improve heart health, boost endurance, and help clients achieve their running and cycling goals.',
        phone: '+91 98765 43216',
        imageUrl: 'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=400&q=80',
    },
    {
        id: '8',
        name: 'Lisa Anderson',
        role: 'Nutrition Coach',
        description: 'Certified nutritionist helping clients fuel their fitness journey.',
        fullBio: 'Lisa combines her nutrition expertise with fitness coaching to provide holistic wellness guidance. She creates meal plans that complement training programs for optimal results.',
        phone: '+91 98765 43217',
        imageUrl: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=400&q=80',
    },
    {
        id: '9',
        name: 'Chris Martinez',
        role: 'Boxing Coach',
        description: 'Former professional boxer turned fitness coach.',
        fullBio: 'Chris brings his boxing expertise to fitness training. His classes combine traditional boxing techniques with conditioning work for a full-body workout that builds strength and agility.',
        phone: '+91 98765 43218',
        imageUrl: 'https://images.unsplash.com/photo-1549476464-37392f717541?w=400&q=80',
    },
    {
        id: '10',
        name: 'Sarah Thompson',
        role: 'Pilates Instructor',
        description: 'Core strength and flexibility specialist through Pilates.',
        fullBio: 'Sarah is a certified Pilates instructor who focuses on building core strength and improving posture. Her mat and reformer classes help clients develop a strong, balanced body.',
        phone: '+91 98765 43219',
        imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&q=80',
    },
    {
        id: '11',
        name: 'Ryan Johnson',
        role: 'Personal Trainer',
        description: 'Customized training programs for all fitness levels.',
        fullBio: 'Ryan creates personalized training programs tailored to individual goals and fitness levels. His supportive coaching style helps clients stay motivated and achieve lasting results.',
        phone: '+91 98765 43220',
        imageUrl: 'https://images.unsplash.com/photo-1567013127542-490d757e51fc?w=400&q=80',
    },
    {
        id: '12',
        name: 'Nicole Davis',
        role: 'Weight Loss Coach',
        description: 'Transformation specialist with proven weight loss methods.',
        fullBio: 'Nicole specializes in weight loss transformations. She combines effective training methods with lifestyle coaching to help clients lose weight sustainably and keep it off.',
        phone: '+91 98765 43221',
        imageUrl: 'https://images.unsplash.com/photo-1579758629938-03607ccdbaba?w=400&q=80',
    },
];

export default function TeamPage() {
    const [selectedTrainer, setSelectedTrainer] = useState<Trainer | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [touchedCard, setTouchedCard] = useState<string | null>(null);
    const [showScrollIndicator, setShowScrollIndicator] = useState(true);

    // Hide scroll indicator when near bottom
    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            const scrollHeight = document.documentElement.scrollHeight;
            const clientHeight = window.innerHeight;

            // Hide when within 150px of bottom
            const nearBottom = scrollTop + clientHeight >= scrollHeight - 150;
            setShowScrollIndicator(!nearBottom);
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Check initial position

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleContactClick = (trainer: Trainer) => {
        setSelectedTrainer(trainer);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setTimeout(() => setSelectedTrainer(null), 300);
    };

    const handleTouchStart = (trainerId: string) => {
        setTouchedCard(trainerId);
    };

    const handleTouchEnd = () => {
        // Keep the button visible for a bit after touch ends
        setTimeout(() => setTouchedCard(null), 2000);
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
                        Our <span className="text-red-600 italic">Trainers</span>
                    </h1>
                    <p className="text-neutral-400 text-lg mt-4 max-w-2xl mx-auto">
                        Meet our expert team of fitness professionals dedicated to helping you achieve your goals
                    </p>
                </div>
            </motion.section>

            {/* Trainers Grid */}
            <section className="px-4 md:px-12 pb-20">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {trainers.map((trainer, index) => (
                            <motion.div
                                key={trainer.id}
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{
                                    duration: 0.5,
                                    delay: index * 0.1,
                                    ease: [0.25, 0.46, 0.45, 0.94],
                                }}
                                whileHover={{ y: -10 }}
                                onTouchStart={() => handleTouchStart(trainer.id)}
                                onTouchEnd={handleTouchEnd}
                                className="group relative bg-neutral-900 rounded-xl overflow-hidden border border-neutral-800 hover:border-red-600/50 transition-colors duration-300"
                            >
                                {/* Image */}
                                <div className="relative h-72 overflow-hidden">
                                    <div
                                        className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                                        style={{ backgroundImage: `url(${trainer.imageUrl})` }}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-transparent" />

                                    {/* Contact Button - Shows on Hover (Desktop) or Touch (Mobile) */}
                                    <div
                                        className={`absolute inset-0 flex items-center justify-center bg-black/50 transition-opacity duration-300 ${touchedCard === trainer.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                                            }`}
                                    >
                                        <button
                                            onClick={() => handleContactClick(trainer)}
                                            className="contact-btn relative overflow-hidden px-6 py-2.5 text-white text-sm font-bold uppercase tracking-wider border-2 border-red-600 bg-red-600 transition-colors duration-300 cursor-pointer"
                                        >
                                            <span className="relative z-10">Contact Us</span>
                                        </button>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-5 text-center">
                                    <h3 className="text-xl font-bold text-white mb-1">{trainer.name}</h3>
                                    <p className="text-red-500 text-sm font-semibold uppercase tracking-wide mb-3">
                                        {trainer.role}
                                    </p>
                                    <p className="text-neutral-400 text-sm leading-relaxed">
                                        {trainer.description}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Scroll Down Indicator */}
            <AnimatePresence>
                {showScrollIndicator && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-30"
                    >
                        <motion.div
                            animate={{ y: [0, 10, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
                            className="text-neutral-500"
                        >
                            <ChevronDown className="w-8 h-8" />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Contact Modal */}
            <AnimatePresence>
                {isModalOpen && selectedTrainer && (
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
                                className="relative bg-neutral-900 border border-neutral-800 rounded-xl w-full max-w-md p-6 pointer-events-auto shadow-2xl"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {/* Close Button */}
                                <button
                                    onClick={handleCloseModal}
                                    className="absolute top-4 right-4 text-neutral-400 hover:text-white transition-colors cursor-pointer"
                                >
                                    <X size={24} />
                                </button>

                                {/* Trainer Image */}
                                <div className="w-24 h-24 mx-auto rounded-full overflow-hidden border-4 border-red-600 mb-4">
                                    <div
                                        className="w-full h-full bg-cover bg-center"
                                        style={{ backgroundImage: `url(${selectedTrainer.imageUrl})` }}
                                    />
                                </div>

                                {/* Trainer Name */}
                                <h2 className="text-2xl font-bold text-center mb-1">
                                    {selectedTrainer.name}
                                </h2>
                                <p className="text-red-500 text-sm font-semibold uppercase tracking-wide text-center mb-4">
                                    {selectedTrainer.role}
                                </p>

                                {/* Bio */}
                                <p className="text-neutral-300 text-sm leading-relaxed mb-6 text-center">
                                    {selectedTrainer.fullBio}
                                </p>

                                {/* Phone Number */}
                                <div className="flex items-center justify-center gap-3 bg-neutral-800 rounded-lg px-4 py-3 mb-4">
                                    <Phone className="w-5 h-5 text-red-500" />
                                    <span className="text-white font-semibold">{selectedTrainer.phone}</span>
                                </div>

                                {/* Call Button */}
                                <a
                                    href={`tel:${selectedTrainer.phone.replace(/\s/g, '')}`}
                                    className="block w-full text-center bg-red-600 hover:bg-red-700 py-3 rounded-lg font-bold uppercase tracking-wide transition-colors"
                                >
                                    Call Now
                                </a>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </main>
    );
}
