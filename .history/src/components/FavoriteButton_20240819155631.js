import React from 'react';
import { FaHeart } from 'react-icons/fa';
import { useRecoilState } from 'recoil';
import { favoritesState } from '@/state/favoritesState';
import { signInUserState } from '@state/signInUserState';

const FavoriteButton = ({ bookId }) => {
  const [favorites, setFavorites] = useRecoilState(favoritesState);
  const signInUser = useRecoilState(signInUserState)[0];
  
  // サインインユーザーが存在しない場合は、操作を無効にする
  if (!signInUser) {
    return <button type="button" disabled><FaHeart color="grey" /></button>;
  }

  const isFavorite = favorites.includes(bookId);
  const userId = signInUser.id; // サインインユーザーのIDを取得

  const handleClick = async (event) => {
    event.preventDefault();

    try {
      let response;

      if (isFavorite) {
        // お気に入りから削除するAPIリクエスト
        response = await fetch(`/api/favorites/${bookId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId, bookId }),
          credentials: 'include',
        });
      } else {
        // お気に入りに追加するAPIリクエスト
        response = await fetch('/api/favorites', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId, bookId }),
          credentials: 'include',
        });
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
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