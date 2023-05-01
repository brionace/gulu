// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { updateImage, createNewImage } from "../../../utils/image-utils";
import { pageUploadPath } from "./create";
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

  const { data, pageImages, newImages } = JSON.parse(req.body);

  const updatePost = await prisma.page.update({
    where: {
      id: Number(data.id),
    },
    data: {
      name: data.name,
      slug: data.slug,
      description: data.description,
      content: data.content,
      showInNav: data.showInNav,
      navPosition: data.navPosition,
      published: data.published ? false : true,
      images: {
        create: createNewImage(newImages, pageUploadPath),
        update: updateImage(pageImages),
      },
    },
  });

  if (!updatePost.id) {
    return res.status(422).json({ message: "FAIL" });
  }

  await prisma.$disconnect();

  return res.status(200).json({ message: "SUCCESS" });
}
