// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
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

  const post = await prisma.page.findUnique({
    where: {
      id: Number(req.query.id),
    },
    select: {
      name: true,
      slug: true,
      description: true,
      content: true,
      published: true,
      showInNav: true,
      images: {
        select: {
          id: true,
          name: true,
          caption: true,
        },
      },
    },
  });

  if (!post) {
    return res.status(422).json({ message: "FAIL" });
  }

  await prisma.$disconnect();

  return res.status(200).json(post);
  // return res.status(200).json(JSON.parse(JSON.stringify(post)));
  // const name: Work[] = await prisma.name.findMany();
  // props: JSON.parse(JSON.stringify(name, (key, value) =>
  //     typeof value === 'bigint'
  //         ? value.toString()
  //         : value // return everything else unchanged
  // ))
}
