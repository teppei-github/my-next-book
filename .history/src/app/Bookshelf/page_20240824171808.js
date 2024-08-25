"use client";

import React, { useEffect } from "react";
import { useRecoilState } from "recoil";
import { OwnedBooksState } from "@/state/ownedBooksState";
import { useRecoilValue } from "recoil";
import { signInUserState } from "@/state/signInUserState";

const OwnedBooksPage = () => {
  const [ownedBooks, setOwnedBooks] = useRecoilState(OwnedBooksState);
  const signInUser = useRecoilValue(signInUserState);

  useEffect(() => {
    const fetchOwnedBooks = async () => {
      if (!signInUser || !signInUser.uid) {
        console.error("User must be logged in to fetch owned books.");
        return;
      }

      try {
        const response = await fetch(`/api/owned-books?userId=${signInUser.uid}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setOwnedBooks(data);
      } catch (error) {
        console.error('APIリクエスト中にエラーが発生しました:', error);
        // 必要に応じてユーザーにエラーメッセージを表示する機能を追加する
      }
    };

    fetchOwnedBooks();
  }, [signInUser, setOwnedBooks]);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">持っている本</h1>
      <ul>
        {ownedBooks.length > 0 ? (
          ownedBooks.map((book) => (
            <li key={book.id}>
              {book.title} - {book.author}
              {/* 必要に応じてその他の書籍情報を表示 */}
            </li>
          ))
        ) : (
          <p>所有している本がありません。</p>
        )}
      </ul>
    </div>
  );
};

export default OwnedBooksPage;
