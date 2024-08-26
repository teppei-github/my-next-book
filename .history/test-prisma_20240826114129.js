const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const books = await prisma.book.findMany();
    console.log('Books:', books);

    const reviews = await prisma.review.findMany();
    console.log('Reviews:', reviews);

    const users = await prisma.user.findMany();
    console.log('Users:', users);

    const favorites = await prisma.favorite.findMany();
    console.log('Favorites:', favorites);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
