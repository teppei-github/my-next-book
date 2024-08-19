import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { getBookById } from "@lib/getter";

const prisma = new PrismaClient();

export async function POST(req) {
  try {
    const data = await req.json();
    const book = await getBookById(data.id);
    const userId = data.userId;

    if (!userId) {
      return new Response("ユーザーIDが指定されていません。", { status: 400 });
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

    return NextResponse.redirect("/");
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.error();
  }
}