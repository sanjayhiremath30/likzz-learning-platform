"use client";

import { useEffect, useState } from "react";

type Course = {
    id: string;
    title: string;
    category: string;
    price: number;
};

export default function CoursesContent() {

    const [courses, setCourses] = useState<Course[]>([]);
    const [category, setCategory] = useState("ALL");
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const fetchCourses = async () => {
            try {

                const res = await fetch("/api/courses");

                const data = await res.json();

                setCourses(data);

            } catch (error) {

                console.error("Failed to fetch courses", error);

            } finally {

                setLoading(false);

            }
        };

        fetchCourses();

    }, []);

    const filteredCourses = courses.filter((course) => {

        if (category === "ALL") return true;

        return course.category?.toLowerCase() === category.toLowerCase();

    });

    if (loading) {
        return (
            <div className="p-10 text-center">
                Loading courses...
            </div>
        );
    }

    return (

        <div className="p-10">

            <h1 className="text-3xl font-bold mb-6">Courses</h1>

            {/* CATEGORY BUTTONS */}

            <div className="flex gap-3 mb-8 flex-wrap">

                {["ALL", "Development", "Design", "Business", "Marketing", "Data Science"].map((cat) => (

                    <button
                        key={cat}
                        onClick={() => setCategory(cat)}
                        className={`px-4 py-2 rounded border ${category === cat ? "bg-blue-600 text-white" : "bg-white"
                            }`}
                    >
                        {cat}
                    </button>

                ))}

            </div>

            {/* COURSES */}

            {filteredCourses.length === 0 ? (

                <div className="text-center text-gray-500">
                    No courses found
                </div>

            ) : (

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                    {filteredCourses.map((course) => (

                        <div
                            key={course.id}
                            className="border rounded-lg p-5 shadow-sm"
                        >

                            <h3 className="font-semibold text-lg">
                                {course.title}
                            </h3>

                            <p className="text-gray-500">
                                {course.category}
                            </p>

                            <p className="text-blue-600 font-bold mt-2">
                                ₹{course.price}
                            </p>

                        </div>

                    ))}

                </div>

            )}

        </div>

    );
}