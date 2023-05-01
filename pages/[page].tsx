import { PrismaClient } from "@prisma/client";
import { Box, Grid, Text } from "@chakra-ui/react";
import Link from "next/link";
import PageHeader, { IPageHeader } from "../components/page-header";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import PageLayout from "../components/page-layout";
import PageHead from "../components/page-head";
import { CustomImage } from "../components/image";
import { GetServerSideProps } from "next";

const prisma = new PrismaClient();

type IPage = {
  page: {
    name: string;
    description: string;
    content: string;
    images: { name: string; caption: string }[];
  }[];
  menu: IPageHeader["menu"];
};

export default function Page({ menu, page }: IPage) {
  const { name, description, content, images } = page[0];

  return (
    <>
      <PageHead>
        <title>{`${name} Anna Paton Studios`}</title>
        <meta name="description" content={description} />
      </PageHead>
      <PageLayout gridTemplateRows="50px 1fr 30px">
        <PageHeader menu={menu} />
        <Box as="main"></Box>
        <Box as="footer">footer</Box>
      </PageLayout>
    </>
  );
}

type Data = {
  menu: IPage["menu"][];
  page: IPage["page"];
};

export const getServerSideProps: GetServerSideProps<Data> = async (context) => {
  const page = await prisma.page.findMany({
    where: {
      slug: `${context.query.page}`,
      published: true,
      NOT: {
        slug: {
          equals: "homepage",
        },
      },
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

  if (!page.length) {
    return {
      notFound: true,
    };
  }

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
      page: JSON.parse(JSON.stringify(page)),
      menu: JSON.parse(JSON.stringify(menu)),
    },
  };
};
