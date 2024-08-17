import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function addReview(data) {
  const reviewId = data.get('id');
  const userId = data.get('userId');

  if (!isValidObjectId(reviewId)) {
      throw new Error("Invalid ID format.");
  }

  const book = await getBookById(reviewId);

  if (!userId) {
      throw new Error("ユーザーIDが指定されていません。");
  }

  const user = await prisma.user.findUnique({
      where: { id: userId }
  });

  if (!user) {
      await prisma.user.create({
          data: { 
              id: userId,
              name: "Default Name",
              email: `${userId}@example.com`,
              password: "defaultpassword"
          }
      });
  }

  const reviewData = {
      title: book.title,
      author: book.author,
      price: Number(book.price),
      publisher: book.publisher,
      published: new Date(book.published).toISOString(),
      image: book.image,
      read: new Date(data.get('read')),
      memo: data.get('memo'),
      userId: userId,
  };

  const review = await prisma.review.upsert({
      where: { id: reviewId },
      update: reviewData,
      create: reviewData,
  });

  return review;
}

export async function removeReview(id) {
  if (!isValidObjectId(id)) {
      throw new Error("Invalid ID format.");
  }

  try {
      await prisma.review.delete({
          where: { id: id }
      });
      redirect('/');
  } catch (error) {
      console.error("削除に失敗しました:", error);
      throw error;
  }
}
