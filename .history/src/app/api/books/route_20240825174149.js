import { NextResponse } from 'next/server';

const allBooks = [
  { id: '1', title: 'Book 1', author: 'Author 1' },
  { id: '2', title: 'Book 2', author: 'Author 2' },
  { id: '3', title: 'Book 3', author: 'Author 3' },
];

export async function GET(request) {
  const url = new URL(request.url);
  const keyword = url.searchParams.get('keyword') || '';
  const page = parseInt(url.searchParams.get('page')) || 1;
  const booksPerPage = parseInt(url.searchParams.get('booksPerPage')) || 10;

  const filteredBooks = allBooks.filter((book) =>
    book.title.toLowerCase().includes(keyword.toLowerCase())
  );

  const start = (page - 1) * booksPerPage;
  const end = page * booksPerPage;
  const paginatedBooks = filteredBooks.slice(start, end);

  return NextResponse.json(paginatedBooks);
}
