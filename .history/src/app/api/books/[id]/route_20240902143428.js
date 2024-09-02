import { NextResponse } from 'next/server';

const fetchBookById = async (id) => {
  return { id, title: "サンプル書籍", author: "著者名" };
};

export async function GET(request, { params }) {
  const { id } = params;

  try {
    if (!id) {
      throw new Error("IDが提供されていません");
    }

    const book = await fetchBookById(id);
    return NextResponse.json(book);
  } catch (error) {
    console.error("Error fetching book by ID", error);
    return NextResponse.json({ error: "書籍データの取得に失敗しました" }, { status: 500 });
  }
}
