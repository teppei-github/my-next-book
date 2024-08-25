import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// ユーザーの所有する本一覧を取得
export async function GET(req) {
  try {
    // クエリパラメータを取得する
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "ユーザーIDが指定されていません。" },
        { status: 400 } // Bad Request
      );
    }

    // ユーザーの所有する本を取得
    const ownedBooks = await prisma.ownedBook.findMany({
      where: { userId },
      include: { book: true }, // 所有している本の詳細情報も取得する
    });

    return NextResponse.json(ownedBooks.map(owned => owned.book)); // 本の情報のみを返す
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 } // Internal Server Error
    );
  }
}

// ユーザーの所有する本を追加
export async function POST(req) {
  try {
    const data = await req.json();
    const { userId, bookId } = data;

    if (!userId || !bookId) {
      return NextResponse.json(
        { error: "ユーザーIDまたは書籍IDが指定されていません。" },
        { status: 400 } // Bad Request
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
      { status: 500 } // Internal Server Error
    );
  }
}

// ユーザーの所有する本を削除
export async function DELETE(req) {
  try {
    const data = await req.json();
    const { userId, bookId } = data;

    if (!userId || !bookId) {
      return NextResponse.json(
        { error: "ユーザーIDまたは書籍IDが指定されていません。" },
        { status: 400 } // Bad Request
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
      { status: 500 } // Internal Server Error
    );
  }
}
