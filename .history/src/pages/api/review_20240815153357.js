import { PrismaClient } from '@prisma/client';

// PrismaClientのインスタンスを作成します。これを使ってデータベースとのやり取りを行います。
const prisma = new PrismaClient();

// Next.jsのAPIルートハンドラー。リクエストのメソッドに応じて異なる処理を行います。
export default async function handler(req, res) {
  // リクエストのHTTPメソッドを取得します。
  const { method } = req;

  // HTTPメソッドに応じた処理を行います。
  switch (method) {
    case 'GET':
      // GETリクエスト: レビューを取得する
      // クエリパラメータからユーザーIDを取得します。
      const userId = req.query.userId;

      // ユーザーIDが提供されている場合
      if (userId) {
        try {
          // Prismaを使ってレビューをデータベースから取得します。
          const reviews = await prisma.review.findMany({
            where: { userId }, // ユーザーIDに基づいてレビューを検索します。
          });

          // レビューが取得できたら、200 OKとともにレビューのデータを返します。
          res.status(200).json(reviews);
        } catch (error) {
          // データ取得中にエラーが発生した場合、500 Internal Server Errorを返します。
          res.status(500).json({ error: 'Error fetching reviews' });
        }
      } else {
        // ユーザーIDが提供されていない場合、400 Bad Requestを返します。
        res.status(400).json({ error: 'User ID is required' });
      }
      break;

    case 'POST':
      // POSTリクエスト: レビューを追加または更新する
      // リクエストボディから必要なデータを取得します。
      const { id, read, memo, userId } = req.body;

      // IDとユーザーIDが提供されている場合
      if (id && userId) {
        try {
          // Prismaの`upsert`メソッドを使ってレビューを追加または更新します。
          await prisma.review.upsert({
            where: { id }, // IDでレビューを検索します。
            update: { read, memo }, // レビューが存在する場合、指定されたデータで更新します。
            create: { id, read, memo, userId }, // レビューが存在しない場合、新しく作成します。
          });

          // レビューが追加または更新できたら、200 OKとともに成功メッセージを返します。
          res.status(200).json({ message: 'Review added or updated successfully' });
        } catch (error) {
          // レビューの追加または更新中にエラーが発生した場合、500 Internal Server Errorを返します。
          res.status(500).json({ error: 'Error adding or updating review' });
        }
      } else {
        // IDまたはユーザーIDが提供されていない場合、400 Bad Requestを返します。
        res.status(400).json({ error: 'ID and User ID are required' });
      }
      break;

    case 'DELETE':
      // DELETEリクエスト: レビューを削除する
      // リクエストボディから削除するレビューのIDを取得します。
      const { reviewId } = req.body;

      // レビューIDが提供されている場合
      if (reviewId) {
        try {
          // Prismaを使ってレビューをデータベースから削除します。
          await prisma.review.delete({
            where: { id: reviewId }, // IDでレビューを検索し、削除します。
          });

          // レビューが削除できたら、200 OKとともに成功メッセージを返します。
          res.status(200).json({ message: 'Review deleted successfully' });
        } catch (error) {
          // レビューの削除中にエラーが発生した場合、500 Internal Server Errorを返します。
          res.status(500).json({ error: 'Error deleting review' });
        }
      } else {
        // レビューIDが提供されていない場合、400 Bad Requestを返します。
        res.status(400).json({ error: 'Review ID is required' });
      }
      break;

    default:
      // サポートされていないHTTPメソッドの場合、405 Method Not Allowedを返します。
      res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
      res.status(405).end(`Method ${method} Not Allowed`);
      break;
  }
}
