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
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/components/ui/Logo";
import { cn } from "@/lib/utils";

const navItems = [
    { name: "Home", href: "/" },
    { name: "Program", href: "/programs" },
    { name: "Grp", href: "/grp" },
    { name: "Team", href: "/plans" },
    { name: "Testimonials", href: "/testimonials" },
];

interface Todo {
    id: number;
    text: string;
    completed: boolean;
}

export const Navbar = () => {
    const pathname = usePathname();

    // Find the current page based on pathname
    const getCurrentPage = () => {
        const currentItem = navItems.find(item => item.href === pathname);
        return currentItem?.name || "Home";
    };

    const [hovered, setHovered] = useState<string | null>(null);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [todoOpen, setTodoOpen] = useState(false);
    const [userOpen, setUserOpen] = useState(false);

    const [todos, setTodos] = useState<Todo[]>([]);
    const [input, setInput] = useState("");

    const remainingCount = todos.filter(t => !t.completed).length;

    // The active pill should show on hovered item, or fall back to current page
    const activePill = hovered || getCurrentPage();

    const addTodo = () => {
        if (!input.trim()) return;
        setTodos(prev => [
            ...prev,
            { id: Date.now(), text: input, completed: false },
        ]);
        setInput("");
    };

    const toggleTodo = (id: number) => {
        setTodos(prev =>
            prev.map(t =>
                t.id === id ? { ...t, completed: !t.completed } : t
            )
        );
    };

    const deleteTodo = (id: number) => {
        setTodos(prev => prev.filter(t => t.id !== id));
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
                            className="relative p-2 rounded-full hover:bg-white/5 text-neutral-400 hover:text-white"
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
                            className="p-2 rounded-full hover:bg-white/5"
                        >
                            <div className="w-9 h-9 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center">
                                <User className="w-4 h-4 text-neutral-300" />
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

                            <div className="flex gap-2 mb-4">
                                <input
                                    value={input}
                                    onChange={e => setInput(e.target.value)}
                                    onKeyDown={e => e.key === "Enter" && addTodo()}
                                    placeholder="Add a task…"
                                    className="flex-1 bg-neutral-800 border border-white/10 rounded-lg px-3 py-2 text-sm"
                                />
                                <button onClick={addTodo} className="bg-red-600 px-3 rounded-lg">
                                    Add
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
                                            onClick={() => toggleTodo(todo.id)}
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
                            className="fixed top-20 right-6 w-80 bg-[#212121] rounded-xl shadow-2xl z-50 p-5"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            <div className="flex flex-col items-center mb-4">
                                <div className="w-16 h-16 rounded-full bg-neutral-800 flex items-center justify-center mb-2">
                                    <User className="w-8 h-8" />
                                </div>
                                <span className="font-bold text-lg">USER</span>
                            </div>

                            <hr className="border-white/10 mb-4" />

                            <div className="space-y-3 text-sm">
                                <div className="flex items-center gap-2">
                                    <CreditCard className="w-4 h-4" /> Current Plan: <b>Free</b>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CreditCard className="w-4 h-4" /> Payment History
                                </div>
                                <button className="flex items-center gap-2 hover:text-white">
                                    <MessageSquare className="w-4 h-4" /> Give Feedback
                                </button>
                                <button className="flex items-center gap-2 hover:text-white">
                                    <HelpCircle className="w-4 h-4" /> Contact Us
                                </button>
                            </div>
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
