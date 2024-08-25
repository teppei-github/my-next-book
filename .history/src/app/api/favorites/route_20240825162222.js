import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// お気に入りを追加する
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

    // お気に入りを追加
    await prisma.favorite.create({
      data: {
        userId,
        bookId,
      },
    });

    return NextResponse.json({ message: "お気に入りが追加されました。" });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 } // Internal Server Error
    );
  }
}

// お気に入り一覧を取得する
export async function GET(req) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get("userId");

    if (!userId) {
      return NextResponse.json(
        { error: "ユーザーIDが指定されていません。" },
        { status: 400 } // Bad Request
      );
    }

    // ユーザーのすべてのお気に入りを取得
    const favorites = await prisma.favorite.findMany({
      where: { userId },
      include: { book: true },  // お気に入りに関連する書籍情報も取得する
    });

    return NextResponse.json(favorites.map(fav => fav.book)); // 書籍情報のみを返す
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 } // Internal Server Error
    );
  }
}

// お気に入りを削除する
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

    // お気に入りを削除
    await prisma.favorite.deleteMany({
      where: {
        userId,
        bookId,
      },
    });

    return NextResponse.json({ message: "お気に入りが削除されました。" });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 } // Internal Server Error
    );
  }
}
