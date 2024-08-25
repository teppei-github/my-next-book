import { NextResponse } from 'next/server';

const allBooks = [
  { id: '1', title: 'Book 1', author: 'Author 1' },
  { id: '2', title: 'Book 2', author: 'Author 2' },
  { id: '3', title: 'Book 3', author: 'Author 3' },
];

export async function GET(request, { params }) {
  const { id } = params;
  const book = allBooks.find(book => book.id === id);

  if (!book) {
    return NextResponse.json({ error: '書籍が見つかりません' }, { status: 404 });
  }

  return NextResponse.json(book);
}
