"use client";

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Image from 'next/image';

//ホームページコンポーネント
export default function HomePage() {
  // ルーターを使用してページ遷移を管理
  const router = useRouter();

  const authContext = useAuth();
  console.log(authContext);
  const { user } = authContext || {};
  // 認証コンテキストからユーザー情報を取得
  //const { user } = useAuth();

  //ユーザーがログインしていない場合、ログインページにリダイレクト
  useEffect(() => {
    if (!user) {
      router.push('/login')
    }
  }, [user, router]); // userが変更されるたびにこの効果を実行

  //ログイン状態を確認中の表示
  if(!user) {
    return <p>Loading...</p>;
  }

  //ユーザーがログインしている場合のホームページの内容
  return (
    <div>
      <h1 className="text-4xl text-indigo-800 font-bold my-2">
        ホームページへようこそ！</h1>

        <Image src='/images/logo1.png' width={300} height={150} alt="Logo" />
    </div>
  );
}


