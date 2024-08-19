import React from "react";
import { FaHeart } from "react-icons/fa";
import { useRecoilState, useRecoilValue } from "recoil";
import { favoritesState } from "@/state/favoritesState";
import { signInUserState } from "@state/signInUserState";

const FavoriteButton = ({ bookId }) => {
  const [favorites, setFavorites] = useRecoilState(favoritesState);
  const signInUser = useRecoilValue(signInUserState);
  const isFavorite = favorites.includes(bookId);

  const handleClick = async (event) => {
    event.preventDefault();

    try {
      let response;

      if (isFavorite) {
        // お気に入りから削除するAPIリクエスト
        response = await fetch(`/api/favorites/${bookId}`, {
          method: 'DELETE',
          credentials: 'include',
        });
      } else {
        // お気に入りに追加するAPIリクエスト
        response = await fetch('/api/favorites', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ bookId }),
          credentials: 'include',
        });
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // 状態の更新
      setFavorites(prevFavorites => {
        if (isFavorite) {
          return prevFavorites.filter(id => id !== bookId);
        } else {
          return [...prevFavorites, bookId];
        }
      });
    } catch (error) {
      console.error('APIリクエスト中にエラーが発生しました:', error);
    }
  };

  return (
    <button type="button" onClick={handleClick}>
      <FaHeart color={isFavorite ? 'red' : 'grey'} />
    </button>
  );
};

export default FavoriteButton;
