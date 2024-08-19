import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { getBookById } from "@lib/getter";

const prisma = new PrismaClient();
export default async function handler(req, res) {

  if (req.method === 'POST') {
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

    return res.redirect('/');
    } catch (error) {
      console.error("API Error:", error);
      return res.status(500).json({ error: "サーバーエラーが発生しました。" });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get('userId');

    if (!userId) {
      return new Response("ユーザーIDが指定されていません。", { status: 400 });
    }

    const reviews = await prisma.review.findMany({
      where: { userId },
    });

    return new Response(JSON.stringify(reviews), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("API Error:", error);
    return new Response("サーバーエラーが発生しました。", { status: 500 });
  }
}