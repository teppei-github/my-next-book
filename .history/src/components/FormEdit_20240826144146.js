"use client";

import { useRouter } from "next/navigation";
import { removeReview } from "@/lib/actions";
import { signInUserState } from "@state/signInUserState";
import { useRecoilValue } from "recoil";

function isValidObjectId(id) {
  const objectIdPattern = /^[0-9a-fA-F]{24}$/;
  return objectIdPattern.test(id);
}

export default function FormEdit({ src: { id, read, memo } }) {
  // 現在のユーザーを取得
  const signInUser = useRecoilValue(signInUserState);
  const router = useRouter();

  // フォームのサブミットハンドラー
  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    formData.append("userId", signInUser?.uid); // ユーザーIDを追加

    if (!signInUser) {
      console.error("User is not signed in.");
      return;
    }
    const formDataObj = {};
    formData.forEach((value, key) => {
      formDataObj[key] = value;
    });

    console.log("formData???", formDataObj); // ユーザーIDをログに出力
    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formDataObj),
      });

      if (response.ok) {
        console.log("Review added successfully");
        router.push("/"); // トップページにリダイレクト
      } else {
        console.error("Failed to add review:", response.statusText);
      }
    } catch (error) {
      console.error("Failed to add review:", error);
    }
  };

  // 削除ハンドラー
  const handleDelete = async () => {
    console.log("Review ID:", id); // レビューIDをログに出力

    if (!id || !isValidObjectId(id)) {
      console.error("Invalid Review ID format.");
      return;
    }

    try {
      const response = await fetch("/api/reviews", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, userId: signInUser?.uid }),
      });

      if (response.ok) {
        console.log("Review deleted successfully"); // 修正: 削除成功のメッセージ
        router.push("/"); // トップページにリダイレクト
      } else {
        console.error("Failed to add review:", await response.text());

      }
    } catch (error) {
      console.error("Failed to add review:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
        <input type="hidden" name="id" defaultValue={id} />
        <div className="mb-3">
            <label className="font-bold" htmlFor="read">読了日 :</label>
            <input type="date" id="read" name="read"
                className="block bg-gray-100 border-2 border-gray-600 rounded focus:bg-white
                focus:outline-none focus:border-red-500"
                defaultValue={read} />
        </div>

        <div className="mb-3">
            <label className="font-bold" htmlFor="memo">感想 :</label>
            <textarea id="memo" name="memo" rows="3"
                className="block bg-gray-100 border-2 border-gray-600 w-full rounded
                focus:bg-white focus:outline-none focus:border-red-500"
                defaultValue={memo}></textarea>
        </div>

        <button type="submit"
            className="bg-blue-600 text-white rounded px-4 py-2 mr-2 hover:bg-blue-500">
            登録
        </button>

        {/* 削除ボタンで handleDelete 関数を呼び出し */}
        <button type="button" 
            className="bg-red-600 text-white rounded px-4 py-2 hover:bg-red-500"
            onClick={handleDelete}> {/* onClick イベントで handleDelete を呼び出す */}
            削除
        </button>
    </form>
);
}