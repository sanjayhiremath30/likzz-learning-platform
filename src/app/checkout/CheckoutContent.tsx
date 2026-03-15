"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
    ShieldCheck,
    Loader2,
    ShoppingBag,
    Smartphone
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

    const planPrices: Record<string, number> = {
        basic: 9,
        pro: 19,
        premium: 29
    };

    useEffect(() => {

        const fetchCart = async () => {
            try {

                // If "Buy Now" was clicked directly on a course, fetch that course
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
                        return;
                    }
                }

                const res = await fetch("/api/cart");

                if (res.ok) {

                    const data = await res.json();

                    if (plan && data.length === 0) {

                        const price = planPrices[plan] || 0;

                        const planItem = {
                            id: "plan-" + plan,
                            courseId: "plan-" + plan,
                            course: {
                                title: plan.toUpperCase() + " Plan",
                                price: price,
                                thumbnail: "/plan.png",
                                instructor: {
                                    name: "Likzz Platform"
                                }
                            }
                        };

                        setCartItems([planItem]);

                    } else {

                        setCartItems(data);

                    }

                }

            } catch (err) {

                console.error(err);

            } finally {

                setLoading(false);

            }
        };

        if (status === "authenticated") {

            fetchCart();

        } else if (status === "unauthenticated") {

            router.push(`/login?callbackUrl=/checkout${directCourseId ? `?courseId=${directCourseId}` : ""}`);

        }

    }, [status, router, plan, directCourseId]);


    const removeFromCart = async (courseId: string) => {

        if (courseId.startsWith("plan-")) return;

        try {

            const res = await fetch(`/api/cart?courseId=${courseId}`, {
                method: "DELETE"
            });

            if (res.ok) {

                setCartItems(prev =>
                    prev.filter(item => item.courseId !== courseId)
                );

                await refreshCart();

            }

        } catch (err) {

            console.error(err);

        }

    };

    const handleCheckout = async () => {

        setIsProcessing(true);

        setTimeout(async () => {

            try {

                await fetch("/api/cart", { method: "DELETE" });

                await refreshCart();

                router.push("/dashboard?status=success");

            } catch (err) {

                console.error(err);

            } finally {

                setIsProcessing(false);

            }

        }, 2000);

    };

    const total = cartItems.reduce(
        (acc, item) => acc + item.course.price,
        0
    );

    if (loading) {

        return (

            <div className="flex flex-col items-center justify-center py-40 gap-4 mt-20">

                <Loader2 className="animate-spin text-blue-600" size={40} />

                <p className="text-gray-500 text-xs uppercase tracking-widest">
                    Securing session...
                </p>

            </div>

        );

    }

    return (

        <div className="min-h-screen bg-[var(--background)] pt-32 pb-20">

            <div className="max-w-7xl mx-auto px-4">

                <h1 className="text-5xl font-black mb-12">
                    Order Summary 🛍️
                </h1>

                <div className="grid lg:grid-cols-5 gap-12">

                    <div className="lg:col-span-3 space-y-8">

                        {cartItems.length > 0 ? (

                            <div className="bg-white border rounded-3xl p-8 shadow">

                                <AnimatePresence>

                                    {cartItems.map(item => (

                                        <motion.div
                                            key={item.id}
                                            layout
                                            className="flex justify-between items-center border-b pb-6 mb-6"
                                        >

                                            <div className="flex items-center gap-4">

                                                <img
                                                    src={item.course.thumbnail}
                                                    className="w-24 h-16 object-cover rounded"
                                                />

                                                <div>

                                                    <h3 className="font-bold">
                                                        {item.course.title}
                                                    </h3>

                                                    <p className="text-gray-500 text-sm">
                                                        Mentor: {item.course.instructor.name}
                                                    </p>

                                                </div>

                                            </div>

                                            <div className="text-right">

                                                <div className="font-bold">
                                                    ${item.course.price}
                                                </div>

                                                {!item.courseId.startsWith("plan-") && (

                                                    <button
                                                        onClick={() =>
                                                            removeFromCart(item.courseId)
                                                        }
                                                        className="text-red-500 text-xs"
                                                    >
                                                        Remove
                                                    </button>

                                                )}

                                            </div>

                                        </motion.div>

                                    ))}

                                </AnimatePresence>

                            </div>

                        ) : (

                            <div className="text-center py-32 border rounded-3xl">

                                <ShoppingBag className="mx-auto opacity-30" size={80} />

                                <h3 className="text-xl font-bold mt-4">
                                    Empty Transaction
                                </h3>

                                <Link
                                    href="/courses"
                                    className="mt-6 inline-block bg-blue-600 text-white px-6 py-3 rounded-xl"
                                >
                                    Browse Courses
                                </Link>

                            </div>

                        )}

                        <div className="bg-blue-50 border rounded-2xl p-6 flex gap-4">

                            <Smartphone className="text-blue-600" size={32} />

                            <div>

                                <p className="font-bold">
                                    UPI Payment
                                </p>

                                <p className="text-sm text-gray-500">
                                    Pay securely with PhonePe, Google Pay or UPI.
                                </p>

                            </div>

                        </div>

                    </div>

                    <div className="lg:col-span-2 space-y-8">

                        <div className="bg-white border rounded-3xl p-10 shadow">

                            <h2 className="text-2xl font-bold mb-6">
                                Transaction Bill
                            </h2>

                            <div className="space-y-4 mb-6">

                                <div className="flex justify-between">
                                    <span>Gross Total</span>
                                    <span>${(total * 1.5).toFixed(2)}</span>
                                </div>

                                <div className="flex justify-between text-green-600">
                                    <span>Institutional Discount</span>
                                    <span>-${(total * 0.5).toFixed(2)}</span>
                                </div>

                                <div className="flex justify-between text-3xl font-bold">
                                    <span>Net Payable</span>
                                    <span className="text-blue-600">
                                        ${total.toFixed(2)}
                                    </span>
                                </div>

                            </div>

                            <button
                                onClick={handleCheckout}
                                disabled={total === 0 || isProcessing}
                                className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold disabled:opacity-50"
                            >

                                {isProcessing ? "Processing..." : "Authorize Payment"}

                            </button>

                        </div>

                        <div className="bg-white border rounded-3xl p-6 flex gap-4">

                            <ShieldCheck className="text-blue-600" size={32} />

                            <div>

                                <p className="text-xs uppercase font-bold text-blue-600">
                                    Secure Checkout
                                </p>

                                <p className="text-sm text-gray-500">
                                    Payments are encrypted with secure gateway.
                                </p>

                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>

    );
}