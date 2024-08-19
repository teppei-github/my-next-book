import prisma from "@/lib/prisma";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { userId, bookId, favorite } = req.body;

    if (!userId || !bookId || typeof favorite !== "boolean") {
      return res.status(400).json({ error: "Invalid input" });
    }

    try {
      if (favorite) {
        // お気に入りに追加
        await prisma.favorite.create({
          data: {
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
