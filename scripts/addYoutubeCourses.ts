import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const youtubeCourses = [
    {
        title: "React Full Course",
        video: "https://www.youtube.com/watch?v=bMknfKXIFA8",
        price: 19,
        category: "Development",
        description: "Master React.js from scratch with this comprehensive bootcamp styled course.",
        duration: "12h 30m"
    },
    {
        title: "Node.js Full Course",
        video: "https://www.youtube.com/watch?v=Oe421EPjeBE",
        price: 15,
        category: "Development",
        description: "Learn backend development with Node.js, Express, and MongoDB.",
        duration: "10h 15m"
    },
    {
        title: "Python Programming",
        video: "https://www.youtube.com/watch?v=_uQrJ0TkZlc",
        price: 12,
        category: "Programming",
        description: "A complete guide to Python programming for beginners and intermediates.",
        duration: "8h 45m"
    },
    {
        title: "UI/UX Design Course",
        video: "https://www.youtube.com/watch?v=c9Wg6Cb_YlU",
        price: 10,
        category: "Design",
        description: "Learn the fundamentals of UI/UX design and how to use Figma like a pro.",
        duration: "6h 20m"
    }
];

async function main() {
    console.log("🚀 Starting YouTube Course Seed...");

    // Get an instructor to assign these courses to
    const instructor = await prisma.user.findFirst({
        where: { role: 'INSTRUCTOR' }
    });

    if (!instructor) {
        console.error("❌ No instructor found. Please run the main seed script first.");
        return;
    }

    console.log(`👤 Using instructor: ${instructor.name}`);

    for (const data of youtubeCourses) {
        const videoId = data.video.split("v=")[1]?.split("&")[0];
        if (!videoId) {
            console.error(`⚠️ Could not extract videoId for: ${data.title}`);
            continue;
        }

        const thumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

        const course = await prisma.course.create({
            data: {
                title: data.title,
                description: data.description,
                price: data.price,
                previewVideo: data.video,
                thumbnail: thumbnail,
                category: data.category,
                duration: data.duration,
                rating: 4.5 + Math.random() * 0.5,
                reviews: Math.floor(Math.random() * 500) + 50,
                instructorId: instructor.id,
                isYoutubeCourse: true
            }
        });

        console.log(`✅ Created YouTube Course: ${course.title} (ID: ${course.id})`);
    }

    console.log("✨ YouTube Course Seeding completed!");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
