"use client";

import { useRouter } from "next/navigation";
import { signInUserState } from "@state/signInUserState";
import { useRecoilValue } from "recoil";

// MongoDB ObjectId形式や他の形式に対応する検証関数（追加）
function isValidId(id) {
  // MongoDB ObjectId形式（24文字の16進数）
  const objectIdPattern = /^[0-9a-fA-F]{24}$/;
  
  // 書籍IDの形式（例として10文字以上の大文字と数字）
  const bookIdPattern = /^[A-Z0-9]{10,}$/;
  
  // ID形式をチェック
  return objectIdPattern.test(id) || bookIdPattern.test(id);
}

//一時的に追加、あとで削除
function testIsValidObjectId() {
  console.log(isValidObjectId("GXmsEAAAQBAJ")); // 期待する出力: false
  console.log(isValidObjectId("60c72b2f9b1d8a5f5f5f5f5f")); // 期待する出力: true
}
testIsValidObjectId();


export default function FormEdit({ src: { id, read, memo, book } }) {
  // 現在のユーザーをRecoilから取得
  const signInUser = useRecoilValue(signInUserState);
  const router = useRouter();

  // フォームのサブミットハンドラー
  const handleSubmit = async (event) => {
    event.preventDefault(); // デフォルトのフォーム送信を防ぐ

    // フォームデータを取得
    const formData = new FormData(event.target);
    formData.append("userId", signInUser?.uid); // ユーザーIDを追加

    // ユーザーがサインインしていない場合はエラーメッセージを表示
    if (!signInUser) {
      console.error("User is not signed in.");
      return;
    }

    // FormDataをオブジェクトに変換
    const formDataObj = {};
    formData.forEach((value, key) => {
      formDataObj[key] = value;
    });

    try {
      // APIリクエストを送信してレビューを追加
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formDataObj),
      });

      // レスポンスが成功の場合はリダイレクト
      if (response.ok) {
        console.log("Review added successfully");
        router.push("/");
      } else {
        console.error("Failed to add review:", response.statusText);
      }
    } catch (error) {
      console.error("Failed to add review:", error);
    }
  };

  // 削除ハンドラー
  const handleDelete = async () => {
    console.log("Review ID:", id);
    // IDが不正な形式の場合はエラーメッセージを表示
    if (!id || !isValidObjectId(id)) {
      console.error("Invalid Review ID format.");
      return;
    }

    try {
      // APIリクエストを送信してレビューを削除
      const response = await fetch("/api/reviews", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, userId: signInUser?.uid }),
      });

      // レスポンスが成功の場合はリダイレクト
      if (response.ok) {
        console.log("Review deleted successfully");
        router.push("/");
      } else {
        console.error("Failed to delete review:", await response.text());
      }
    } catch (error) {
      console.error("Failed to delete review:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="hidden" name="id" defaultValue={id} />
      <input type="hidden" name="imagesrc" defaultValue={book.image} />
      <input type="hidden" name="title" defaultValue={book.title} />
      <input type="hidden" name="author" defaultValue={book.author} />
      <input type="hidden" name="publisher" defaultValue={book.publisher} />
      <input type="hidden" name="published" defaultValue={book.published} />
      <div className="mb-3">
        <label className="font-bold" htmlFor="read">
          読了日 :
        </label>
        <input
          type="date"
          id="read"
          name="read"
          className="block bg-gray-100 border-2 border-gray-600 rounded focus:bg-white focus:outline-none focus:border-red-500"
          defaultValue={read}
        />
      </div>

      <div className="mb-3">
        <label className="font-bold" htmlFor="memo">
          感想 :
        </label>
        <textarea
          id="memo"
          name="memo"
          rows="3"
          className="block bg-gray-100 border-2 border-gray-600 w-full rounded focus:bg-white focus:outline-none focus:border-red-500"
          defaultValue={memo}
        ></textarea>
      </div>

      <button
        type="submit"
        className="bg-blue-600 text-white rounded px-4 py-2 mr-2 hover:bg-blue-500"
      >
        登録
      </button>

      <button
        type="button"
        className="bg-red-600 text-white rounded px-4 py-2 hover:bg-red-500"
        onClick={handleDelete}
      >
        削除
      </button>
    </form>
  );
}