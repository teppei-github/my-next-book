import React, { useState, useEffect } from 'react';
import { FaHeart } from 'react-icons/fa';

const FavoriteButton = ({ bookId }) => {
  const [isFavorite, setIsFavorite] = useState(false);

  // コンポーネントがマウントされたときにお気に入りの状態を取得する
  useEffect(() => {
    const checkFavorite = async () => {
      try {
        const response = await fetch(`/api/favorites/check/${bookId}`, {
          method: 'GET',
          credentials: 'include',
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        setIsFavorite(data.isFavorite);
      } catch (error) {
        console.error('APIリクエスト中にエラーが発生しました:', error);
      }
    };

    checkFavorite();
  }, [bookId]);

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

      setIsFavorite(prevIsFavorite => !prevIsFavorite);
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
