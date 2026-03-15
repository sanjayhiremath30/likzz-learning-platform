"use client";

import { useEffect, useState } from "react";
import CourseCard from "@/components/CourseCard";
import { Youtube, BookOpen } from "lucide-react";

export default function CoursesContent() {
    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/courses")
            .then(res => res.json())
            .then(data => {
                setCourses(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch(err => {
                console.error("Fetch error:", err);
                setLoading(false);
            });
    }, []);

    const regularCourses = courses.filter(c => !c.isYoutubeCourse);
    const youtubeCourses = courses.filter(c => c.isYoutubeCourse);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-500 font-medium">Loading courses...</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-6 py-10">

            {/* Regular Courses Section */}
            <div className="mb-16">
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                        <BookOpen size={20} className="text-blue-600" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black tracking-tight">All Courses</h1>
                        <p className="text-gray-500 text-sm font-medium">{regularCourses.length} courses available</p>
                    </div>
                </div>

                {regularCourses.length === 0 ? (
                    <div className="border-2 border-dashed border-gray-200 rounded-3xl p-20 text-center text-gray-400">
                        <BookOpen size={48} className="mx-auto mb-4 opacity-30" />
                        <p className="font-black uppercase tracking-widest text-sm">No Courses Found</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {regularCourses.map(course => (
                            <CourseCard key={course.id} course={course} />
                        ))}
                    </div>
                )}
            </div>

            {/* YouTube Courses Section */}
            <div>
                <div className="flex items-center gap-3 mb-8">
                    <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center">
                        <Youtube size={20} className="text-red-600" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-black tracking-tight">YouTube Masterclasses</h2>
                        <p className="text-gray-500 text-sm font-medium">{youtubeCourses.length} free & premium video courses</p>
                    </div>
                </div>

                {youtubeCourses.length === 0 ? (
                    <div className="border-2 border-dashed border-gray-200 rounded-3xl p-20 text-center text-gray-400">
                        <Youtube size={48} className="mx-auto mb-4 opacity-30" />
                        <p className="font-black uppercase tracking-widest text-sm">No YouTube Courses Found</p>
                        <p className="text-xs mt-2">Run the database seed to add YouTube courses.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {youtubeCourses.map(course => (
                            <CourseCard key={course.id} course={course} />
                        ))}
                    </div>
                )}
            </div>

        </div>
    );
}