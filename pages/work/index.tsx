import { PrismaClient } from "@prisma/client";
import { Box, Flex, Text } from "@chakra-ui/react";
import PageHeader, { IPageHeader } from "../../components/page-header";
import NextLink from "next/link";
import { CustomImage } from "../../components/image";
import PageLayout from "../../components/page-layout";
import PageHead from "../../components/page-head";

const prisma = new PrismaClient();

interface Work {
  work: {
    id: number;
    title: string;
    images: { name: string }[];
  }[];
  menu: IPageHeader["menu"];
  page: {
    description: string;
    content: string;
  };
}

export default function Index({ work, menu, page }: Work) {
  return (
    <>
      <PageHead>
        <title>Work / Anna Paton Studios</title>
        <meta name="description" content={page.description} />
      </PageHead>
      <PageLayout>
        <PageHeader menu={menu} />
        <Flex
          as="main"
          gap={4}
          margin="0 auto"
          maxW={720}
          flexDirection={{ base: "column", md: "row" }}
        >
          {page.content && <Box>{page.content}</Box>}
          {work.map(({ id, title, images }) => {
            return (
              <Box key={id}>
                {images?.map((image: any) => {
                  return (
                    <Box
                      key={image.id}
                      pos="relative"
                      w={{ md: 200 }}
                      h={240}
                      flexGrow={1}
                    >
                      <CustomImage
                        src={`/uploads/posts/${image.name}`}
                        alt=""
                        objectFit="cover"
                        /* @ts-ignore:next-line */
                        fill
                        layout="fill"
                      />
                    </Box>
                  );
                })}
                <NextLink href={`/work/${id}`} passHref>
                  <Text as={"span"} px={{ base: 4, md: 0 }}>
                    {title}
                  </Text>
                </NextLink>
              </Box>
            );
          })}
        </Flex>
      </PageLayout>
    </>
  );
}

export async function getServerSideProps() {
  const work = await prisma.post.findMany({
    where: {
      published: true,
    },
    select: {
      id: true,
      title: true,
      images: {
        take: 1,
        select: {
          id: true,
          name: true,
        },
      },
    },
  });
  const page = await prisma.page.findFirst({
    where: {
      slug: "work",
    },
    select: {
      description: true,
      content: true,
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
    work: { work: JSON.parse(JSON.stringify(work)) },
    page: { work: JSON.parse(JSON.stringify(page)) },
    menu: { work: JSON.parse(JSON.stringify(menu)) },
  };
}
