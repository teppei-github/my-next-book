"use client";

import React, { useEffect } from "react";
import FavoriteButton from "@/components/FavoriteButton";
import { useRecoilState, useRecoilValue } from "recoil";
import { favoritesState } from "@/state/favoritesState";
import { signInUserState } from "@/state/signInUserState";
import ReturnTopButton from "@/components/ReturnTopButton";

const FavoritesPage = () => {
  // Recoilの状態からお気に入りとサインインユーザーを取得
  const [favorites, setFavorites] = useRecoilState(favoritesState);
  const signInUser = useRecoilValue(signInUserState);

  useEffect(() => {
    // お気に入りの状態が更新されたときにログ出力
    console.log("Favorites state updated:", favorites);
    if (!Array.isArray(favorites)) {
      console.error("favorites is not an array:", favorites);
    }
  }, [favorites]);

  // ユーザーがサインインしていない場合のエラーメッセージ
  if (!signInUser || !signInUser.uid) {
    return <div>ログインしていないため、お気に入りページを表示できません。</div>;
  }

  return (
    <div className="p-6 mx-auto max-w-screen-lg">
      <h1 className="text-3xl font-bold mb-6">お気に入り</h1>
      <ul>
        {/* お気に入りの配列が存在し、アイテムがある場合 */}
        {Array.isArray(favorites) && favorites.length > 0 ? (
          favorites.map((item, index) => (
            <li key={item.bookId || index}> 
              <div>{item.title || 'タイトルがありません'}</div> {/* 書籍タイトルを表示、タイトルが空の場合のフォールバック */}
              <FavoriteButton
                bookId={item.bookId}
                title={item.title}
                author={item.author}
                price={item.price}
                publisher={item.publisher}
                published={item.published}
                image={item.image}
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