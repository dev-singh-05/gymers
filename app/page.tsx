import { Navbar } from "@/components/Navbar";
import Image from "next/image";

export default function Home() {
    return (
        <main className="relative min-h-screen bg-neutral-950 text-white overflow-hidden font-[family-name:var(--font-geist-sans)]">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="/bg.png"
                    alt="Bodybuilder background"
                    fill
                    className="object-cover object-center opacity-60"
                    priority
                />
                {/* Gradient Overlay for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-l from-neutral-950/90 via-neutral-950/50 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent" />
            </div>

            <Navbar />

            {/* Hero Content */}
            <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 md:px-12 pt-36">
                <div className="w-full max-w-7xl flex justify-end text-right">
                    <div className="flex flex-col items-end gap-6 max-w-3xl">
                        {/* Main Heading */}
                        <h1 className="text-6xl md:text-8xl lg:text-9xl font-black uppercase italic tracking-tighter leading-[0.8]">
                            <span className="block text-white">WHERE <span className="text-red-600">HARD</span></span>
                            <span className="block text-white"><span className="text-red-600">WORK</span> MEETS</span>
                            <span className="block text-white">SUCCESS</span>
                        </h1>

                        {/* Description */}
                        <p className="text-lg md:text-xl text-neutral-300 max-w-xl font-light">
                            Join the elite community of fitness enthusiasts. Transform your body and mind with our premium programs.
                        </p>

                        {/* Buttons */}
                        <div className="flex flex-wrap gap-4 justify-end mt-4">
                            <button className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-full transition-all uppercase tracking-wide text-sm md:text-base shadow-lg shadow-red-900/40">
                                Get Started
                            </button>
                            <button className="px-8 py-3 bg-transparent border border-white/20 hover:bg-white/10 text-white font-bold rounded-full transition-all uppercase tracking-wide text-sm md:text-base backdrop-blur-sm">
                                View Programs
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
