import { Flex } from "@chakra-ui/react";
import { SignIn } from "@clerk/nextjs";

const SignInPage = () => (
  <Flex
    p={4}
    justifyContent={"center"}
    alignItems={"center"}
    w={"full"}
    h={"full"}
  >
    <SignIn path="/sign-in" routing="path" signUpUrl="/sign-up" />
  </Flex>
);

export default SignInPage;
