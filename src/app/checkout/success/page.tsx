"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle, BookOpen, ArrowRight, Sparkles, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

function SuccessContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const enrolledCount = searchParams.get("enrolled") || "0";
    const total = searchParams.get("total") || "0";

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-800 px-4 py-20">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white dark:bg-gray-900 rounded-[3.5rem] shadow-2xl p-12 md:p-16 max-w-xl w-full text-center border border-white/20 relative overflow-hidden"
            >
                {/* Background Sparkles */}
                <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
                    <div className="absolute top-10 left-10 text-blue-400 opacity-20"><Sparkles size={40} /></div>
                    <div className="absolute bottom-10 right-10 text-indigo-400 opacity-20 rotate-12"><Sparkles size={32} /></div>
                </div>

                <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                    className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-10 shadow-lg shadow-green-500/20"
                >
                    <CheckCircle size={52} className="text-green-600 dark:text-green-400" />
                </motion.div>

                <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter text-gray-900 dark:text-white">
                    {Number(total) > 0 ? "Payment Successful! 🎉" : "Enrollment Successful! 🎉"}
                </h1>

                <p className="text-gray-500 dark:text-gray-400 text-lg font-medium mb-10">
                    {Number(total) > 0 ? `₹${Number(total).toFixed(2)} processed securely` : "Your learning journey begins now."}
                </p>

                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="mt-6 mb-12 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-3xl p-8 transition-all hover:shadow-xl hover:shadow-blue-500/5 group"
                >
                    <div className="flex items-center justify-center gap-4 mb-3">
                        <div className="p-3 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-600/30 group-hover:scale-110 transition-transform">
                            <BookOpen size={24} />
                        </div>
                        <p className="font-black text-blue-700 dark:text-blue-400 text-2xl tracking-tight">
                            {enrolledCount} Course{Number(enrolledCount) !== 1 ? "s" : ""} Activated!
                        </p>
                    </div>
                    <p className="text-blue-600 dark:text-blue-500/80 text-sm font-bold uppercase tracking-widest opacity-80">
                        Synchronized with your digital library
                    </p>
                </motion.div>

                <div className="flex flex-col gap-4">
                    <Link
                        href="/dashboard/enrolled"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white py-5 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-3 shadow-2xl shadow-blue-600/30 active:scale-95 group"
                    >
                        START LEARNING <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link
                        href="/courses"
                        className="w-full border-2 border-gray-100 dark:border-gray-800 text-gray-600 dark:text-gray-400 py-5 rounded-2xl font-black hover:bg-gray-50 dark:hover:bg-gray-800 transition-all uppercase tracking-widest text-xs"
                    >
                        Explore More Courses
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}

export default function SuccessPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="animate-spin text-blue-600" size={40} /></div>}>
            <SuccessContent />
        </Suspense>
    );
}
