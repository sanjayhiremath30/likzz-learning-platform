"use client";

import { useSession } from "next-auth/react";
import { User, Lock, Bell, Shield, Camera, Mail, Loader2, Sparkles, Save } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

export default function DashboardSettings() {
    const { data: session, status } = useSession();
    const [saving, setSaving] = useState(false);

    if (status === "loading") {
        return (
            <div className="flex flex-col items-center justify-center py-40 gap-4">
                <Loader2 className="animate-spin text-blue-600" size={40} />
            </div>
        );
    }

    const tabs = [
        { icon: User, label: "Identity", active: true },
        { icon: Lock, label: "Security", active: false },
        { icon: Bell, label: "Notifications", active: false },
        { icon: Shield, label: "Privacy", active: false },
    ];

    return (
        <div className="max-w-4xl mx-auto space-y-12 pb-20">
            <div>
                <h1 className="text-4xl font-black tracking-tight mb-2">Systems Configuration ⚙️</h1>
                <p className="text-[var(--muted-foreground)] font-medium">Manage your academic profile and security protocols.</p>
            </div>

            <div className="flex gap-2 p-1.5 bg-[var(--muted)]/50 rounded-2xl w-fit">
                {tabs.map((tab, i) => (
                    <button
                        key={i}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-black transition-all ${tab.active ? 'bg-[var(--card)] text-blue-600 shadow-sm' : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'}`}
                    >
                        <tab.icon size={18} />
                        <span className="uppercase tracking-widest text-[10px]">{tab.label}</span>
                    </button>
                ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-12">
                <div className="lg:col-span-1 space-y-8">
                    <div className="bg-[var(--card)] border border-[var(--border)] rounded-[3rem] p-10 text-center relative overflow-hidden group">
                        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-br from-blue-600 to-indigo-700 -z-10"></div>
                        <div className="relative inline-block mb-6">
                            <div className="w-32 h-32 rounded-[2.5rem] bg-gray-200 border-8 border-[var(--card)] overflow-hidden shadow-2xl">
                                <img src={`https://i.pravatar.cc/150?u=${session?.user?.email}`} alt="Avatar" className="w-full h-full object-cover" />
                            </div>
                            <button className="absolute bottom-1 right-1 bg-blue-600 text-white p-3 rounded-2xl shadow-xl hover:bg-blue-700 transition-all group/btn border-4 border-[var(--card)]">
                                <Camera size={18} className="group-hover/btn:scale-110 transition-transform" />
                            </button>
                        </div>
                        <h3 className="text-xl font-black mb-1">{session?.user?.name}</h3>
                        <p className="text-xs font-bold text-[var(--muted-foreground)] uppercase tracking-widest mb-6">Student ID: #88294</p>

                        <div className="pt-6 border-t border-[var(--border)] grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-[10px] font-black text-[var(--muted-foreground)] uppercase tracking-widest mb-1">Rank</p>
                                <p className="font-black text-blue-600 uppercase text-xs">Platinum</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-black text-[var(--muted-foreground)] uppercase tracking-widest mb-1">Status</p>
                                <p className="font-black text-emerald-600 uppercase text-xs">Active</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-blue-600 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl shadow-blue-600/20">
                        <Sparkles className="absolute top-4 right-4 text-blue-300 opacity-50" size={40} />
                        <h4 className="text-lg font-black mb-2">Upgrade to Pro</h4>
                        <p className="text-blue-100 text-sm font-medium mb-6">Access 24/7 neural mentors and private labs.</p>
                        <button className="w-full bg-white text-blue-600 font-black py-3 rounded-xl text-xs uppercase tracking-[0.2em] shadow-lg hover:shadow-white/20 transition-all active:scale-95">
                            Learn More
                        </button>
                    </div>
                </div>

                <div className="lg:col-span-2 space-y-10">
                    <section className="bg-[var(--card)] border border-[var(--border)] rounded-[3rem] p-10 space-y-8 shadow-sm">
                        <div className="grid sm:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-[var(--muted-foreground)] uppercase tracking-[0.3em] ml-1">Full Legal Name</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" size={18} />
                                    <input
                                        type="text"
                                        defaultValue={session?.user?.name || ""}
                                        className="w-full bg-[var(--muted)]/50 border border-[var(--border)] pl-12 pr-4 py-4 rounded-2xl focus:border-blue-500 outline-none transition-all font-bold text-sm"
                                    />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <label className="text-[10px] font-black text-[var(--muted-foreground)] uppercase tracking-[0.3em] ml-1">Academic Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" size={18} />
                                    <input
                                        type="email"
                                        defaultValue={session?.user?.email || ""}
                                        disabled
                                        className="w-full bg-[var(--muted)] opacity-60 border border-[var(--border)] pl-12 pr-4 py-4 rounded-2xl outline-none font-bold text-sm cursor-not-allowed"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-[var(--muted-foreground)] uppercase tracking-[0.3em] ml-1">Professional Headline</label>
                            <input
                                type="text"
                                placeholder="E.g. Full Stack Developer | UI Designer"
                                className="w-full bg-[var(--muted)]/50 border border-[var(--border)] px-6 py-4 rounded-2xl focus:border-blue-500 outline-none transition-all font-bold text-sm"
                            />
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-[var(--muted-foreground)] uppercase tracking-[0.3em] ml-1">Personal Bio</label>
                            <textarea
                                rows={4}
                                placeholder="Tell the academy about your goals..."
                                className="w-full bg-[var(--muted)]/50 border border-[var(--border)] px-6 py-4 rounded-2xl focus:border-blue-500 outline-none transition-all font-bold text-sm resize-none"
                            ></textarea>
                        </div>

                        <div className="pt-6 border-t border-[var(--border)] flex justify-end">
                            <button
                                onClick={() => {
                                    setSaving(true);
                                    setTimeout(() => setSaving(false), 1500);
                                }}
                                className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.3em] flex items-center gap-3 hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/20 active:scale-95"
                            >
                                {saving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                                {saving ? 'Synchronizing...' : 'Save Changes'}
                            </button>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
