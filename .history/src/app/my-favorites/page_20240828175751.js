"use client";

import React from "react";
import FavoriteButton from "@/components/FavoriteButton";
import { useRecoilState } from "recoil";
import { favoritesState } from "@/state/favoritesState";
import { useEffect } from "react";
import ReturnTopButton from "@/components/ReturnTopButton";

const FavoritesPage = () => {
  const [favorites, setFavorites] = useRecoilState(favoritesState);

  /*
  useEffect(() => {
    console.log("Favorites state updated:", favorites);
  }, [favorites]);

  if (!Array.isArray(favorites)) {
    console.error("favorites is not an array:", favorites);
    return <div>お気に入りの情報を読み込めませんでした。</div>;
  }
*/
  return (
    <div className="p-6 mx-auto max-w-screen-lg">
      <h1 className="text-3xl font-bold mb-6">お気に入り</h1>
      <ul>
        {favorites.length > 0 ? (
          favorites.map((item) => (
            <li key={item.id}>
              {item.title}
              <FavoriteButton bookId={item.id} />
            </li>
          ))
        ) : (
          <p>お気に入りの本がありません。</p>
        )}
      </ul>
      <ReturnTopButton />
    </div>
  );
  
  return null;
};

export default FavoritesPage;