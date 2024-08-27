"use client";

import React, { useEffect } from "react";
import { useRecoilState } from "recoil";
import { OwnedBooksState } from "@/state/OwnedBooksState";
import { useRecoilValue } from "recoil";
import { signInUserState } from "@/state/signInUserState";
import MyBooksButton from "@/components/MyBooksButton";
import ReturnTopButton from "@/components/ReturnTopButton";

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
        const response = await fetch(`/api/bookshelf?userId=${signInUser.uid}`);
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
      <h1 className="text-3xl font-bold mb-6">自分の本棚</h1>
      <ul>
        {ownedBooks.length > 0 ? (
          ownedBooks.map((book) => (
            <li key={book.id}>
              {book.title ? book.title : 'タイトルがありません'}
              {/* 各本の ID を `MyBooksButton` に渡す */}
              <MyBooksButton bookId={book.id} />
            </li>
          ))
        ) : (
          <p>本棚に本がありません。</p>
        )}
      </ul>
      <ReturnTopButton/>
    </div>
  );
};

export default OwnedBooksPage;