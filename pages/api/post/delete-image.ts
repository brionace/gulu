// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { deleteFile } from "../../../utils/image-utils";
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

  const { postId, imageId, imageName } = JSON.parse(req.body);

  const deletedImage = await prisma.post.update({
    where: {
      id: postId,
    },
    data: {
      images: {
        delete: { id: imageId },
      },
    },
  });

  deleteFile(`${postUploadPath}/${imageName}`);

  if (!deletedImage.id) {
    return res.status(422).json({ message: "FAIL" });
  }

  await prisma.$disconnect();

  return res.status(200).json({ message: "SUCCESS" });
}
