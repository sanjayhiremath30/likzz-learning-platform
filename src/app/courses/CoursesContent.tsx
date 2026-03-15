"use client";

import { useEffect, useState } from "react";

export default function CoursesContent() {

    const [courses, setCourses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const fetchCourses = async () => {

            try {

                const res = await fetch("/api/courses");

                const data = await res.json();

                setCourses(data || []);

            } catch (error) {

                console.error("Error fetching courses:", error);

            } finally {

                setLoading(false);

            }

        };

        fetchCourses();

    }, []);

    if (loading) {
        return (
            <div className="p-10 text-center">
                Loading courses...
            </div>
        );
    }

    if (!courses || courses.length === 0) {
        return (
            <div className="p-10 text-center">
                No courses found
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