import { Box, Flex, MenuItem, Text } from "@chakra-ui/react";
import Link from "next/link";
import React from "react";
import { Icon } from "@chakra-ui/icons";
import { MdClose, MdMenu } from "react-icons/md";
import Logo from "./logo";
import { SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import LoggedInNav from "./loggedin-nav";

export interface IPageHeader {
  menu: {
    name: string;
    slug: string;
  }[];
  color?: string;
}

export default function PageHeader({ menu, color }: IPageHeader) {
  const [openMenu, setOpenMenu] = React.useState(false);

  return (
    <Flex
      as="header"
      justifyContent="space-between"
      gap={15}
      px={3}
      fontWeight="bold"
      alignItems={"center"}
      pos={"relative"}
      zIndex={1}
      color={color}
    >
      <Link href="/" color="inherit">
        <Logo />
      </Link>
      <Flex as="nav" gap={2} alignItems={"center"}>
        <SignedOut>
          {!openMenu ? (
            <Box
              as="button"
              display={{ md: "none" }}
              onClick={() => setOpenMenu(!openMenu)}
            >
              <Icon as={MdMenu} />
              {/* {openMenu ? <Icon as={MdMenuOpen} /> : <Icon as={MdMenu} />} */}
            </Box>
          ) : null}
          <Box pos={"relative"}>
            {openMenu && (
              <Box
                as="button"
                display={{ md: "none" }}
                onClick={() => setOpenMenu(!openMenu)}
              >
                <Icon as={MdClose} />
              </Box>
            )}
            <Flex
              gap={3}
              display={{ base: openMenu ? "inline" : "none", md: "inline" }}
              backgroundColor={{ base: "white", md: "initial" }}
              pos={{ base: "absolute", md: "initial" }}
              bottom={{ base: 0, md: "initial" }}
              right={{ base: 0, md: "initial" }}
              inset={{ base: "0px 0px auto auto", md: "initial" }}
              transform={{
                base: "translate3d(0, 30.5px, 0px)",
                md: "initial",
              }}
              p={{ base: 3, md: "initial" }}
              borderRadius={{ base: 3, md: "initial" }}
              // width={{ base: "100%", md: "initial" }}
              // height={{ base: "100%", md: "initial" }}
            >
              <Link href="/work">
                <Text as={`span`}>Work</Text>
              </Link>
            </Flex>
          </Box>
        </SignedOut>
        <Flex alignItems={`center`} gap={3} color={"initial"}>
          <SignedIn>
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
            <UserButton />
          </SignedIn>
        </Flex>
      </Flex>
    </Flex>
  );
}
