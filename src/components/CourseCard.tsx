"use client";

export default function CourseCard({ course }: any) {

    return (
        <div className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden">

            <img
                src={course.image || "https://via.placeholder.com/400x200"}
                alt={course.title}
                className="w-full h-44 object-cover"
            />

            <div className="p-4">

                <h2 className="text-lg font-semibold">
                    {course.title}
                </h2>

                <p className="text-gray-500 text-sm">
                    {course.category}
                </p>

                <div className="flex justify-between items-center mt-4">

                    <span className="text-blue-600 font-bold">
                        ₹{course.price}
                    </span>

                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
                        Buy Course
                    </button>

                </div>

            </div>

        </div>
    );
}