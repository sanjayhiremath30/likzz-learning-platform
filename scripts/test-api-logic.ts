import { PrismaClient } from '@prisma/client';

async function main() {
    const prisma = new PrismaClient();
    try {
        console.log('--- Testing /api/courses logic ---');
        const courses = await prisma.course.findMany({
            include: {
                instructor: {
                    select: {
                        name: true
                    }
                }
            },
            orderBy: {
                createdAt: "desc"
            }
        });
        console.log(`Found ${courses.length} courses`);
        if (courses.length > 0) {
            console.log('First course:', courses[0].title);
        }

        console.log('\n--- Testing /api/youtube-courses logic ---');
        const ytCourses = await prisma.course.findMany({
            where: {
                previewVideo: { not: null },
                isYoutubeCourse: true
            },
            include: {
                instructor: {
                    select: {
                        name: true
                    }
                }
            },
            orderBy: { createdAt: "desc" }
        });
        console.log(`Found ${ytCourses.length} YouTube courses`);
        if (ytCourses.length > 0) {
            console.log('First YT course:', ytCourses[0].title);
        }

    } catch (error) {
        console.error('Logic test failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
