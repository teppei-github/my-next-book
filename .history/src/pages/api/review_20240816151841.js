import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export async function addReview(data) {
    const reviewId = data.get('id');
    const userId = data.get('userId');

    // ID の形式を確認
    if (!isValidObjectId(reviewId)) {
        throw new Error("Invalid ID format.");
    }

    const book = await getBookById(reviewId); // book の取得処理（必要に応じて実装）

    if (!userId) {
        throw new Error("ユーザーIDが指定されていません。");
    }

    // ユーザーが存在するか確認
    const user = await prisma.user.findUnique({
        where: { id: userId }
    });

    // ユーザーが存在しない場合は作成
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

    // レビューの登録
    const reviewData = {
        // フォームデータから必要なフィールドを設定
        id: reviewId,
        read: data.get('read'),
        memo: data.get('memo'),
        userId: userId,
    };

    // Prisma の upsert を使用してレビューを登録
    const review = await prisma.review.upsert({
        where: { id: reviewId },
        update: reviewData,
        create: reviewData,
    });

    return review;
}

// ObjectID の形式を検証する関数
const isValidObjectId = (id) => /^[0-9a-fA-F]{24}$/.test(id);
