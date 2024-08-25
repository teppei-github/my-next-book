import { PrismaClient } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();

// ユーザーの所有する本一覧を取得
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