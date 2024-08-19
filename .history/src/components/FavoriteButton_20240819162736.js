import React from 'react';
import { FaHeart } from 'react-icons/fa';
import { useRecoilState, useRecoilValue } from 'recoil';
import { favoritesState } from '@/state/favoritesState';
import { signInUserState } from '@/state/signInUserState';

const FavoriteButton = ({ bookId }) => {
  const [favorites, setFavorites] = useRecoilState(favoritesState);
  const isFavorite = favorites.includes(bookId);
  const setFavoritesState = useSetRecoilState(favoritesState);

  const handleClick = async (event) => {
    event.preventDefault();

    try {
      let response;

      if (isFavorite) {
        response = await fetch(`/api/favorites/${bookId}`, {
          method: 'DELETE',
          credentials: 'include',
        });
      } else {
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
