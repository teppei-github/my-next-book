import React from "react";
import FavoriteButton from "@/components/FavoriteButton";
import { useRecoilValue } from 'recoil';
import { favoritesState } from '@/state/favoritesState'; 

const FavoritesPage = () => {
  // Recoilからお気に入りのリストを取得
  const favorites = useRecoilValue(favoritesState);

  console.log('Favorites from Recoil:', favorites);

  // favoritesが配列であることを確認
  if (!Array.isArray(favorites)) {
    console.error('favorites is not an array:', favorites);
    return <div>お気に入りの情報を読み込めませんでした。</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">お気に入り</h1>
      <ul>
        {favorites.length > 0 ? (
          favorites.map((item) => (
            <li key={item.id}>
              {item.title} {/* ここでタイトルを表示 */}
              <FavoriteButton bookId={item.id} /> {/* お気に入りボタン */}
            </li>
          ))
        ) : (
          <p>お気に入りの本がありません。</p>
        )}
      </ul>
    </div>
  );
};

export default FavoritesPage;
