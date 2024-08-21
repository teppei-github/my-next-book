import React from "react";
import { FaHeart } from "react-icons/fa";
import { useRecoilState, useRecoilValue } from "recoil";
import { favoritesState } from "@/state/favoritesState";
import { signInUserState } from "@state/signInUserState";

const FavoriteButton = ({ bookId }) => {
  // Recoilで状態を管理する
  const [favorites, setFavorites] = useRecoilState(favoritesState);
  const signInUser = useRecoilValue(signInUserState); // サインインユーザーの状態を取得
  const isFavorite = favorites.includes(bookId); // 現在の本がお気に入りかどうか

  const handleClick = async (event) => {
    event.preventDefault();

    // サインインしていない場合はエラーメッセージを表示
    if (!signInUser || !signInUser.uid) {
      console.error("User must be logged in to favorite a book.");
      return;
    }

    try {
      let response;

      if (isFavorite) {
        // お気に入りから削除するAPIリクエスト
        response = await fetch(`/api/favorites/${bookId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });
      } else {
        // お気に入りに追加するAPIリクエスト
        response = await fetch('/api/favorites', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId: signInUser.uid, bookId }), // ユーザーIDと本のIDをリクエストボディに含める
          credentials: 'include',
        });
      }

      // レスポンスが正常でない場合はエラーをスロー
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // お気に入りリストの状態を更新
      setFavorites(prevFavorites => {
        if (isFavorite) {
          return prevFavorites.filter(id => id !== bookId);
        } else {
          return [...prevFavorites, bookId];
        }
      });
    } catch (error) {
      // エラーハンドリング
      console.error('APIリクエスト中にエラーが発生しました:', error);
      // 必要に応じてユーザーにエラーメッセージを表示する機能を追加する
    }
  };

  return (
    <button type="button" onClick={handleClick}>
      <FaHeart color={isFavorite ? 'red' : 'grey'} />
      {/* お気に入り状態に応じてハートアイコンの色を変更 */}
    </button>
  );
};

export default FavoriteButton;
