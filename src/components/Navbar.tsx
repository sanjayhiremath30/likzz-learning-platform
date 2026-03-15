"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import {
    BrainCircuit,
    ShoppingCart,
    Moon,
    Sun,
    LogOut,
    Menu,
    X
} from "lucide-react";
import Link from "next/link";
import clsx from "clsx";
import { useCart } from "@/context/CartContext";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
    const { data: session, status } = useSession();
    const { cartCount } = useCart();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isDark, setIsDark] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const toggleDarkMode = () => {
        setIsDark(!isDark);
        if (!isDark) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
    };

    return (
        <nav
            className={clsx(
                "fixed top-0 w-full z-50 transition-all duration-300 border-b",
                isScrolled
                    ? "bg-[var(--background)]/80 backdrop-blur-md border-[var(--border)] shadow-sm py-4"
                    : "bg-transparent border-transparent py-6"
            )}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">

                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <div className="bg-blue-600 p-2 rounded-lg text-white">
                        <BrainCircuit size={24} />
                    </div>
                    <span className="text-xl font-bold tracking-tight">LIKZZ</span>
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden md:flex items-center gap-8 text-[var(--foreground)]">
                    <Link href="/" className="text-sm font-medium hover:text-blue-600 transition-colors">
                        Home
                    </Link>

                    <Link href="/courses" className="text-sm font-medium hover:text-blue-600 transition-colors">
                        Courses
                    </Link>

                    <Link href="/youtube-courses" className="text-sm font-medium hover:text-blue-600 transition-colors">
                        YouTube Courses
                    </Link>

                    {/* FIXED LINKS */}
                    <Link href="/pricing" className="text-sm font-medium hover:text-blue-600 transition-colors">
                        Pricing
                    </Link>

                    <Link href="/mentors" className="text-sm font-medium hover:text-blue-600 transition-colors">
                        Mentors
                    </Link>
                </div>

                {/* Right Section */}
                <div className="hidden md:flex items-center gap-4">

                    <button
                        onClick={toggleDarkMode}
                        className="p-2 rounded-full hover:bg-[var(--muted)] transition-colors text-[var(--foreground)]"
                    >
                        {isDark ? <Sun size={20} /> : <Moon size={20} />}
                    </button>

                    {/* Cart */}
                    <Link
                        href="/checkout"
                        className="p-2 rounded-full hover:bg-[var(--muted)] transition-colors relative text-[var(--foreground)]"
                    >
                        <ShoppingCart size={20} />
                        {cartCount > 0 && (
                            <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center">
                                {cartCount}
                            </span>
                        )}
                    </Link>

                    {status === "authenticated" ? (
                        <>
                            <Link
                                href="/dashboard"
                                className="text-sm font-medium hover:text-blue-600 transition-colors px-4 py-2"
                            >
                                Dashboard
                            </Link>

                            <button
                                onClick={() => signOut()}
                                className="text-sm font-medium bg-blue-600 text-white px-5 py-2.5 rounded-full hover:bg-blue-700 flex items-center gap-2"
                            >
                                <LogOut size={16} /> Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                href="/login"
                                className="text-sm font-medium hover:text-blue-600 transition-colors px-4 py-2"
                            >
                                Log in
                            </Link>

                            <Link
                                href="/register"
                                className="text-sm font-medium bg-blue-600 text-white px-5 py-2.5 rounded-full hover:bg-blue-700"
                            >
                                Sign up
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile Toggle */}
                <div className="md:hidden flex items-center gap-4">
                    <Link href="/checkout" className="relative text-[var(--foreground)]">
                        <ShoppingCart size={22} />
                        {cartCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                                {cartCount}
                            </span>
                        )}
                    </Link>

                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="text-[var(--foreground)]"
                    >
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {mobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-[var(--card)] border-b border-[var(--border)] overflow-hidden"
                    >
                        <div className="p-4 space-y-4">
                            <Link href="/" className="block text-lg font-bold">Home</Link>
                            <Link href="/courses" className="block text-lg font-bold">Courses</Link>
                            <Link href="/youtube-courses" className="block text-lg font-bold">YouTube Courses</Link>

                            {/* FIXED MOBILE LINKS */}
                            <Link href="/pricing" className="block text-lg font-bold">Pricing</Link>
                            <Link href="/mentors" className="block text-lg font-bold">Mentors</Link>

                            {status === "authenticated" ? (
                                <>
                                    <Link href="/dashboard" className="block text-lg font-bold">Dashboard</Link>
                                    <button
                                        onClick={() => signOut()}
                                        className="w-full text-left text-lg font-bold text-red-600"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <Link href="/login" className="block text-lg font-bold text-blue-600">
                                    Login
                                </Link>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}