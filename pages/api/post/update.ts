// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { updateImage, createNewImage } from "../../../utils/image-utils";
import { postUploadPath } from "./create";
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

  const { data, postImages, newImages } = JSON.parse(req.body);
  // const time = new Date().toISOString();

  const updatePost = await prisma.post.update({
    where: {
      id: Number(data.id),
    },
    data: {
      title: data.title,
      excerpt: data.excerpt,
      content: data.content,
      categories: data.categories,
      published: data.published ? false : true,
      tags: data.tags,
      images: {
        create: createNewImage(newImages, postUploadPath),
        update: updateImage(postImages),
      },
    },
  });

  if (!updatePost.id) {
    return res.status(422).json({ message: "FAIL" });
  }

  await prisma.$disconnect();

  return res.status(200).json({ message: "SUCCESS" });
}
