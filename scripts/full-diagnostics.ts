import { PrismaClient } from '@prisma/client';

async function main() {
    const prisma = new PrismaClient();
    try {
        console.log('--- DB DIAGNOSTICS ---');
        const users = await prisma.user.findMany();
        console.log(`User count: ${users.length}`);
        users.forEach(u => console.log(`- ${u.name} (${u.role}, ${u.email})`));

        const courses = await prisma.course.findMany();
        console.log(`Total Course count (any): ${courses.length}`);

        const ytCourses = await prisma.course.findMany({ where: { isYoutubeCourse: true } });
        console.log(`YouTube Course count: ${ytCourses.length}`);

        const instructor = await prisma.user.findFirst({ where: { role: 'INSTRUCTOR' } });
        console.log(`Found Instructor: ${instructor ? instructor.name : 'NONE'}`);

        if (courses.length > 0) {
            console.log('First Course Data:', JSON.stringify(courses[0], null, 2));
        }

    } catch (error) {
        console.error('DIAGNOSTICS FAILED:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
