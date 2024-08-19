import { atom } from 'recoil';

// お気に入りの状態を管理するRecoilのatom
export const favoritesState = atom({
  key: 'favoritesState',
  default: [], // デフォルト値は空の配列
});