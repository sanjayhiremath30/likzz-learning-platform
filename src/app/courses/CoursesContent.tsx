"use client";

import { useEffect, useState } from "react";

export default function CoursesContent() {

    const [courses, setCourses] = useState<any[]>([]);

    useEffect(() => {

        async function loadCourses() {
            const res = await fetch("/api/courses");
            const data = await res.json();
            console.log("COURSES:", data);   // 👈 check console
            setCourses(data);
        }

        loadCourses();

    }, []);

    if (!courses.length) {
        return <div style={{ padding: 40 }}>No courses found</div>;
    }

    return (
        <div className="p-10 grid grid-cols-3 gap-6">

            {courses.map((course: any) => (

                <div
                    key={course.id}
                    className="border rounded-xl shadow hover:shadow-lg transition p-4"
                >

                    <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-full h-40 object-cover rounded"
                    />

                    <h2 className="font-bold mt-3">
                        {course.title}
                    </h2>

                    <p className="text-gray-500 text-sm">
                        {course.category}
                    </p>

                    <p className="font-semibold mt-2 text-blue-600">
                        ₹{course.price}
                    </p>

                </div>

            ))}

        </div>
    );
}