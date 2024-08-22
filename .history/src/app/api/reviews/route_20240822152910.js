import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { getBookById } from "@lib/getter";

// PrismaClientのインスタンスを作成
const prisma = new PrismaClient();

export async function POST(req) {
  try {
    // リクエストボディからデータを取得
    const data = await req.json();
    const book = await getBookById(data.id);  // 書籍情報を取得
    const userId = data.userId;

    // ユーザーIDが指定されていない場合のエラーハンドリング
    if (!userId) {
      return NextResponse.json({ error: "ユーザーIDが指定されていません。" }, { status: 400 });
    }

    // ユーザーの存在確認、存在しない場合は新規作成
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

    // レビューの入力データを構築
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

    // レビューを追加または更新
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

    // 成功メッセージを返す
    return NextResponse.json({ message: "レビューが正常に保存されました。" });
  } catch (error) {
    console.error("API Error:", error);
    // 内部サーバーエラーを返す
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    // リクエストURLからクエリパラメータを取得
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();
    
    // ユーザーIDが指定されていない場合のエラーハンドリング
    if (!userId) {
      return NextResponse.json({ error: "ユーザーIDが指定されていません。" }, { status: 400 });
    }

    // ユーザーに関連するレビューを取得
    const reviews = await prisma.review.findMany({
      where: { userId: userId },
    });

    // 取得したレビューを返す
    return NextResponse.json(reviews);
  } catch (error) {
    console.error("API Error:", error);
    // 内部サーバーエラーを返す
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    // リクエストボディからデータを取得
    const data = await req.json();
    const userId = data.userId;
    const reviewId = data.id;

    // ユーザーIDまたはレビューIDが指定されていない場合のエラーハンドリング
    if (!userId || !reviewId) {
      return NextResponse.json({ error: "ユーザーIDまたはレビューIDが指定されていません。" }, { status: 400 });
    }

    // 指定されたレビューを削除
    await prisma.review.deleteMany({
      where: { id: reviewId, userId: userId },
    });

    // 成功メッセージを返す
    return NextResponse.json({ message: "レビューが削除されました。" });
  } catch (error) {
    console.error("API Error:", error);
    // 内部サーバーエラーを返す
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
