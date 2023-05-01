// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { deleteFile } from "../../../utils/image-utils";
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

  const { id } = JSON.parse(req.body);

  const deletedPage = await prisma.page.delete({
    where: {
      id: id,
    },
    include: {
      images: true,
    },
  });

  if (!deletedPage.id) {
    return res.status(422).json({ message: "FAIL" });
  }

  deletedPage.images.forEach((image) => {
    deleteFile(`${pageUploadPath}/${image.name}`);
  });

  await prisma.$disconnect();

  return res.status(200).json({ message: "SUCCESS" });
}
