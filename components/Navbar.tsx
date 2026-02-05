"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
    User,
    Menu,
    ClipboardList,
    X,
    Trash2,
    Check,
    CreditCard,
    MessageSquare,
    HelpCircle,
    LogIn,
    LogOut,
    UserPlus,
    ChevronDown,
    Camera,
    Loader2,
    XCircle,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { Logo } from "@/components/ui/Logo";
import { cn } from "@/lib/utils";
import { onAuthStateChange, signOut, getCurrentUser } from "@/lib/auth";
import {
    getTodos,
    addTodo as addTodoDb,
    toggleTodo as toggleTodoDb,
    deleteTodo as deleteTodoDb,
    getUserPrograms,
    deactivateProgram,
    getProfile,
    updateProfile,
    UserProgram,
    Todo as DbTodo,
    Profile,
} from "@/lib/db";
import { uploadImage } from "@/lib/cloudinary";
import { ImageCropModal } from "@/components/ImageCropModal";
import { ImageZoomModal } from "@/components/ImageZoomModal";
import type { User as SupabaseUser } from "@supabase/supabase-js";

const navItems = [
    { name: "Home", href: "/" },
    { name: "Program", href: "/programs" },
    { name: "Grp", href: "/grp" },
    { name: "Team", href: "/plans" },
    { name: "Testimonials", href: "/testimonials" },
];

export const Navbar = () => {
    const pathname = usePathname();
    const router = useRouter();

    // Auth state
    const [currentUser, setCurrentUser] = useState<SupabaseUser | null>(null);
    const [profile, setProfile] = useState<Profile | null>(null);

    // UI states
    const [hovered, setHovered] = useState<string | null>(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [todoOpen, setTodoOpen] = useState(false);
    const [userOpen, setUserOpen] = useState(false);
    const [planOpen, setPlanOpen] = useState(false);

    // Todos state
    const [todos, setTodos] = useState<DbTodo[]>([]);
    const [input, setInput] = useState("");
    const [todosLoading, setTodosLoading] = useState(false);

    // Programs state
    const [userPrograms, setUserPrograms] = useState<UserProgram[]>([]);
    const [programsLoading, setProgramsLoading] = useState(false);

    // Photo upload state
    const [uploading, setUploading] = useState(false);
    const [cropModalOpen, setCropModalOpen] = useState(false);
    const [zoomModalOpen, setZoomModalOpen] = useState(false);
    const [cropImageUrl, setCropImageUrl] = useState<string>("");
    const fileInputRef = useRef<HTMLInputElement>(null);

    const remainingCount = todos.filter(t => !t.completed).length;
    const activePill = hovered || getCurrentPage();

    // Subscribe to auth changes
    useEffect(() => {
        getCurrentUser().then((user) => {
            setCurrentUser(user);
            if (user) {
                loadUserData(user.id);
            }
        });

        const { data: { subscription } } = onAuthStateChange((user) => {
            setCurrentUser(user);
            if (user) {
                loadUserData(user.id);
            } else {
                // Clear data on logout
                setTodos([]);
                setUserPrograms([]);
                setProfile(null);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const loadUserData = async (userId: string) => {
        // Load profile
        const profileData = await getProfile(userId);
        setProfile(profileData);

        // Load todos
        const todosData = await getTodos(userId);
        setTodos(todosData);

        // Load programs
        const programsData = await getUserPrograms(userId);
        setUserPrograms(programsData);
    };

    // Handle logout
    const handleLogout = async () => {
        await signOut();
        setUserOpen(false);
        router.push("/");
    };

    // Find the current page based on pathname
    function getCurrentPage() {
        const currentItem = navItems.find(item => item.href === pathname);
        return currentItem?.name || "Home";
    }

    // ========== TODO FUNCTIONS ==========
    const addTodo = async () => {
        if (!input.trim() || !currentUser) return;
        setTodosLoading(true);
        try {
            const newTodo = await addTodoDb(currentUser.id, input.trim());
            setTodos(prev => [...prev, newTodo]);
            setInput("");
        } catch (error) {
            console.error("Error adding todo:", error);
        } finally {
            setTodosLoading(false);
        }
    };

    const toggleTodo = async (todoId: string, completed: boolean) => {
        try {
            await toggleTodoDb(todoId, !completed);
            setTodos(prev =>
                prev.map(t =>
                    t.id === todoId ? { ...t, completed: !completed } : t
                )
            );
        } catch (error) {
            console.error("Error toggling todo:", error);
        }
    };

    const deleteTodo = async (todoId: string) => {
        try {
            await deleteTodoDb(todoId);
            setTodos(prev => prev.filter(t => t.id !== todoId));
        } catch (error) {
            console.error("Error deleting todo:", error);
        }
    };

    // ========== PROGRAM FUNCTIONS ==========
    const handleDeactivateProgram = async (programId: string) => {
        if (!currentUser) return;
        setProgramsLoading(true);
        try {
            await deactivateProgram(currentUser.id, programId);
            setUserPrograms(prev => prev.filter(p => p.program_id !== programId));
        } catch (error) {
            console.error("Error deactivating program:", error);
        } finally {
            setProgramsLoading(false);
        }
    };

    // ========== PHOTO UPLOAD ==========
    const handlePhotoClick = () => {
        if (profile?.avatar_url) {
            // If photo exists, open zoom modal
            setZoomModalOpen(true);
        } else {
            // Otherwise open file picker
            fileInputRef.current?.click();
        }
    };

    const handleChangePhotoClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Create preview URL and open crop modal
        const url = URL.createObjectURL(file);
        setCropImageUrl(url);
        setCropModalOpen(true);

        // Reset input
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const handleCropComplete = async (blob: Blob) => {
        if (!currentUser) return;

        setUploading(true);
        try {
            // Create file from blob
            const file = new File([blob], 'profile.jpg', { type: 'image/jpeg' });
            const result = await uploadImage(file);
            await updateProfile(currentUser.id, { avatar_url: result.secure_url }, currentUser.email || '');
            setProfile(prev => prev ? { ...prev, avatar_url: result.secure_url } : null);
            setCropModalOpen(false);
            URL.revokeObjectURL(cropImageUrl);
        } catch (error) {
            console.error("Error uploading photo:", error);
        } finally {
            setUploading(false);
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(price);
    };

    return (
        <>
            {/* ================= NAVBAR ================= */}
            <nav className="fixed top-0 left-0 right-0 z-50 py-2 px-6 md:px-12">
                <div className="absolute inset-0 bg-neutral-950/80 backdrop-blur-md border-b border-white/5 shadow-xl" />

                <div className="relative mx-auto max-w-7xl flex items-center justify-between">
                    <Logo />

                    {/* Desktop Nav */}
                    <div
                        className="hidden md:flex items-center gap-1 bg-neutral-900/50 p-1 rounded-full border border-white/5 shadow-inner"
                        onMouseLeave={() => setHovered(null)}
                    >
                        {navItems.map(item => (
                            <Link
                                key={item.name}
                                href={item.href}
                                onMouseEnter={() => setHovered(item.name)}
                                className={cn(
                                    "relative px-4 py-1.5 rounded-full text-sm font-medium",
                                    activePill === item.name
                                        ? "text-white"
                                        : "text-neutral-400 hover:text-white"
                                )}
                            >
                                {activePill === item.name && (
                                    <motion.div
                                        layoutId="nav-pill"
                                        className="absolute inset-0 bg-red-600 rounded-full shadow-lg shadow-red-900/40"
                                    />
                                )}
                                <span className="relative z-10">{item.name}</span>
                            </Link>
                        ))}
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-3 ml-auto md:ml-0">

                        {/* TODO */}
                        <button
                            onClick={() => {
                                setTodoOpen(true);
                                setUserOpen(false);
                                setMobileMenuOpen(false);
                            }}
                            className="relative cursor-pointer p-2 rounded-full hover:bg-white/5 text-neutral-400 hover:text-white"
                        >
                            <ClipboardList className="w-5 h-5" />
                            {remainingCount > 0 && (
                                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] bg-red-600 text-xs font-bold text-white rounded-full flex items-center justify-center">
                                    {remainingCount}
                                </span>
                            )}
                        </button>

                        {/* USER */}
                        <button
                            onClick={() => {
                                setUserOpen(true);
                                setTodoOpen(false);
                                setMobileMenuOpen(false);
                            }}
                            className="p-2 rounded-full hover:bg-white/5 cursor-pointer"
                        >
                            <div className="w-9 h-9 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center overflow-hidden">
                                {profile?.avatar_url ? (
                                    <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                                ) : (
                                    <User className="w-4 h-4 text-neutral-300" />
                                )}
                            </div>
                        </button>

                        {/* MOBILE MENU */}
                        <button
                            className="md:hidden p-2 text-white"
                            onClick={() => {
                                setMobileMenuOpen(true);
                                setTodoOpen(false);
                                setUserOpen(false);
                            }}
                        >
                            <Menu className="w-6 h-6" />
                        </button>
                    </div>
                </div>
            </nav>

            {/* ================= CROP MODAL ================= */}
            <ImageCropModal
                imageUrl={cropImageUrl}
                isOpen={cropModalOpen}
                onClose={() => {
                    setCropModalOpen(false);
                    URL.revokeObjectURL(cropImageUrl);
                }}
                onCropComplete={handleCropComplete}
                loading={uploading}
            />

            {/* ================= ZOOM MODAL ================= */}
            <ImageZoomModal
                imageUrl={profile?.avatar_url || ''}
                isOpen={zoomModalOpen}
                onClose={() => setZoomModalOpen(false)}
                alt="Profile photo"
            />

            {/* ================= TODO MODAL ================= */}
            <AnimatePresence>
                {todoOpen && (
                    <>
                        <motion.div
                            className="fixed inset-0 bg-black/60 z-40"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setTodoOpen(false)}
                        />

                        <motion.div
                            className="fixed top-20 right-6 w-80 bg-[#212121] rounded-xl shadow-2xl z-50 p-4"
                            initial={{ opacity: 0, y: -10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        >
                            <h3 className="font-bold text-lg mb-3">To-Do List</h3>

                            {currentUser ? (
                                <>
                                    <div className="flex gap-2 mb-4">
                                        <input
                                            value={input}
                                            onChange={e => setInput(e.target.value)}
                                            onKeyDown={e => e.key === "Enter" && addTodo()}
                                            placeholder="Add a task…"
                                            className="flex-1 bg-neutral-800 border border-white/10 rounded-lg px-3 py-2 text-sm"
                                            disabled={todosLoading}
                                        />
                                        <button
                                            onClick={addTodo}
                                            className="bg-red-600 px-3 rounded-lg disabled:opacity-50"
                                            disabled={todosLoading}
                                        >
                                            {todosLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Add"}
                                        </button>
                                    </div>

                                    <AnimatePresence>
                                        {todos.map(todo => (
                                            <motion.div
                                                key={todo.id}
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: "auto" }}
                                                exit={{ opacity: 0, height: 0 }}
                                                transition={{ duration: 0.35 }}
                                                className="flex items-center gap-2 overflow-hidden mb-2"
                                            >
                                                <button
                                                    onClick={() => toggleTodo(todo.id, todo.completed)}
                                                    className="w-5 h-5 border border-white/20 rounded flex items-center justify-center"
                                                >
                                                    {todo.completed && <Check className="w-3 h-3" />}
                                                </button>

                                                <div className="relative flex-1 text-sm">
                                                    <span className={todo.completed ? "text-neutral-400" : ""}>
                                                        {todo.text}
                                                    </span>
                                                    {todo.completed && (
                                                        <motion.span
                                                            className="absolute left-0 top-1/2 h-[2px] bg-white"
                                                            initial={{ width: 0 }}
                                                            animate={{ width: "100%" }}
                                                            transition={{ duration: 0.75, ease: "easeInOut" }}
                                                        />
                                                    )}
                                                </div>

                                                <button
                                                    onClick={() => deleteTodo(todo.id)}
                                                    className="text-neutral-400 hover:text-red-500"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </motion.div>
                                        ))}
                                    </AnimatePresence>

                                    {todos.length === 0 && (
                                        <p className="text-neutral-500 text-sm text-center py-4">
                                            No tasks yet. Add one above!
                                        </p>
                                    )}
                                </>
                            ) : (
                                <div className="flex flex-col items-center py-6">
                                    <div className="w-12 h-12 rounded-full bg-neutral-800 flex items-center justify-center mb-3">
                                        <ClipboardList className="w-6 h-6 text-neutral-500" />
                                    </div>
                                    <p className="text-neutral-400 text-sm text-center mb-4">
                                        Sign in to use your To-Do List
                                    </p>
                                    <Link
                                        href="/login"
                                        onClick={() => setTodoOpen(false)}
                                        className="flex items-center gap-2 bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg transition-colors font-medium text-sm"
                                    >
                                        <LogIn className="w-4 h-4" />
                                        Sign In
                                    </Link>
                                </div>
                            )}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* ================= USER MODAL ================= */}
            <AnimatePresence>
                {userOpen && (
                    <>
                        <motion.div
                            className="fixed inset-0 bg-black/60 z-40"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setUserOpen(false)}
                        />

                        <motion.div
                            className="fixed top-20 right-6 w-80 bg-[#212121] rounded-xl shadow-2xl z-50 p-5 max-h-[80vh] overflow-y-auto"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            {currentUser ? (
                                <>
                                    {/* Profile Section with Photo Upload */}
                                    <div className="flex flex-col items-center mb-4">
                                        <div
                                            className="relative w-20 h-20 rounded-full bg-gradient-to-br from-red-600 to-red-700 flex items-center justify-center mb-2 cursor-pointer group overflow-hidden"
                                            onClick={handlePhotoClick}
                                        >
                                            {uploading ? (
                                                <Loader2 className="w-6 h-6 text-white animate-spin" />
                                            ) : profile?.avatar_url ? (
                                                <>
                                                    <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
                                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                        <span className="text-white text-xs font-medium">View</span>
                                                    </div>
                                                </>
                                            ) : (
                                                <>
                                                    <User className="w-8 h-8 text-white" />
                                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                        <Camera className="w-5 h-5 text-white" />
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFileChange}
                                            className="hidden"
                                        />
                                        <span className="font-bold text-lg text-white">
                                            {profile?.name || currentUser.email?.split("@")[0]}
                                        </span>
                                        <span className="text-neutral-400 text-xs">
                                            {currentUser.email}
                                        </span>
                                        <button
                                            onClick={handleChangePhotoClick}
                                            className="text-red-400 hover:text-red-300 text-xs mt-1 flex items-center gap-1"
                                        >
                                            <Camera className="w-3 h-3" />
                                            Change Photo
                                        </button>
                                    </div>

                                    <hr className="border-white/10 mb-4" />

                                    {/* Current Plan Section with Dropdown */}
                                    <div className="mb-4">
                                        <button
                                            onClick={() => setPlanOpen(!planOpen)}
                                            className="w-full flex items-center justify-between text-sm text-neutral-300 hover:text-white transition-colors"
                                        >
                                            <div className="flex items-center gap-2">
                                                <CreditCard className="w-4 h-4" />
                                                <span>Current Plan: <b>{userPrograms.length > 0 ? `${userPrograms.length} Programs` : "Free"}</b></span>
                                            </div>
                                            <ChevronDown className={`w-4 h-4 transition-transform ${planOpen ? "rotate-180" : ""}`} />
                                        </button>

                                        <AnimatePresence>
                                            {planOpen && (
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: 1, height: "auto" }}
                                                    exit={{ opacity: 0, height: 0 }}
                                                    className="mt-3 space-y-2 overflow-hidden"
                                                >
                                                    {userPrograms.length === 0 ? (
                                                        <p className="text-neutral-500 text-xs text-center py-2">
                                                            No active programs
                                                        </p>
                                                    ) : (
                                                        userPrograms.map(prog => (
                                                            <div
                                                                key={prog.id}
                                                                className="flex items-center justify-between bg-neutral-800/50 rounded-lg p-2"
                                                            >
                                                                <div>
                                                                    <p className="text-sm font-medium">{prog.program_name}</p>
                                                                    <p className="text-xs text-neutral-500">{formatPrice(prog.price)}/mo</p>
                                                                </div>
                                                                <button
                                                                    onClick={() => handleDeactivateProgram(prog.program_id)}
                                                                    disabled={programsLoading}
                                                                    className="text-red-400 hover:text-red-300 text-xs flex items-center gap-1"
                                                                >
                                                                    <XCircle className="w-3 h-3" />
                                                                    Leave
                                                                </button>
                                                            </div>
                                                        ))
                                                    )}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>

                                    <div className="space-y-3 text-sm">
                                        <Link
                                            href="/feedback"
                                            onClick={() => setUserOpen(false)}
                                            className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors"
                                        >
                                            <MessageSquare className="w-4 h-4" /> Give Feedback
                                        </Link>
                                        <Link
                                            href="/contact"
                                            onClick={() => setUserOpen(false)}
                                            className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors"
                                        >
                                            <HelpCircle className="w-4 h-4" /> Contact Us
                                        </Link>
                                    </div>

                                    <hr className="border-white/10 my-4" />

                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center justify-center gap-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 hover:text-red-300 py-2.5 rounded-lg transition-colors cursor-pointer"
                                    >
                                        <LogOut className="w-4 h-4" />
                                        Sign Out
                                    </button>
                                </>
                            ) : (
                                <>
                                    <div className="flex flex-col items-center mb-4">
                                        <div className="w-16 h-16 rounded-full bg-neutral-800 flex items-center justify-center mb-2">
                                            <User className="w-8 h-8 text-neutral-400" />
                                        </div>
                                        <span className="font-bold text-lg text-white">Guest</span>
                                        <span className="text-neutral-400 text-sm">
                                            Sign in to access all features
                                        </span>
                                    </div>

                                    <hr className="border-white/10 mb-4" />

                                    <div className="space-y-3">
                                        <Link
                                            href="/login"
                                            onClick={() => setUserOpen(false)}
                                            className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 text-white py-2.5 rounded-lg transition-colors font-medium"
                                        >
                                            <LogIn className="w-4 h-4" />
                                            Sign In
                                        </Link>
                                        <Link
                                            href="/signup"
                                            onClick={() => setUserOpen(false)}
                                            className="w-full flex items-center justify-center gap-2 bg-neutral-800 hover:bg-neutral-700 text-white py-2.5 rounded-lg transition-colors border border-white/10"
                                        >
                                            <UserPlus className="w-4 h-4" />
                                            Create Account
                                        </Link>
                                    </div>

                                    <hr className="border-white/10 my-4" />

                                    <div className="space-y-2 text-sm">
                                        <Link
                                            href="/contact"
                                            onClick={() => setUserOpen(false)}
                                            className="flex items-center gap-2 text-neutral-400 hover:text-white transition-colors"
                                        >
                                            <HelpCircle className="w-4 h-4" /> Help & Support
                                        </Link>
                                    </div>
                                </>
                            )}
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            {/* ================= MOBILE MENU ================= */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <>
                        <motion.div
                            className="fixed inset-0 bg-black/60 z-40"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setMobileMenuOpen(false)}
                        />

                        <motion.aside
                            className="fixed top-0 right-0 h-full w-64 bg-[#212121] z-50"
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", stiffness: 120, damping: 26 }}
                        >
                            <div className="flex items-center justify-between p-4 border-b border-white/10">
                                <span className="font-bold text-xl">Menu</span>
                                <button onClick={() => setMobileMenuOpen(false)}>
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <nav className="flex flex-col p-5 gap-5">
                                {navItems.map(item => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="text-xl font-semibold text-neutral-300 hover:text-white"
                                    >
                                        {item.name}
                                    </Link>
                                ))}
                            </nav>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </>
    );
};
