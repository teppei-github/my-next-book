import { NextResponse } from "next/server";
import { getBookById } from "@lib/getter";

export async function GET(request) {
  try {
    // URL パスから ID を取得
    const url = new URL(request.url);
    const id = url.pathname.split('/').pop(); // URL の最後の部分を ID として取得

    if (!id) {
      return NextResponse.json({ error: "IDが指定されていません。" }, { status: 400 });
    }

    const book = await getBookById(id);

    if (!book) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }

    return NextResponse.json(book);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
