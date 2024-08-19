import prisma from '@/lib/prisma'; // Prismaインスタンスのインポート

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { userId, bookId } = req.body;

    if (!userId || !bookId) {
      return res.status(400).json({ error: 'userId and bookId are required' });
    }

    try {
      // お気に入りに追加または削除のロジックを追加
      // 例: お気に入りに追加
      await prisma.favorite.create({
        data: {
          userId,
          bookId,
        },
      });

      res.status(200).json({ success: true });
    } catch (error) {
      console.error("Error processing request:", error);
      res.status(500).json({ error: "Error processing request" });
    }
  } else if (req.method === 'DELETE') {
    const { userId, bookId } = req.body;

    if (!userId || !bookId) {
      return res.status(400).json({ error: 'userId and bookId are required' });
    }

    try {
      // お気に入りから削除
      await prisma.favorite.deleteMany({
        where: {
          userId,
          bookId,
        },
      });

      res.status(200).json({ success: true });
    } catch (error) {
      console.error("Error processing request:", error);
      res.status(500).json({ error: "Error processing request" });
    }
  } else {
    res.setHeader("Allow", ["POST", "DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
