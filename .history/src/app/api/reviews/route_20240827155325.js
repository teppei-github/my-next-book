import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { getBookById } from "@lib/getter";
import { getReviewById } from "@lib/getter";

// PrismaClientのインスタンスを作成
const prisma = new PrismaClient();

export async function POST(req) {
  try {
    // リクエストボディからデータを取得
    const data = await req.json();
    console.log('Received data:', data);

    // 書籍情報を取得
    const book = await getBookById(data.id);  
    const userId = data.userId;

    // 書籍情報が取得できなかった場合のエラーハンドリング
    if (!book) {
      return NextResponse.json({ error: "指定された書籍が見つかりません。" }, { status: 404 });
    }

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
      where: { id: data.id || "" }, // 新規作成の場合は空文字列を使用
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
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const userId = url.searchParams.get('userId');
    const bookId = url.searchParams.get('bookId');
    const reviewId = url.searchParams.get('reviewId');
    const filter = url.searchParams.get("filter") || 'all'; // 'all' がデフォルト

    if (!userId) {
      return NextResponse.json({ error: "ユーザーIDが指定されていません。" }, { status: 400 });
    }

    let reviews;

   if (reviewId) {
      // reviewId が指定されている場合
      const review = await getReviewById(reviewId);
      if (!review) {
        return NextResponse.json({ error: "指定されたレビューが見つかりません。" }, { status: 404 });
      }
      reviews = [review]; // 単一のレビューを配列に格納
    } else if (bookId) {
      // bookId が指定されている場合
      reviews = await prisma.review.findMany({
        where: {
          userId: userId,
          bookId: bookId
        },
        include: { book: true } // book フィールドも取得する
      });
    } else if (filter === 'mine') {
      // 自分のレビューを取得
      reviews = await prisma.review.findMany({
        where: { userId: userId },
        include: { book: true } // book フィールドも取得する
      });
    } else if (filter === 'others') {
      // 他のユーザーのレビューを取得
      reviews = await prisma.review.findMany({
        where: {
          userId: { not: userId }
        },
        include: { book: true } // book フィールドも取得する
      });
    } else {
      // すべてのレビューを取得
      reviews = await prisma.review.findMany({
        include: { book: true } // book フィールドも取得する
      });
    }

    return NextResponse.json(reviews);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    // リクエストボディからデータを取得
    const data = await req.json();
    console.log('Received data:', data);
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
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
