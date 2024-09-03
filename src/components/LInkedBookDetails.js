import Link from "next/link";
import BookDetails from "./BookDetails";
import FavoriteButton from "./FavoriteButton";
import MyBooksButton from "./MyBooksButton";

export default function LinkedBookDetails({ index, book }) {
  console.log("LinkedBookDetails の book", book);
  //BookDetailsコンポーネントにリンクを付与
  return (
    <div className="relative p-4 border border-gray-200 rounded-lg shadow-md bg-white mb-4 hover:bg-green-50 transition-colors duration-300">
      <Link href={`/edit/${book.id}`}>
        <div>
          <BookDetails index={index} book={book} />
        </div>
      </Link>
      <div className="absolute bottom-2 right-2">
        <Link href={"/my-favorites"}>
          <FavoriteButton bookId={book.id} bookObj={book} />
          {/* FavoriteButtonを右下に配置 */}
        </Link>

        <Link href={"/bookshelf"}>
          <MyBooksButton /> {/* MyBooksButtonを右下に配置 */}
        </Link>
      </div>
    </div>
  );
}
