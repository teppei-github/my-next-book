import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// API経由で取得した書籍情報から必要な情報だけをオブジェクトに詰め替え
export function createBook(book) {
  const authors = book.volumeInfo?.authors;
  const price = book.saleInfo?.listPrice;
  const img = book.volumeInfo?.imageLinks;
  return {
    id: book.id,
    title: book.volumeInfo?.title || "タイトルなし",
    author: authors ? authors.join(", ") : "著者不明",
    price: price ? price.amount : 0,
    publisher: book.volumeInfo?.publisher || "出版社不明",
    published: book.volumeInfo?.publishedDate || "日付不明",
    image: img?.smallThumbnail || "/vercel.svg", // デフォルト画像のパス
  };
}

// Google Books APIから書籍情報を取得
export async function getBookById(id) {
  try {
    const result = await fetchWithBackoff(
      `https://www.googleapis.com/books/v1/volumes/${id}`,
      false
    );
    return createBook(result);
  } catch (error) {
    console.error(`Error fetching book by ID ${id}:`, error);
    return null;
  }
}

// 引数keywordをキーにGoogle Books APIから書籍を検索
export async function getBooksByKeyword(keyword, page = 1, booksPerPage = 10) {
  if (!keyword) {
    console.error("キーワードが指定されていません。");
    return [];
  }

  try {
    const startIndex = (page - 1) * booksPerPage;
    const result = await fetchWithBackoff(
      `https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(
        keyword
      )}&langRestrict=ja&maxResults=${booksPerPage}&startIndex=${startIndex}&printType=books`,
      true
    );
    if (!result.items) {
      console.warn("書籍情報が取得できませんでした。");
      return [];
    }
    return result.items.map(createBook);
  } catch (error) {
    console.error("Error fetching books:", error);
    return [];
  }
}

// id値をキーにレビュー情報を取得
export async function getReviewById(id) {
  try {
    return await prisma.review.findUnique({
      where: { id: id },
    });
  } catch (error) {
    console.error(`Error fetching review by ID ${id}:`, error);
    return null;
  }
}

// 全てのレビューを取得
export async function getAllReviews() {
  try {
    return await prisma.review.findMany({
      orderBy: { read: "desc" },
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return [];
  }
}

// エクスポネンシャルバックオフを使ってリクエストを再試行する関数
const fetchWithBackoff = async (url, apiget, retries = 3, delay = 1000) => {
  try {
    let fullUrl = apiget ? `${url}&key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}` : url;
    const res = await fetch(fullUrl);

    if (res.status === 429 && retries > 0) {
      await new Promise((resolve) => setTimeout(resolve, delay));
      return fetchWithBackoff(url, apiget, retries - 1, delay * 2);
    }

    if (!res.ok) {
      throw new Error(`HTTP error! status: ${res.status}`);
    }

    return res.json();
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
};
