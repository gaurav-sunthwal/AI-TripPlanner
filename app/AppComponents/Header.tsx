"use client";
import { Button } from "@/components/ui/button";
import { ColorModeButton } from "@/components/ui/color-mode";
import { Box, Heading, HStack } from "@chakra-ui/react";
import { UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";

export default function Header() {
  const { isLoaded, isSignedIn } = useUser();
  return (
    <div>
      <HStack
        w={"full"}
        justifyContent={"space-between"}
        boxShadow={"3xl"}
        p={4}
      >
        <Box>
          <Link href={"/"}>
            <Heading fontSize={"28px"} fontWeight={"800"}>
              TripAI.
            </Heading>
          </Link>
        </Box>
        <Box>
          <HStack>
            {isLoaded && isSignedIn ? (
              <UserButton />
            ) : (
              <Link href={"/sign-up"}>
                {" "}
                <Button>Sign Up</Button>
              </Link>
            )}

            <ColorModeButton>Click me</ColorModeButton>
          </HStack>
        </Box>
      </HStack>
    </div>
  );
}
