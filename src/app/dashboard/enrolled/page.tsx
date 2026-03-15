"use client";

import { useSession } from "next-auth/react";
import { BookOpen, PlayCircle, ArrowRight, Loader2, GraduationCap } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function EnrolledCoursesPage() {
    const { status } = useSession();
    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status !== "authenticated") return;

        const fetchEnrolled = async () => {
            try {
                const res = await fetch("/api/user/stats");
                if (res.ok) {
                    const data = await res.json();
                    setCourses(data.activeCourses || []);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchEnrolled();
    }, [status]);

    if (status === "loading" || loading) {
        return (
            <div className="flex flex-col items-center justify-center py-40 gap-4">
                <Loader2 className="animate-spin text-blue-600" size={40} />
                <p className="text-[var(--muted-foreground)] font-medium">Loading your enrolled courses...</p>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto space-y-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <GraduationCap className="text-blue-600" size={32} />
                        <h1 className="text-4xl font-black tracking-tight">Enrolled Courses</h1>
                    </div>
                    <p className="text-[var(--muted-foreground)] font-medium">
                        {courses.length > 0
                            ? `You are enrolled in ${courses.length} course${courses.length > 1 ? "s" : ""}.`
                            : "You haven't enrolled in any courses yet."}
                    </p>
                </div>
                <Link
                    href="/courses"
                    className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-2xl font-black hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20 active:scale-95 text-sm uppercase tracking-wider"
                >
                    Discover More <ArrowRight size={16} />
                </Link>
            </div>

            {courses.length === 0 ? (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="py-32 text-center bg-[var(--card)] rounded-[3rem] border-2 border-dashed border-[var(--border)]"
                >
                    <div className="w-24 h-24 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-8 text-blue-600">
                        <BookOpen size={48} />
                    </div>
                    <h2 className="text-3xl font-black mb-4 tracking-tight">No enrolled courses yet</h2>
                    <p className="text-[var(--muted-foreground)] text-lg mb-10 max-w-md mx-auto font-medium">
                        Browse our catalog, add courses to your cart, and complete checkout to start learning.
                    </p>
                    <Link
                        href="/courses"
                        className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-black transition-all hover:bg-blue-700 shadow-xl shadow-blue-600/30 active:scale-95 inline-block uppercase tracking-wider text-sm"
                    >
                        Browse Courses
                    </Link>
                </motion.div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {courses.map((course: any, i: number) => (
                        <motion.div
                            key={course.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.08 }}
                            className="bg-[var(--card)] border border-[var(--border)] rounded-[2.5rem] overflow-hidden group hover:shadow-2xl hover:shadow-blue-500/10 transition-all flex flex-col h-full"
                        >
                            {/* Thumbnail */}
                            <div className="h-48 w-full relative overflow-hidden bg-gray-100">
                                <img
                                    src={course.thumbnail || course.image || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80"}
                                    alt={course.title}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80";
                                    }}
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                                    <PlayCircle size={64} className="text-white drop-shadow-2xl" />
                                </div>
                                {/* Category Badge */}
                                <div className="absolute top-4 left-4">
                                    <span className="px-4 py-1.5 rounded-full bg-white/90 dark:bg-black/80 backdrop-blur-md text-[10px] font-black uppercase tracking-widest shadow-xl border border-white/20">
                                        {course.category}
                                    </span>
                                </div>
                                {/* "Enrolled" Badge */}
                                <div className="absolute top-4 right-4">
                                    <span className="px-3 py-1.5 rounded-full bg-green-500 text-white text-[10px] font-black uppercase tracking-widest">
                                        ✓ Enrolled
                                    </span>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6 flex-1 flex flex-col">
                                <h3 className="font-black text-xl mb-1 leading-tight group-hover:text-blue-600 transition-colors line-clamp-2">
                                    {course.title}
                                </h3>
                                <p className="text-[10px] font-bold text-[var(--muted-foreground)] uppercase tracking-widest mb-6">
                                    Instructor: {course.instructor?.name || "Likzz Instructor"}
                                </p>

                                {/* Progress */}
                                <div className="mt-auto space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-black text-[var(--foreground)] uppercase tracking-widest">
                                            {(course.progress || 0).toFixed(0)}% Progress
                                        </span>
                                        <span className="text-xs font-bold text-[var(--muted-foreground)] uppercase tracking-widest">
                                            {course.progress >= 100 ? "✅ Complete" : "In Progress"}
                                        </span>
                                    </div>
                                    <div className="h-2 w-full bg-[var(--muted)] rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-blue-600 rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(37,99,235,0.4)]"
                                            style={{ width: `${course.progress || 0}%` }}
                                        />
                                    </div>

                                    <Link
                                        href={`/courses/${course.id}`}
                                        className="w-full mt-2 bg-blue-600 text-white font-black py-3 rounded-2xl flex items-center justify-center gap-2 hover:bg-blue-700 transition-all active:scale-95 group/btn text-sm"
                                    >
                                        {course.progress > 0 ? "Continue Learning" : "Start Learning"}
                                        <ArrowRight size={16} className="group-hover/btn:translate-x-1 transition-transform" />
                                    </Link>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
