import Head from "next/head";
import { useRouter } from "next/router";
import { AddPost } from "../../components/add-post";
import { PrismaClient, type Post, type Page } from "@prisma/client";
import { PropsWithChildren, ReactNode, useEffect, useState } from "react";
import {
  Box,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  MenuItem,
} from "@chakra-ui/react";
import { CalendarIcon, SpinnerIcon, SearchIcon } from "@chakra-ui/icons";
import { AddPage } from "../../components/add-page";
import { useAuth, SignedIn, UserButton } from "@clerk/nextjs";
import moment from "moment";
import LoggedInNav, {
  queryTypePage,
  queryTypePost,
} from "../../components/loggedin-nav";
import SignInPage from "../sign-in/[[...index]]";
import PageLayout from "../../components/page-layout";
import { IPageHeader } from "../../components/page-header";

type HomeProps = {
  feed: {
    id: number;
    title: string;
    table: "POST" | "PAGE";
    updatedAt: Date;
    published: boolean;
  }[];
  menu: IPageHeader["menu"];
};

export default function Dashboard({ feed, menu }: HomeProps) {
  const { isLoaded, userId } = useAuth();
  const router = useRouter();
  const { id, type } = router.query;
  const [query, setQuery] = useState("");
  const [searchResult, setSearchResearch] = useState<HomeProps["feed"]>();

  useEffect(() => {
    async function fetchSearchResults() {
      try {
        const res = await fetch(`/api/search`, {
          method: "POST",
          body: JSON.stringify({ query }),
        });
        const responseBody = await res.json();
        setSearchResearch(responseBody.results);
      } catch (err) {
        console.log(err);
      }
    }
    void fetchSearchResults();
  }, [query]);

  if (!isLoaded) {
    return (
      <Flex
        alignItems={"center"}
        justifyContent={"center"}
        h={"100vh"}
        w={"100%"}
      >
        <SpinnerIcon boxSize={6} />
      </Flex>
    );
  }

  if (!userId) {
    return <SignInPage />;
  }

  if (type === "post") {
    return <AddPost id={Number(id)} />;
  }

  if (type === "page") {
    return <AddPage id={Number(id)} />;
  }

  const list = searchResult ? searchResult : feed;

  return (
    <>
      <Head>
        <title>Administration dashboard</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <PageLayout margin={4}>
        <Flex
          as="header"
          justifyContent="space-between"
          alignItems="center"
          gap={4}
        >
          <Flex w={`100%`}>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <SearchIcon color="gray.300" />
              </InputLeftElement>
              <Input
                placeholder="Search for a Post, Page, or Category..."
                onChange={(e) => {
                  setQuery(e.currentTarget.value);
                }}
              />
            </InputGroup>
          </Flex>
          <Flex gap={3} alignItems="center">
            <LoggedInNav>
              {menu?.map((menu) => {
                const slug = menu.slug;
                return (
                  <MenuItem key={slug} pl={3} as="a" href={slug}>
                    {menu.name}
                  </MenuItem>
                );
              })}
            </LoggedInNav>
            <Box>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </Box>
          </Flex>
        </Flex>
        <Box as="main">
          {list.map(({ id, title, table, published, updatedAt }) => {
            let mapped = null;
            const updateDate = moment(
              new Date(updatedAt),
              "YYYYMMDD"
            ).fromNow();

            if (table === "POST") {
              mapped = (
                <List key={`post-${id}`}>
                  <Box
                    as={"a"}
                    href={`${queryTypePost}&id=${id}`}
                    _after={{
                      content: !published ? '" - DRAFT"' : '""',
                      marginLeft: "4px",
                    }}
                  >
                    {title}
                  </Box>
                  <ListLabelWrapper>
                    <Box as="span">
                      <CalendarIcon /> {updateDate} - POST
                    </Box>
                  </ListLabelWrapper>
                </List>
              );
            }

            if (table === "PAGE") {
              mapped = (
                <List key={`page-${id}`}>
                  <Box
                    as={"a"}
                    href={`${queryTypePage}&id=${id}`}
                    _after={{
                      content: !published ? '" - DRAFT"' : '""',
                      marginLeft: "4px",
                    }}
                  >
                    {title}
                  </Box>
                  <ListLabelWrapper>
                    <Box as="span">
                      <CalendarIcon /> {updateDate} - PAGE
                    </Box>
                  </ListLabelWrapper>
                </List>
              );
            }

            return mapped;
          })}
        </Box>
      </PageLayout>
    </>
  );
}

type ListLabelWrapperProps = {
  children?: ReactNode | ReactNode[];
};

export function ListLabelWrapper({ children }: ListLabelWrapperProps) {
  return (
    <Flex gap={1} fontSize={"xx-small"} opacity={0.5}>
      {children}
    </Flex>
  );
}

export function List({ children }: PropsWithChildren) {
  return <Box mb={4}>{children}</Box>;
}

export async function getServerSideProps() {
  const prisma = new PrismaClient();

  const feed = await prisma.$queryRaw<Page[] & Post[]>`
  SELECT id, title, 'POST' AS table, "updatedAt", published FROM "Post"
  UNION ALL
  SELECT id, name AS title, 'PAGE' AS table, "updatedAt", published FROM "Page"
  -- WHERE published = true
  ORDER BY "updatedAt" DESC
  LIMIT 30`;

  const parsedFeed = JSON.parse(JSON.stringify(feed));

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
      feed: parsedFeed,
      menu: JSON.parse(JSON.stringify(menu)),
    },
  };
}
