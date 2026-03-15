"use client";

import { useState, useRef, useEffect } from "react";
import { Star, Clock, Users, Play, ShoppingCart, Loader2 } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";

interface CourseCardProps {
    course: {
        id: string;
        title: string;
        instructor: { name: string };
        rating: number;
        reviews: number;
        price: number;
        thumbnail: string;
        previewVideo: string;
        duration: string;
        category: string;
    };
}

export default function CourseCard({ course }: CourseCardProps) {
    const [isHovered, setIsHovered] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [videoError, setVideoError] = useState(false);
    const [isAdding, setIsAdding] = useState(false);
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);
    const { refreshCart } = useCart();

    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (isHovered && videoRef.current && !videoError) {
            videoRef.current.play().catch(() => setVideoError(true));
            timer = setTimeout(() => {
                if (videoRef.current) {
                    videoRef.current.pause();
                    videoRef.current.currentTime = 0;
                }
            }, 8000); // 8 second preview
        } else if (!isHovered && videoRef.current) {
            videoRef.current.pause();
            videoRef.current.currentTime = 0;
        }
        return () => clearTimeout(timer);
    }, [isHovered, videoError]);

    const addToCart = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (isAdding) return;
        setIsAdding(true);

        try {
            const res = await fetch("/api/cart", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ courseId: course.id })
            });

            if (res.ok) {
                await refreshCart();
                // We could add a toast here, but for now simple success state is good
            } else {
                const data = await res.json();
                if (data.error === "Unauthorized") {
                    window.location.href = "/login";
                }
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsAdding(false);
        }
    };

    const [imgSrc, setImgSrc] = useState(course.thumbnail || `https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80`);

    return (
        <motion.div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group bg-[var(--card)] border border-[var(--border)] rounded-[2.5rem] overflow-hidden hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] transition-all duration-500 h-full flex flex-col"
        >
            <Link href={`/courses/${course.id}`} className="block relative h-52 overflow-hidden bg-gray-100">
                <img
                    src={imgSrc}
                    alt={course.title}
                    onError={() => setImgSrc(`https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80`)}
                    className={`w-full h-full object-cover transition-opacity duration-500 ${isVideoPlaying ? 'opacity-0' : 'opacity-100'}`}
                />

                {isHovered && !videoError && (
                    <video
                        ref={videoRef}
                        src={course.previewVideo}
                        muted
                        playsInline
                        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${isVideoPlaying ? 'opacity-100 scale-105' : 'opacity-0 scale-100'}`}
                        onError={() => {
                            setVideoError(true);
                            setIsVideoPlaying(false);
                        }}
                    />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

                <div className="absolute top-4 left-4">
                    <span className="px-4 py-1.5 rounded-full bg-white/90 dark:bg-black/80 backdrop-blur-md text-[10px] font-black uppercase tracking-widest shadow-xl border border-white/20">
                        {course.category}
                    </span>
                </div>

                <AnimatePresence>
                    {isHovered && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                            className="absolute inset-0 flex items-center justify-center pointer-events-none"
                        >
                            <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-xl flex items-center justify-center text-white border border-white/30 shadow-2xl">
                                <Play fill="white" size={28} />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </Link>

            <div className="p-8 flex-1 flex flex-col">
                <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center gap-1 bg-amber-50 dark:bg-amber-900/20 px-2 py-1 rounded-lg">
                        <Star size={14} className="fill-amber-500 text-amber-500" />
                        <span className="text-xs font-black text-amber-700 dark:text-amber-400">{course.rating.toFixed(1)}</span>
                    </div>
                    <span className="text-[10px] text-[var(--muted-foreground)] font-bold uppercase tracking-wider">({course.reviews} Verifications)</span>
                </div>

                <Link href={`/courses/${course.id}`}>
                    <h3 className="font-black text-xl mb-3 leading-[1.2] tracking-tight group-hover:text-blue-600 transition-colors line-clamp-2 h-14">
                        {course.title}
                    </h3>
                </Link>

                <p className="text-xs font-bold text-[var(--muted-foreground)] uppercase tracking-widest mb-6">by {course.instructor.name}</p>

                <div className="flex items-center justify-between mt-auto pt-6 border-t border-[var(--border)]">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black text-[var(--muted-foreground)] uppercase tracking-[0.2em] mb-1">Pricing</span>
                        <span className="text-2xl font-black tracking-tighter">${course.price}</span>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={addToCart}
                            disabled={isAdding}
                            className={`p-4 rounded-2xl transition-all shadow-xl active:scale-90 flex items-center justify-center ${isAdding
                                ? "bg-[var(--muted)] text-[var(--muted-foreground)]"
                                : "bg-blue-600 text-white hover:bg-blue-700 shadow-blue-600/20"
                                }`}
                        >
                            {isAdding ? <Loader2 className="animate-spin" size={20} /> : <ShoppingCart size={20} />}
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
