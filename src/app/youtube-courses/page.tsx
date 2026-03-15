"use client";

import { useState, useEffect } from "react";
import { Loader2, Play, Youtube, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import CourseCard from "@/components/CourseCard";
import { motion } from "framer-motion";

export default function YoutubeCoursesPage() {
    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [dbInfo, setDbInfo] = useState<{count: string, status: string} | null>(null);

    useEffect(() => {
        const fetchYoutubeCourses = async () => {
            try {
                const res = await fetch(`/api/youtube-courses?t=${Date.now()}`);
                
                const count = res.headers.get('X-DB-Count');
                if (count) setDbInfo({ count, status: 'Active' });

                if (res.ok) {
                    const data = await res.json();
                    if (Array.isArray(data)) {
                        setCourses(data);
                    } else {
                        console.error("YouTube API did not return an array:", data);
                        setCourses([]);
                    }
                } else {
                    console.error("Failed to fetch YouTube courses:", res.status);
                    setCourses([]);
                }
            } catch (err) {
                console.error("Failed to fetch YouTube courses:", err);
                setCourses([]);
            } finally {
                setLoading(false);
            }
        };
        fetchYoutubeCourses();
    }, []);

    return (
        <div className="min-h-screen bg-[var(--background)]">
            <Navbar />
            
            <main className="pt-32 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="mb-20">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex flex-col md:flex-row md:items-end justify-between gap-8"
                    >
                        <div className="max-w-3xl">
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400 text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                                <Youtube size={14} /> Live Stream Knowledge
                            </div>
                            <h1 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter leading-none">
                                YouTube <br /> <span className="text-blue-600">Masterclass</span> Series
                            </h1>
                            <p className="text-xl text-[var(--muted-foreground)] font-medium leading-relaxed">
                                High-quality curated learning paths from the world's best instructors, integrated directly into the Likzz ecosystem.
                            </p>
                        </div>
                        
                        <div className="flex gap-4">
                            <div className="bg-[var(--card)] border border-[var(--border)] p-6 rounded-[2rem] flex flex-col gap-1 min-w-[160px]">
                                <span className="text-4xl font-black text-blue-600 tracking-tighter">{courses.length}</span>
                                <span className="text-[10px] font-black uppercase tracking-widest text-[var(--muted-foreground)]">Active Courses</span>
                            </div>
                            <div className="bg-[var(--card)] border border-[var(--border)] p-6 rounded-[2rem] flex flex-col gap-1 min-w-[160px]">
                                <span className="text-4xl font-black text-red-600 tracking-tighter">HD</span>
                                <span className="text-[10px] font-black uppercase tracking-widest text-[var(--muted-foreground)]">Stream Quality</span>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-40 gap-4">
                        <Loader2 className="animate-spin text-blue-600" size={48} />
                        <p className="text-[var(--muted-foreground)] font-black uppercase tracking-[0.2em] text-xs">Syncing YouTube Database...</p>
                    </div>
                ) : courses.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                        {courses.map((course) => (
                            <CourseCard key={course.id} course={course} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-40 bg-[var(--card)] rounded-[4rem] border-2 border-dashed border-[var(--border)]">
                        <Youtube size={64} className="mx-auto text-[var(--muted-foreground)] mb-6 opacity-20" />
                        <h3 className="text-2xl font-black mb-2 opacity-40 uppercase tracking-widest">No YouTube Courses Found</h3>
                        <p className="text-[var(--muted-foreground)] font-medium">We're currently updating our curated list. Check back soon!</p>
                    </div>
                )}
            </main>
        </div>
    );
}
