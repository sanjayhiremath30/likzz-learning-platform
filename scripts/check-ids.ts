import { PrismaClient } from '@prisma/client';

async function main() {
    const prisma = new PrismaClient();
    try {
        const user = await prisma.user.findFirst();
        console.log('User ID:', user?.id);
        const course = await prisma.course.findFirst();
        console.log('Course InstructorID:', course?.instructorId);
        
        if (user && course && user.id === course.instructorId) {
            console.log('IDs MATCH');
        } else {
            console.log('IDs MISMATCH or missing data');
        }
    } finally {
        await prisma.$disconnect();
    }
}
main();
