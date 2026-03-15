"use client";

import { useSession } from "next-auth/react";
import {
    Plus,
    Settings,
    BarChart3,
    BookOpen,
    Users,
    PlayCircle,
    MoreVertical,
    CheckCircle2,
    Clock,
    Loader2,
    TrendingUp
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import clsx from "clsx";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function InstructorDashboard() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("/api/instructor/stats");
                if (res.ok) {
                    const json = await res.json();
                    setData(json);
                } else if (res.status === 401) {
                    router.push("/dashboard"); // Redirect if not instructor
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        if (status === "authenticated") {
            fetchData();
        } else if (status === "unauthenticated") {
            router.push("/login");
        }
    }, [status]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-40 gap-4">
                <Loader2 className="animate-spin text-blue-600" size={40} />
                <p className="text-[var(--muted-foreground)] font-medium">Loading instructor panel...</p>
            </div>
        );
    }

    const stats = [
        { icon: Users, label: "Total Students", value: data?.stats.totalStudents || "0", color: "blue", trend: "+12%" },
        { icon: BarChart3, label: "Course Revenue", value: data?.stats.totalRevenue || "$0", color: "green", trend: "+8%" },
        { icon: BookOpen, label: "Total Courses", value: data?.stats.activeCourses || "0", color: "purple", trend: "0%" },
        { icon: BarChart3, label: "Avg. Rating", value: data?.stats.avgRating || "0.0", color: "amber", trend: "+0.1" },
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12"
            >
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight mb-2">Instructor Panel 👨‍🏫</h1>
                    <p className="text-[var(--muted-foreground)] text-lg">Hello {session?.user?.name}, manage your academy performance here.</p>
                </div>
                <div className="flex gap-4">
                    <button className="bg-[var(--card)] border border-[var(--border)] px-6 py-3 rounded-xl font-bold hover:bg-[var(--muted)] transition-all">
                        <Settings size={20} />
                    </button>
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-xl shadow-blue-600/25 flex items-center gap-2 active:scale-95">
                        <Plus size={22} /> Create New Course
                    </button>
                </div>
            </motion.div>

            {/* Stats */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
                {stats.map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-[var(--card)] border border-[var(--border)] p-8 rounded-[2rem] shadow-sm hover:shadow-xl transition-all"
                    >
                        <div className="flex justify-between items-start mb-6">
                            <div className={`w-14 h-14 rounded-2xl bg-${stat.color}-100 dark:bg-${stat.color}-900/30 text-${stat.color}-600 dark:text-${stat.color}-400 flex items-center justify-center shadow-inner`}>
                                <stat.icon size={28} />
                            </div>
                            <span className="text-[10px] font-black text-green-500 bg-green-50 dark:bg-green-900/20 px-3 py-1.5 rounded-full uppercase tracking-widest">{stat.trend}</span>
                        </div>
                        <p className="text-xs font-black text-[var(--muted-foreground)] mb-1 uppercase tracking-[0.2em]">{stat.label}</p>
                        <h3 className="text-3xl font-black">{stat.value}</h3>
                    </motion.div>
                ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-12">
                {/* Course List */}
                <div className="lg:col-span-2 space-y-8">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold flex items-center gap-3">
                            <BookOpen size={24} className="text-blue-600" /> Your Courses
                        </h2>
                        <span className="text-xs font-bold text-[var(--muted-foreground)] uppercase tracking-widest bg-[var(--muted)] px-3 py-1.5 rounded-full">{data?.courses.length} Total</span>
                    </div>

                    <div className="space-y-4">
                        <AnimatePresence>
                            {data?.courses.map((course: any, i: number) => (
                                <motion.div
                                    key={course.id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: 0.4 + i * 0.05 }}
                                    className="bg-[var(--card)] border border-[var(--border)] p-6 rounded-3xl flex items-center justify-between group hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-500/5 transition-all"
                                >
                                    <div className="flex gap-6 items-center">
                                        <div className="w-20 h-14 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl flex items-center justify-center overflow-hidden border border-[var(--border)]">
                                            <PlayCircle size={28} className="text-blue-600 group-hover:scale-110 transition-transform" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-lg group-hover:text-blue-600 transition-colors tracking-tight">{course.title}</h4>
                                            <div className="flex items-center gap-6 mt-1.5 text-xs text-[var(--muted-foreground)] font-bold uppercase tracking-wider">
                                                <span className="flex items-center gap-1.5"><Users size={14} className="text-blue-500" /> {course.students} Students</span>
                                                <span className="flex items-center gap-1.5"><BarChart3 size={14} className="text-green-500" /> {course.revenue} Earned</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className={clsx(
                                            "text-[10px] uppercase font-black px-3 py-1.5 rounded-full border tracking-widest",
                                            course.status === "Published"
                                                ? "bg-green-50 text-green-700 border-green-100 dark:bg-green-900/10 dark:text-green-400 dark:border-green-800"
                                                : "bg-gray-50 text-gray-700 border-gray-100 dark:bg-gray-900/10 dark:text-gray-400 dark:border-gray-800"
                                        )}>{course.status}</span>
                                        <button className="p-3 hover:bg-[var(--muted)] rounded-2xl transition-colors">
                                            <MoreVertical size={20} />
                                        </button>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="space-y-8">
                    <h2 className="text-2xl font-bold flex items-center gap-3">
                        <TrendingUp size={24} className="text-blue-600" /> Live Feed
                    </h2>
                    <div className="bg-[var(--card)] border border-[var(--border)] rounded-[2.5rem] overflow-hidden divide-y divide-[var(--border)] shadow-sm">
                        {[
                            { user: "Adam Smith", action: "enrolled in", course: "Advanced React", time: "2m ago" },
                            { user: "Emma Watson", action: "completed", course: "UI/UX Basics", time: "15m ago" },
                            { user: "System", action: "verified", course: "Next.js 15 Master", time: "1h ago" },
                            { user: "Liam Noah", action: "left review", course: "Design Systems", time: "3h ago" }
                        ].map((activity, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.6 + i * 0.1 }}
                                className="p-6 flex gap-4 text-sm group hover:bg-[var(--muted)]/50 transition-colors"
                            >
                                <div className="w-10 h-10 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center shrink-0 border border-blue-100 dark:border-blue-800">
                                    <Users size={18} className="text-blue-600" />
                                </div>
                                <div>
                                    <p className="leading-relaxed"><span className="font-bold text-[var(--foreground)]">{activity.user}</span> <span className="text-[var(--muted-foreground)]">{activity.action}</span> <span className="font-bold text-blue-600">{activity.course}</span></p>
                                    <span className="text-[10px] text-[var(--muted-foreground)] uppercase font-black tracking-widest mt-1 block">{activity.time}</span>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
