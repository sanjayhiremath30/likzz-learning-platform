"use client";

import { useEffect, useState } from "react";
import CourseCard from "@/components/CourseCard";

export default function CoursesContent() {

    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        fetch("/api/courses")
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    setCourses(data);
                } else {
                    console.error("API returned:", data);
                    setCourses([]);
                }
                setLoading(false);
            })
            .catch(err => {
                console.error("Fetch error:", err);
                setLoading(false);
            });

    }, []);

    if (loading) {
        return (
            <div className="p-10 text-center text-gray-500">
                Loading courses...
            </div>
        );
    }

    return (

        <div className="max-w-7xl mx-auto px-6 py-10">

            <h1 className="text-3xl font-bold mb-8">
                Courses
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {courses.length === 0 ? (
                    <p>No courses found</p>
                ) : (
                    courses.map((course) => (
                        <CourseCard key={course.id} course={course} />
                    ))
                )}

            </div>

        </div>

    );
}