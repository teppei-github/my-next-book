import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// API ハンドラー関数
export default async function handler(req, res) {
  switch (req.method) {
    case 'GET':
      return await getOwnedBooks(req, res);
    case 'POST':
      return await addOwnedBook(req, res);
    case 'DELETE':
      return await deleteOwnedBook(req, res);
    default:
      res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

// GET リクエストハンドラー
async function getOwnedBooks(req, res) {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: "ユーザーIDが指定されていません。" });
    }

    const ownedBooks = await prisma.ownedBook.findMany({
      where: { userId },
      include: { book: true },
    });

    res.status(200).json(ownedBooks.map(owned => owned.book));
  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// POST リクエストハンドラー
async function addOwnedBook(req, res) {
  try {
    const { userId, bookId } = req.body;

    if (!userId || !bookId) {
      return res.status(400).json({ error: "ユーザーIDまたは書籍IDが指定されていません。" });
    }

    await prisma.ownedBook.create({
      data: { userId, bookId },
    });

    res.status(201).json({ message: "書籍が追加されました。" });
  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}

// DELETE リクエストハンドラー
async function deleteOwnedBook(req, res) {
  try {
    const { userId, bookId } = req.body;

    if (!userId || !bookId) {
      return res.status(400).json({ error: "ユーザーIDまたは書籍IDが指定されていません。" });
    }

    await prisma.ownedBook.deleteMany({
      where: { userId, bookId },
    });

    res.status(200).json({ message: "書籍が削除されました。" });
  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
