"use client";

import { useSession } from "next-auth/react";
import { BookOpen, Award, TrendingUp, Clock, PlayCircle, Loader2 } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import clsx from "clsx";

const CourseThumbnail = ({ src, title }: { src: string, title: string }) => {
    const [imgSrc, setImgSrc] = useState(src || `https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80`);
    return (
        <img
            src={imgSrc}
            alt={title}
            onError={() => setImgSrc(`https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80`)}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
    );
};

export default function Dashboard() {
    const { data: session, status } = useSession();
    const [stats, setStats] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await fetch("/api/user/stats");
                if (res.ok) {
                    const data = await res.json();
                    setStats(data);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        if (status === "authenticated") {
            fetchStats();
        }
    }, [status]);

    if (status === "loading" || loading) {
        return (
            <div className="flex flex-col items-center justify-center py-40 gap-4">
                <Loader2 className="animate-spin text-blue-600" size={40} />
                <p className="text-[var(--muted-foreground)] font-medium">Loading your progress...</p>
            </div>
        );
    }

    const statConfig = [
        { icon: BookOpen, label: "Enrolled Courses", value: stats?.enrolledCourses || 0, color: "blue" },
        { icon: Award, label: "Certificates Earned", value: stats?.certificates || 0, color: "amber" },
        { icon: Clock, label: "Hours Learned", value: stats?.hoursLearned || "0", color: "purple" },
        { icon: TrendingUp, label: "Current Streak", value: stats?.streak ? `${stats.streak} Days` : "0 Days", color: "green" },
    ];

    return (
        <div className="max-w-6xl mx-auto space-y-12">
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
            >
                <h1 className="text-4xl font-extrabold tracking-tight mb-2 uppercase tracking-tighter">System Report: {session?.user?.name?.split(' ')[0] || "User"} 🚀</h1>
                <p className="text-[var(--muted-foreground)] text-lg font-medium">Neural synthesis is at 75% efficiency. Continue protocol.</p>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {statConfig.map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: i * 0.1 }}
                        className="bg-[var(--card)] border border-[var(--border)] p-8 rounded-3xl shadow-sm hover:shadow-2xl hover:shadow-blue-500/5 transition-all group"
                    >
                        <div className={clsx(
                            "w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform",
                            stat.color === "blue" ? "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" :
                                stat.color === "amber" ? "bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400" :
                                    stat.color === "purple" ? "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400" :
                                        "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                        )}>
                            <stat.icon size={28} />
                        </div>
                        <p className="text-[10px] font-black text-[var(--muted-foreground)] mb-1 uppercase tracking-[0.2em]">{stat.label}</p>
                        <h3 className="text-3xl font-black tracking-tight">{stat.value}</h3>
                    </motion.div>
                ))}
            </div>

            <div>
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl font-black uppercase tracking-tight">Active Protocols</h2>
                    <Link href="/dashboard/courses" className="text-[10px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-full transition-colors border border-blue-100 dark:border-blue-800">Review All Courses</Link>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {stats?.activeCourses && stats.activeCourses.length > 0 ? (
                        stats.activeCourses.map((course: any, i: number) => (
                            <motion.div
                                key={course.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.4 + i * 0.1 }}
                                className="bg-[var(--card)] border border-[var(--border)] rounded-3xl overflow-hidden shadow-sm group cursor-pointer hover:shadow-2xl transition-all h-full flex flex-col"
                            >
                                <div className="h-40 w-full relative overflow-hidden">
                                    <CourseThumbnail src={course.thumbnail} title={course.title} />
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 backdrop-blur-sm">
                                        <PlayCircle size={56} className="text-white drop-shadow-lg" />
                                    </div>
                                    <div className="absolute top-4 left-4 bg-white/90 dark:bg-black/80 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                                        {course.category}
                                    </div>
                                </div>
                                <div className="p-8 flex-1 flex flex-col">
                                    <h3 className="font-black text-xl mb-1 leading-tight line-clamp-2 group-hover:text-blue-600 transition-colors h-14">{course.title}</h3>
                                    <p className="text-[10px] font-bold text-[var(--muted-foreground)] uppercase tracking-widest mb-6">Mentor: {course.instructor.name}</p>

                                    <div className="mt-auto space-y-3">
                                        <div className="flex justify-between items-end">
                                            <span className="text-[10px] font-black text-[var(--foreground)] uppercase tracking-widest">{course.progress?.toFixed(0) || 0}% SYNCED</span>
                                            <span className="text-[10px] font-bold text-[var(--muted-foreground)] uppercase tracking-widest">Ongoing</span>
                                        </div>
                                        <div className="h-2 w-full bg-[var(--muted)] rounded-full overflow-hidden">
                                            <div className="h-full bg-blue-600 rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(37,99,235,0.5)]" style={{ width: `${course.progress || 0}%` }}></div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    ) : (
                        <div className="col-span-full py-20 px-10 text-center bg-[var(--card)] rounded-3xl border border-[var(--border)] border-dashed">
                            <div className="text-5xl mb-4">📚</div>
                            <h3 className="text-xl font-bold mb-2">No active courses</h3>
                            <p className="text-[var(--muted-foreground)] mb-8">You haven't started any courses yet. Explore our catalog and start learning today!</p>
                            <Link href="/courses" className="bg-blue-600 text-white px-8 py-3 rounded-full font-bold hover:bg-blue-700 transition-all inline-block">
                                Browse Courses
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
