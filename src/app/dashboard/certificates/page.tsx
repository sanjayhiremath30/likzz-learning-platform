"use client";

import { Award, Download, ExternalLink, ShieldCheck, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

export default function CertificatesPage() {
    const { status } = useSession();
    const [certificates, setCertificates] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCertificates = async () => {
            try {
                const res = await fetch("/api/certificates");
                if (res.ok) {
                    const data = await res.json();
                    setCertificates(data);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        if (status === "authenticated") {
            fetchCertificates();
        }
    }, [status]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-40 gap-4">
                <Loader2 className="animate-spin text-blue-600" size={40} />
                <p className="text-[var(--muted-foreground)] font-medium">Loading certificates...</p>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto space-y-12">
            <div>
                <h1 className="text-4xl font-extrabold tracking-tight mb-2">My Certificates 🏆</h1>
                <p className="text-[var(--muted-foreground)] text-lg">View, download and share your official industry-recognized certifications.</p>
            </div>

            {certificates.length > 0 ? (
                <div className="grid md:grid-cols-2 gap-8">
                    <AnimatePresence>
                        {certificates.map((cert, i) => (
                            <motion.div
                                key={cert.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="bg-[var(--card)] border border-[var(--border)] rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl transition-all flex flex-col group"
                            >
                                {/* Certificate Preview Mockup */}
                                <div className="h-56 bg-gradient-to-br from-blue-900 via-indigo-950 to-black p-8 flex flex-col justify-between relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12 group-hover:scale-110 transition-transform duration-700">
                                        <ShieldCheck size={180} className="text-white" />
                                    </div>
                                    <div className="flex justify-between items-start relative z-10">
                                        <div className="bg-white/10 p-3 rounded-2xl backdrop-blur-xl border border-white/20 text-white shadow-2xl">
                                            <Award size={28} />
                                        </div>
                                        <div className="text-right">
                                            <span className="text-[10px] text-blue-200 font-black uppercase tracking-[0.2em] bg-blue-500/20 border border-blue-500/30 px-3 py-1.5 rounded-full backdrop-blur-md">Verified</span>
                                        </div>
                                    </div>
                                    <div className="relative z-10 mt-auto">
                                        <h3 className="text-white text-xl font-bold leading-tight mb-2 group-hover:text-blue-200 transition-colors uppercase tracking-tight">{cert.course.title}</h3>
                                        <div className="flex items-center gap-2">
                                            <div className="w-6 h-px bg-blue-500"></div>
                                            <p className="text-blue-400 text-[10px] font-black tracking-widest uppercase">ID: {cert.certId}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-8">
                                    <div className="space-y-4 mb-10">
                                        <div className="flex justify-between text-sm pb-4 border-b border-[var(--border)] border-dashed">
                                            <span className="text-[var(--muted-foreground)] font-bold uppercase tracking-wider text-[10px]">Issued Date</span>
                                            <span className="font-bold">{new Date(cert.issuedAt).toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex justify-between text-sm pb-4 border-b border-[var(--border)] border-dashed">
                                            <span className="text-[var(--muted-foreground)] font-bold uppercase tracking-wider text-[10px]">Credential ID</span>
                                            <span className="font-mono text-xs overflow-hidden text-ellipsis max-w-[150px]">{cert.certId}</span>
                                        </div>
                                    </div>

                                    <div className="flex gap-4">
                                        <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold py-4 rounded-2xl transition-all flex items-center justify-center gap-2 active:scale-95 shadow-lg shadow-blue-600/20">
                                            <Download size={18} /> Download PDF
                                        </button>
                                        <button className="p-4 bg-[var(--muted)] hover:bg-[var(--border)] rounded-2xl transition-all text-[var(--muted-foreground)] hover:text-blue-600 active:scale-95 shadow-sm">
                                            <ExternalLink size={20} />
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            ) : (
                <div className="py-32 px-10 text-center bg-[var(--card)] rounded-3xl border border-[var(--border)] border-dashed">
                    <div className="text-6xl mb-6">🎓</div>
                    <h3 className="text-2xl font-bold mb-3">No certificates yet</h3>
                    <p className="text-[var(--muted-foreground)] mb-10 max-w-md mx-auto">Complete your first course to earn your authenticated industry-recognized certificate.</p>
                    <Link href="/courses" className="bg-blue-600 text-white px-10 py-4 rounded-full font-bold hover:bg-blue-700 transition-all shadow-xl hover:shadow-blue-600/30 inline-block">
                        Start Learning Today
                    </Link>
                </div>
            )}

            <div className="bg-gradient-to-br from-blue-600 to-indigo-800 rounded-[2.5rem] p-10 text-white shadow-2xl flex flex-col lg:flex-row items-center gap-10">
                <div className="w-24 h-24 rounded-3xl bg-white/20 backdrop-blur-xl flex items-center justify-center text-white shrink-0 border border-white/20 shadow-2xl">
                    <ShieldCheck size={48} className="drop-shadow-lg" />
                </div>
                <div className="text-center lg:text-left">
                    <h4 className="font-black text-2xl mb-2 uppercase tracking-tight">Blockchain Verification Enabled</h4>
                    <p className="text-blue-100/80 text-lg leading-relaxed max-w-2xl">
                        All certificates issued by LIKZZ are secured by blockchain technology. This ensures they are tamper-proof and can be instantly verified by employers globally.
                    </p>
                </div>
                <button className="lg:ml-auto whitespace-nowrap bg-white text-blue-900 px-8 py-4 rounded-2xl font-black text-sm hover:bg-blue-50 transition-all active:scale-95 shadow-xl uppercase tracking-widest">
                    Verify Link
                </button>
            </div>
        </div>
    );
}
