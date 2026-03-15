
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const courses = await prisma.course.findMany({
      take: 1
    });
    if (courses.length > 0) {
      console.log('KEYS:', Object.keys(courses[0]).join(', '));
      console.log('TITLE:', courses[0].title);
      console.log('IMAGE:', courses[0].image);
      console.log('THUMBNAIL:', courses[0].thumbnail);
    } else {
      console.log('No courses found.');
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
