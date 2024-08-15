import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case 'GET':
      // GETリクエスト: レビューを取得する
      const userId = req.query.userId;
      if (userId) {
        try {
          const reviews = await prisma.review.findMany({
            where: { userId },
          });
          res.status(200).json(reviews);
        } catch (error) {
          res.status(500).json({ error: 'Error fetching reviews' });
        }
      } else {
        res.status(400).json({ error: 'User ID is required' });
      }
      break;

    case 'POST':
      // POSTリクエスト: レビューを追加または更新する
      const { id, read, memo, userId } = req.body;
      if (id && userId) {
        try {
          await prisma.review.upsert({
            where: { id },
            update: { read, memo },
            create: { id, read, memo, userId },
          });
          res.status(200).json({ message: 'Review added or updated successfully' });
        } catch (error) {
          res.status(500).json({ error: 'Error adding or updating review' });
        }
      } else {
        res.status(400).json({ error: 'ID and User ID are required' });
      }
      break;

    case 'DELETE':
      // DELETEリクエスト: レビューを削除する
      const { reviewId } = req.body;
      if (reviewId) {
        try {
          await prisma.review.delete({ where: { id: reviewId } });
          res.status(200).json({ message: 'Review deleted successfully' });
        } catch (error) {
          res.status(500).json({ error: 'Error deleting review' });
        }
      } else {
        res.status(400).json({ error: 'Review ID is required' });
      }
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
      break;
  }
}
