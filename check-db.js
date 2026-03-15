
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const courseCount = await prisma.course.count();
    console.log('Course Count:', courseCount);
    const courses = await prisma.course.findMany({
      take: 5,
      select: { id: true, title: true }
    });
    console.log('Sample Courses:', JSON.stringify(courses, null, 2));
    
    const userCount = await prisma.user.count();
    console.log('User Count:', userCount);
  } catch (error) {
    console.error('Error connecting to database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
