import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// オブジェクトIDが有効かどうかをチェックする関数
function isValidObjectId(id) {
    const objectIdPattern = /^[0-9a-fA-F]{24}$/;
    return objectIdPattern.test(id);
}

// メインのハンドラ関数
export default async function handler(req, res) {
    const { method } = req;

    switch (method) {
        case 'GET':
            return handleGet(req, res); // GETリクエストを処理
        case 'POST':
            return handlePost(req, res); // POSTリクエストを処理
        case 'DELETE':
            return handleDelete(req, res); // DELETEリクエストを処理
        default:
            res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
            return res.status(405).end(`Method ${method} Not Allowed`); // 許可されていないメソッドの場合
    }
}

// GETリクエストを処理する関数
async function handleGet(req, res) {
    try {
        const { userId, filter } = req.query;

        if (!userId) {
            return res.status(400).json({ error: 'User ID is required' }); // ユーザーIDが必要
        }

        const reviews = await prisma.review.findMany({
            where: filter === 'others' ? { NOT: { userId } } : { userId },
            orderBy: { read: 'desc' },
        });

        return res.status(200).json(reviews); // レビューを返す
    } catch (error) {
        return res.status(500).json({ error: 'Failed to fetch reviews' }); // エラーハンドリング
    } finally {
        await prisma.$disconnect(); // データベース接続を切断
    }
}

// POSTリクエストを処理する関数
async function handlePost(req, res) {
    try {
        const { id, userId, read, memo } = req.body;

        if (!isValidObjectId(id)) {
            return res.status(400).json({ error: 'Invalid Review ID format' }); // 無効なレビューID形式
        }

        const book = await getBookById(id); // 本の情報を取得

        const user = await prisma.user.findUnique({ where: { id: userId } });

        if (!user) {
            await prisma.user.create({
                data: { 
                    id: userId,
                    name: "Default Name",
                    email: `${userId}@example.com`,
                    password: "defaultpassword"
                }
            });
        }

        const reviewData = {
            title: book.title,
            author: book.author,
            price: Number(book.price),
            publisher: book.publisher,
            published: new Date(book.published).toISOString(),
            image: book.image,
            read: new Date(read),
            memo: memo,
            userId: userId,
        };

        const review = await prisma.review.upsert({
            where: { id: id },
            update: reviewData,
            create: reviewData,
        });

        return res.status(200).json(review); // レビューを返す
    } catch (error) {
        return res.status(500).json({ error: 'Failed to add review' }); // エラーハンドリング
    } finally {
        await prisma.$disconnect(); // データベース接続を切断
    }
}

// DELETEリクエストを処理する関数
async function handleDelete(req, res) {
    try {
        const { id } = req.body;

        if (!isValidObjectId(id)) {
            return res.status(400).json({ error: 'Invalid Review ID format' }); // 無効なレビューID形式
        }

        await prisma.review.delete({ where: { id: id } });

        return res.status(200).json({ message: 'Review removed successfully' }); // レビュー削除成功
    } catch (error) {
        return res.status(500).json({ error: 'Failed to remove review' }); // エラーハンドリング
    } finally {
        await prisma.$disconnect(); // データベース接続を切断
    }
}
