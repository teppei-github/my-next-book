import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function isValidObjectId(id) {
    const objectIdPattern = /^[0-9a-fA-F]{24}$/;
    return objectIdPattern.test(id);
}

export default async function handler(req, res) {
  if (req.method === 'GET') { // GETリクエストの処理
    try {
      const { userId, filter } = req.query; // クエリパラメーターからフィルタ条件を取得

      if (!userId) {
        res.status(400).json({ error: 'User ID is required' }); // userIdがない場合はエラー
        return;
      }

      let reviews;
      if (filter === 'others') { // 他の人のレビューを取得
        reviews = await prisma.review.findMany({
          where: { NOT: { userId } }, // 自分以外のレビューを取得
          orderBy: { read: 'desc' },
        });
      } else { // 自分のレビューを取得
        reviews = await prisma.review.findMany({
          where: { userId }, // 自分のレビューを取得
          orderBy: { read: 'desc' },
        });
      }

      // 成功時にレビューを返す
      res.status(200).json(reviews); 
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch reviews' }); // エラーハンドリング
    } finally {
      await prisma.$disconnect(); // Prismaクライアントの切断
    }
  } else if (req.method === 'POST') { // POSTリクエストの処理
    try {
      const { id, userId, read, memo } = req.body;

      if (!isValidObjectId(id) || !isValidObjectId(userId)) {
        res.status(400).json({ error: 'Invalid ID format' });
        return;
      }

      const book = await getBookById(id);

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
        read: new Date(read),
        memo: memo,
        userId: userId,
      };

      const review = await prisma.review.upsert({
        where: { id: id },
        update: reviewData,
        create: reviewData,
      });

      res.status(200).json(review);
    } catch (error) {
      res.status(500).json({ error: 'Failed to add review' });
    } finally {
      await prisma.$disconnect();
    }
  } else if (req.method === 'DELETE') { // DELETEリクエストの処理
    try {
      const { id } = req.body;

      if (!isValidObjectId(id)) {
        res.status(400).json({ error: 'Invalid ID format' });
        return;
      }

      await prisma.review.delete({
        where: { id: id }
      });

      res.status(200).json({ message: 'Review removed successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to remove review' });
    } finally {
      await prisma.$disconnect();
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' }); // 許可されていないメソッドのリクエスト
  }
}
