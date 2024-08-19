import { PrismaClient } from "@prisma/client";
import { getBookById } from "@lib/getter";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const data = await req.json();
    const book = await getBookById(data.id);
    const userId = data.userId;

    if (!userId) {
      return new Response(JSON.stringify({ error: "ユーザーIDが指定されていません。" }), { status: 400 });
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
      where: { id: data.id }, // ここが `String` 型でなければならない
      update: {
        ...input,
        user: { connect: { id: userId } },
      },
      create: {
        ...input,
        id: data.id, // ここも `String` 型でなければならない
        user: { connect: { id: userId } },
      },
    });

    return new Response(JSON.stringify({ message: "Review added successfully" }), { status: 200 });
  } catch (error) {
    console.error("API Error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}