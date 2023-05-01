import { Flex } from "@chakra-ui/react";
import { SignUp } from "@clerk/nextjs";

const SignUpPage = () => (
  <Flex
    p={4}
    justifyContent={"center"}
    alignItems={"center"}
    w={"full"}
    h={"full"}
  >
    <SignUp path="/sign-up" routing="path" signInUrl="/sign-in" />
  </Flex>
);

export default SignUpPage;
