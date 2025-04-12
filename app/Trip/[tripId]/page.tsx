"use client";

import { MapPin, Calendar, DollarSign, Users, Star, Info, Loader2Icon } from "lucide-react";
import Image from "next/image";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { db } from "@/Utils/db";
import { tripDitails } from "@/Utils/schema";
import { eq } from "drizzle-orm";
import Header from "@/app/AppComponents/Header";
import { FaMoneyBillWave } from "react-icons/fa6";
import Link from "next/link";
import { createClient } from 'pexels';
// Define types for our data structure
interface GeoCoordinates {
  latitude: number;
  longitude: number;
}

interface Hotel {
  hotelName: string;
  hotelAddress: string;
  price: string;
  hotelImageUrl: string;
  geoCoordinates: GeoCoordinates;
  rating: number;
  description: string;
}

// Add new CityInfo interface
interface CityInfo {
  cityName: string;
  cityDescription: string[];
  cityImageUrl: string[];
}

// Activity can now be either a place to visit or a food establishment
interface Activity {
  placeName?: string;
  placeDetails?: string;
  placeImageUrl?: string;
  foodName?: string;
  foodDetails?: string;
  foodImageUrl?: string;
  geoCoordinates: GeoCoordinates;
  ticketPrice?: string;
  price?: string;
}

interface DayData {
  date: string;
  activities: Activity[];
}

interface Itinerary {
  [key: string]: DayData;
}

interface TripDetails {
  location: string;
  duration: string;
  budget: string;
  travelers: string;
  date: string;
  season: string;
  approxBudgetRequired: string;
}

interface Summary {
  totalCost: string;
  highlights: string[];
  travelTips: string[];
}

interface TripData {
  tripDetails: TripDetails;
  hotels: Hotel[];
  itinerary: Itinerary;
  summary?: Summary;
  cityInfo?: CityInfo; // Add cityInfo to TripData
}

export default function TripDashboard() {
  const params = useParams();
  const client = createClient('slJ1vWuSxc9tU1CwgWaKm7wdUefG2TGsqUVWYkkcecp6GOey3kTHWtba');
  const tripId = params.tripId as string;
  const [tripData, setTripData] = useState<TripData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // Define default images
  const defaultLocationImage = "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3";
  const defaultHotelImage = "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3";
  const defaultPlaceImage = "https://plus.unsplash.com/premium_photo-1672252617591-cfef963eeefa?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3";
  const defaultFoodImage = "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3";
  const defaultCityImage = "https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3";

  // Removed duplicate declaration of fetchPexelsImages

  useEffect(() => {
    async function fetchTripData() {
      try {
        setLoading(true);
        // Query the database for the trip with the matching tripId
        const trips = await db
          .select()
          .from(tripDitails)
          .where(eq(tripDitails.tripId, tripId));

        if (trips.length === 0) {
          setError("Trip not found");
          return;
        }

        // Parse the tripData JSON string from the first matching trip
        const trip = trips[0];
        const parsedTripData = JSON.parse(trip.tripData) as {
          tripDetails?: Partial<TripDetails>;
          hotels?: Hotel[];
          itinerary?: Itinerary;
          summary?: Summary;
          cityInfo?: CityInfo;
        };

        // Set the parsed trip data to state
        const tripDataObj = {
          tripDetails: {
            location: trip.location,
            duration: trip.duration,
            budget: parsedTripData.tripDetails?.budget || "N/A",
            travelers: trip.travelers,
            date: trip.date,
            season: parsedTripData.tripDetails?.season || "Any",
            approxBudgetRequired:
              parsedTripData.tripDetails?.approxBudgetRequired || "3000-5000",
          },
          hotels: parsedTripData.hotels || [],
          itinerary: parsedTripData.itinerary || {},
          summary: parsedTripData.summary,
          cityInfo: parsedTripData.cityInfo || {
            cityName: trip.location,
            cityDescription: ["Beautiful city with lots to explore."],
            cityImageUrl: []
          }
        };

        setTripData(tripDataObj);

        // Fetch images after setting trip data
        fetchPexelsImages(tripDataObj);
      } catch (err) {
        console.error("Error fetching trip data:", err);
        setError("Failed to load trip data");
      } finally {
        setLoading(false);
      }
    }

    if (tripId) {
      fetchTripData();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ tripId]);

   
  const fetchPexelsImages = async (data: TripData) => {
    try {
      // Fetch city/location image
      const locationSearchTerm = data.cityInfo?.cityName || data.tripDetails.location;
      const locationPhotos = await client.photos.search({ query: locationSearchTerm, per_page: 3 });
      
      if ('photos' in locationPhotos && locationPhotos.photos.length > 0) {
        // Update cityInfo with image URLs
        setTripData(prevData => {
          if (!prevData) return prevData;
          
          const cityImageUrls = locationPhotos.photos.map(photo => photo.src.large);
          return {
            ...prevData,
            cityInfo: {
              ...prevData.cityInfo!,
              cityImageUrl: cityImageUrls
            }
          };
        });
      }

      // Fetch hotel images
      for (const hotel of data.hotels) {
        try {
          const hotelPhotos = await client.photos.search({ query: `hotel ${hotel.hotelName}`, per_page: 1 });
          
          if ('photos' in hotelPhotos && hotelPhotos.photos.length > 0) {
            // Update hotel with image URL
            setTripData(prevData => {
              if (!prevData) return prevData;
              
              const updatedHotels = prevData.hotels.map(h => {
                if (h.hotelName === hotel.hotelName) {
                  return {
                    ...h,
                    hotelImageUrl: hotelPhotos.photos[0].src.large
                  };
                }
                return h;
              });
              
              return {
                ...prevData,
                hotels: updatedHotels
              };
            });
          }
        } catch (error) {
          console.error(`Error fetching image for hotel ${hotel.hotelName}:`, error);
        }
      }

      // Fetch activity images
      for (const day of Object.values(data.itinerary)) {
        for (const activity of day.activities) {
          const activityName = activity.placeName || activity.foodName;
          if (activityName) {
            try {
              const activityPhotos = await client.photos.search({ query: activityName, per_page: 1 });
              
              if ('photos' in activityPhotos && activityPhotos.photos.length > 0) {
                // Update activity with image URL
                setTripData(prevData => {
                  if (!prevData) return prevData;
                  
                  const updatedItinerary = { ...prevData.itinerary };
                  
                  Object.keys(updatedItinerary).forEach(dayKey => {
                    updatedItinerary[dayKey].activities = updatedItinerary[dayKey].activities.map(a => {
                      if ((a.placeName === activity.placeName) || (a.foodName === activity.foodName)) {
                        if (activity.placeName) {
                          return {
                            ...a,
                            placeImageUrl: activityPhotos.photos[0].src.large
                          };
                        } else {
                          return {
                            ...a,
                            foodImageUrl: activityPhotos.photos[0].src.large
                          };
                        }
                      }
                      return a;
                    });
                  });
                  
                  return {
                    ...prevData,
                    itinerary: updatedItinerary
                  };
                });
              }
            } catch (error) {
              console.error(`Error fetching image for activity ${activityName}:`, error);
            }
          }
        }
      }
    } catch (error) {
      console.error("Error fetching Pexels images:", error);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4"><Loader2Icon/> Loading trip details...</div>
    );
  }

  if (error) {
    return <div className="container mx-auto py-8 px-4">Error: {error}</div>;
  }

  if (!tripData) {
    return (
      <div className="container mx-auto py-8 px-4">No trip data found</div>
    );
  }

  // Helper function to get a fallback image if URL is missing or for testing
  const getImageUrl = (url: string | undefined, type: 'hotel' | 'place' | 'food' | 'city') => {
    if (url && url.startsWith('http')) {
      return url;
    }
    
    // Fallback images based on type
    if (type === 'hotel') {
      return defaultHotelImage;
    } else if (type === 'place') {
      return defaultPlaceImage;
    } else if (type === 'food') {
      return defaultFoodImage;
    } else if (type === 'city') {
      return defaultCityImage;
    } else {
      return defaultLocationImage;
    }
  };

  // Helper function to get the name of an activity
  const getActivityName = (activity: Activity) => {
    return activity.placeName || activity.foodName || "Unnamed Activity";
  };

  // Helper function to get the details of an activity
  const getActivityDetails = (activity: Activity) => {
    return activity.placeDetails || activity.foodDetails || "No details available";
  };

  // Helper function to get the image URL of an activity
  const getActivityImageUrl = (activity: Activity) => {
    const type = activity.placeName ? 'place' : 'food';
    return getImageUrl(activity.placeImageUrl || activity.foodImageUrl, type);
  };

  // Helper function to get the price or ticket price of an activity
  const getActivityPrice = (activity: Activity) => {
    return activity.ticketPrice || activity.price || "N/A";
  };


 

  return (
    <>
      <Header />
      <div className="container mx-auto py-8 px-4">
        {/* Trip Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold mb-6">
            Trip to {tripData.tripDetails.location}
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <MapPin className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Location</p>
                    <p className="font-medium">
                      {tripData.tripDetails.location}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Duration</p>
                    <p className="font-medium">
                      {tripData.tripDetails.duration}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Budget</p>
                    <p className="font-medium">{tripData.tripDetails.budget}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Travelers</p>
                    <p className="font-medium">
                      {tripData.tripDetails.travelers}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-2">
                  <FaMoneyBillWave className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Approx Budget Required
                    </p>
                    <p className="font-medium">
                      {tripData.tripDetails.approxBudgetRequired}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* City Information Section */}
        {tripData.cityInfo && (
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-6">About {tripData.cityInfo.cityName}</h2>
            <Card className="overflow-hidden">
              <div className="md:flex">
                <div className="md:w-1/3 relative h-64 md:h-auto">
                  <Image
                    src={"https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Y2l0eXxlbnwwfHwwfHx8MA%3D%3D"}
                    alt={tripData.cityInfo.cityName}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="md:w-2/3">
                  <CardHeader>
                    <CardTitle>{tripData.cityInfo.cityName}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {tripData.cityInfo.cityDescription}
                    </div>
                  </CardContent>
                </div>
              </div>
            </Card>
          </section>
        )}

        {/* Hotels Section */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-6">Accommodations</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {tripData.hotels.map((hotel, index) => (
              <Card key={index} className="overflow-hidden">
                <div className="relative h-48 w-full">
                  <Image
                    src={getImageUrl(hotel.hotelImageUrl, 'hotel')}
                    alt={hotel.hotelName}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle>{hotel.hotelName}</CardTitle>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                      <span>{hotel.rating}</span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-2">
                    {hotel.hotelAddress}
                  </p>
                  <p className="mb-4">{hotel.description}</p>
                  <Badge
                    variant="outline"
                    className="bg-primary/10 text-primary"
                  >
                    {hotel.price}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Itinerary Section */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-6">Itinerary</h2>
          {Object.keys(tripData.itinerary).length > 0 ? (
            <Tabs
              defaultValue={Object.keys(tripData.itinerary)[0]}
              className="w-full"
            >
              <TabsList className="grid grid-cols-7 mb-6">
                {Object.entries(tripData.itinerary).map(([day], index) => (
                  <TabsTrigger key={day} value={day}>{`Day ${
                    index + 1
                  }`}</TabsTrigger>
                ))}
              </TabsList>

              {Object.entries(tripData.itinerary).map(([day, data]) => (
                <TabsContent key={day} value={day} className="space-y-6">
                  <h3 className="text-xl font-semibold">{data.date}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {data.activities.map((activity, index) => (
                      <Card key={index}>
                        <div className="relative h-48 w-full">
                          <Image
                            src={getActivityImageUrl(activity)}
                            alt={getActivityName(activity)}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <CardHeader>
                          <CardTitle>
                            {getActivityName(activity)}
                            {activity.foodName && (
                              <Badge className="ml-2" variant="secondary">Food</Badge>
                            )}
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="mb-4">{getActivityDetails(activity)}</p>
                          <div className="flex flex-wrap gap-2">
                            {getActivityPrice(activity) !== "N/A" && (
                              <Badge
                                variant="secondary"
                                className="flex items-center gap-1"
                              >
                                <DollarSign className="h-3 w-3" />
                                {getActivityPrice(activity)}
                              </Badge>
                            )}
                            {activity.geoCoordinates &&
                              activity.geoCoordinates.latitude !== 0 && (
                                <Link
                                  href={`https://www.google.com/maps/search/?api=1&query=${getActivityName(activity)}`}
                                  target="_blank"
                                >
                                  <Badge
                                    variant="outline"
                                    className="flex items-center gap-1"
                                  >
                                    <MapPin className="h-3 w-3" />
                                    Map Location
                                  </Badge>
                                </Link>
                              )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          ) : (
            <p>No itinerary available for this trip.</p>
          )}
        </section>

        {/* Summary Section */}
        {tripData.summary && (
          <section>
            <h2 className="text-2xl font-bold mb-6">Trip Summary</h2>
            <Card>
              <CardHeader>
                <CardTitle>Trip Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <DollarSign className="h-5 w-5 mr-2 text-primary" />
                    Total Estimated Cost
                  </h3>
                  <p>{tripData.summary.totalCost}</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <Star className="h-5 w-5 mr-2 text-primary" />
                    Highlights
                  </h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {tripData.summary.highlights.map((highlight, index) => (
                      <li key={index}>{highlight}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2 flex items-center">
                    <Info className="h-5 w-5 mr-2 text-primary" />
                    Travel Tips
                  </h3>
                  <ul className="list-disc pl-5 space-y-1">
                    {tripData.summary.travelTips.map((tip, index) => (
                      <li key={index}>{tip}</li>
                    ))}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </section>
        )}
      </div>
    </>
  );
}