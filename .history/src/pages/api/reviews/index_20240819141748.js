import { PrismaClient } from "@prisma/client";
import { getBookById } from "@lib/getter";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    // POSTメソッドの処理
    try {
      const data = req.body;
      const book = await getBookById(data.id);
      const userId = data.userId;

      if (!userId) {
        return res.status(400).json({ error: 'ユーザーIDが指定されていません。' });
      }

      const user = await prisma.user.findUnique({ where: { id: userId } });

      if (!user) {
        await prisma.user.create({
          data: {
            id: userId,
            name: 'Default Name',
            email: `${userId}@example.com`,
            password: 'defaultpassword',
          },
        });
      }

      const input = {
        title: book.title,
        author: book.author,
        price: Number(book.price),
        publisher: book.publisher,
        published: new Date(book.published).toISOString(),
        image: book.image,
        read: new Date(data.read),
        memo: data.memo,
      };

      await prisma.review.upsert({
        where: { id: data.id },
        update: {
          ...input,
          user: { connect: { id: userId } },
        },
        create: {
          ...input,
          id: data.id,
          user: { connect: { id: userId } },
        },
      });

      return res.status(200).json({ message: 'Review added successfully' });
    } catch (error) {
      console.error('API Error:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  } else if (req.method === 'GET') {
    // GETメソッドの処理
    try {
      const { userId } = req.query;

      if (!userId) {
        return res.status(400).json({ error: 'ユーザーIDが指定されていません。' });
      }

      const reviews = await prisma.review.findMany({
        where: { userId: userId },
      });

      return res.status(200).json(reviews);
    } catch (error) {
      console.error('API Error:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    // 他のHTTPメソッドには対応しない
    res.setHeader('Allow', ['GET', 'POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
