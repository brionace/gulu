import { ChevronDownIcon, AddIcon } from "@chakra-ui/icons";
import { Menu, MenuButton, Button, MenuList, MenuItem } from "@chakra-ui/react";
import React, { ReactNode } from "react";
import { MdMenu } from "react-icons/md";

export const queryTypePost = "?type=post";
export const queryTypePage = "?type=page";
export const homepage = "/";
export const admin = "/admin";

interface ISiteNav {
  children?: ReactNode | ReactNode[];
}

export default function LoggedInNav({ children }: ISiteNav) {
  return (
    <Menu>
      <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
        <MdMenu />
      </MenuButton>
      <MenuList>
        <MenuItem as="a" href={admin}>
          Admin dashboard
        </MenuItem>
        <MenuItem as="a" href={`${admin}/${queryTypePage}`}>
          <AddIcon mr={3} /> Page
        </MenuItem>
        <MenuItem as="a" href={`${admin}/${queryTypePost}`}>
          <AddIcon mr={3} /> Post
        </MenuItem>
        <hr />
        <MenuItem as="a" href={homepage}>
          Homepage
        </MenuItem>
        {children}
        {/* {menu?.map((menuItem) => {
          return (
            <MenuItem as="a" href={`/${menuItem.slug}`}>
              {menuItem.name}
            </MenuItem>
          );
        })} */}
      </MenuList>
    </Menu>
  );
}
