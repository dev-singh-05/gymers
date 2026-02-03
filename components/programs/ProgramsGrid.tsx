'use client';

import { useState } from 'react';
import { ProgramCard } from './ProgramCard';
import { ProgramModal } from './ProgramModal';

const PROGRAMS = [
    {
        id: 'body-building',
        title: 'Body Building',
        description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores consectetur suscipit incidunt sit.',
        fullDescription: 'Build muscle mass and strength with our comprehensive bodybuilding program. Our expert coaches will guide you through compound exercises, progressive overload techniques, and nutrition planning to help you achieve your physique goals. Perfect for beginners and advanced lifters alike.',
        price: 2999,
        imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&q=80',
    },
    {
        id: 'cardio',
        title: 'Cardio',
        description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores consectetur suscipit incidunt sit.',
        fullDescription: 'Improve your cardiovascular health and endurance with our high-intensity cardio programs. From treadmill intervals to cycling sessions, we offer diverse workouts that keep your heart pumping and calories burning. Great for weight management and overall fitness.',
        price: 1999,
        imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&q=80',
    },
    {
        id: 'fitness',
        title: 'Fitness',
        description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores consectetur suscipit incidunt sit.',
        fullDescription: 'Our general fitness program covers all aspects of physical wellness. Combining strength, flexibility, and cardio training, this program is designed for those who want a balanced approach to their fitness journey. Suitable for all fitness levels.',
        price: 1499,
        imageUrl: 'https://images.unsplash.com/photo-1518310383802-640c2de311b2?w=800&q=80',
    },
    {
        id: 'crossfit',
        title: 'CrossFit',
        description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores consectetur suscipit incidunt sit.',
        fullDescription: 'Experience the ultimate functional fitness with CrossFit. Our program combines weightlifting, cardio, and gymnastics movements in high-intensity workouts that build strength, endurance, and mental toughness. Join our supportive community today.',
        price: 2499,
        imageUrl: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=800&q=80',
    },
    {
        id: 'yoga',
        title: 'Yoga',
        description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores consectetur suscipit incidunt sit.',
        fullDescription: 'Find balance between mind and body with our yoga program. From Vinyasa flow to Hatha poses, our certified instructors guide you through sessions that improve flexibility, reduce stress, and enhance mental clarity. Perfect for relaxation and recovery.',
        price: 999,
        imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80',
    },
    {
        id: 'weight-loss',
        title: 'Weight Loss',
        description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores consectetur suscipit incidunt sit.',
        fullDescription: 'Transform your body with our targeted weight loss program. Combining effective cardio routines, strength training, and personalized nutrition guidance, we help you shed pounds sustainably. Our coaches provide constant motivation and track your progress.',
        price: 2299,
        imageUrl: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80',
    },
    {
        id: 'strength-training',
        title: 'Strength Training',
        description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores consectetur suscipit incidunt sit.',
        fullDescription: 'Master the fundamentals of strength with our power lifting program. Learn proper form for squats, deadlifts, bench press, and more. Our coaches ensure safe progressive overload to help you lift heavier and build raw strength.',
        price: 2799,
        imageUrl: 'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=800&q=80',
    },
    {
        id: 'hiit',
        title: 'HIIT',
        description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores consectetur suscipit incidunt sit.',
        fullDescription: 'Maximize calorie burn with High Intensity Interval Training. Our HIIT sessions alternate between intense bursts of activity and rest periods, boosting metabolism and improving cardiovascular fitness. Get results in less time with this efficient workout style.',
        price: 1799,
        imageUrl: 'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?w=800&q=80',
    },
];

export function ProgramsGrid() {
    const [selectedProgram, setSelectedProgram] = useState<typeof PROGRAMS[0] | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleReadMore = (program: typeof PROGRAMS[0]) => {
        setSelectedProgram(program);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setTimeout(() => setSelectedProgram(null), 300);
    };

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                {PROGRAMS.map((program, index) => (
                    <ProgramCard
                        key={program.id}
                        id={program.id}
                        title={program.title}
                        description={program.description}
                        imageUrl={program.imageUrl}
                        index={index}
                        onReadMore={() => handleReadMore(program)}
                    />
                ))}
            </div>

            <ProgramModal
                program={selectedProgram}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
            />
        </>
    );
}
