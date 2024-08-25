import { NextResponse } from "next/server";
import { getBookById } from "@lib/getter";

export async function GET(request, { params }) {
  try {
    const { id } = params; // URLパラメータからIDを取得

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
