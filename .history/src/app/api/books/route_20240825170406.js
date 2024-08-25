import { NextResponse } from 'next/server';

// ダミーデータ (実際にはデータベースや他の API からデータを取得します)
const allBooks = [
  { id: '1', title: 'Book 1', author: 'Author 1' },
  { id: '2', title: 'Book 2', author: 'Author 2' },
  { id: '3', title: 'Book 3', author: 'Author 3' },
  // 追加の書籍データ
];

export async function GET(request) {
  // URL からクエリパラメータを取得
  const url = new URL(request.url);
  const keyword = url.searchParams.get('keyword') || ''; // クエリパラメータからキーワードを取得
  const page = parseInt(url.searchParams.get('page')) || 1; // クエリパラメータからページ番号を取得
  const booksPerPage = parseInt(url.searchParams.get('booksPerPage')) || 10; // クエリパラメータから1ページあたりの書籍数を取得

  // キーワードでフィルタリング
  const filteredBooks = allBooks.filter((book) =>
    book.title.toLowerCase().includes(keyword.toLowerCase())
  );

  // ページネーション処理
  const start = (page - 1) * booksPerPage;
  const end = page * booksPerPage;
  const paginatedBooks = filteredBooks.slice(start, end);

  return NextResponse.json(paginatedBooks);
}