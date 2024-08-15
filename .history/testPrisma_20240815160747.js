// testPrisma.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testPrisma() {
  try {
    // データベースに接続
    await prisma.$connect();
    console.log('Connected to MongoDB successfully');

    // テストデータの作成
    const newUser = await prisma.user.create({
      data: {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password',
      },
    });
    console.log('Created User:', newUser);

    // データの読み込み
    const users = await prisma.user.findMany();
    console.log('All Users:', users);

    // データの更新
    const updatedUser = await prisma.user.update({
      where: { id: newUser.id },
      data: { name: 'Updated User' },
    });
    console.log('Updated User:', updatedUser);

    // データの削除
    await prisma.user.delete({
      where: { id: newUser.id },
    });
    console.log('User deleted successfully');

  } catch (error) {
    console.error('Error:', error);
  } finally {
    // Prisma クライアントの切断
    await prisma.$disconnect();
  }
}

testPrisma();
