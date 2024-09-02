import { NextResponse } from 'next/server';

const fetchBooks = async (ids) => {
  // 仮のデータを返す
  return ids.map(id => ({
    bookId: id,
    title: `書籍タイトル ${id}`,
    author: `著者名 ${id}`,
    price: 1000,
    publisher: '出版社名',
    published: '2024-01-01',
    image: 'default_image_url'
  }));
};

export async function GET(request) {
  const url = new URL(request.url);
  const ids = url.searchParams.get('ids') || '';

  try {
    if (!ids) {
      throw new Error('IDsが指定されていません');
    }

    const books = await fetchBooks(ids.split(','));
    return NextResponse.json({ books }); // 修正: books プロパティを含める
  } catch (error) {
    console.error("Error fetching books:", error);
    return NextResponse.json({ error: '書籍データの取得に失敗しました' }, { status: 500 });
  }
}
