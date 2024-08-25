"use client"; 

import { useState, useEffect } from "react";
import LinkedBookDetails from "@/components/LinkedBookDetails"; // 書籍の詳細情報を表示するコンポーネント
import PaginationComponent from "@/components/PaginationComponent"; // ページネーション用のコンポーネント

export default function BookResult({ params }) {
  // URLパラメータからキーワードを取得
  const keyword = params.keyword || ""; // キーワードが存在しない場合は空文字にする
  const [books, setBooks] = useState([]); // 書籍データを格納する状態
  const [totalBooks, setTotalBooks] = useState(0); // 全書籍数を管理
  const [page, setPage] = useState(1); // 現在のページ番号を格納する状態
  const [error, setError] = useState(null); // エラーメッセージを格納する状態
  const booksPerPage = 10; // 1ページあたりの書籍数

  // クライアントサイドでのデータフェッチ
  useEffect(() => {
    const fetchBooks = async () => {
      if (!keyword) {
        setError("キーワードが指定されていません。");
        return;
      }

      try {
        // APIエンドポイントに対してGETリクエストを送信
        const response = await fetch(`/api/books?keyword=${encodeURIComponent(keyword)}&page=${page}&booksPerPage=${booksPerPage}`);
        
        // レスポンスが正常でない場合にエラーをスロー
        if (!response.ok) {
          throw new Error("ネットワークエラー");
        }
        
        // レスポンスをJSON形式で取得
        const data = await response.json();
        setBooks(data.books); // 現在のページの書籍
        setTotalBooks(data.totalBooks); // 全書籍数
      } catch (error) {
        console.error("書籍データの取得中にエラーが発生しました:", error);
        setError("書籍情報の取得に失敗しました。もう一度お試しください。"); // エラーメッセージを設定
      }
    };

    fetchBooks(); // データ取得を実行
  }, [keyword, page]); // keywordまたはpageが変更されるとデータを再取得

  // ページ変更時に呼び出される関数
  const handleChange = (event, value) => {
    setPage(value); // 現在のページ番号を更新
  };

  // 現在のページに表示する書籍データを計算
  const paginatedBooks = books.slice((page - 1) * booksPerPage, page * booksPerPage);

  return (
    <div>
      {error ? (
        <p>{error}</p> // エラーメッセージがある場合に表示
      ) : (
        <>
          {/* 現在のページに表示する書籍データをリスト表示 */}
          {books.length > 0 ? (
            paginatedBooks.map((b, i) => (
              <LinkedBookDetails book={b} index={i + 1} key={b.id} /> // 書籍詳細コンポーネント
            ))
          ) : (
            <p>書籍情報が見つかりませんでした。</p> // 書籍情報がない場合のメッセージ
          )}

          {/* ページネーションコンポーネント */}
          <PaginationComponent
            page={page} // 現在のページ番号
            count={Math.ceil(books.length / booksPerPage)} // 総ページ数
            onChange={handleChange} // ページ変更時に呼び出される関数
          />
        </>
      )}
    </div>
  );
}
