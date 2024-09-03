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
import { favoritesState } from "@/state/favoritesState";
import "./Header.css";

export default function Header({ children }) {
  // メニューのアンカー要素の状態を管理
  const [anchorElBooks, setAnchorElBooks] = useState(null);
  const [signInUser, setSignInUser] = useRecoilState(signInUserState);
  const [openLoginModal, setOpenLoginModal] = useState(false);
  const [favorites, setFavorites] = useRecoilState(favoritesState);

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
    const loginCheck = async () => {
      const loggedIn = localStorage.getItem("isLoggedIn") === "true";
      if (loggedIn) {
        //ログイン状態がtrueの場合、Recoilの状態を更新
        setSignInUser({ uid: "dummy-uid" });
        const query = new URLSearchParams({
          userId: "dummy-uid",
        }).toString();
        const response = await fetch(`/api/favorites?${query}`);
        if (!response.ok) {
          throw new Error("Failed to fetch favorites");
        }
        const data = await response.json();
        const favorites = data.map((d) => d.bookId);
        setFavorites(favorites);
        console.log("favolites", favorites);
      } else {
        // ログイン状態がfalseの場合、Recoilの状態をクリア
        setSignInUser(null);
      }
      console.log("Logged in:", loggedIn);
      console.log("signInUser state:", signInUser);
    };
    loginCheck();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      <div className="flex items-center justify-between p-4 bg-white border-b border-gray-300">
        <h1 className="text-2xl font-bold text-left ml-4">本棚アプリ</h1>
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
                <Link href="/books" className="custom-menu-link">
                  検索
                </Link>
              </MenuItem>
              <MenuItem onClick={() => handleClose(setAnchorElBooks)}>
                <Link href="/bookshelf" className="custom-menu-link">
                  本棚の管理
                </Link>
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
              onClick={() => console.log("Favorites button clicked")}
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
