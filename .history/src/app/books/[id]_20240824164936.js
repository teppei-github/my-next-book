import React from 'react';

// API から書籍データを取得する関数
async function fetchBookData(id) {
  const res = await fetch(`http://localhost:3000/api/books/${id}`);
  if (!res.ok) {
    throw new Error('書籍情報の取得に失敗しました');
  }
  const data = await res.json();
  return data;
}

export async function getServerSideProps(context) {
  const { id } = context.query; // URL パラメータから ID を取得

  try {
    const book = await fetchBookData(id);

    if (!book || book.error) {
      return { notFound: true }; // 書籍が見つからない場合は 404 ページを表示
    }

    return {
      props: { book }, // ページコンポーネントにデータを渡す
    };
  } catch (error) {
    console.error("Error fetching book data:", error);
    return { notFound: true }; // エラーが発生した場合も 404 ページを表示
  }
}

const BookPage = ({ book }) => {
  if (!book) {
    return <div>書籍が見つかりません</div>;
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