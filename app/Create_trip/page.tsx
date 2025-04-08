"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { MapPin, Users, DollarSign, CalendarIcon, Plane } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { FaCalendar } from "react-icons/fa6";
import { chatSession } from "@/Utils/Gamini";
import { useRouter } from "next/navigation";
export default function TripPlanner() {
  // 🎯 State for form fields
  const [destination, setDestination] = useState<string>("");
  const [days, setDays] = useState<number>(7);
  const [budget, setBudget] = useState<string | null>(null);
  const [travelCompanions, setTravelCompanions] = useState<string | null>(null);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [season, setSeason] = useState<string | null>(null);
  const route =  useRouter()
  const [selectedMode, setSelectedMode] = useState<"calendar" | "season">(
    "calendar"
  );
  // 🚀 Submit handler
  const { toast } = useToast();
  const handleTakeOff = async () => {
    if (!destination || !days || !budget || !travelCompanions || !date) {
      toast({
        title: "Please fill in all the fields before proceeding!",
      });
      return;
    }
    const tripData = {
      destination,
      days,
      budget,
      travelCompanions,
      selectedMode,
      ...(selectedMode === "calendar" ? { date } : { season }),
    };

    console.log(tripData);

    const TrpiPromp = `Generate Travel Plan for Location: Pune, for 5 Days for Couple with a luxury budget ,Give me a Hotels options list with Hote lName, Hotel address, Price, hotel image url, geo coordinates, rating, descriptions and suggest itinerary with place Name, Place Details, Place Image Url which are avalble on google, Geo Coordinates, ticket Pricing for each of the location for 5 days, also suggest best places to visit. Format this data according to each day and also generate the result in JSON format.
`;
    console.log(TrpiPromp);
    const result = await chatSession.sendMessage(TrpiPromp);
    const TripJSONResp = result.response.text();
    console.log(TripJSONResp);
    route.push("/Dashboard")
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-5xl mx-auto">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 sm:text-6xl md:text-7xl mb-4">
            Plan Your Dream Trip 🚀
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300">
            Share your travel dreams, and let&apos;s make them a reality! 🌏✨
          </p>
        </motion.div>

        {/* Destination Input */}
        <Card className="p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg mb-6">
          <CardContent>
            <h2 className="text-3xl font-semibold mb-4 flex items-center">
              <MapPin className="mr-2" /> Where to?
            </h2>
            <Input
              placeholder="Enter your dream destination"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              required
            />
          </CardContent>
        </Card>

        {/* Trip Duration */}
        <Card className="p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg mb-6">
          <CardContent>
            <h2 className="text-3xl font-semibold mb-4 flex items-center">
              <FaCalendar className="mr-2" /> How Many Days?
            </h2>
            <Input
              placeholder="Enter No of Days"
              value={days}
              type="number"
              min={0}
              max={15}
              onChange={(e) => setDays(Number(e.target.value))}
              required
            />
          </CardContent>
        </Card>

        {/* Budget Selection */}
        <Card className="p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg mb-6">
          <CardContent>
            <h2 className="text-3xl font-semibold mb-4 flex items-center">
              <DollarSign className="mr-2" /> What&apos;s your budget?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {["Budget", "Comfort", "Luxury"].map((option) => (
                <motion.div
                  key={option}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Card
                    className={`p-4 cursor-pointer transition ${
                      budget === option
                        ? "ring-2 ring-offset-2 ring-purple-500"
                        : "hover:shadow-lg"
                    }`}
                    onClick={() => setBudget(option)}
                  >
                    <h3 className="text-xl font-bold text-center">{option}</h3>
                  </Card>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Travel Companions */}
        <Card className="p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg mb-6">
          <CardContent>
            <h2 className="text-3xl font-semibold mb-4 flex items-center">
              <Users className="mr-2" /> Who&apos;s joining your journey?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
              {["Solo", "Friends", "Family", "Couples"].map((option) => (
                <motion.div
                  key={option}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Card
                    className={`p-4 cursor-pointer transition ${
                      travelCompanions === option
                        ? "ring-2 ring-offset-2 ring-purple-500"
                        : "hover:shadow-lg"
                    }`}
                    onClick={() => setTravelCompanions(option)}
                  >
                    <h3 className="text-xl font-bold text-center">{option}</h3>
                  </Card>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Date Selection */}
        {/* Date Selection */}
        <Card className="p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg">
          <CardContent>
            <h2 className="text-3xl font-semibold text-gray-900 dark:text-gray-100 mb-6 flex items-center">
              <CalendarIcon className="mr-2" /> When&apos;s the big day?
            </h2>
            <Tabs
              value={selectedMode}
              onValueChange={(value: string) =>
                setSelectedMode(value as "calendar" | "season")
              }
              className="w-full"
            >
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="calendar">Calendar</TabsTrigger>
                <TabsTrigger value="season">Season</TabsTrigger>
              </TabsList>
              {/* Calendar Tab */}
              <TabsContent value="calendar">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(selectedDate) => {
                    setDate(selectedDate);
                    setSeason(null); // Reset season if a date is selected
                    setSelectedMode("calendar");
                  }}
                  className={`rounded-md border ${
                    selectedMode === "season"
                      ? "opacity-50 pointer-events-none"
                      : ""
                  }`}
                  required
                />
              </TabsContent>
              {/* Season Tab */}
              <TabsContent value="season">
                <div className="grid grid-cols-2 gap-4">
                  {["Spring", "Summer", "Autumn", "Winter"].map(
                    (seasonOption) => (
                      <Button
                        key={seasonOption}
                        variant={
                          season === seasonOption ? "default" : "outline"
                        }
                        className={`text-lg py-6 ${
                          selectedMode === "calendar"
                            ? "opacity-50 pointer-events-none"
                            : ""
                        }`}
                        onClick={() => {
                          setSeason(seasonOption);
                          setDate(undefined); // Reset date if a season is selected
                          setSelectedMode("season");
                        }}
                      >
                        {seasonOption}
                      </Button>
                    )
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Submit Button */}
        <div className="text-center mt-4">
          <Button
            size="lg"
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-12 py-6 rounded-full"
            onClick={handleTakeOff}
          >
            <Plane className="mr-2" /> Take Off!
          </Button>
        </div>
      </div>
    </div>
  );
}
