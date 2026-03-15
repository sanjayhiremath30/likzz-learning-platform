"use client";

import { useRouter } from "next/navigation";

export default function MentorsPage() {
    const router = useRouter();

    const mentors = [
        {
            id: "john-smith",
            name: "John Smith",
            role: "React Developer",
            exp: "10+ years",
            image: "https://randomuser.me/api/portraits/men/32.jpg"
        },
        {
            id: "sarah-lee",
            name: "Sarah Lee",
            role: "Data Scientist",
            exp: "8+ years",
            image: "https://randomuser.me/api/portraits/women/44.jpg"
        },
        {
            id: "michael-brown",
            name: "Michael Brown",
            role: "DevOps Engineer",
            exp: "12+ years",
            image: "https://randomuser.me/api/portraits/men/75.jpg"
        }
    ];

    const openMentor = (id: string) => {
        router.push(`/mentors/${id}`);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center pt-24 px-6">

            <h1 className="text-4xl font-bold mb-3">Our Mentors</h1>
            <p className="text-gray-500 mb-12">
                Learn from experienced industry professionals
            </p>

            <div className="grid md:grid-cols-3 gap-10 max-w-6xl w-full">

                {mentors.map((mentor) => (
                    <div
                        key={mentor.id}
                        onClick={() => openMentor(mentor.id)}
                        className="cursor-pointer bg-white rounded-xl shadow-md p-8 text-center border hover:shadow-xl transition hover:-translate-y-1"
                    >
                        <img
                            src={mentor.image}
                            className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                        />

                        <h2 className="text-xl font-semibold">{mentor.name}</h2>

                        <p className="text-gray-600 mt-1">{mentor.role}</p>

                        <p className="text-sm text-gray-400 mt-1">
                            {mentor.exp}
                        </p>

                        <button className="mt-4 text-blue-600 font-medium hover:underline">
                            View Courses
                        </button>

                    </div>
                ))}

            </div>
        </div>
    );
}