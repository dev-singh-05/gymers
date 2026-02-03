'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Users, ArrowLeft, Loader2 } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

interface Message {
    id: string;
    text: string;
    sender_name: string;
    sender_avatar: string;
    created_at: string;
}

export default function GrpPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [username, setUsername] = useState<string | null>(null);
    const [showNamePrompt, setShowNamePrompt] = useState(false);
    const [nameInput, setNameInput] = useState('');
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Check for saved username
    useEffect(() => {
        const savedName = localStorage.getItem('gymers_username');
        if (savedName) {
            setUsername(savedName);
        } else {
            setShowNamePrompt(true);
        }
    }, []);

    // Fetch initial messages
    useEffect(() => {
        const fetchMessages = async () => {
            const { data, error } = await supabase
                .from('messages')
                .select('*')
                .order('created_at', { ascending: true });

            if (error) {
                console.error('Error fetching messages:', error);
            } else {
                setMessages(data || []);
            }
            setLoading(false);
        };

        fetchMessages();

        // Set up real-time subscription
        const channel = supabase
            .channel('messages-channel')
            .on(
                'postgres_changes',
                {
                    event: 'INSERT',
                    schema: 'public',
                    table: 'messages',
                },
                (payload) => {
                    setMessages((prev) => [...prev, payload.new as Message]);
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const handleSetUsername = () => {
        if (!nameInput.trim()) return;
        const name = nameInput.trim();
        localStorage.setItem('gymers_username', name);
        setUsername(name);
        setShowNamePrompt(false);
    };

    const sendMessage = async () => {
        if (!input.trim() || !username) return;

        setSending(true);
        const { error } = await supabase.from('messages').insert({
            text: input.trim(),
            sender_name: username,
            sender_avatar: username.charAt(0).toUpperCase(),
        });

        if (error) {
            console.error('Error sending message:', error);
        }

        setInput('');
        setSending(false);
    };

    const formatTime = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true,
        });
    };

    const isMyMessage = (senderName: string) => {
        return senderName === username;
    };

    return (
        <main className="min-h-screen bg-neutral-950 text-white">
            <Navbar />

            {/* Username Prompt Modal */}
            <AnimatePresence>
                {showNamePrompt && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="fixed inset-0 z-50 flex items-center justify-center p-4"
                        >
                            <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 w-full max-w-sm">
                                <h2 className="text-xl font-bold mb-2">Welcome to THE GYMERS</h2>
                                <p className="text-neutral-400 text-sm mb-4">
                                    Enter your name to start chatting
                                </p>
                                <input
                                    type="text"
                                    value={nameInput}
                                    onChange={(e) => setNameInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSetUsername()}
                                    placeholder="Your name..."
                                    className="w-full bg-neutral-800 border border-white/10 rounded-lg px-4 py-3 mb-4 focus:outline-none focus:border-red-600/50"
                                    autoFocus
                                />
                                <button
                                    onClick={handleSetUsername}
                                    disabled={!nameInput.trim()}
                                    className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 py-3 rounded-lg font-bold transition-colors cursor-pointer"
                                >
                                    Join Chat
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Chat Container */}
            <div className="pt-16 h-screen flex flex-col">
                {/* Chat Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-neutral-900/80 backdrop-blur-md border-b border-white/10 px-4 md:px-8 py-4"
                >
                    <div className="max-w-4xl mx-auto flex items-center gap-4">
                        <Link
                            href="/"
                            className="p-2 hover:bg-white/10 rounded-full transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Link>

                        {/* Group Avatar */}
                        <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center font-bold text-lg">
                            TG
                        </div>

                        {/* Group Info */}
                        <div className="flex-1">
                            <h1 className="font-bold text-lg">THE GYMERS</h1>
                            <div className="flex items-center gap-2 text-neutral-400 text-sm">
                                <Users className="w-4 h-4" />
                                <span>Group Chat</span>
                                {username && (
                                    <span className="text-green-500">• Joined as {username}</span>
                                )}
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6">
                    <div className="max-w-4xl mx-auto space-y-4">
                        {loading ? (
                            <div className="flex items-center justify-center h-full">
                                <Loader2 className="w-8 h-8 animate-spin text-red-600" />
                            </div>
                        ) : messages.length === 0 ? (
                            <div className="text-center text-neutral-500 py-20">
                                <p className="text-lg">No messages yet</p>
                                <p className="text-sm">Be the first to say hello! 👋</p>
                            </div>
                        ) : (
                            <AnimatePresence>
                                {messages.map((message) => (
                                    <motion.div
                                        key={message.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className={`flex gap-3 ${isMyMessage(message.sender_name) ? 'flex-row-reverse' : ''}`}
                                    >
                                        {/* Avatar */}
                                        {!isMyMessage(message.sender_name) && (
                                            <div className="w-10 h-10 rounded-full bg-neutral-700 flex items-center justify-center text-sm font-bold flex-shrink-0">
                                                {message.sender_avatar}
                                            </div>
                                        )}

                                        {/* Message Bubble */}
                                        <div
                                            className={`max-w-[70%] ${isMyMessage(message.sender_name)
                                                ? 'bg-red-600 rounded-2xl rounded-br-sm'
                                                : 'bg-neutral-800 rounded-2xl rounded-bl-sm'
                                                } px-4 py-3`}
                                        >
                                            {!isMyMessage(message.sender_name) && (
                                                <p className="text-red-400 text-sm font-semibold mb-1">
                                                    {message.sender_name}
                                                </p>
                                            )}
                                            <p className="text-white">{message.text}</p>
                                            <p className={`text-xs mt-1 ${isMyMessage(message.sender_name) ? 'text-red-200' : 'text-neutral-500'}`}>
                                                {formatTime(message.created_at)}
                                            </p>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                </div>

                {/* Input Area */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-neutral-900/80 backdrop-blur-md border-t border-white/10 px-4 md:px-8 py-4"
                >
                    <div className="max-w-4xl mx-auto flex items-center gap-3">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && !sending && sendMessage()}
                            placeholder={username ? "Type a message..." : "Enter your name first..."}
                            disabled={!username || sending}
                            className="flex-1 bg-neutral-800 border border-white/10 rounded-full px-5 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-red-600/50 transition-colors disabled:opacity-50"
                        />
                        <button
                            onClick={sendMessage}
                            disabled={!input.trim() || !username || sending}
                            className="p-3 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-full transition-colors cursor-pointer"
                        >
                            {sending ? (
                                <Loader2 className="w-5 h-5 animate-spin" />
                            ) : (
                                <Send className="w-5 h-5" />
                            )}
                        </button>
                    </div>
                </motion.div>
            </div>
        </main>
    );
}
