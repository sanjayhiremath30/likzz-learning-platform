"use client";

import { useState } from "react";
import { ShoppingCart, Star, Clock, Play, Youtube, CheckCircle } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

export default function CourseCard({ course }: any) {
    const [imgSrc, setImgSrc] = useState(
        course.image || `https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80`
    );
    const [cartAdded, setCartAdded] = useState(false);
    const [cartLoading, setCartLoading] = useState(false);
    const [showPlayer, setShowPlayer] = useState(false);
    const { refreshCart } = useCart();

    // Extract YouTube video ID
    const getYouTubeId = (url: string) => {
        if (!url) return null;
        const match = url.match(/(?:v=|youtu\.be\/)([^&?/]+)/);
        return match ? match[1] : null;
    };

    const ytId = course.isYoutubeCourse ? getYouTubeId(course.previewVideo) : null;

    const addToCart = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (cartLoading || cartAdded) return;
        setCartLoading(true);
        try {
            const res = await fetch("/api/cart", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ courseId: course.id }),
            });
            if (res.ok) {
                setCartAdded(true);
                await refreshCart(); // ✅ Update navbar cart count
                setTimeout(() => setCartAdded(false), 3000);
            } else if (res.status === 401) {
                window.location.href = "/login?callbackUrl=/courses";
            }
        } catch (err) {
            console.error(err);
        } finally {
            setCartLoading(false);
        }
    };

    return (
        <>
            {/* YouTube Player Modal */}
            {showPlayer && ytId && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
                    onClick={() => setShowPlayer(false)}
                >
                    <div
                        className="relative w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setShowPlayer(false)}
                            className="absolute top-4 right-4 z-10 w-10 h-10 bg-black/60 text-white rounded-full flex items-center justify-center hover:bg-black transition-all"
                        >
                            ✕
                        </button>
                        <div className="aspect-video w-full">
                            <iframe
                                src={`https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0`}
                                className="w-full h-full"
                                allow="autoplay; encrypted-media; fullscreen"
                                allowFullScreen
                            />
                        </div>
                        <div className="bg-[#0f0f0f] text-white p-6">
                            <p className="text-xs font-black uppercase tracking-widest text-red-400 mb-2 flex items-center gap-2">
                                <Youtube size={14} /> YouTube Course
                            </p>
                            <h3 className="font-black text-xl">{course.title}</h3>
                        </div>
                    </div>
                </div>
            )}

            <div className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col border border-gray-100">

                {/* Thumbnail */}
                <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
                    <img
                        src={imgSrc}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={() => setImgSrc(`https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80`)}
                    />

                    {/* Category badge */}
                    <div className="absolute top-3 left-3">
                        <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm">
                            {course.category}
                        </span>
                    </div>

                    {/* YouTube badge */}
                    {course.isYoutubeCourse && (
                        <div className="absolute top-3 right-3">
                            <span className="px-3 py-1 bg-red-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1">
                                <Youtube size={10} /> YouTube
                            </span>
                        </div>
                    )}

                    {/* Play overlay for YouTube */}
                    {course.isYoutubeCourse && (
                        <button
                            onClick={() => setShowPlayer(true)}
                            className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30"
                        >
                            <div className="w-16 h-16 bg-red-600 text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform">
                                <Play fill="white" size={24} />
                            </div>
                        </button>
                    )}
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-1">

                    <div className="flex items-center gap-2 mb-3">
                        {course.rating && (
                            <div className="flex items-center gap-1">
                                <Star size={12} className="fill-amber-400 text-amber-400" />
                                <span className="text-xs font-black text-amber-600">{Number(course.rating).toFixed(1)}</span>
                            </div>
                        )}
                        {course.duration && (
                            <div className="flex items-center gap-1 text-gray-400">
                                <Clock size={12} />
                                <span className="text-xs font-medium">{course.duration}</span>
                            </div>
                        )}
                    </div>

                    <h2 className="text-base font-black leading-tight mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                        {course.title}
                    </h2>

                    {course.description && (
                        <p className="text-gray-500 text-sm line-clamp-2 mb-4 font-medium">
                            {course.description}
                        </p>
                    )}

                    <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between gap-2">
                        <span className="text-xl font-black text-blue-600">
                            {course.price === 0 ? "FREE" : `₹${course.price}`}
                        </span>

                        <div className="flex items-center gap-2">
                            {/* Add to Cart */}
                            <button
                                onClick={addToCart}
                                disabled={cartLoading}
                                title="Add to Cart"
                                className={`p-2.5 rounded-xl border-2 transition-all active:scale-90 ${
                                    cartAdded
                                        ? "border-green-500 bg-green-50 text-green-600"
                                        : "border-gray-200 hover:border-blue-500 hover:bg-blue-50 text-gray-500 hover:text-blue-600"
                                }`}
                            >
                                {cartAdded ? <CheckCircle size={18} /> : <ShoppingCart size={18} />}
                            </button>

                            {/* Buy Now / Watch */}
                            {course.isYoutubeCourse ? (
                                <button
                                    onClick={() => setShowPlayer(true)}
                                    className="px-4 py-2.5 bg-red-600 text-white text-xs font-black rounded-xl hover:bg-red-700 active:scale-95 transition-all flex items-center gap-1.5 uppercase tracking-widest"
                                >
                                    <Play size={12} fill="white" /> Watch
                                </button>
                            ) : (
                                <Link
                                    href={`/checkout?courseId=${course.id}`}
                                    className="px-4 py-2.5 bg-blue-600 text-white text-xs font-black rounded-xl hover:bg-blue-700 active:scale-95 transition-all uppercase tracking-widest"
                                >
                                    Buy Now
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}