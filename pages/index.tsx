import { PrismaClient } from "@prisma/client";
import { Box, Text } from "@chakra-ui/react";
import Link from "next/link";
import PageHeader, { IPageHeader } from "../components/page-header";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import PageLayout from "../components/page-layout";
import PageHead from "../components/page-head";
import { CustomImage } from "../components/image";
import { useEffect, useState } from "react";

const prisma = new PrismaClient();

interface IHome extends IPageHeader {
  work: {
    id: number;
    images: { name: string; caption: string }[];
  }[];
  homepage: {
    name: string;
    description: string;
    content: string;
  };
  menu: IPageHeader["menu"];
}

export default function Home({ work, homepage, menu }: IHome) {
  const { name, description, content } = homepage;
  const [imageColor, setImageColor] = useState(null);
  let id,
    image,
    caption,
    imageItem = null;

  if (work.length) {
    const w = work[0];
    const images = w.images;
    id = w.id;
    imageItem = images && images[Math.floor(Math.random() * images.length)];
    image = imageItem?.name;
    caption = imageItem?.caption;
  }

  useEffect(() => {
    // Grab and set colour here
  }, []);

  return (
    <>
      <PageHead>
        <title>Anna Paton Studios</title>
        <meta name="description" content={description} />
      </PageHead>
      <PageLayout gridTemplateRows="50px 1fr 30px">
        <PageHeader color="white" menu={menu} />
        <Box as="main"></Box>
        <Box as="footer" textAlign="right">
          {caption && (
            <Text>
              {caption} -{" "}
              <Link href={`/work/${id}`}>
                see work <ArrowForwardIcon />
              </Link>
            </Text>
          )}
        </Box>
      </PageLayout>
      <Box
        pos="fixed"
        w="100vw"
        h="100vh"
        top={0}
        zIndex={-1}
        _after={{
          content: '""',
          backgroundColor: `rgb(${imageColor})`,
          position: "fixed",
          left: 0,
          top: 0,
          width: "100%",
          height: "100%",
        }}
      >
        {imageItem && (
          <CustomImage
            src={`/uploads/posts/${image}`}
            alt={caption ? caption : ""}
            /* @ts-ignore:next-line */
            fill
            layout="fill"
            objectFit="cover"
            quality={100}
            transition="all 0.2s"
            _groupHover={{
              transform: "scale(1.05)",
            }}
          />
        )}
      </Box>
    </>
  );
}

export async function getServerSideProps() {
  // https://github.com/prisma/prisma/discussions/5886
  const workCount = await prisma.post.count();
  const skip = Math.floor(Math.random() * workCount);
  const work = await prisma.post.findMany({
    take: 1, // reverse -1
    skip: skip,
    // orderBy: {
    //   id: 'desc',
    // },
    select: {
      id: true,
      images: {
        take: 1,
        // skip: skip,
        select: {
          name: true,
          caption: true,
        },
      },
    },
    where: {
      images: { some: {} },
    },
  });

  const homepage = await prisma.page.findFirst({
    where: {
      slug: "homepage",
    },
    select: {
      name: true,
      description: true,
      content: true,
      images: {
        select: {
          name: true,
          caption: true,
        },
      },
    },
  });

  const menu = await prisma.page.findMany({
    where: {
      showInNav: true,
      published: true,
    },
    select: {
      name: true,
      slug: true,
    },
  });

  return {
    props: {
      work: JSON.parse(JSON.stringify(work)),
      homepage: JSON.parse(JSON.stringify(homepage)),
      menu: JSON.parse(JSON.stringify(menu)),
    },
  };
}
