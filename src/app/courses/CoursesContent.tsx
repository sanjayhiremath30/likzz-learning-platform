"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function CoursesContent() {

    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [dbInfo, setDbInfo] = useState<{count: string, status: string, masked: string} | null>(null);

    useEffect(() => {

        const fetchCourses = async () => {

            setLoading(true);
            setError(null);

            try {

                const res = await fetch(`/api/courses?t=${Date.now()}`);

                // Read debug headers
                const count = res.headers.get('X-DB-Count');
                const status = res.headers.get('X-DB-Status');
                const masked = res.headers.get('X-DB-Masked');
                
                if (count || status) {
                    setDbInfo({ 
                        count: count || '?', 
                        status: status || 'unknown',
                        masked: masked || 'none'
                    });
                }

                if (!res.ok) {
                    const errData = await res.json().catch(() => ({}));
                    throw new Error(errData.details || errData.error || `Failed to fetch: ${res.status}`);
                }

                const data = await res.json();

                if (data.courses && Array.isArray(data.courses)) {
                    setCourses(data.courses);
                    if (data.debug) {
                        setDbInfo({ 
                            count: data.debug.total?.toString() || data.debug.count?.toString() || '0', 
                            status: data.debug.dbStatus,
                            masked: data.debug.maskedUrl
                        });
                    }
                } else if (Array.isArray(data)) {
                    setCourses(data);
                } else {
                    console.error("API did not return expected structure:", data);
                    setCourses([]);
                }

            } catch (err: any) {
                console.error("Error fetching courses:", err);
                setError(err.message || "An unexpected error occurred");
                setCourses([]);
            } finally {
                setLoading(false);
            }
        };

        fetchCourses();
    }, []);

    if (loading) {
        return (
            <div className="p-10 text-center flex flex-col items-center gap-4">
                <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <p>Establishing Pipeline v3.0...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-10 text-center text-red-600 bg-red-50 m-10 rounded-xl border border-red-100">
                <h3 className="font-bold text-lg mb-2">Protocol Error v3.0</h3>
                <p>{error}</p>
                <button 
                    onClick={() => window.location.reload()}
                    className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                    Retry Handshake
                </button>
            </div>
        );
    }

    if (!courses || courses.length === 0) {
        return (
            <div className="min-h-[70vh] flex flex-col items-center justify-center p-10 bg-white">
                <div className="max-w-3xl w-full">
                    {/* Unique Identifier for v3.0 */}
                    <div className="mb-8 flex items-center justify-between">
                        <span className="bg-blue-600 text-white px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">
                            System Manifest v3.0
                        </span>
                        <span className="text-gray-400 text-[10px] font-mono">
                            {new Date().toLocaleDateString()}
                        </span>
                    </div>

                    <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-[3rem] p-16 text-center shadow-sm">
                        <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                            <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14h.01M10 10h.01M10 6h.01M4 18h16" />
                            </svg>
                        </div>
                        
                        <h2 className="text-4xl font-black text-gray-900 mb-4 tracking-tighter">LIKZZ_SYSTEM_EMPTY_STATE</h2>
                        <p className="text-gray-500 text-lg mb-12 font-medium">
                            The API handshaked successfully (200 OK) but the payload collection is currently empty.
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-12">
                            <button 
                                onClick={() => window.location.reload()}
                                className="bg-blue-600 text-white px-8 py-5 rounded-2xl font-black hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 active:scale-95 uppercase tracking-widest text-xs"
                            >
                                Re-sync with Cloud
                            </button>
                            <Link href="/" className="bg-white border-2 border-gray-100 text-gray-900 px-8 py-5 rounded-2xl font-black hover:border-blue-500 transition-all active:scale-95 uppercase tracking-widest text-xs">
                                Return to Terminal
                            </Link>
                        </div>

                        {dbInfo && (
                            <div className="text-left bg-[#0c0c0e] text-[#55ff55] p-8 rounded-[2.5rem] font-mono text-[11px] overflow-auto border border-white/5 shadow-2xl">
                                <p className="text-gray-600 mb-4 border-b border-white/10 pb-2 flex justify-between">
                                    <span>[SYSTEM_DIAGNOSTICS_V3.0]</span>
                                    <span className="animate-pulse">● LIVE</span>
                                </p>
                                <div className="space-y-1">
                                    <p><span className="text-gray-500">PROVIDER_STATUS:</span> {dbInfo.status}</p>
                                    <p><span className="text-gray-500">RESOURCE_COUNT:</span> {dbInfo.count} (Courses detected in DB)</p>
                                    <p><span className="text-gray-500">ENDPOINT_MASK:</span> {dbInfo.masked}</p>
                                    <p><span className="text-gray-500">CACHE_POLICE:</span> BYPASSING_AGGRESSIVE</p>
                                    <p><span className="text-gray-500">TRACE_ID:</span> {Math.random().toString(36).substring(7).toUpperCase()}</p>
                                </div>
                                <div className="mt-6 pt-4 border-t border-white/10 text-yellow-500/80">
                                    <p className="font-bold">!! ATTENTION ENGINE ERROR !!</p>
                                    <p>If RESOURCE_COUNT is 0 but local matches are found, verify your PRODUCTION ENVIRONMENT VARIABLES in the dashboard.</p>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return (

        <div className="p-10">

            <h1 className="text-3xl font-bold mb-6">
                Courses
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {courses.map((course) => (

                    <div
                        key={course.id}
                        className="border rounded-lg p-5 shadow-sm"
                    >

                        <h3 className="font-semibold text-lg">
                            {course.title || "Untitled Course"}
                        </h3>

                        <p className="text-gray-500">
                            {course.category || "General"}
                        </p>

                        <p className="text-blue-600 font-bold mt-2">
                            ₹{course.price || 0}
                        </p>

                    </div>

                ))}

            </div>

        </div>

    );
}