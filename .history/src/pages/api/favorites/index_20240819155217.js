import prisma from "@/lib/prisma";

// ヘッダーに認証情報を含む場合、ここで取得する処理を追加できます

export async function handler(req, res) {
  if (req.method === 'POST') {
    const { bookId, userId, favorite } = req.body;

    if (!bookId || !userId || typeof favorite !== 'boolean') {
      return res.status(400).json({ error: 'bookId, userId, and favorite are required' });
    }

    try {
      if (favorite) {
        // お気に入りに追加
        await prisma.favorite.upsert({
          where: { userId_bookId: { userId, bookId } },
          update: {},
          create: {
            userId,
            bookId,
          },
        });
      } else {
        // お気に入りから削除
        await prisma.favorite.deleteMany({
          where: {
            userId,
            bookId,
          },
        });
      }
      res.status(200).json({ success: true });
    } catch (error) {
      console.error("Error processing request:", error);
      res.status(500).json({ error: "Error processing request" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
