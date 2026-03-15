"use client";

import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";

export default function MentorProfile() {

    const params = useParams();
    const router = useRouter();

    const id = params.id;

    const mentors: any = {
        "john-smith": {
            name: "John Smith",
            role: "React Developer",
            exp: "10+ Years Experience",
            bio: "Expert React developer who has trained thousands of students.",
            image: "https://randomuser.me/api/portraits/men/32.jpg"
        },
        "sarah-lee": {
            name: "Sarah Lee",
            role: "Data Scientist",
            exp: "8+ Years Experience",
            bio: "Specialist in Machine Learning and Data Science.",
            image: "https://randomuser.me/api/portraits/women/44.jpg"
        },
        "michael-brown": {
            name: "Michael Brown",
            role: "DevOps Engineer",
            exp: "12+ Years Experience",
            bio: "DevOps specialist helping teams scale infrastructure.",
            image: "https://randomuser.me/api/portraits/men/75.jpg"
        }
    };

    const mentorCourses: any = {
        "john-smith": [
            { title: "React Masterclass", price: 49 },
            { title: "Advanced React Patterns", price: 59 }
        ],
        "sarah-lee": [
            { title: "Machine Learning Bootcamp", price: 79 },
            { title: "Python for Data Science", price: 69 }
        ],
        "michael-brown": [
            { title: "DevOps Fundamentals", price: 59 },
            { title: "Docker & Kubernetes", price: 79 }
        ]
    };

    const mentor = mentors[id as string];
    const courses = mentorCourses[id as string] || [];

    if (!mentor) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <h1>Mentor not found</h1>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-32 flex flex-col items-center px-6">

            {/* Mentor Card */}
            <div className="bg-white shadow-lg rounded-xl p-10 text-center max-w-xl w-full mb-12">

                <img
                    src={mentor.image}
                    className="w-28 h-28 rounded-full mx-auto mb-4 object-cover"
                />

                <h1 className="text-3xl font-bold">{mentor.name}</h1>

                <p className="text-blue-600 mt-1">{mentor.role}</p>

                <p className="text-gray-500 mt-2">{mentor.exp}</p>

                <p className="mt-6 text-gray-600">
                    {mentor.bio}
                </p>

                <button
                    onClick={() => router.push(`/courses?mentor=${id}`)}
                    className="mt-8 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
                >
                    View Courses
                </button>

            </div>


            {/* Mentor Courses Section */}

            <div className="max-w-5xl w-full">

                <h2 className="text-2xl font-bold mb-6 text-center">
                    Courses by {mentor.name}
                </h2>

                <div className="grid md:grid-cols-2 gap-6">

                    {courses.map((course: any, index: number) => (
                        <div
                            key={index}
                            className="bg-white border rounded-lg p-6 shadow hover:shadow-lg transition"
                        >
                            <h3 className="text-lg font-semibold mb-2">
                                {course.title}
                            </h3>

                            <p className="text-gray-500 mb-4">
                                Price: ${course.price}
                            </p>

                            <button
                                onClick={() => router.push("/courses")}
                                className="bg-blue-600 text-white px-4 py-2 rounded"
                            >
                                View Course
                            </button>
                        </div>
                    ))}

                </div>

            </div>

        </div>
    );
}