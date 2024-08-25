import { NextResponse } from 'next/server';

// ダミー関数：IDに基づいて書籍データを取得するシミュレーション
const fetchBookById = async (id) => {
  // APIコールやデータベースクエリをシミュレート
  return { id, title: "サンプル書籍", author: "著者名" }; // 実際のデータ取得ロジックに置き換えてください
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
    return NextResponse.error(new Error("書籍データの取得に失敗しました"));
  }
}
