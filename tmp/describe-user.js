const { PrismaClient } = require('@prisma/client');
require('dotenv').config({ path: '.env.local' });

const prisma = new PrismaClient();

async function describeUser() {
  try {
    const result = await prisma.$queryRaw`SELECT column_name, data_type FROM information_schema.columns WHERE table_name = 'User'`;
    console.log('User Columns:', result);
  } catch(e) {
    console.error('ERROR:', e.message);
  } finally {
    await prisma.$disconnect();
  }
}
describeUser();
