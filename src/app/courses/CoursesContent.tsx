"use client";

import { useEffect, useState } from "react";
import CourseCard from "@/components/CourseCard";

export default function CoursesContent() {

    const [courses, setCourses] = useState([]);

    useEffect(() => {

        fetch("/api/courses")
            .then(res => res.json())
            .then(data => setCourses(data));

    }, []);

    return (

        <div className="max-w-7xl mx-auto px-6 py-10">

            <h1 className="text-3xl font-bold mb-8">
                Courses
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {courses.map((course: any) => (
                    <CourseCard
                        key={course.id}
                        course={course}
                    />
                ))}

            </div>

        </div>

    );
}