"use client"; // クライアントコンポーネントとしてマーク

import { useState, useEffect } from "react";
import LinkedBookDetails from "@/components/LinkedBookDetails";
import PaginationComponent from "@/components/PaginationComponent";
import { getBooksByKeyword } from "@lib/getter";
import ReturnTopButton from "@/components/ReturnTopButton";
import { useRecoilState, useRecoilValue } from "recoil";
import { signInUserState } from "@/state/signInUserState";

// ルートパラメーターparamsを取得
export default function BookResult({ params }) {
  const keyword = params.keyword || ""; // URLからキーワードを取得し、デフォルト値を設定
  const [books, setBooks] = useState([]); // 書籍データを格納する状態
  const [page, setPage] = useState(1); // 現在のページ番号を格納する状態
  const [error, setError] = useState(null); // エラーメッセージを格納する状態
  const booksPerPage = 10; // 1ページあたりの書籍数

  const signInUser = useRecoilValue(signInUserState); // サインインユーザーの取得

  useEffect(() => {
    const fetchBooks = async () => {
      if (!keyword) {
        setError("キーワードが指定されていません。");
        return;
      }

      try {
        const fetchedBooks = await getBooksByKeyword(
          keyword,
          page,
          booksPerPage
        );
        setBooks(fetchedBooks);

        setError(null);
      } catch (error) {
        console.error("書籍データの取得中にエラーが発生しました:", error);
        setError("書籍情報の取得に失敗しました。もう一度お試しください。");
      }
    };
    fetchBooks();
  }, [keyword, page]);

  // ページ変更時に呼び出される関数
  const handleChange = (event, value) => {
    setPage(value); // 現在のページ番号を更新
  };

  // 現在のページに表示する書籍データを計算
  const paginatedBooks = books.slice(
    (page - 1) * booksPerPage,
    page * booksPerPage
  );

  return (
    <div>
      {error ? (
        <p>{error}</p> // エラーメッセージがある場合に表示
      ) : (
        <>
          {/* 現在のページに表示する書籍データをリスト表示 */}
          {books.length > 0 ? (
            paginatedBooks.map((b, i) => (
              <LinkedBookDetails book={b} index={i + 1} key={b.id} />
            ))
          ) : (
            <p>書籍情報が見つかりませんでした。</p>
          )}

          {/* ページネーションコンポーネント */}
          <PaginationComponent
            page={page} // 現在のページ番号
            count={Math.ceil(books.length / booksPerPage)} // 総ページ数
            onChange={handleChange} // ページ変更時に呼び出される関数
          />
          {/* ページの下部に ReturnTopButton を追加 */}
          <ReturnTopButton />
        </>
      )}
    </div>
  );
}
