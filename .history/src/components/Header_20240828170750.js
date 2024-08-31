"use client";

import Link from "next/link";
import { Menu, MenuItem, Button } from "@mui/material";
import { useState, useEffect } from "react";
import { useRecoilState } from "recoil";
import { signInUserState } from "@state/signInUserState";
import LoginButton from "./LoginButton";
import LogoutButton from "./LogoutButton";
import LoginForm from "./LoginForm";
import { useRouter } from "next/navigation";
import "./Header.css";

export default function Header({ children }) {
  // メニューのアンカー要素の状態を管理
  const [anchorElBooks, setAnchorElBooks] = useState(null);
  const [signInUser, setSignInUser] = useRecoilState(signInUserState);
  const [openLoginModal, setOpenLoginModal] = useState(false);
  const router = useRouter();

  // メニューを開くためのハンドラー
  const handleClick = (event, setAnchor) => {
    if (event && event.currentTarget) {
      setAnchor(event.currentTarget);
    } else {
      console.error("Event or currentTarget is null or undefined");
    }
  };

  // メニューを閉じるためのハンドラー
  const handleClose = (setAnchor) => {
    setAnchor(null);
  };

  const closeLoginModal = () => {
    setOpenLoginModal(false);
  };

  // コンポーネントのマウント時にログイン状態をチェック
  useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (loggedIn) {
      //ログイン状態がtrueの場合、Recoilの状態を更新
      setSignInUser({ uid: "dummy-uid" });
    } else {
      // ログイン状態がfalseの場合、Recoilの状態をクリア
      setSignInUser(null);
    }
    console.log("Logged in:", loggedIn);
    console.log("signInUser state:", signInUser);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="flex items-center justify-between p-4 bg-white border-b border-gray-300">
      <div className="flex items-center space-x-2">
  <svg className="w-8 h-8 text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
  </svg>
  <h1 className="text-3xl font-semibold text-gray-900">本棚アプリ</h1>
</div>






      <ul className="flex space-x-4">
          {signInUser?.uid ? (
            <li className="header-menu-item">
              <LogoutButton />
            </li>
          ) : (
            <li className="header-menu-item">
              <LoginButton setOpenLoginModal={setOpenLoginModal} />
            </li>
          )}

          <li className="header-menu-item">
            <Button
              aria-controls="books-menu"
              aria-haspopup="true"
              onClick={(e) => handleClick(e, setAnchorElBooks)}
              className="custom-menu-button"
            >
              書籍管理
            </Button>
            <Menu
              id="books-menu"
              anchorEl={anchorElBooks}
              keepMounted
              open={Boolean(anchorElBooks)}
              onClose={() => handleClose(setAnchorElBooks)}
            >
              <MenuItem onClick={() => handleClose(setAnchorElBooks)}>
                <Link href="/books" className="custom-menu-link">検索</Link>
              </MenuItem>
              <MenuItem onClick={() => handleClose(setAnchorElBooks)}>
                <Link href="/bookshelf" className="custom-menu-link">本棚の管理</Link>
              </MenuItem>
            </Menu>
          </li>

          <li className="header-menu-item">
            <Button
              component={Link}
              href="/my-reviews"
              className="custom-menu-button"
            >
              レビュー
            </Button>
          </li>

          <li className="header-menu-item">
            <Button
              component={Link}
              href="/my-favorites"
              className="custom-menu-button"
              onClick={() => console.log('Favorites button clicked')}
            >
              お気に入り
            </Button>
          </li>

          <li className="header-menu-item">
            <Button
              component={Link}
              href="/my-recommendations"
              className="custom-menu-button"
            >
              おすすめの本
            </Button>
          </li>
        </ul>
      </div>
      <div className="ml-2">{children}</div>
      {openLoginModal && <LoginForm closeLoginModal={closeLoginModal} />}
    </>
  );
}