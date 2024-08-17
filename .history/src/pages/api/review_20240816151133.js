import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ObjectIDの形式を検証する関数
// 24文字の16進数であることをチェック
const isValidObjectId = (id) => /^[0-9a-fA-F]{24}$/.test(id);

export default async function handler(req, res) {
  // POSTリクエストの処理
  if (req.method === 'POST') {
    try {
      // リクエストボディから reviewId と reviewData を取得
      const { reviewId, reviewData } = req.body;

      // reviewId の形式が正しいか検証
      // 無効な形式の場合、エラーメッセージを返す
      if (!isValidObjectId(reviewId)) {
        res.status(400).json({ error: 'Invalid ID format' });
        return; // ここで処理を終了
      }

      // reviewId が有効な形式であれば、upsert 操作を実行
      // upsert は、指定された ID のレビューが存在すれば更新し、存在しなければ新規作成する
      const review = await prisma.review.upsert({
        where: { id: reviewId },
        update: reviewData, // 既存のレビューを更新するデータ
        create: reviewData, // 新しいレビューを作成するデータ
      });

      // 成功時にレビューを返す
      res.status(200).json(review);
    } catch (error) {
      // エラー発生時にエラーメッセージを返す
      console.error('Failed to add review:', error);
      res.status(500).json({ error: 'Failed to add review' });
    } finally {
      // Prismaクライアントの切断
      await prisma.$disconnect();
    }
  } else {
    // POST以外のメソッドに対してはエラーメッセージを返す
    res.status(405).json({ error: 'Method not allowed' });
  }
}
