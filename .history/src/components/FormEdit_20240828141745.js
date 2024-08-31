"use client";

import { useRouter } from "next/navigation";
import { signInUserState } from "@state/signInUserState";
import { useRecoilValue } from "recoil";

// MongoDBのObjectIdの形式が正しいかを検証する関数
function isValidObjectId(id) {
  const objectIdPattern = /^[0-9a-fA-F]{24}$/;
  return objectIdPattern.test(id);
}

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