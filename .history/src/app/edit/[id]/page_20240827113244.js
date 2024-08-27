"use client";

import BookDetails from "@/components/BookDetails";
import FormEdit from "@/components/FormEdit";
import { useState, useEffect } from "react";
import { useRecoilValue } from "recoil";
import { signInUserState } from "@state/signInUserState";
import { getBookById, getReviewById } from "@/lib/getter";

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
        const bookData = await getBookById(params.id); // APIではなくgetterを使用
        setBook(bookData);

        const reviewData = await getReviewById(params.id, userId); // 新たにgetReviewByIdを実装する必要あり
        setReview(reviewData);
      } catch (error) {
        console.error("Error fetching data:", error);
        setBook(null);
        setReview(null);
      }
    };

    fetchBooks();
  }, [params.id, userId, signInUser]);
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
