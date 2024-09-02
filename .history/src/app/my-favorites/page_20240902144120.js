"use client";

import React, { useEffect, useState } from "react";
import FavoriteButton from "@/components/FavoriteButton";
import { useRecoilState, useRecoilValue } from "recoil";
import { favoritesState } from "@/state/favoritesState";
import { signInUserState } from "@/state/signInUserState";
import ReturnTopButton from "@/components/ReturnTopButton";

const FavoritesPage = () => {
  const [favorites, setFavorites] = useRecoilState(favoritesState);
  const signInUser = useRecoilValue(signInUserState);
  const [books, setBooks] = useState([]);

  useEffect(() => {
    // お気に入りが変更されたときに書籍情報を取得
    const fetchBooks = async () => {
      if (favorites.length === 0) return;
      
      try {
        const response = await fetch(`/api/favorites?ids=${favorites.join(',')}`); // 書籍情報を取得する API エンドポイント
        if (!response.ok) {
          throw new Error('Failed to fetch books');
        }
        const data = await response.json();
        setBooks(data.books); // 書籍情報をステートに保存
      } catch (error) {
        console.error('Error fetching books:', error);
      }
    };

    fetchBooks();
  }, [favorites]);

  if (!signInUser || !signInUser.uid) {
    return <div>ログインしていないため、お気に入りページを表示できません。</div>;
  }

  return (
    <div className="p-6 mx-auto max-w-screen-lg">
      <h1 className="text-3xl font-bold mb-6">お気に入り</h1>
      <ul>
        {books.length > 0 ? (
          books.map((book) => (
            <li key={book.bookId}> 
              <div>{book.title || 'タイトルがありません'}</div>
              <FavoriteButton
                bookId={book.bookId}
                title={book.title}
                author={book.author}
                price={book.price}
                publisher={book.publisher}
                published={book.published}
                image={book.image}
              />
            </li>
          ))
        ) : (
          <p>お気に入りの本がありません。</p> 
        )}
      </ul>
      <ReturnTopButton />
    </div>
  );
};

export default FavoritesPage;
