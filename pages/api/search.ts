// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { Page, Post, PrismaClient } from "@prisma/client";
import { getAuth } from "@clerk/nextjs/server";

const prisma = new PrismaClient();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { userId } = getAuth(req);

  if (!userId) {
    return res.status(401).json({ message: "PROTECTED" });
  }

  const { query } = JSON.parse(req.body);

  if (!query) {
    return res.status(200).json([]);
  }

  const _query = `%${query.toLowerCase()}%`;
  const results = await prisma.$queryRaw<Post[] | Page[]>`
      SELECT id, title, 'POST' AS table, "updatedAt", published FROM "Post" WHERE lower(title) LIKE ${_query} OR lower(content) LIKE ${_query}
      UNION ALL
      SELECT id, name AS title, 'PAGE' AS table, "updatedAt", published FROM "Page" WHERE lower(name) LIKE ${_query} OR lower(description) LIKE ${_query}  OR lower(content) LIKE ${_query}
      LIMIT 10
    `;

  return res.status(200).json({ results });
}
