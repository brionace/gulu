import NextImage from "next/image";
import { chakra } from "@chakra-ui/react";

export const CustomImage = chakra(NextImage, {
  shouldForwardProp: (prop) =>
    ["height", "width", "quality", "src", "alt", "fill", "style"].includes(
      prop
    ),
});
