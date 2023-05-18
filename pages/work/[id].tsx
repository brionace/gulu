import { PrismaClient } from "@prisma/client";
import { Box, Text } from "@chakra-ui/react";
import PageHeader, { IPageHeader } from "../../components/page-header";
import { CustomImage } from "../../components/image";
import PageLayout from "../../components/page-layout";
import PageHead from "../../components/page-head";

const prisma = new PrismaClient();

interface SingleWork {
  title: string;
  excerpt: string;
  content: string;
  images?: { id: number; name: string; caption?: string }[];
  menu: IPageHeader["menu"];
}

export default function Index({
  title,
  excerpt,
  content,
  images,
  menu,
}: SingleWork) {
  return (
    <>
      <PageHead>
        <title>{title}</title>
        <meta name="description" content={excerpt} />
      </PageHead>
      <PageLayout>
        <PageHeader menu={menu} />
        <Box as="main">
          <Box as={"article"}>
            <Box as="section" margin={"0 auto"} w={600}>
              <Text as="h1" mb={4} px={3}>
                {title}
              </Text>
              <Text mb={4} px={3} fontStyle={"italic"}>
                {excerpt}
              </Text>
              <Box mb={4} px={3}>
                {content}
              </Box>
            </Box>
            <Box as="section">
              {images?.map((image) => {
                return (
                  <Box
                    key={image.id}
                    mb={12}
                    maxW="700"
                    textAlign={"center"}
                    margin="0 auto"
                  >
                    <Box pos={"relative"} w={"100%"} h={"100vh"}>
                      <CustomImage
                        src={`/uploads/posts/${image.name}`}
                        alt={image.name}
                        /* @ts-ignore:next-line */
                        fill
                      />
                    </Box>
                    {image.caption && (
                      <Text
                        maxW="600px"
                        m="0 auto 40px auto"
                        bgColor="Highlight"
                        padding={15}
                        borderBottomRadius={8}
                        textAlign={"left"}
                      >
                        {image.caption}
                      </Text>
                    )}
                  </Box>
                );
              })}
            </Box>
          </Box>
        </Box>
      </PageLayout>
    </>
  );
}

export async function getServerSideProps(context: any) {
  const { id } = context.query;
  const work = await prisma.post.findUnique({
    where: { id: Number(id) },
    select: {
      title: true,
      excerpt: true,
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

  if (!work) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      ...JSON.parse(JSON.stringify(work)),
      menu: [...JSON.parse(JSON.stringify(menu))],
    },
  };
}
