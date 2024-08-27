"use client";

import BookDetails from "@/components/BookDetails";
import FormEdit from "@/components/FormEdit";
import { useState, useEffect } from "react";
import { useRecoilValue } from "recoil";
import { signInUserState } from "@state/signInUserState";


export default function EditPage({ params }) {
  const [book, setBook] = useState(null);
  const [review, setReview] = useState(null);
  const signInUser = useRecoilValue(signInUserState);
  console.log("Current signInUser:", signInUser);

  // 必要なプロパティが存在するか確認
  const userId = signInUser?.uid; // ここでは uid を使用

  useEffect(() => {
    const fetchBooks = async () => {
      console.log("Fetching book with id:", params.id);
      console.log("Current signInUser:", signInUser);

      if (!params.id || !userId) {
        console.log("Missing parameters or user ID");
        return;
      }

      try {
        // 書籍情報を取得する API 呼び出し
        const bookResponse = await fetch(`/api/books/${params.id}`);
        console.log("Book response status:", bookResponse.status);
        if (!bookResponse.ok) {
          throw new Error("Failed to fetch book data");
        }
        const bookData = await bookResponse.json();
        console.log("Book data:", bookData);
        setBook(bookData);

        // レビュー情報を取得する API 呼び出し
        const reviewResponse = await fetch(`/api/reviews?userId=${userId}&bookId=${params.id}`);
        console.log("Review response status:", reviewResponse.status);
        if (!reviewResponse.ok) {
          throw new Error("Failed to fetch review data");
        }
        const reviewData = await reviewResponse.json();
        console.log("Review data:", reviewData);
        setReview(reviewData);
      } catch (error) {
        console.error("Error fetching data:", error);
        // エラーハンドリングの追加
        setBook(null);
        setReview(null);
      }
    };

    fetchBooks();
  }, [params.id, userId, signInUser]); // userId に依存

  // `book` が存在する場合にのみ `FormEdit` をレンダリング
  if (!book) {
    return <p>Book not found.</p>; // 書籍が見つからない場合のメッセージ
  }

  //「YYYY-MM-DD」形式の日付を生成
  const read = (review?.read || new Date()).toLocaleDateString("sv-SE");

  return (
    <div id="form">
      <BookDetails book={book} />
      <hr />
      <FormEdit src={{ id: book.id, read, memo: review?.memo }} />
    </div>
  );
}
