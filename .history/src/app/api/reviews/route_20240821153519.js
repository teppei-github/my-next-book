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
      return NextResponse.error(new Error("ユーザーIDが指定されていません。"));
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

export async function GET(req) {
  // GETメソッドの処理
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");
    console.log("userId??", userId);
    if (!userId) {
      return res
        .status(400)
        .json({ error: "ユーザーIDが指定されていません。" });
    }

    const reviews = await prisma.review.findMany({
      where: { userId: userId },
    });

    return res.status(200).json(reviews);
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}

export async function DELETE(req) {
  try {
    const data = await req.json();
    const book = await getBookById(data.deleteid);
    const userId = data.userId;

    if (!userId) {
      return NextResponse.error(new Error("ユーザーIDが指定されていません。"));
    }

    // delete の場合は消してもいいかも？
    const user = await prisma.user.findUnique({ where: { id: userId } });

    // upsert → 削除に切り替え
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