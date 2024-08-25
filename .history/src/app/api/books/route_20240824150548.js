import { NextResponse } from "next/server";
import { getBooksByKeyword } from "@lib/getter";

// GETリクエストを処理する関数
export async function GET(request) {
  try {
    const url = request.nextUrl;
    const keyword = url.searchParams.get("keyword") || "";
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const booksPerPage = parseInt(url.searchParams.get("booksPerPage") || "10", 10);

    if (!keyword) {
      return NextResponse.json({ error: "キーワードが指定されていません。" }, { status: 400 });
    }

    const books = await getBooksByKeyword(keyword, page, booksPerPage);

    return NextResponse.json(books);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}