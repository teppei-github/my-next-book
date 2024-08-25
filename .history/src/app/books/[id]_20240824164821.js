import React from 'react';

// API からデータを取得する関数
async function fetchBookData(id) {
  const res = await fetch(`http://localhost:3000/api/books/${id}`);
  const data = await res.json();
  return data;
}

export async function getServerSideProps(context) {
  const { id } = context.params;

  try {
    const book = await fetchBookData(id);

    if (!book || book.error) {
      return { notFound: true }; // 404 ページを表示する
    }

    return {
      props: { book }, // ページコンポーネントにデータを渡す
    };
  } catch (error) {
    console.error("Error fetching book data:", error);
    return { notFound: true }; // 404 ページを表示する
  }
}

const BookPage = ({ book }) => {
  if (!book) {
    return <div>Book not found</div>;
  }

  return (
    <div>
      <h1>{book.title}</h1>
      <p>{book.author}</p>
      {/* 他の書籍情報を表示 */}
    </div>
  );
};

export default BookPage;