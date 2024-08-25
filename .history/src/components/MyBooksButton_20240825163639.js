import { FaBook } from "react-icons/fa6";
import { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import { OwnedBooksState } from "@state/OwnedBooksState";

const MyBooksButton = ({ bookId }) => {
  // OwnedBooksState からタイトルを取得
  const [ownedBooks, setOwnedBooks] = useRecoilState(OwnedBooksState);
  const [myBook, setMyBook] = useState(false);

  // ボタンがクリックされたときの処理
  const handleClick = (event) => {
    event.preventDefault(); // デフォルトのリンク動作を防ぐ

    if (myBook) {
      const newOwnedBooks = ownedBooks.filter(id => id !== bookId);
      setOwnedBooks(newOwnedBooks);
      console.log('本棚から削除:', newOwnedBooks);
    } else {
      const newOwnedBooks = [...ownedBooks, bookId];
      setOwnedBooks(newOwnedBooks);
      console.log('本棚に追加:', newOwnedBooks);
    }
    setMyBook(!myBook);
  };

  // `myBook` ステートが変更された場合に `ownedBooks` と同期させる
  useEffect(() => {
    setMyBook(ownedBooks.includes(bookId));
  }, [ownedBooks, bookId]); // `bookId` を依存配列に追加

  return (
    <button type="button" onClick={handleClick}>
      <FaBook color={myBook ? 'yellow' : 'grey'} />
    </button>
  );
};

export default MyBooksButton;
