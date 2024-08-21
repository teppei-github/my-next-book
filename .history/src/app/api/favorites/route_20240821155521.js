import { NextApiRequest, NextApiResponse } from 'next';
import prisma from '@/lib/prisma';

export default async function handler(req, res) {
  const { userId, bookId } = req.body;

  if (!userId || !bookId) {
    return res.status(400).json({ error: 'userId and bookId are required' });
  }

  if (req.method === 'POST') {
    console.log('Received POST data:', req.body);

    try {
      await prisma.favorite.create({
        data: {
          userId,
          bookId,
        },
      });

      res.status(200).json({ success: true });
    } catch (error) {
      console.error("Error processing request:", error);
      res.status(500).json({ error: "Error processing request" });
    }
  } else if (req.method === 'DELETE') {
    console.log('Received DELETE data:', req.body);

    try {
      await prisma.favorite.deleteMany({
        where: {
          userId,
          bookId,
        },
      });

      res.status(200).json({ success: true });
    } catch (error) {
      console.error("Error processing request:", error);
      res.status(500).json({ error: "Error processing request" });
    }
  } else {
    res.setHeader("Allow", ["POST", "DELETE"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
