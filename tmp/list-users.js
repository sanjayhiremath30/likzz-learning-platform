const { PrismaClient } = require('@prisma/client');
require('dotenv').config({ path: '.env.local' });

const prisma = new PrismaClient();

async function check() {
  try {
    const users = await prisma.user.findMany();
    console.log('Users:', JSON.stringify(users, null, 2));
  } catch(e) {
    console.error('ERROR:', e.message);
  } finally {
    await prisma.$disconnect();
  }
}
check();
