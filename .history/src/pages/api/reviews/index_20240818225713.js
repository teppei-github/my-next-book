import { PrismaClient } from "@prisma/client";
import { getBookById } from "@lib/getter";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  try {
    if (req.method === 'POST') {
      const data = req.body; // req.json() ではなく、req.body を使用
      const book = await getBookById(data.id);
      const userId = data.userId;

      if (!userId) {
        return res.status(400).json({ error: "ユーザーIDが指定されていません。" });
      }

      const user = await prisma.user.findUnique({ where: { id: userId } });

      if (!user) {
        await prisma.user.create({
          data: {
            id: userId,
            name: "Default Name",
            email: `${userId}@example.com`,
            password: "defaultpassword",
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

      return res.redirect("/"); // res.redirect() は Next.js ではサポートされていません。代わりに、リダイレクトの URL をレスポンスとして返すことを検討してください。
    } else if (req.method === 'GET') {
      const url = new URL(req.url, `http://${req.headers.host}`);
      const userId = url.searchParams.get('userId');

      if (!userId) {
        return res.status(400).json({ error: "ユーザーIDが指定されていません。" });
      }

      const reviews = await prisma.review.findMany({
        where: { userId },
      });

      return res.status(200).json(reviews);
    } else {
      return res.status(405).json({ error: "メソッドがサポートされていません。" });
    }
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({ error: "サーバーエラーが発生しました。" });
  }
}