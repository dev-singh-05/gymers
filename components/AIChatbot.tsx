'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Loader2, Dumbbell, Sparkles } from 'lucide-react';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
}

const SYSTEM_PROMPT = `You are GYMERS AI Trainer, a friendly and knowledgeable fitness coach. You help users with:
- Workout routines and exercise techniques
- Nutrition advice and meal planning
- Fitness goals and motivation
- Recovery and rest strategies
- General health and wellness tips

Keep responses concise, encouraging, and actionable. Use emojis occasionally to keep it fun! 💪`;

const INITIAL_MESSAGE: Message = {
    id: 'welcome',
    role: 'assistant',
    content: "Hey there! 💪 I'm your AI Trainer. Ask me anything about workouts, nutrition, or fitness goals. Let's crush it together!"
};

export function AIChatbot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const generateResponse = async (userMessage: string): Promise<string> => {
        // Simple fitness-focused responses for demo
        // In production, integrate with OpenAI/Gemini API
        const lowerMsg = userMessage.toLowerCase();

        if (lowerMsg.includes('workout') || lowerMsg.includes('exercise')) {
            return "Great question! 🏋️ For a balanced workout, I recommend:\n\n• **Push Day**: Chest, shoulders, triceps\n• **Pull Day**: Back, biceps\n• **Legs Day**: Quads, hamstrings, calves\n\nAim for 3-4 sets of 8-12 reps. What's your current fitness level?";
        }
        if (lowerMsg.includes('diet') || lowerMsg.includes('nutrition') || lowerMsg.includes('eat') || lowerMsg.includes('food')) {
            return "Nutrition is key! 🥗 Here are my top tips:\n\n• **Protein**: 1.6-2.2g per kg bodyweight\n• **Hydration**: 3-4 liters of water daily\n• **Timing**: Eat within 2 hours post-workout\n\nWhat are your nutrition goals?";
        }
        if (lowerMsg.includes('weight') || lowerMsg.includes('lose') || lowerMsg.includes('fat')) {
            return "Weight loss = caloric deficit + consistency! 🔥\n\n• Track calories (apps like MyFitnessPal help)\n• Prioritize protein to preserve muscle\n• Combine cardio with strength training\n• Get 7-8 hours sleep\n\nWant a specific plan?";
        }
        if (lowerMsg.includes('muscle') || lowerMsg.includes('gain') || lowerMsg.includes('bulk')) {
            return "Building muscle? Here's the formula! 💪\n\n• **Caloric surplus**: +300-500 calories\n• **Progressive overload**: Increase weights gradually\n• **Recovery**: 48 hours rest per muscle group\n• **Sleep**: 7-9 hours minimum\n\nWhich muscle groups are you focusing on?";
        }
        if (lowerMsg.includes('motivation') || lowerMsg.includes('lazy') || lowerMsg.includes('tired')) {
            return "I got you! 🌟 Here's some motivation:\n\n\"The only bad workout is the one that didn't happen.\"\n\nTips to stay motivated:\n• Set small, achievable goals\n• Find a workout buddy\n• Track your progress\n• Remember your 'why'\n\nYou've got this! 💪";
        }
        if (lowerMsg.includes('hello') || lowerMsg.includes('hi') || lowerMsg.includes('hey')) {
            return "Hey champion! 👋 Ready to crush your fitness goals today? Ask me about workouts, nutrition, or anything fitness-related!";
        }
        if (lowerMsg.includes('thank')) {
            return "You're welcome! 🙌 Keep pushing, you're doing amazing. I'm here whenever you need fitness advice!";
        }

        return "Great question! 💪 I'm here to help with:\n\n• Workout routines\n• Nutrition plans\n• Weight loss/muscle gain\n• Motivation & tips\n\nWhat would you like to focus on today?";
    };

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input.trim(),
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 1000));
            const response = await generateResponse(userMessage.content);

            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: response,
            };

            setMessages(prev => [...prev, assistantMessage]);
        } catch (error) {
            console.error('Error generating response:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Floating Button */}
            <motion.button
                onClick={() => setIsOpen(true)}
                className={`fixed bottom-6 right-6 z-40 w-14 h-14 bg-gradient-to-br from-red-600 to-red-700 rounded-full shadow-lg shadow-red-900/40 flex items-center justify-center text-white hover:scale-110 transition-transform ${isOpen ? 'hidden' : ''}`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: 'spring' }}
            >
                <Dumbbell className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full animate-pulse" />
            </motion.button>

            {/* Chat Window */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="fixed z-50 
                            inset-4 sm:inset-auto 
                            sm:bottom-6 sm:right-6 
                            sm:w-[360px] sm:h-[500px] 
                            bg-neutral-900 border border-white/10 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
                    >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-red-600 to-red-700 px-4 py-3 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                                    <Dumbbell className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-white">AI Trainer</h3>
                                    <p className="text-red-200 text-xs flex items-center gap-1">
                                        <span className="w-2 h-2 bg-green-400 rounded-full" />
                                        Online
                                    </p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="p-1 hover:bg-white/20 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5 text-white" />
                            </button>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.map((message) => (
                                <motion.div
                                    key={message.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div
                                        className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm ${message.role === 'user'
                                            ? 'bg-red-600 text-white rounded-br-sm'
                                            : 'bg-neutral-800 text-neutral-100 rounded-bl-sm'
                                            }`}
                                    >
                                        <p className="whitespace-pre-wrap">{message.content}</p>
                                    </div>
                                </motion.div>
                            ))}

                            {loading && (
                                <div className="flex justify-start">
                                    <div className="bg-neutral-800 px-4 py-3 rounded-2xl rounded-bl-sm">
                                        <div className="flex items-center gap-2">
                                            <Loader2 className="w-4 h-4 animate-spin text-red-500" />
                                            <span className="text-neutral-400 text-sm">Thinking...</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="p-3 border-t border-white/10">
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder="Ask your trainer..."
                                    disabled={loading}
                                    className="flex-1 bg-neutral-800 border border-white/10 rounded-full px-4 py-2.5 text-sm text-white placeholder:text-neutral-500 focus:outline-none focus:border-red-500/50"
                                />
                                <button
                                    onClick={handleSend}
                                    disabled={!input.trim() || loading}
                                    className="p-2.5 bg-red-600 hover:bg-red-500 disabled:opacity-50 rounded-full transition-colors"
                                >
                                    <Send className="w-4 h-4 text-white" />
                                </button>
                            </div>
                            <p className="text-neutral-500 text-xs text-center mt-2">
                                Powered by <Sparkles className="w-3 h-3 inline text-red-500" /> GYMERS AI
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
