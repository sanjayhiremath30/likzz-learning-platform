"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
    ShieldCheck,
    Loader2,
    ShoppingBag,
    Smartphone,
    CheckCircle,
    ArrowRight,
    Trash2,
    BookOpen
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCart } from "@/context/CartContext";

export default function CheckoutContent() {

    const { data: session, status } = useSession();
    const router = useRouter();
    const searchParams = useSearchParams();
    const plan = searchParams.get("plan");
    const directCourseId = searchParams.get("courseId");

    const { refreshCart } = useCart();

    const [cartItems, setCartItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentSuccess, setPaymentSuccess] = useState(false);
    const [enrolledCount, setEnrolledCount] = useState(0);

    const planPrices: Record<string, number> = {
        basic: 9,
        pro: 19,
        premium: 29
    };

    useEffect(() => {
        if (status === "unauthenticated") {
            const callback = directCourseId
                ? `/checkout?courseId=${directCourseId}`
                : "/checkout";
            router.push(`/login?callbackUrl=${encodeURIComponent(callback)}`);
            return;
        }
        if (status !== "authenticated") return;

        const fetchCart = async () => {
            try {
                // Direct Buy Now flow — load just this course
                if (directCourseId) {
                    const courseRes = await fetch(`/api/courses/${directCourseId}`);
                    if (courseRes.ok) {
                        const course = await courseRes.json();
                        setCartItems([{
                            id: "direct-" + course.id,
                            courseId: course.id,
                            course: {
                                ...course,
                                thumbnail: course.image,
                                instructor: course.instructor || { name: "Likzz Instructor" }
                            }
                        }]);
                    }
                    return;
                }

                // Plan upgrade flow
                if (plan) {
                    const price = planPrices[plan] || 0;
                    setCartItems([{
                        id: "plan-" + plan,
                        courseId: "plan-" + plan,
                        course: {
                            title: plan.charAt(0).toUpperCase() + plan.slice(1) + " Plan",
                            price,
                            thumbnail: null,
                            instructor: { name: "Likzz Platform" }
                        }
                    }]);
                    return;
                }

                // Regular cart flow
                const res = await fetch("/api/cart");
                if (res.ok) {
                    const data = await res.json();
                    setCartItems(data);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchCart();
    }, [status, router, plan, directCourseId]);

    // Separate setLoading for direct/plan flows where we return early
    useEffect(() => {
        if (directCourseId || plan) setLoading(false);
    }, [directCourseId, plan]);

    const removeFromCart = async (courseId: string) => {
        if (courseId.startsWith("plan-") || courseId.startsWith("direct-")) return;
        try {
            const res = await fetch(`/api/cart?courseId=${courseId}`, { method: "DELETE" });
            if (res.ok) {
                setCartItems(prev => prev.filter(item => item.courseId !== courseId));
                await refreshCart();
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleCheckout = async () => {
        setIsProcessing(true);
        try {
            // Collect real course IDs (skip plan items)
            const courseIds = cartItems
                .map(item => item.courseId)
                .filter(id => !id.startsWith("plan-") && !id.startsWith("direct-"));

            // Also include direct buy course
            if (directCourseId) courseIds.push(directCourseId);

            // Enroll user in purchased courses
            if (courseIds.length > 0) {
                const enrollRes = await fetch("/api/enroll", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ courseIds })
                });
                if (enrollRes.ok) {
                    const data = await enrollRes.json();
                    setEnrolledCount(data.enrolled || courseIds.length);
                }
            }

            // Clear cart in context
            await refreshCart();
            setPaymentSuccess(true);

        } catch (err) {
            console.error(err);
        } finally {
            setIsProcessing(false);
        }
    };

    const total = cartItems.reduce((acc, item) => acc + (item.course?.price || 0), 0);

    if (status === "loading" || loading) {
        return (
            <div className="flex flex-col items-center justify-center py-40 gap-4 mt-20">
                <Loader2 className="animate-spin text-blue-600" size={40} />
                <p className="text-gray-500 text-xs uppercase tracking-widest">Securing session...</p>
            </div>
        );
    }

    // ✅ Payment Success Screen
    if (paymentSuccess) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50 px-4">
                <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="bg-white rounded-[3rem] shadow-2xl p-16 max-w-lg w-full text-center"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                        className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8"
                    >
                        <CheckCircle size={52} className="text-green-600" />
                    </motion.div>

                    <h1 className="text-4xl font-black mb-3 tracking-tight text-gray-900">
                        Payment Successful! 🎉
                    </h1>

                    <p className="text-gray-500 text-lg font-medium mb-2">
                        ₹{total.toFixed(2)} paid securely
                    </p>

                    {enrolledCount > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="mt-6 mb-10 bg-blue-50 border border-blue-100 rounded-2xl p-6"
                        >
                            <div className="flex items-center justify-center gap-3 mb-2">
                                <BookOpen className="text-blue-600" size={24} />
                                <p className="font-black text-blue-700 text-lg">
                                    {enrolledCount} Course{enrolledCount > 1 ? "s" : ""} Enrolled!
                                </p>
                            </div>
                            <p className="text-blue-600 text-sm font-medium">
                                Your courses are now available in your dashboard.
                            </p>
                        </motion.div>
                    )}

                    <div className="flex flex-col gap-3">
                        <Link
                            href="/dashboard"
                            className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-xl shadow-blue-600/20 active:scale-95"
                        >
                            Go to My Courses <ArrowRight size={18} />
                        </Link>
                        <Link
                            href="/courses"
                            className="w-full border-2 border-gray-100 text-gray-700 py-4 rounded-2xl font-black hover:border-blue-300 transition-all"
                        >
                            Browse More Courses
                        </Link>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-32 pb-20">
            <div className="max-w-6xl mx-auto px-4">

                <h1 className="text-5xl font-black mb-2 tracking-tight">Order Summary 🛍️</h1>
                <p className="text-gray-500 font-medium mb-12">Review your items and complete your purchase.</p>

                <div className="grid lg:grid-cols-5 gap-10">

                    {/* Left — Cart Items */}
                    <div className="lg:col-span-3 space-y-6">

                        {cartItems.length > 0 ? (
                            <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
                                <h2 className="text-xl font-black mb-6 text-gray-800">
                                    Your Items ({cartItems.length})
                                </h2>
                                <AnimatePresence>
                                    {cartItems.map(item => (
                                        <motion.div
                                            key={item.id}
                                            layout
                                            exit={{ opacity: 0, x: -20 }}
                                            className="flex gap-4 items-center border-b border-gray-50 pb-6 mb-6 last:border-0 last:mb-0 last:pb-0"
                                        >
                                            <div className="w-20 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                                                {item.course?.thumbnail || item.course?.image ? (
                                                    <img
                                                        src={item.course.thumbnail || item.course.image}
                                                        className="w-full h-full object-cover"
                                                        alt={item.course.title}
                                                        onError={(e) => {
                                                            (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80";
                                                        }}
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center">
                                                        <BookOpen size={24} className="text-gray-300" />
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex-1">
                                                <h3 className="font-black text-gray-900 leading-tight">
                                                    {item.course?.title}
                                                </h3>
                                                <p className="text-gray-400 text-sm font-medium">
                                                    by {item.course?.instructor?.name || "Likzz Instructor"}
                                                </p>
                                            </div>

                                            <div className="text-right flex flex-col items-end gap-2">
                                                <span className="text-xl font-black text-blue-600">
                                                    ₹{item.course?.price?.toFixed(2)}
                                                </span>
                                                {!item.courseId?.startsWith("plan-") && !item.id?.startsWith("direct-") && (
                                                    <button
                                                        onClick={() => removeFromCart(item.courseId)}
                                                        className="text-red-400 hover:text-red-600 transition-colors"
                                                        title="Remove"
                                                    >
                                                        <Trash2 size={16} />
                                                    </button>
                                                )}
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <div className="text-center py-32 border-2 border-dashed border-gray-200 rounded-3xl bg-white">
                                <ShoppingBag className="mx-auto opacity-20 mb-4" size={64} />
                                <h3 className="text-xl font-black mb-2 text-gray-400">Your cart is empty</h3>
                                <Link href="/courses" className="mt-4 inline-block bg-blue-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-blue-700 transition-all">
                                    Browse Courses
                                </Link>
                            </div>
                        )}

                        {/* Payment Method */}
                        <div className="bg-white border border-gray-100 rounded-2xl p-6 flex gap-4 shadow-sm">
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                <Smartphone className="text-blue-600" size={24} />
                            </div>
                            <div>
                                <p className="font-black text-gray-900">UPI / Card Payment</p>
                                <p className="text-sm text-gray-500 font-medium">
                                    Pay securely with PhonePe, Google Pay, or Debit/Credit Card.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right — Bill Summary */}
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm sticky top-32">
                            <h2 className="text-2xl font-black mb-8 text-gray-900">Bill Summary</h2>

                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between text-gray-600 font-medium">
                                    <span>Subtotal</span>
                                    <span>₹{(total * 1.18).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-green-600 font-bold">
                                    <span>Discount (GST off)</span>
                                    <span>-₹{(total * 0.18).toFixed(2)}</span>
                                </div>
                                <div className="h-px bg-gray-100 my-2" />
                                <div className="flex justify-between items-center">
                                    <span className="text-2xl font-black text-gray-900">Total</span>
                                    <span className="text-3xl font-black text-blue-600">
                                        ₹{total.toFixed(2)}
                                    </span>
                                </div>
                            </div>

                            <button
                                onClick={handleCheckout}
                                disabled={total === 0 || isProcessing || cartItems.length === 0}
                                className="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-blue-700 active:scale-95 transition-all shadow-xl shadow-blue-600/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isProcessing ? (
                                    <>
                                        <Loader2 className="animate-spin" size={20} />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        Pay ₹{total.toFixed(2)} <ArrowRight size={20} />
                                    </>
                                )}
                            </button>

                            <div className="mt-6 flex items-center gap-3 justify-center text-gray-400">
                                <ShieldCheck size={16} />
                                <span className="text-xs font-medium">256-bit SSL encrypted payment</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}