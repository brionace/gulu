// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { createNewImage } from "../../../utils/image-utils";
import { getAuth } from "@clerk/nextjs/server";

const prisma = new PrismaClient();
export const postUploadPath = "public/uploads/posts";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { userId } = getAuth(req);

  if (!userId) {
    return res.status(401).json({ message: "PROTECTED" });
  }

  const { data } = JSON.parse(req.body);

  if (!data.title) {
    return res.status(422).json({ message: "Please enter a title" });
  }

  const post = await prisma.post.upsert({
    where: { id: data.id || 0 },
    update: {
      title: data.title,
      excerpt: data.excerpt,
      content: data.content,
      published: data.published,
      images: {
        create: createNewImage(data.images, postUploadPath),
      },
      categories: data.categories,
      tags: data.tags,
      author: data.author,
      authorEmail: data.authorEmail,
    },
    create: {
      title: data.title,
      excerpt: data.excerpt,
      content: data.content,
      published: data.published,
      images: {
        create: createNewImage(data.images, postUploadPath),
      },
      categories: data.categories,
      tags: data.tags,
      author: data.author,
      authorEmail: data.authorEmail,
      // https://www.prisma.io/docs/concepts/components/prisma-client/relation-queries#connect-or-create-a-record
      // user: {
      //   connectOrCreate: {
      //     where: { id: data.author.id },
      //     create: data.author,
      //   },
      // },
    },
    // include: {
    //   images: true,
    // },
  });

  if (!post.id) {
    return res.status(422).json({ message: "FAIL" });
  }

  await prisma.$disconnect();

  return res.status(200).json({ message: "SUCCESS" });
}
