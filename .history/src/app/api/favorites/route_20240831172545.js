import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// お気に入りを追加する
export async function POST(req) {
  try {
    const data = await req.json();
    const { userId, bookId, title, author, price, publisher, published, image } = data;

    if (!userId || !bookId || !title || !author || price === undefined || !publisher || !published || !image) {
      return NextResponse.json(
        { error: "ユーザーIDまたは書籍IDが指定されていません。" },
        { status: 400 } // Bad Request
      );
    }

    // お気に入りを追加
    const favorite = await prisma.favorite.create({  // モデル名が `favorite`
      data: {
        userId,
        bookId,
        title,
        author,
        price: parseInt(price, 10),
        publisher,
        published: new Date(published),
        image,
      },
    });
    console.log("Favorite added:", favorite);

    return NextResponse.json({ message: "お気に入りが追加されました。" });
  } catch (error) {
    console.error("API Error:", error.message); // エラーメッセージの詳細を出力
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
    const favorites = await prisma.favorite.findMany({  // モデル名が `favorite`
      where: { userId },
    });

    return NextResponse.json(favorites); // 書籍情報も返す場合は、必要な情報を含める
  } catch (error) {
    console.error("API Error:", error.message); // エラーメッセージの詳細を出力
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
    await prisma.favorite.deleteMany({  // モデル名が `favorite`
      where: {
        userId,
        bookId,
      },
    });

    return NextResponse.json({ message: "お気に入りが削除されました。" });
  } catch (error) {
    console.error("API Error:", error.message); // エラーメッセージの詳細を出力
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 } // Internal Server Error
    );
  }
}
