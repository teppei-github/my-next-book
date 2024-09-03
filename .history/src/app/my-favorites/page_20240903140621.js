"use client";

import React, { useEffect, useState } from "react";
import FavoriteButton from "@/components/FavoriteButton";
import { useRecoilState, useRecoilValue } from "recoil";
import { favoritesState } from "@/state/favoritesState";
import { signInUserState } from "@/state/signInUserState";
import ReturnTopButton from "@/components/ReturnTopButton";
import Image from 'next/image';

const FavoritesPage = () => {
  const [favorites, setFavorites] = useRecoilState(favoritesState);
  const signInUser = useRecoilValue(signInUserState);
  const [books, setBooks] = useState([]);

  useEffect(() => {
    // お気に入りが変更されたときに書籍情報を取得
    const fetchBooks = async () => {
      if (favorites.length === 0) {
        setBooks([]); // お気に入りが空の場合、書籍リストも空にする
        return;
      }
      
      try {
        const query = new URLSearchParams({ userId: signInUser.uid }).toString();
        const response = await fetch(`/api/favorites?${query}`);
        if (!response.ok) {
          throw new Error('Failed to fetch favorites');
        }
        const data = await response.json();
        console.log('API response data:', data); // データを確認
        setBooks(data.books || []);
      } catch (error) {
        console.error('Error fetching favorites:', error);
      }
    };
    fetchBooks();
  },  [favorites, signInUser]);

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
              <div>タイトル: {book.title || 'タイトルがありません'}</div>
              <div>著者: {book.author || '著者情報がありません'}</div>
              <div>価格: {book.price || '価格情報がありません'}</div>
              <div>出版社: {book.publisher || '出版社情報がありません'}</div>
              <div>出版日: {book.published ? new Date(book.published).toLocaleDateString() : '出版日がありません'}</div>
              <Image 
              src={book.image || '/default_image_url.jpg'} 
              alt={book.title || '書籍画像'} 
              width={150} // 適切な幅を指定
              height={200} // 適切な高さを指定
              layout='responsive' // レイアウトオプションを指定
            />

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
