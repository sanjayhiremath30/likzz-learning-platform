const { PrismaClient } = require('@prisma/client');
require('dotenv').config({ path: '.env.local' });

const prisma = new PrismaClient();

async function testEnroll() {
  try {
    // Find a student and a course
    const user = await prisma.user.findFirst({ where: { role: 'STUDENT' } });
    const course = await prisma.course.findFirst();

    if (!user || !course) {
      console.log('User or Course not found');
      return;
    }

    console.log(`Testing enrollment for User: ${user.id} and Course: ${course.id}`);

    const enrollment = await prisma.enrollment.upsert({
      where: { userId_courseId: { userId: user.id, courseId: course.id } },
      update: {},
      create: { userId: user.id, courseId: course.id, progress: 0 }
    });

    console.log('SUCCESS:', enrollment);
  } catch(e) {
    console.error('ERROR:', e.message);
  } finally {
    await prisma.$disconnect();
  }
}
testEnroll();
