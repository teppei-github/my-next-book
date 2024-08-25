import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

// ハンドラー関数
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "ユーザーIDが指定されていません。" },
        { status: 400 }
      );
    }

    const ownedBooks = await prisma.ownedBook.findMany({
      where: { userId },
      include: { book: true },
    });

    return NextResponse.json(ownedBooks.map(owned => owned.book));
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  try {
    const data = await req.json();
    const { userId, bookId } = data;

    if (!userId || !bookId) {
      return NextResponse.json(
        { error: "ユーザーIDまたは書籍IDが指定されていません。" },
        { status: 400 }
      );
    }

    await prisma.ownedBook.create({
      data: { userId, bookId },
    });

    return NextResponse.json({ message: "書籍が追加されました。" });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    const data = await req.json();
    const { userId, bookId } = data;

    if (!userId || !bookId) {
      return NextResponse.json(
        { error: "ユーザーIDまたは書籍IDが指定されていません。" },
        { status: 400 }
      );
    }

    await prisma.ownedBook.deleteMany({
      where: { userId, bookId },
    });

    return NextResponse.json({ message: "書籍が削除されました。" });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
