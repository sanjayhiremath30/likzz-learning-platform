const { PrismaClient } = require('@prisma/client');
require('dotenv').config({ path: '.env.local' });

const prisma = new PrismaClient();

async function clean() {
  try {
    await prisma.$executeRawUnsafe('DELETE FROM "User"');
    console.log('Users deleted via raw SQL.');
  } catch(e) {
    console.error('ERROR:', e.message);
  } finally {
    await prisma.$disconnect();
  }
}
clean();
