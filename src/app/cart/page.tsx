"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { ShoppingCart, Trash2, BookOpen, ArrowRight, Loader2, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const { refreshCart } = useCart();

    const [cart, setCart] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [removingId, setRemovingId] = useState<string | null>(null);

    const fetchCart = async () => {
        try {
            const res = await fetch("/api/cart");
            if (res.ok) {
                const data = await res.json();
                setCart(data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login?callbackUrl=/cart");
            return;
        }
        if (status === "authenticated") {
            fetchCart();
        }
    }, [status]);

    const removeItem = async (courseId: string) => {
        setRemovingId(courseId);
        try {
            const res = await fetch(`/api/cart?courseId=${courseId}`, { method: "DELETE" });
            if (res.ok) {
                setCart(prev => prev.filter(item => item.courseId !== courseId));
                await refreshCart();
            }
        } catch (err) {
            console.error(err);
        } finally {
            setRemovingId(null);
        }
    };

    const total = cart.reduce((sum, item) => sum + (item.course?.price || 0), 0);

    if (status === "loading" || loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4">
                <Loader2 className="animate-spin text-blue-600" size={40} />
                <p className="text-gray-500 font-medium">Loading your cart...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-32 pb-20">
            <div className="max-w-5xl mx-auto px-4">

                <div className="flex items-center gap-3 mb-2">
                    <ShoppingCart className="text-blue-600" size={34} />
                    <h1 className="text-5xl font-black tracking-tight">Your Cart</h1>
                </div>
                <p className="text-gray-400 font-medium mb-10">
                    {cart.length === 0 ? "Nothing here yet!" : `${cart.length} course${cart.length > 1 ? "s" : ""} ready for checkout`}
                </p>

                {cart.length === 0 ? (
                    <div className="text-center py-32 border-2 border-dashed border-gray-200 rounded-3xl bg-white">
                        <BookOpen className="mx-auto opacity-20 mb-4" size={64} />
                        <h3 className="text-xl font-black mb-2 text-gray-400">Your cart is empty</h3>
                        <p className="text-gray-400 mb-8">Find something amazing to learn today.</p>
                        <Link href="/courses" className="inline-block bg-blue-600 text-white px-8 py-4 rounded-2xl font-black hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20">
                            Browse Courses
                        </Link>
                    </div>
                ) : (
                    <div className="grid lg:grid-cols-5 gap-8">

                        {/* Cart Items */}
                        <div className="lg:col-span-3 space-y-4">
                            <AnimatePresence>
                                {cart.map(item => (
                                    <motion.div
                                        key={item.id}
                                        layout
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, x: -40 }}
                                        className="bg-white rounded-2xl border border-gray-100 p-5 flex gap-4 items-center shadow-sm"
                                    >
                                        <div className="w-20 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                                            {item.course?.image ? (
                                                <img
                                                    src={item.course.image}
                                                    alt={item.course.title}
                                                    className="w-full h-full object-cover"
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&q=80";
                                                    }}
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <BookOpen size={24} className="text-gray-300" />
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-black text-gray-900 leading-tight line-clamp-1">{item.course?.title}</h3>
                                            <p className="text-gray-400 text-sm font-medium mt-0.5">
                                                by {item.course?.instructor?.name || "Likzz Instructor"}
                                            </p>
                                        </div>

                                        <div className="flex items-center gap-4 flex-shrink-0">
                                            <span className="text-xl font-black text-blue-600">
                                                {item.course?.price === 0 ? "FREE" : `₹${item.course?.price?.toFixed(2)}`}
                                            </span>
                                            <button
                                                onClick={() => removeItem(item.courseId)}
                                                disabled={removingId === item.courseId}
                                                className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                                title="Remove from cart"
                                            >
                                                {removingId === item.courseId
                                                    ? <Loader2 size={16} className="animate-spin" />
                                                    : <Trash2 size={16} />
                                                }
                                            </button>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-2">
                            <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm sticky top-32">
                                <h2 className="text-2xl font-black mb-6 text-gray-900">Order Summary</h2>

                                <div className="space-y-3 mb-6">
                                    {cart.map(item => (
                                        <div key={item.id} className="flex justify-between text-sm text-gray-600 font-medium">
                                            <span className="line-clamp-1 flex-1 mr-2">{item.course?.title}</span>
                                            <span className="font-black text-gray-900 flex-shrink-0">
                                                {item.course?.price === 0 ? "FREE" : `₹${item.course?.price?.toFixed(2)}`}
                                            </span>
                                        </div>
                                    ))}
                                </div>

                                <div className="h-px bg-gray-100 mb-4" />

                                <div className="flex justify-between items-center mb-8">
                                    <span className="text-xl font-black text-gray-900">Total</span>
                                    <span className="text-3xl font-black text-blue-600">
                                        {total === 0 ? "FREE" : `₹${total.toFixed(2)}`}
                                    </span>
                                </div>

                                <Link
                                    href="/checkout"
                                    className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black text-base hover:bg-blue-700 active:scale-95 transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-2"
                                >
                                    Proceed to Checkout <ArrowRight size={18} />
                                </Link>

                                <div className="mt-5 flex items-center gap-2 justify-center text-gray-400">
                                    <ShieldCheck size={14} />
                                    <span className="text-xs font-medium">Secure checkout · 256-bit SSL</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}