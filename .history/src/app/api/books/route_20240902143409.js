import { NextResponse } from 'next/server';

const fetchBooks = async (keyword, page, limit) => {
  const books = Array.from({ length: limit }, (_, index) => ({
    id: `${index + 1}`,
    title: `書籍タイトル ${index + 1}`,
    author: `著者名 ${index + 1}`
  }));

  return books;
};

export async function GET(request) {
  const url = new URL(request.url);
  const keyword = url.searchParams.get('keyword') || '';
  const page = parseInt(url.searchParams.get('page'), 10) || 1;
  const limit = parseInt(url.searchParams.get('limit'), 10) || 10;

  try {
    if (!keyword) {
      throw new Error('キーワードが指定されていません');
    }

    const books = await fetchBooks(keyword, page, limit);
    return NextResponse.json(books);
  } catch (error) {
    console.error("Error fetching books:", error);
    return NextResponse.json({ error: '書籍データの取得に失敗しました' }, { status: 500 });
  }
}
