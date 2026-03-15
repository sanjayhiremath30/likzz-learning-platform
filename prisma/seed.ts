import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
    console.log("Cleaning database...");
    await prisma.course.deleteMany();
    await prisma.user.deleteMany();

    console.log("Creating default instructor...");
    const instructor = await prisma.user.create({
        data: {
            email: "instructor@likzz.com",
            name: "Dr. Angela Steele",
            role: "INSTRUCTOR",
        } as any,
    });

    const regularCourses = [
        {
            title: "The Web Developer Bootcamp 2026",
            description: "Everything you need to know about web development: HTML, CSS, JS, Node, and more!",
            price: 94.99, category: "Development",
            image: "https://images.unsplash.com/photo-1587620962725-abab7fe55159?auto=format&fit=crop&w=1200",
            previewVideo: "https://media.w3.org/2010/05/sintel/trailer_hd.mp4",
            duration: "64h 30m", rating: 4.8, reviews: 12500, isYoutubeCourse: false, instructorId: instructor.id
        },
        {
            title: "Complete Machine Learning Course",
            description: "Learn Python for Data Science and Machine Learning from scratch.",
            price: 89.99, category: "Data Science",
            image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200",
            previewVideo: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
            duration: "42h 15m", rating: 4.9, reviews: 8200, isYoutubeCourse: false, instructorId: instructor.id
        },
        {
            title: "Mastering UI/UX Design",
            description: "Build beautiful and functional user interfaces using Figma and Adobe XD.",
            price: 79.99, category: "Design",
            image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=1200",
            previewVideo: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
            duration: "28h 00m", rating: 4.7, reviews: 5400, isYoutubeCourse: false, instructorId: instructor.id
        },
        {
            title: "Financial Analysis & Business Modeling",
            description: "Excel basics to advanced financial modeling for business analysis.",
            price: 64.99, category: "Business",
            image: "https://images.unsplash.com/photo-1507679799987-c7377f50a4f1?auto=format&fit=crop&w=1200",
            previewVideo: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
            duration: "18h 45m", rating: 4.6, reviews: 3100, isYoutubeCourse: false, instructorId: instructor.id
        },
        {
            title: "Social Media Marketing Masterclass",
            description: "Grow your brand with Facebook, Instagram, and TikTok marketing.",
            price: 49.99, category: "Marketing",
            image: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=1200",
            previewVideo: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
            duration: "12h 20m", rating: 4.5, reviews: 2100, isYoutubeCourse: false, instructorId: instructor.id
        },
        {
            title: "Python for Everybody Specialization",
            description: "Learn to program and analyze data with Python.",
            price: 0.0, category: "Development",
            image: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200",
            previewVideo: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
            duration: "35h 00m", rating: 4.9, reviews: 45000, isYoutubeCourse: false, instructorId: instructor.id
        },
        {
            title: "Neural Networks and Deep Learning",
            description: "Build and train deep neural networks from the ground up.",
            price: 129.99, category: "Data Science",
            image: "https://images.unsplash.com/photo-1507413245164-6160d8298b31?auto=format&fit=crop&w=1200",
            previewVideo: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackAds.mp4",
            duration: "22h 30m", rating: 4.8, reviews: 15200, isYoutubeCourse: false, instructorId: instructor.id
        },
        {
            title: "The Ultimate Drawing Course",
            description: "Learn to draw icons, characters, and environments from scratch.",
            price: 39.99, category: "Design",
            image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1200",
            previewVideo: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
            duration: "11h 00m", rating: 4.7, reviews: 8900, isYoutubeCourse: false, instructorId: instructor.id
        },
        {
            title: "Negotiation Skills for Professionals",
            description: "Master the art of negotiation and influence.",
            price: 54.99, category: "Business",
            image: "https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200",
            previewVideo: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4",
            duration: "8h 45m", rating: 4.8, reviews: 1200, isYoutubeCourse: false, instructorId: instructor.id
        },
        {
            title: "SEO 2026: Complete Strategy",
            description: "Top ranking strategies for Google and YouTube.",
            price: 44.99, category: "Marketing",
            image: "https://images.unsplash.com/photo-1432888622747-4eb9a8f2c1d1?auto=format&fit=crop&w=1200",
            previewVideo: "http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
            duration: "15h 10m", rating: 4.6, reviews: 950, isYoutubeCourse: false, instructorId: instructor.id
        }
    ];

    const youtubeCourses = [
        {
            title: "React Full Course for Beginners",
            description: "Master React.js from scratch — hooks, context, routing and more in this complete YouTube masterclass.",
            price: 9.00, category: "Development",
            image: "https://img.youtube.com/vi/bMknfKXIFA8/maxresdefault.jpg",
            previewVideo: "https://www.youtube.com/watch?v=bMknfKXIFA8",
            duration: "12h 45m", rating: 4.9, reviews: 15400, isYoutubeCourse: true, instructorId: instructor.id
        },
        {
            title: "Node.js Full Course",
            description: "Learn backend development with Node.js, Express, and MongoDB from scratch.",
            price: 15.00, category: "Development",
            image: "https://img.youtube.com/vi/Oe421EPjeBE/maxresdefault.jpg",
            previewVideo: "https://www.youtube.com/watch?v=Oe421EPjeBE",
            duration: "10h 15m", rating: 4.8, reviews: 9200, isYoutubeCourse: true, instructorId: instructor.id
        },
        {
            title: "Python Programming Full Course",
            description: "Complete Python programming course from beginner to advanced — data structures, OOP, and more.",
            price: 12.00, category: "Programming",
            image: "https://img.youtube.com/vi/_uQrJ0TkZlc/maxresdefault.jpg",
            previewVideo: "https://www.youtube.com/watch?v=_uQrJ0TkZlc",
            duration: "8h 00m", rating: 4.8, reviews: 42000, isYoutubeCourse: true, instructorId: instructor.id
        },
        {
            title: "UI/UX Design with Figma",
            description: "The most comprehensive YouTube course on UI/UX design. Learn professional design systems and handoff.",
            price: 10.00, category: "Design",
            image: "https://img.youtube.com/vi/c9Wg6Cb_YlU/maxresdefault.jpg",
            previewVideo: "https://www.youtube.com/watch?v=c9Wg6Cb_YlU",
            duration: "6h 30m", rating: 4.7, reviews: 8900, isYoutubeCourse: true, instructorId: instructor.id
        },
        {
            title: "Next.js 15 Full Course",
            description: "Master Next.js 15 — App Router, Server Actions, streaming, and deployment on Vercel.",
            price: 19.00, category: "Development",
            image: "https://img.youtube.com/vi/wm5gMKuwSYk/maxresdefault.jpg",
            previewVideo: "https://www.youtube.com/watch?v=wm5gMKuwSYk",
            duration: "11h 00m", rating: 4.9, reviews: 12400, isYoutubeCourse: true, instructorId: instructor.id
        },
        {
            title: "Advanced TypeScript Patterns",
            description: "Learn high-level TypeScript patterns used in industry-scale applications.",
            price: 19.00, category: "Development",
            image: "https://img.youtube.com/vi/h8L0IsLpHe8/maxresdefault.jpg",
            previewVideo: "https://www.youtube.com/watch?v=h8L0IsLpHe8",
            duration: "6h 15m", rating: 4.8, reviews: 4200, isYoutubeCourse: true, instructorId: instructor.id
        }
    ];

    for (const course of [...regularCourses, ...youtubeCourses]) {
        await prisma.course.create({ data: course });
    }

    console.log(`Seed complete: ${regularCourses.length} regular + ${youtubeCourses.length} YouTube courses.`);
}

main()
    .catch((e) => { console.error(e); process.exit(1); })
    .finally(async () => { await prisma.$disconnect(); });