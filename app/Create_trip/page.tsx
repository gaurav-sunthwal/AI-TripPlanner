"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import {
  MapPin,
  Users,
  DollarSign,
  CalendarIcon,
  Plane,
  RefreshCw,
  Loader2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { FaCalendar } from "react-icons/fa6";
import { chatSession } from "@/Utils/Gamini";
import { useRouter } from "next/navigation";
import { db } from "@/Utils/db";
import { v4 as uuidv4 } from "uuid";
import { tripDitails } from "@/Utils/schema";
import { useUser } from "@clerk/nextjs";

export default function TripPlanner() {
  // 🎯 State for form fields
  const [destination, setDestination] = useState<string>("");
  const [days, setDays] = useState<number>(3);
  const [budget, setBudget] = useState<string | null>(null);
  const [travelCompanions, setTravelCompanions] = useState<string | null>(null);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [season, setSeason] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);
  const router = useRouter();
  const [selectedMode, setSelectedMode] = useState<"calendar" | "season">(
    "calendar"
  );
  const { user } = useUser();
  // 🚀 Submit handler
  const { toast } = useToast();

  const generateTripPlan = async () => {
    const props = `Generate a detailed travel plan based on the following preferences:

    Location: ${destination}, 
    Duration: ${days} Days, 
    Budget: ${budget ? budget : "Standard"}, 
    Travel Companions: ${travelCompanions ? travelCompanions : "Solo"},
    Travel Date: ${date?.toDateString()},
    Preferred Season: ${season ? season : "Any"}
    
    Please follow this format exactly:
    
    1. Return the response as a JSON object containing:
       - tripDetails: {
           location,
           duration,
           budget,
           travelers,
           date,
           season
            approx budget required
         }
    
    2. Provide a curated list of top 3–5 luxury hotels in the location, formatted as:
       - hotelName
       - hotelAddress
       - price (per night in local currency)
       - hotelImageUrl
       - geoCoordinates (latitude, longitude)
       - rating (out of 5)
       - description
      
    
    3. Suggest a full itinerary divided into each day (day1 to day${days}):
       For each day, include:
       - date (Day X)
       - activities: [
           {
             placeName,
             placeDetails,
             placeImageUrl (google Images),
             geoCoordinates (latitude, longitude),
             ticketPrice (in local currency or 'Free' if applicable)
           },
           {
              foodName,
              foodDetails,
              foodImageUrl (google Images),
              geoCoordinates (latitude, longitude),
              price (in local currency)
           }
          
         ]
    
    4. Ensure all locations and hotels have real, verifiable Google Maps locations, correct coordinates, and image URLs available online.
    
    5. Focus on best tourist attractions, experiences, fine dining, and luxury experiences in and around ${destination}.
    
    
    6. Provide a brief summary of the trip at the end, including:
       - total estimated cost (in local currency)
       - highlights of the trip
       - any travel tips or recommendations

    7. Maintain the JSON schema format as follows:
      const tripData = {
        tripDetails: { ... },
        hotels: [ ... ],
        itinerary: {
          day1: { date, activities: [...] },
          day2: { ... },
          ...
          day${days}: { ... }
        }
        cityInfo: {
          cityName: ${destination},
          cityDescription: ${destination} is known for its ...,
          cityImageUrl: ${destination} image URL google img 
        },
        summary: {
          totalCost: ...,
          highlights: [...],
          travelTips: [...]
        }
      8. please ensure the JSON is valid and well-structured. error like 
      {
        SyntaxError: Expected double-quoted property name in JSON at position ,
        imgeUrl : geting 404 error plzz provide valid image url can be use as src
      }
    };
    
    Make sure data is clean, accurate, and complete with all requested fields.`;

    const result = await chatSession.sendMessage(props);
    const mockJSONResp = result.response
      .text()
      .replace("```json", "")
      .replace("```", "");

    return mockJSONResp;
  };

  const handleTakeOff = async () => {
    if (!destination || !days || !budget || !travelCompanions) {
      toast({
        title: "Please fill in all the fields before proceeding!",
      });
      return;
    }

    if (selectedMode === "calendar" && !date) {
      toast({
        title: "Please select a travel date!",
      });
      return;
    }

    if (selectedMode === "season" && !season) {
      toast({
        title: "Please select a travel season!",
      });
      return;
    }

    try {
      setIsLoading(true);
      setHasError(false);

      const mockJSONResp = await generateTripPlan();
      console.log(mockJSONResp);

      const parsedTripData = JSON.parse(mockJSONResp);
      console.log(parsedTripData);

      // Generate UUID for the trip
      const tripId = uuidv4();
      // Format date for the database
      const formattedDate =
        selectedMode === "calendar"
          ? date?.toISOString().split("T")[0] ||
            new Date().toISOString().split("T")[0]
          : season || "Any";

      // Insert the trip data into the database
      await db.insert(tripDitails).values({
        duration: days.toString(),
        tripName: `Trip to ${destination}`,
        tripId: tripId,
        location: destination,
        travelers: travelCompanions || "",
        date: formattedDate,
        tripData: mockJSONResp,
        email: user?.primaryEmailAddress?.emailAddress || "",
      });

      toast({
        title: "Trip successfully created!",
        description: "Redirecting to your dashboard...",
      });

      // Navigate to dashboard
      router.push(`/Trip/${tripId}`);
    } catch (error) {
      console.error("Error creating trip:", error);
      setHasError(true);
      toast({
        title: "Error creating trip",
        description: "Please try again by clicking the retry button.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    setHasError(false);
    handleTakeOff();
  };

  // Loading overlay component
  const LoadingOverlay = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl flex flex-col items-center">
        <Loader2 className="h-12 w-12 text-purple-500 animate-spin mb-4" />
        <h2 className="text-2xl font-bold mb-2">Creating your dream trip...</h2>
        <p className="text-gray-600 dark:text-gray-300 text-center">
          Hang tight! We&apos;re planning your perfect adventure to{" "}
          {destination}
        </p>
      </div>
    </div>
  );

  // Error overlay component
  const ErrorOverlay = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl flex flex-col items-center">
        <div className="text-red-500 mb-4 text-6xl">⚠️</div>
        <h2 className="text-2xl font-bold mb-2">Oops! Something went wrong</h2>
        <p className="text-gray-600 dark:text-gray-300 text-center mb-6">
          We couldn&apos;t create your trip plan. Would you like to try again?
        </p>
        <div className="flex gap-4">
          <Button variant="outline" onClick={() => setHasError(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleRetry}
            className="bg-purple-500 hover:bg-purple-600"
          >
            <RefreshCw className="mr-2 h-4 w-4" /> Retry
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      {isLoading && <LoadingOverlay />}
      {hasError && <ErrorOverlay />}

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
              max={7}
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
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Creating
                Trip...
              </>
            ) : (
              <>
                <Plane className="mr-2" /> Take Off!
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
