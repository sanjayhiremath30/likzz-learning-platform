const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

const prisma = new PrismaClient();

async function test() {
  try {
    const hash = await bcrypt.hash('testpass123', 10);
    const user = await prisma.user.create({
      data: {
        name: 'Test User',
        email: 'testdiag_' + Date.now() + '@gmail.com',
        password: hash,
        role: 'STUDENT'
      }
    });
    console.log('SUCCESS:', user.id, user.email);
    await prisma.user.delete({ where: { id: user.id } });
    console.log('Cleaned up.');
  } catch(e) {
    console.error('ERROR:', e.message);
    console.error('CODE:', e.code);
    console.error('META:', JSON.stringify(e.meta));
  } finally {
    await prisma.$disconnect();
  }
}
test();
