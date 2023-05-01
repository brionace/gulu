import { promises as fs } from "fs";
import path from "path";
import { createId } from "@paralleldrive/cuid2";
import { ImageProps } from "../components/add-post";

export async function isExists(path: string) {
  try {
    await fs.access(path);
    return true;
  } catch {
    return false;
  }
}

export async function writeFile(
  filePath: string,
  img: string,
  imgName: string
) {
  try {
    const dirname = path.dirname(filePath + "/" + imgName);
    const exist = await isExists(dirname);
    if (!exist) {
      await fs.mkdir(dirname, { recursive: true });
    }

    // Strip off the data: url prefix to get just the base64-encoded bytes
    const data = img.replace(/^data:image\/\w+;base64,/, "");
    const buf = Buffer.from(data, "base64");
    return await fs.writeFile(filePath + "/" + imgName, buf);
  } catch (error: any) {
    throw new Error(error);
  }
}

export async function deleteFile(file: string) {
  return await fs.unlink(file);
}

export function createNewImage(images: any, path: string) {
  return images.map((image: any) => {
    const base64Data = image.dataURL;
    const caption = image.caption;
    const name = `${createId()}.${base64Data?.split(";")[0].split("/")[1]}`;

    writeFile(path, base64Data, name);

    return { name: name, caption: caption };
  });
}

export function updateImage(workImages: ImageProps[]) {
  return workImages.map((image) => {
    return {
      where: {
        id: Number(image.id),
      },
      data: {
        caption: image.caption,
      },
    };
  });
}
