import { getBooksByKeyword } from "@lib/getter";

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const keyword = url.searchParams.get("keyword") || "";
    const page = parseInt(url.searchParams.get("page") || "1", 10);
    const booksPerPage = parseInt(url.searchParams.get("booksPerPage") || "10", 10);

    if (!keyword) {
      return new Response(JSON.stringify({ error: "キーワードが指定されていません。" }), { status: 400 });
    }

    const books = await getBooksByKeyword(keyword, page, booksPerPage);
    return new Response(JSON.stringify(books), { status: 200 });
  } catch (error) {
    console.error("API Error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), { status: 500 });
  }
}
