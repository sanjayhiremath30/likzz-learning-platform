"use client";

import { useState, useEffect } from "react";
import { Search, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import CourseCard from "@/components/CourseCard";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function CoursesContent() {
    const searchParams = useSearchParams();
    const initialCategory = searchParams.get("category") || "All";

    const [search, setSearch] = useState("");
    const [activeCategory, setActiveCategory] = useState(initialCategory);
    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCourses = async () => {
            setLoading(true);
            try {
                const res = await fetch(`/api/courses?category=${activeCategory === "All" ? "" : activeCategory}`);
                if (res.ok) {
                    const data = await res.json();
                    setCourses(data);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchCourses();
    }, [activeCategory]);

    const filteredCourses = courses.filter(c =>
        c.title.toLowerCase().includes(search.toLowerCase()) ||
        c.description.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-[var(--background)] pb-20">
            <Navbar />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32">
                <div className="mb-12">
                    <h1 className="text-5xl font-black tracking-tighter mb-4">Explore Courses 🚀</h1>
                    <p className="text-[var(--muted-foreground)] text-lg font-medium">Choose from {courses.length}+ professional video courses with new additions every month.</p>
                </div>

                {/* Filters & Search */}
                <div className="flex flex-col lg:flex-row gap-6 mb-16 items-center">
                    <div className="relative flex-1 w-full lg:w-auto">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" size={24} />
                        <input
                            type="text"
                            placeholder="What do you want to learn today?"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-16 pr-6 py-6 rounded-[2.5rem] bg-[var(--card)] border border-[var(--border)] focus:border-blue-500 outline-none shadow-2xl shadow-blue-500/5 transition-all text-xl font-medium"
                        />
                    </div>
                    <div className="flex gap-4 overflow-x-auto pb-4 lg:pb-0 scrollbar-none w-full lg:w-auto px-2">
                        {["All", "Development", "Design", "Business", "Marketing", "Data Science"].map(cat => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`px-10 py-5 rounded-2xl text-xs font-black uppercase tracking-widest transition-all whitespace-nowrap border ${activeCategory === cat
                                    ? "bg-blue-600 text-white border-blue-600 shadow-2xl shadow-blue-600/20 active:scale-95"
                                    : "bg-[var(--card)] border-[var(--border)] text-[var(--muted-foreground)] hover:border-blue-500 hover:text-blue-600 shadow-sm"
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Results */}
                {loading ? (
                    <div className="flex flex-col items-center justify-center py-60 gap-4">
                        <Loader2 className="animate-spin text-blue-600" size={56} />
                        <p className="text-[var(--muted-foreground)] font-black uppercase tracking-widest text-sm">Synchronizing Courses...</p>
                    </div>
                ) : (
                    <>
                        {filteredCourses.length > 0 ? (
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12">
                                <AnimatePresence mode="popLayout">
                                    {filteredCourses.map((course) => (
                                        <motion.div
                                            key={course.id}
                                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                            animate={{ opacity: 1, scale: 1, y: 0 }}
                                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                            layout
                                        >
                                            <CourseCard course={course} />
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <div className="text-center py-40 bg-[var(--card)] rounded-[4rem] border-2 border-dashed border-[var(--border)]">
                                <h3 className="text-3xl font-black mb-4">No courses found matching "{search}"</h3>
                                <p className="text-[var(--muted-foreground)] text-lg mb-8">Try adjusting your search or filters to find what you're looking for.</p>
                                <button
                                    onClick={() => { setSearch(""); setActiveCategory("All") }}
                                    className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl shadow-blue-600/20"
                                >
                                    Clear All Filters
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}