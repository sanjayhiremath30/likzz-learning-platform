import { PrismaClient } from '@prisma/client';

async function main() {
    const prisma = new PrismaClient();
    try {
        const count = await prisma.course.count();
        console.log(`Course count: ${count}`);
        const ytCount = await prisma.course.count({ where: { isYoutubeCourse: true } });
        console.log(`YouTube Course count: ${ytCount}`);
    } catch (error) {
        console.error('Error checking DB:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
