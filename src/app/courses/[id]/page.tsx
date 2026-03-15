"use client";

import { use, useState, useEffect } from "react";
import {
    Star,
    Clock,
    Users,
    Globe,
    Calendar,
    PlayCircle,
    CheckCircle2,
    MessageCircle,
    BrainCircuit,
    Lock,
    ChevronRight,
    ArrowLeft,
    Loader2
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { useCart } from "@/context/CartContext";

export default function CourseDetails({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const { refreshCart } = useCart();
    const [activeTab, setActiveTab] = useState("overview");
    const [course, setCourse] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [addingToCart, setAddingToCart] = useState(false);
    const [imgSrc, setImgSrc] = useState("https://images.unsplash.com/photo-1587620962725-abab7fe55159?auto=format&fit=crop&w=1200");

    useEffect(() => {
        if (course?.thumbnail) {
            setImgSrc(course.thumbnail);
        }
    }, [course]);

    useEffect(() => {
        const fetchCourse = async () => {
            try {
                const res = await fetch(`/api/courses/${id}`);
                if (res.ok) {
                    const data = await res.json();
                    setCourse(data);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchCourse();
    }, [id]);

    const addToCart = async (redirect = false) => {
        setAddingToCart(true);
        try {
            const res = await fetch("/api/cart", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ courseId: id })
            });

            if (res.ok) {
                await refreshCart();
                if (redirect) {
                    router.push("/checkout");
                } else {
                    alert("Added to cart!");
                }
            } else {
                const data = await res.json();
                if (data.error === "Unauthorized") {
                    router.push(`/login?callbackUrl=/courses/${id}`);
                }
            }
        } catch (err) {
            console.error(err);
        } finally {
            setAddingToCart(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-[var(--background)]">
                <Loader2 className="animate-spin text-blue-600" size={56} />
                <p className="text-[var(--muted-foreground)] font-black uppercase tracking-widest text-sm">Initializing Course Stream...</p>
            </div>
        );
    }

    if (!course) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-8 bg-[var(--background)]">
                <div className="text-center">
                    <h1 className="text-6xl font-black mb-4">404</h1>
                    <p className="text-2xl font-bold text-[var(--muted-foreground)] mb-8">Course not found in our database.</p>
                </div>
                <Link href="/courses" className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20">
                    Back to all courses
                </Link>
            </div>
        );
    }


    const getYoutubeId = (url: string) => {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const videoId = course?.isYoutubeCourse || course?.previewVideo?.includes("youtube.com") || course?.previewVideo?.includes("youtu.be")
        ? getYoutubeId(course.previewVideo)
        : null;

    return (
        <div className="min-h-screen bg-[var(--background)] pb-20">
            <Navbar />

            {/* Header / Hero */}
            <div className="bg-[#0f172a] text-white pt-40 pb-20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-500/10 blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <Link href="/courses" className="inline-flex items-center gap-2 text-blue-400 font-black uppercase tracking-[0.2em] text-[10px] mb-12 hover:text-blue-300 transition-colors group">
                        <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" /> Back to Exploration
                    </Link>
                    <div className="grid lg:grid-cols-2 gap-20 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-400 text-[10px] font-black uppercase tracking-[0.2em] mb-8">
                                <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
                                {course.isYoutubeCourse && "YouTube "} {course.category} Certification
                            </div>
                            <h1 className="text-5xl md:text-7xl font-black mb-8 leading-[1.05] tracking-tighter">{course.title}</h1>
                            <p className="text-gray-400 text-xl mb-12 leading-relaxed max-w-2xl font-medium">{course.description}</p>

                            <div className="flex flex-wrap gap-8 text-sm font-bold mb-12 text-gray-400">
                                <div className="flex items-center gap-2"><Star className="text-amber-400 fill-amber-400" size={20} /> <span className="text-white text-lg">{course.rating.toFixed(1)}</span> <span className="text-xs uppercase tracking-widest">({course.reviews} Verifications)</span></div>
                                <div className="flex items-center gap-2"><Users size={20} className="text-blue-400" /> <span className="text-white text-lg">{course.reviews * 10}+</span> <span className="text-xs uppercase tracking-widest">Students</span></div>
                                <div className="flex items-center gap-2"><Clock size={20} className="text-purple-400" /> <span className="text-white text-lg">{course.duration}</span> <span className="text-xs uppercase tracking-widest">Runtime</span></div>
                            </div>

                            <div className="flex items-center gap-5">
                                <div className="w-16 h-16 rounded-[1.5rem] bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center font-black text-2xl shadow-xl shadow-blue-600/30">
                                    {course.instructor.name.charAt(0)}
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-500 uppercase tracking-[0.3em] font-black mb-1">Lead Instructor</p>
                                    <p className="font-black text-2xl tracking-tight">{course.instructor.name}</p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-[var(--card)] text-[var(--foreground)] rounded-[3rem] overflow-hidden border border-[var(--border)] shadow-2xl relative group"
                        >
                            <div className="aspect-video bg-gray-900 group cursor-pointer relative overflow-hidden">
                                {videoId ? (
                                    <iframe
                                        src={`https://www.youtube.com/embed/${videoId}`}
                                        className="w-full h-full"
                                        allowFullScreen
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    />
                                ) : (
                                    <video
                                        src={course.previewVideo || "https://media.w3.org/2010/05/sintel/trailer_hd.mp4"}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                                        controls
                                        poster={imgSrc}
                                        onError={(e: any) => {
                                            e.target.src = "https://media.w3.org/2010/05/sintel/trailer_hd.mp4";
                                        }}
                                    />
                                )}
                            </div>
                            <div className="p-10">
                                <div className="flex items-center gap-4 mb-8">
                                    <span className={`text-5xl font-black tracking-tighter ${course.isYoutubeCourse ? "text-blue-600" : ""}`}>${course.price}</span>
                                    {course.price > 0 && (
                                        <div className="flex items-end gap-2 h-10">
                                            <span className="text-[var(--muted-foreground)] line-through text-lg mb-1 font-bold">${(course.price * 1.5).toFixed(2)}</span>
                                            <span className="bg-red-500 text-white px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest mb-1.5 shadow-lg shadow-red-500/20">33% OFF</span>
                                        </div>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                                    <button
                                        onClick={() => addToCart(true)}
                                        disabled={addingToCart}
                                        className="bg-blue-600 hover:bg-blue-700 text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-blue-600/25 active:scale-[0.98] disabled:opacity-50 uppercase tracking-widest text-xs flex items-center justify-center gap-2"
                                    >
                                        {addingToCart ? <Loader2 className="animate-spin" size={18} /> : <>{course.isYoutubeCourse ? "Start Course" : "Enroll Now"} <ChevronRight size={18} /></>}
                                    </button>
                                    {!course.isYoutubeCourse && (
                                        <button
                                            onClick={() => addToCart(false)}
                                            disabled={addingToCart}
                                            className="bg-[var(--muted)] hover:bg-[var(--border)] text-[var(--foreground)] font-black py-5 rounded-2xl transition-all active:scale-[0.98] disabled:opacity-50 uppercase tracking-widest text-xs border border-[var(--border)]"
                                        >
                                            Add to cart
                                        </button>
                                    )}
                                </div>

                                <div className="space-y-4">
                                    <p className="font-black text-[10px] uppercase tracking-[0.25em] text-[var(--muted-foreground)] mb-6">Platinum Curricula includes:</p>
                                    {[
                                        `${course.duration} On-Demand HD Video`,
                                        "Infinite Lifetime Master Access",
                                        "Exclusive Industry Certification",
                                        "Seamless Desktop & Mobile Sync",
                                        "High-Performance Resource Files"
                                    ].map((item, i) => (
                                        <div key={i} className="flex items-center gap-4 text-xs font-bold leading-relaxed">
                                            <div className="bg-green-100 dark:bg-green-900/30 p-1.5 rounded-lg text-green-500">
                                                <CheckCircle2 size={14} />
                                            </div>
                                            {item}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24 grid lg:grid-cols-3 gap-20">
                <div className="lg:col-span-2">
                    <div className="flex border-b border-[var(--border)] mb-12 overflow-x-auto scrollbar-none gap-4">
                        {["overview", "curriculum", "instructor", "reviews"].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`px-10 py-5 text-xs font-black uppercase tracking-[0.2em] border-b-4 transition-all whitespace-nowrap ${activeTab === tab
                                    ? "border-blue-600 text-blue-600 translate-y-[2px]"
                                    : "border-transparent text-[var(--muted-foreground)] hover:text-blue-500"
                                    }`}
                            >
                                {tab}
                            </button>
                        ))}
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeTab}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.3 }}
                        >
                            {activeTab === "overview" && (
                                <div className="space-y-12">
                                    <div>
                                        <h2 className="text-3xl font-black mb-6 tracking-tight">Systematic Overview</h2>
                                        <div className="prose dark:prose-invert max-w-none text-lg text-[var(--muted-foreground)] leading-relaxed space-y-6 font-medium">
                                            <p>{course.description}</p>
                                            <p>This masterclass is architected for professionals who prioritize excellence. By integrating real-world datasets and cutting-edge paradigms, we ensure that every student emerges with a competitive advantage in the global market.</p>
                                        </div>
                                    </div>
                                    <div className="grid sm:grid-cols-2 gap-8">
                                        <div className="p-10 rounded-[3rem] bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800 shadow-sm">
                                            <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center mb-6 shadow-xl shadow-blue-600/20">
                                                <BrainCircuit size={28} />
                                            </div>
                                            <h4 className="font-black text-xl mb-3">AI Context Layer</h4>
                                            <p className="text-sm text-[var(--muted-foreground)] leading-relaxed font-medium font-medium">Deep integration with Likzz AI for real-time problem solving and semantic explanations of complex concepts.</p>
                                        </div>
                                        <div className="p-10 rounded-[3rem] bg-purple-50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-800 shadow-sm">
                                            <div className="w-14 h-14 rounded-2xl bg-purple-600 text-white flex items-center justify-center mb-6 shadow-xl shadow-purple-600/20">
                                                <PlayCircle size={28} />
                                            </div>
                                            <h4 className="font-black text-xl mb-3">Project Synthesis</h4>
                                            <p className="text-sm text-[var(--muted-foreground)] leading-relaxed font-medium">Build hyper-realistic professional projects that mirror actual industry pipelines and production environments.</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === "curriculum" && (
                                <div className="py-20 text-center bg-[var(--card)] rounded-[4rem] border-2 border-dashed border-[var(--border)]">
                                    <Lock size={48} className="mx-auto text-blue-600 mb-6" />
                                    <h3 className="text-2xl font-black mb-2 uppercase tracking-widest">Locked Curricula</h3>
                                    <p className="text-[var(--muted-foreground)] font-medium">Enroll in the course to unlock 12 sections and 85 comprehensive lessons.</p>
                                </div>
                            )}

                            {activeTab === "instructor" && (
                                <div className="flex flex-col md:flex-row gap-12 items-start bg-[var(--card)] p-12 rounded-[4rem] border border-[var(--border)]">
                                    <div className="w-40 h-40 rounded-[2.5rem] bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-5xl font-black shadow-2xl">
                                        {course.instructor.name.charAt(0)}
                                    </div>
                                    <div className="flex-1">
                                        <div className="mb-8">
                                            <h3 className="text-3xl font-black mb-2 tracking-tight">{course.instructor.name}</h3>
                                            <p className="text-blue-600 font-black uppercase tracking-[0.2em] text-[10px]">Likzz Platinum Faculty Member</p>
                                        </div>
                                        <p className="text-lg text-[var(--muted-foreground)] leading-relaxed mb-10 font-medium">
                                            With over a decade of high-level industrial experience, {course.instructor.name} is a renowned figure in the {course.category} landscape. They prioritize practical application over abstract theory, ensuring students are job-ready from day one.
                                        </p>
                                        <div className="grid grid-cols-3 gap-8">
                                            <div>
                                                <div className="font-black text-2xl tracking-tight">15k+</div>
                                                <div className="text-[10px] text-[var(--muted-foreground)] uppercase font-black tracking-widest">Alumni</div>
                                            </div>
                                            <div>
                                                <div className="font-black text-2xl tracking-tight">4.9/5</div>
                                                <div className="text-[10px] text-[var(--muted-foreground)] uppercase font-black tracking-widest">Rating</div>
                                            </div>
                                            <div>
                                                <div className="font-black text-2xl tracking-tight">24</div>
                                                <div className="text-[10px] text-[var(--muted-foreground)] uppercase font-black tracking-widest">Masters</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>

                <div className="space-y-10">
                    <div className="sticky top-32 space-y-10">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            className="bg-gradient-to-br from-blue-600 via-indigo-700 to-blue-800 rounded-[3rem] p-10 text-white shadow-2xl shadow-blue-600/30 relative overflow-hidden"
                        >
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-[50px] rounded-full"></div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-4 mb-8">
                                    <div className="bg-white/20 p-3 rounded-2xl backdrop-blur-md">
                                        <BrainCircuit size={32} />
                                    </div>
                                    <h3 className="text-xl font-black tracking-tight">AI Synthesis Access</h3>
                                </div>
                                <p className="text-blue-100 text-sm leading-relaxed mb-10 font-medium">
                                    Platinum students receive prioritized LLM processing for instant debugging and architectural consultation 24 hours a day.
                                </p>
                                <button className="w-full bg-white text-blue-700 font-black py-4 rounded-2xl transition-all shadow-xl hover:bg-blue-50 uppercase tracking-widest text-[10px]">Initialize Mentor</button>
                            </div>
                        </motion.div>

                        <div className="bg-[var(--card)] border border-[var(--border)] rounded-[3rem] p-10 shadow-sm">
                            <h4 className="font-black text-xs uppercase tracking-[0.3em] text-[var(--muted-foreground)] mb-8">Course Highlights</h4>
                            <div className="space-y-6">
                                {[
                                    { icon: Users, text: "Elite Student Network", color: "text-blue-500" },
                                    { icon: MessageCircle, text: "Direct Q&A Channels", color: "text-green-500" },
                                    { icon: CheckCircle2, text: "Blockchain Credentials", color: "text-purple-500" },
                                    { icon: Calendar, text: "Perpetual Master Access", color: "text-orange-500" },
                                    { icon: Globe, text: "Multilingual Synthetics", color: "text-pink-500" }
                                ].map((item, i) => (
                                    <div key={i} className="flex items-center gap-5 text-sm font-bold">
                                        <item.icon size={20} className={item.color} />
                                        <span className="tracking-tight">{item.text}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
