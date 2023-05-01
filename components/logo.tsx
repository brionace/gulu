import { Box } from "@chakra-ui/react";

export default function Logo() {
  return (
    <Box as="span" display="block" fontWeight={700} color={"inherit"}>
      Anna Paton{" "}
      <Box as="span" display="block" fontWeight={300}>
        Studios
      </Box>
    </Box>
  );
}
