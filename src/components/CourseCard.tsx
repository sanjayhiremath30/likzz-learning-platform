"use client";

export default function CourseCard({ course }: any) {

    return (
        <div className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden">

            <div className="relative h-48 w-full bg-gray-100 overflow-hidden">
                <img
                    src={course.image || `https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80`}
                    alt={course.title}
                    className="w-full h-44 object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                        (e.target as HTMLImageElement).src = `https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80`;
                    }}
                />
            </div>

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