const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testConnection() {
  try {
    await prisma.$connect();
    console.log('Connected to MongoDB successfully');
  } catch (e) {
    console.error('Error connecting to MongoDB:', e.message);
    console.error('Detailed Error:', e);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
