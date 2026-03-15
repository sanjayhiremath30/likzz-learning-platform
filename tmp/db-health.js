const { PrismaClient } = require('@prisma/client');
require('dotenv').config({ path: '.env.local' });

const prisma = new PrismaClient();

async function checkDB() {
  try {
    const usersCount = await prisma.user.count();
    const coursesCount = await prisma.course.count();
    const enrollmentsCount = await prisma.enrollment.count();
    const cartCount = await prisma.cartItem.count();

    console.log('Stats:', { usersCount, coursesCount, enrollmentsCount, cartCount });

    if (coursesCount === 0) {
      console.log('No courses found. Seeding might be needed.');
    } else {
      const course = await prisma.course.findFirst();
      console.log('Sample course:', { id: course.id, title: course.title });
    }

    if (usersCount > 0) {
      const user = await prisma.user.findFirst();
      console.log('Sample user:', { id: user.id, email: user.email });
    }
  } catch(e) {
    console.error('ERROR:', e.message);
  } finally {
    await prisma.$disconnect();
  }
}
checkDB();
