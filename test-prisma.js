// test-prisma.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const books = await prisma.book.findMany();
  console.log(books);

  const reviews = await prisma.review.findMany();
  console.log(reviews);

  const users = await prisma.user.findMany();
  console.log(users);

  const favorites = await prisma.favorite.findMany();
  console.log(favorites);
}

main()
  .catch(e => {
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
