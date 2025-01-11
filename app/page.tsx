import { Button } from "@/components/ui/button";
import { Heading, HStack, Text, VStack } from "@chakra-ui/react";
import Link from "next/link";
import { FaMapLocationDot } from "react-icons/fa6";

export default function Home() {
  return (
    <>
      <VStack h={"80vh"} justifyContent={"center"}>
        <Heading textAlign={"center"} fontWeight={"800"} fontSize={"5xl"}>
          Your Next Journey, Optimized
        </Heading>
        <Text
          p={5}
          fontWeight={"300"}
          fontSize={"18px"}
          textAlign={"center"}
          color={"gray.500"}
        >
          Build, personalize, and optimize your itineraries with our free AI
          trip planner. <br /> Designed for vacations, workations, and everyday
          adventures.
        </Text>
    <Link href={"/Create_trip"}>
        <Button className="p-[22px]" variant="destructive" size={"lg"}><HStack fontSize={"15px"} fontWeight={"800"}><FaMapLocationDot/> Create a new trip</HStack></Button>
    </Link>
      </VStack>
    </>
  );
}
