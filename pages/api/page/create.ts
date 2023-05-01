// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { createNewImage } from "../../../utils/image-utils";
import { getAuth } from "@clerk/nextjs/server";

const prisma = new PrismaClient();
export const pageUploadPath = "public/uploads/pages";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { userId } = getAuth(req);

  if (!userId) {
    return res.status(401).json({ message: "PROTECTED" });
  }

  const { data } = JSON.parse(req.body);

  if (!data.name) {
    return res.status(422).json({ message: "Please enter a title" });
  }

  const post = await prisma.page.create({
    data: {
      name: data.name,
      slug: data.slug,
      description: data.description,
      content: data.content,
      published: data.published ? false : true,
      showInNav: data.showInNav,
      navPosition: data.navPosition,
      images: {
        create: createNewImage(data.images, pageUploadPath),
      },
    },
  });

  if (!post.id) {
    return res.status(422).json({ message: "FAIL" });
  }

  await prisma.$disconnect();

  return res.status(200).json({ message: "SUCCESS" });
}
