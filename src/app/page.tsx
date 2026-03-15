"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import {
  Play,
  Search,
  BookOpen,
  Award,
  MonitorPlay,
  Star,
  Users,
  ChevronRight,
  TrendingUp,
  BrainCircuit,
  Loader2
} from "lucide-react";
import Link from "next/link";
import clsx from "clsx";
import CourseCard from "@/components/CourseCard";
import Navbar from "@/components/Navbar";

export default function Home() {
  const { data: session, status } = useSession();
  const [categories, setCategories] = useState<any[]>([]);
  const [featuredCourses, setFeaturedCourses] = useState<any[]>([]);
  const [youtubeCourses, setYoutubeCourses] = useState<any[]>([]);
  const [isLoadingMain, setIsLoadingMain] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, courseRes, youtubeRes] = await Promise.all([
          fetch("/api/categories"),
          fetch("/api/courses?featured=true"),
          fetch("/api/youtube-courses")
        ]);
        
        if (catRes.ok) {
          const catData = await catRes.json();
          setCategories(Array.isArray(catData) ? catData : []);
        }
        
        if (courseRes.ok) {
          const courseData = await courseRes.json();
          setFeaturedCourses(Array.isArray(courseData) ? courseData : []);
        }
        
        if (youtubeRes.ok) {
          const ytData = await youtubeRes.json();
          if (Array.isArray(ytData)) {
            setYoutubeCourses(ytData.slice(0, 4));
          } else {
            setYoutubeCourses([]);
          }
        }
      } catch (err) {
        console.error("Home page fetch error:", err);
      } finally {
        setIsLoadingMain(false);
      }
    };
    fetchData();
  }, []);

  if (isLoadingMain) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <Loader2 className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)] selection:bg-blue-500/30">
      <Navbar />

      <main>
        {/* Hero Section */}
        <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 overflow-hidden pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[120px] rounded-full"></div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-bold mb-6 border border-blue-100 dark:border-blue-800">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                  </span>
                  New Courses Added Weekly
                </div>
                <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight mb-8 leading-[1.1]">
                  Advance Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Career</span> with Professional Courses
                </h1>
                <p className="text-xl text-[var(--muted-foreground)] mb-10 leading-relaxed max-w-xl">
                  Learn from industry experts and master the skills that top tech companies are looking for. Access {featuredCourses.length * 5}+ professional videos today.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/courses" className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-5 rounded-2xl font-black text-lg transition-all shadow-2xl shadow-blue-600/30 flex items-center justify-center gap-2 active:scale-95 text-center">
                    Explore Courses <ChevronRight size={20} />
                  </Link>
                  <Link href="/register" className="bg-[var(--card)] border border-[var(--border)] hover:border-blue-500 px-10 py-5 rounded-2xl font-bold text-lg transition-all flex items-center justify-center gap-2 active:scale-95 text-center">
                    Get Started Free
                  </Link>
                </div>

                <div className="mt-12 flex items-center gap-6">
                  <div className="flex -space-x-4">
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} className="w-12 h-12 rounded-full border-4 border-[var(--background)] bg-gray-200 overflow-hidden">
                        <img src={`https://i.pravatar.cc/150?u=${i + 10}`} alt="User" />
                      </div>
                    ))}
                  </div>
                  <div className="text-sm font-bold">
                    <div className="flex items-center gap-1 text-amber-500 mb-1">
                      {[1, 2, 3, 4, 5].map(i => <Star key={i} size={14} fill="currentColor" />)}
                    </div>
                    <p className="text-[var(--muted-foreground)]">Trusted by 10k+ Students Worldwide</p>
                  </div>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="relative"
              >
                <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-[var(--card)] aspect-video group">
                  <img
                    src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80"
                    alt="Platform Preview"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <button className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/30 hover:scale-110 transition-transform group/btn">
                      <div className="w-16 h-16 rounded-full bg-blue-600 flex items-center justify-center shadow-2xl shadow-blue-600/50 group-hover/btn:bg-blue-700">
                        <Play fill="white" size={32} />
                      </div>
                    </button>
                  </div>
                </div>

                {/* Floating Cards */}
                <div className="absolute -top-10 -right-10 bg-[var(--card)] p-6 rounded-[2rem] shadow-2xl border border-[var(--border)] animate-bounce-slow hidden sm:block">
                  <div className="flex items-center gap-4">
                    <div className="bg-green-100 dark:bg-green-900/30 p-3 rounded-2xl text-green-600">
                      <TrendingUp size={24} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[var(--muted-foreground)] uppercase tracking-wider">Course Progress</p>
                      <h4 className="text-lg font-black">75% Completed</h4>
                    </div>
                  </div>
                </div>

                <div className="absolute -bottom-10 -left-10 bg-[var(--card)] p-6 rounded-[2rem] shadow-2xl border border-[var(--border)] animate-pulse hidden sm:block">
                  <div className="flex items-center gap-4">
                    <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-2xl text-blue-600">
                      <Award size={24} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-[var(--muted-foreground)] uppercase tracking-wider">New Certificate</p>
                      <h4 className="text-lg font-black">UI/UX Design Specialist</h4>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Categories Section */}
        <section className="py-24 bg-[var(--muted)]/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="text-4xl font-extrabold mb-4 tracking-tight">Top Learning Categories</h2>
              <p className="text-lg text-[var(--muted-foreground)] max-w-2xl mx-auto font-medium">
                Whatever your goal is, we have a category that fits your needs perfectly.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {categories.map((cat, i) => {
                const getCategoryColor = (name: string) => {
                  const colors: any = {
                    "Development": "blue",
                    "Design": "purple",
                    "Business": "green",
                    "Marketing": "orange",
                    "Data Science": "pink",
                    "Photography": "indigo"
                  };
                  return colors[name] || "indigo";
                };
                const color = getCategoryColor(cat.name);

                return (
                  <Link
                    href={`/courses?category=${cat.name}`}
                    key={cat.name}
                    className="group"
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                      className="bg-[var(--card)] border border-[var(--border)] p-8 rounded-[2rem] text-center hover:border-blue-500 hover:shadow-2xl hover:shadow-blue-500/10 transition-all flex flex-col items-center h-full group-hover:-translate-y-2"
                    >
                      <div className={clsx(
                        "w-16 h-16 rounded-2xl flex items-center justify-center mb-6 text-white shadow-lg transition-transform group-hover:scale-110 group-hover:rotate-3",
                        color === "blue" ? "bg-blue-600 shadow-blue-600/20" :
                          color === "green" ? "bg-emerald-600 shadow-emerald-600/20" :
                            color === "purple" ? "bg-purple-600 shadow-purple-600/20" :
                              color === "orange" ? "bg-orange-600 shadow-orange-600/20" :
                                color === "pink" ? "bg-pink-600 shadow-pink-600/20" :
                                  "bg-indigo-600 shadow-indigo-600/20"
                      )}>
                        {cat.name === "Development" && <BrainCircuit size={32} />}
                        {cat.name === "Design" && <Award size={32} />}
                        {cat.name === "Business" && <TrendingUp size={32} />}
                        {cat.name === "Marketing" && <Award size={32} />}
                        {cat.name === "Data Science" && <MonitorPlay size={32} />}
                        {cat.name === "Photography" && <Award size={32} />}
                        {!["Development", "Design", "Business", "Marketing", "Data Science", "Photography"].includes(cat.name) && <BookOpen size={32} />}
                      </div>
                      <h4 className="font-bold group-hover:text-blue-600 transition-colors uppercase tracking-widest text-xs mb-2">{cat.name}</h4>
                      <p className="text-[10px] text-[var(--muted-foreground)] font-bold">{cat.count} Courses</p>
                    </motion.div>
                  </Link>
                )
              })}
            </div>
          </div>
        </section>

        {/* Featured Courses */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
              <div>
                <h2 className="text-4xl font-extrabold mb-4 tracking-tight">Our Most Popular Courses</h2>
                <p className="text-lg text-[var(--muted-foreground)] font-medium">Join 50,000+ students already learning on LIKZZ.</p>
              </div>
              <Link href="/courses" className="text-blue-600 font-black flex items-center gap-2 hover:gap-4 transition-all uppercase tracking-widest text-sm">
                View All Courses <ChevronRight size={20} />
              </Link>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {featuredCourses.map(course => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          </div>
        </section>

        {/* YouTube Section */}
        {youtubeCourses.length > 0 && (
          <section className="py-24 bg-[#0f172a] text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/20 text-red-400 text-[10px] font-black uppercase tracking-widest mb-4 border border-red-500/30">
                    <MonitorPlay size={14} /> New Masterclasses
                  </div>
                  <h2 className="text-4xl font-extrabold mb-4 tracking-tight">YouTube Masterclasses</h2>
                  <p className="text-lg text-gray-400 font-medium font-medium">Stream high-quality learning directly on LIKZZ.</p>
                </div>
                <Link href="/youtube-courses" className="text-blue-400 font-black flex items-center gap-2 hover:gap-4 transition-all uppercase tracking-widest text-sm">
                  View All Streams <ChevronRight size={20} />
                </Link>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {youtubeCourses.map(course => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Mentors Banner */}
        <section className="py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-br from-blue-600 via-indigo-700 to-blue-800 rounded-[3rem] p-12 lg:p-24 relative overflow-hidden shadow-2xl shadow-blue-600/20">
              <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] pointer-events-none"></div>
              <div className="relative z-10 max-w-2xl">
                <h2 className="text-4xl lg:text-6xl font-black text-white mb-8 leading-tight">
                  Learn from <span className="text-blue-200 underline decoration-indigo-400 decoration-8 underline-offset-8">Mentors</span> at Top Tech Companies
                </h2>
                <p className="text-xl text-blue-100 mb-12 leading-relaxed font-medium">
                  Get personalized feedback, 24/7 AI assistance, and professional guidance to fast-track your success in the industry.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link href="/register" className="bg-white text-blue-700 hover:bg-blue-50 px-10 py-5 rounded-2xl font-black text-lg transition-all shadow-2xl active:scale-95 text-center uppercase tracking-wider">
                    Join LIKZZ Pro
                  </Link>
                  <Link href="/courses" className="bg-blue-500/20 border border-white/30 text-white backdrop-blur-md hover:bg-blue-500/40 px-10 py-5 rounded-2xl font-black text-lg transition-all active:scale-95 text-center uppercase tracking-wider">
                    Our Instructors
                  </Link>
                </div>
              </div>

              <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-blue-400/20 blur-[100px] rounded-full"></div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[var(--card)] border-t border-[var(--border)] pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <div className="bg-blue-600 p-2 rounded-lg text-white">
                  <BrainCircuit size={24} />
                </div>
                <span className="text-2xl font-black tracking-tighter">LIKZZ</span>
              </div>
              <p className="text-[var(--muted-foreground)] leading-relaxed font-medium">
                The modern AI-powered learning platform designed to help you master digital skills and build the career of your dreams.
              </p>
            </div>
            <div>
              <h4 className="font-black mb-8 uppercase tracking-widest text-xs text-blue-600">Explore</h4>
              <ul className="space-y-4 text-sm font-bold text-[var(--muted-foreground)]">
                <li><Link href="/courses" className="hover:text-blue-600 transition-colors">Popular Courses</Link></li>
                <li><Link href="/courses" className="hover:text-blue-600 transition-colors">Learning Tracks</Link></li>
                <li><Link href="/register" className="hover:text-blue-600 transition-colors">Mentorship</Link></li>
                <li><Link href="/register" className="hover:text-blue-600 transition-colors">Enterprise Level</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-black mb-8 uppercase tracking-widest text-xs text-blue-600">Company</h4>
              <ul className="space-y-4 text-sm font-bold text-[var(--muted-foreground)]">
                <li><Link href="/" className="hover:text-blue-600 transition-colors">About Us</Link></li>
                <li><Link href="/" className="hover:text-blue-600 transition-colors">Careers</Link></li>
                <li><Link href="/" className="hover:text-blue-600 transition-colors">Privacy Policy</Link></li>
                <li><Link href="/" className="hover:text-blue-600 transition-colors">Terms of Use</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-black mb-8 uppercase tracking-widest text-xs text-blue-600">Stay Updated</h4>
              <p className="text-[var(--muted-foreground)] text-sm mb-6 font-medium">Get the latest course updates and news.</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="name@email.com"
                  className="bg-[var(--muted)] border border-[var(--border)] px-4 py-3 rounded-xl text-sm focus:border-blue-500 outline-none flex-1 transition-all"
                />
                <button className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20">
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>
          <div className="pt-12 border-t border-[var(--border)] flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-xs font-bold text-[var(--muted-foreground)] uppercase tracking-widest">
              © 2026 LIKZZ EDUCATION PVT LTD. ALL RIGHTS RESERVED.
            </p>
            <div className="flex gap-8">
              <Link href="#" className="text-[var(--muted-foreground)] hover:text-blue-600 transition-colors font-bold text-xs uppercase tracking-widest">Twitter</Link>
              <Link href="#" className="text-[var(--muted-foreground)] hover:text-blue-600 transition-colors font-bold text-xs uppercase tracking-widest">LinkedIn</Link>
              <Link href="#" className="text-[var(--muted-foreground)] hover:text-blue-600 transition-colors font-bold text-xs uppercase tracking-widest">Instagram</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
