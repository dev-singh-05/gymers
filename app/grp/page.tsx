'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Users, ArrowLeft, Loader2, LogIn, Settings, X, CreditCard } from 'lucide-react';
import { Navbar } from '@/components/Navbar';
import { supabase } from '@/lib/supabase';
import { getCurrentUser, onAuthStateChange } from '@/lib/auth';
import { getGrpMembers, joinGrp, getProfile, getUserPrograms, GrpMember, Profile, UserProgram } from '@/lib/db';
import { ImageZoomModal } from '@/components/ImageZoomModal';
import Link from 'next/link';
import type { User } from '@supabase/supabase-js';
import 'react-medium-image-zoom/dist/styles.css';

interface Message {
    id: string;
    text: string;
    sender_name: string;
    sender_avatar: string;
    created_at: string;
}

interface MemberWithProfile extends GrpMember {
    profile?: Profile | null;
    programs?: UserProgram[];
}

export default function GrpPage() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [currentUserProfile, setCurrentUserProfile] = useState<Profile | null>(null);
    const [authLoading, setAuthLoading] = useState(true);
    const [members, setMembers] = useState<MemberWithProfile[]>([]);
    const [showMembers, setShowMembers] = useState(false);
    const [selectedMember, setSelectedMember] = useState<MemberWithProfile | null>(null);
    const [zoomImageUrl, setZoomImageUrl] = useState<string>('');
    const [showZoom, setShowZoom] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Check auth state
    useEffect(() => {
        getCurrentUser().then(async (user) => {
            setCurrentUser(user);
            setAuthLoading(false);

            // Auto-join group if logged in
            if (user) {
                const profile = await getProfile(user.id);
                setCurrentUserProfile(profile);
                const name = profile?.name || user.email?.split('@')[0] || 'Anonymous';
                joinGrp(user.id, name, profile?.avatar_url || undefined).catch(console.error);
            }
        });

        const { data: { subscription } } = onAuthStateChange(async (user) => {
            setCurrentUser(user);
            if (user) {
                const profile = await getProfile(user.id);
                setCurrentUserProfile(profile);
                const name = profile?.name || user.email?.split('@')[0] || 'Anonymous';
                joinGrp(user.id, name, profile?.avatar_url || undefined).catch(console.error);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    // Fetch initial messages
    useEffect(() => {
        if (!currentUser) return;

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
    }, [currentUser]);

    // Fetch members with profiles
    const fetchMembers = async () => {
        const membersData = await getGrpMembers();

        // Fetch profile and programs for each member
        const membersWithProfiles: MemberWithProfile[] = await Promise.all(
            membersData.map(async (member) => {
                const profile = await getProfile(member.user_id);
                const programs = await getUserPrograms(member.user_id);
                return {
                    ...member,
                    profile,
                    programs,
                    avatar_url: profile?.avatar_url || member.avatar_url,
                    name: profile?.name || member.name,
                };
            })
        );

        setMembers(membersWithProfiles);
    };

    const handleViewMembers = () => {
        fetchMembers();
        setShowMembers(true);
    };

    const handleMemberClick = (member: MemberWithProfile) => {
        setSelectedMember(member);
    };

    const handlePhotoZoom = (imageUrl: string) => {
        if (imageUrl) {
            setZoomImageUrl(imageUrl);
            setShowZoom(true);
        }
    };

    const username = currentUserProfile?.name || currentUser?.email?.split('@')[0] || null;

    const sendMessage = async () => {
        if (!input.trim() || !username || !currentUser) return;

        setSending(true);
        const { error } = await supabase.from('messages').insert({
            text: input.trim(),
            sender_name: username,
            sender_avatar: currentUserProfile?.avatar_url || username.charAt(0).toUpperCase(),
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

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(price);
    };

    // Show loading
    if (authLoading) {
        return (
            <main className="min-h-screen bg-neutral-950 text-white flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-red-600" />
            </main>
        );
    }

    // Show sign-in prompt if not logged in
    if (!currentUser) {
        return (
            <main className="min-h-screen bg-neutral-950 text-white">
                <Navbar />
                <div className="pt-24 flex flex-col items-center justify-center min-h-[80vh] px-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center"
                    >
                        <div className="w-20 h-20 rounded-full bg-neutral-800 flex items-center justify-center mx-auto mb-6">
                            <Users className="w-10 h-10 text-neutral-500" />
                        </div>
                        <h1 className="text-3xl font-bold mb-3">Join THE GYMERS</h1>
                        <p className="text-neutral-400 mb-8 max-w-sm">
                            Sign in to access the group chat and connect with other fitness enthusiasts
                        </p>
                        <Link
                            href="/login"
                            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-8 py-3 rounded-full font-bold transition-colors"
                        >
                            <LogIn className="w-5 h-5" />
                            Sign In to Join
                        </Link>
                        <p className="text-neutral-500 text-sm mt-4">
                            Don&apos;t have an account?{' '}
                            <Link href="/signup" className="text-red-500 hover:text-red-400">
                                Create one
                            </Link>
                        </p>
                    </motion.div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-neutral-950 text-white">
            <Navbar />

            {/* Photo Zoom Modal */}
            <ImageZoomModal
                imageUrl={zoomImageUrl}
                isOpen={showZoom}
                onClose={() => setShowZoom(false)}
                alt="Profile photo"
            />

            {/* View Members Modal */}
            <AnimatePresence>
                {showMembers && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
                            onClick={() => setShowMembers(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="fixed inset-0 z-50 flex items-center justify-center p-4"
                        >
                            <div
                                className="bg-neutral-900 border border-neutral-800 rounded-xl p-6 w-full max-w-sm max-h-[70vh] overflow-hidden"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="text-xl font-bold">Group Members</h2>
                                    <button
                                        onClick={() => setShowMembers(false)}
                                        className="text-neutral-400 hover:text-white"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>
                                <div className="space-y-3 overflow-y-auto max-h-[50vh]">
                                    {members.length === 0 ? (
                                        <p className="text-neutral-500 text-center py-4">No members yet</p>
                                    ) : (
                                        members.map((member) => (
                                            <button
                                                key={member.id}
                                                onClick={() => handleMemberClick(member)}
                                                className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-neutral-800 transition-colors text-left"
                                            >
                                                <div
                                                    className="w-10 h-10 rounded-full bg-red-600 flex items-center justify-center font-bold text-sm overflow-hidden flex-shrink-0"
                                                >
                                                    {member.avatar_url ? (
                                                        <img src={member.avatar_url} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        member.name.charAt(0).toUpperCase()
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="font-medium truncate">{member.name}</p>
                                                    <p className="text-neutral-500 text-xs">
                                                        {(member.programs?.length || 0) > 0
                                                            ? `${member.programs?.length} programs`
                                                            : 'Free member'}
                                                    </p>
                                                </div>
                                            </button>
                                        ))
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* Member Profile Modal */}
            <AnimatePresence>
                {selectedMember && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[60]"
                            onClick={() => setSelectedMember(null)}
                        />
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="fixed inset-0 z-[60] flex items-center justify-center p-4"
                        >
                            <div
                                className="bg-neutral-900 border border-neutral-800 rounded-xl w-full max-w-sm overflow-hidden"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {/* Profile Header */}
                                <div className="bg-gradient-to-b from-red-600/30 to-transparent p-6 flex flex-col items-center">
                                    <button
                                        onClick={() => setSelectedMember(null)}
                                        className="absolute top-4 right-4 text-white/70 hover:text-white"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>

                                    {/* Profile Photo - Clickable for Zoom */}
                                    <button
                                        onClick={() => selectedMember.avatar_url && handlePhotoZoom(selectedMember.avatar_url)}
                                        className="w-24 h-24 rounded-full bg-neutral-800 flex items-center justify-center font-bold text-2xl overflow-hidden mb-4 border-4 border-neutral-900 cursor-pointer hover:opacity-90 transition-opacity"
                                    >
                                        {selectedMember.avatar_url ? (
                                            <img src={selectedMember.avatar_url} alt="" className="w-full h-full object-cover" />
                                        ) : (
                                            selectedMember.name.charAt(0).toUpperCase()
                                        )}
                                    </button>

                                    <h3 className="text-xl font-bold">{selectedMember.name}</h3>
                                    <p className="text-neutral-400 text-sm">
                                        Joined {new Date(selectedMember.joined_at).toLocaleDateString()}
                                    </p>
                                    {selectedMember.avatar_url && (
                                        <p className="text-neutral-500 text-xs mt-1">Tap photo to zoom</p>
                                    )}
                                </div>

                                {/* Programs Section */}
                                <div className="p-6 pt-0">
                                    <div className="flex items-center gap-2 mb-3">
                                        <CreditCard className="w-4 h-4 text-red-500" />
                                        <h4 className="font-semibold">Programs Joined</h4>
                                    </div>

                                    {(selectedMember.programs?.length || 0) === 0 ? (
                                        <p className="text-neutral-500 text-sm py-4 text-center bg-neutral-800/50 rounded-lg">
                                            No programs yet
                                        </p>
                                    ) : (
                                        <div className="space-y-2">
                                            {selectedMember.programs?.map((prog) => (
                                                <div
                                                    key={prog.id}
                                                    className="flex items-center justify-between bg-neutral-800/50 rounded-lg p-3"
                                                >
                                                    <span className="font-medium text-sm">{prog.program_name}</span>
                                                    <span className="text-neutral-400 text-xs">{formatPrice(prog.price)}/mo</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                {/* Footer */}
                                <div className="p-4 border-t border-neutral-800">
                                    <button
                                        onClick={() => setSelectedMember(null)}
                                        className="w-full py-2.5 bg-neutral-800 hover:bg-neutral-700 rounded-lg font-medium transition-colors"
                                    >
                                        Close
                                    </button>
                                </div>
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
                                <span className="text-green-500">• Joined as {username}</span>
                            </div>
                        </div>

                        {/* Settings/View Members */}
                        <button
                            onClick={handleViewMembers}
                            className="p-2 hover:bg-white/10 rounded-full transition-colors text-neutral-400 hover:text-white"
                        >
                            <Settings className="w-5 h-5" />
                        </button>
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
                                            <div className="w-10 h-10 rounded-full bg-neutral-700 flex items-center justify-center text-sm font-bold flex-shrink-0 overflow-hidden">
                                                {message.sender_avatar.startsWith('http') ? (
                                                    <img src={message.sender_avatar} alt="" className="w-full h-full object-cover" />
                                                ) : (
                                                    message.sender_avatar
                                                )}
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
                            placeholder="Type a message..."
                            disabled={sending}
                            className="flex-1 bg-neutral-800 border border-white/10 rounded-full px-5 py-3 text-white placeholder-neutral-500 focus:outline-none focus:border-red-600/50 transition-colors disabled:opacity-50"
                        />
                        <button
                            onClick={sendMessage}
                            disabled={!input.trim() || sending}
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
