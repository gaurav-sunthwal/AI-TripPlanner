import { MapPin, Calendar, DollarSign, Users, Star } from "lucide-react"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function TripDashboard() {
  // This would typically come from an API or database
  const tripData = {
    tripDetails: {
      location: "Pune, India",
      duration: "5 Days",
      budget: "Luxury",
      travelers: "Couple",
    },
    hotels: [
      {
        hotelName: "The Ritz-Carlton, Pune",
        hotelAddress: "Golf Course Square, Airport Road, Pune, Maharashtra 411006, India",
        price: "INR 15,000 - 25,000 per night (approx.)",
        hotelImageUrl:
          "https://www.ritzcarlton.com/content/dam/ritzcarlton/hotels/pune/hotel-overview/rc-pune-exterior-dawn-01-864x576.jpg",
        geoCoordinates: {
          latitude: 18.5621,
          longitude: 73.9111,
        },
        rating: 5,
        description: "Luxury hotel with elegant rooms, fine dining, and a spa.",
      },
      {
        hotelName: "JW Marriott Hotel Pune",
        hotelAddress: "Senapati Bapat Rd, Laxmi Society, Model Colony, Shivajinagar, Pune, Maharashtra 411016",
        price: "INR 12,000 - 20,000 per night (approx.)",
        hotelImageUrl:
          "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1a/10/94/62/exterior.jpg?w=1200&h=-1&s=1",
        geoCoordinates: {
          latitude: 18.5369,
          longitude: 73.8274,
        },
        rating: 4.8,
        description: "Upscale hotel with modern amenities, multiple dining options, and a rooftop pool.",
      },
    ],
    itinerary: {
      day1: {
        date: "Day 1",
        activities: [
          {
            placeName: "Aga Khan Palace",
            placeDetails: "Historical palace with Gandhian significance.",
            placeImageUrl: "https://www.culturalindia.net/iliimages/Aga-Khan-Palace-Pune.jpg",
            geoCoordinates: {
              latitude: 18.5667,
              longitude: 73.9136,
            },
            ticketPrice: "INR 25 per person (approx.)",
          },
          {
            placeName: "Osho Ashram",
            placeDetails: "Meditation center with lush gardens.",
            placeImageUrl:
              "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/Osho_International_Meditation_Resort%2C_Pune_2009.jpg/1280px-Osho_International_Meditation_Resort%2C_Pune_2009.jpg",
            geoCoordinates: {
              latitude: 18.529,
              longitude: 73.8333,
            },
            ticketPrice: "Varies depending on activities",
          },
        ],
      },
      day2: {
        date: "Day 2",
        activities: [
          {
            placeName: "Sinhagad Fort",
            placeDetails: "Historic hill fort with stunning views.",
            placeImageUrl:
              "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Sinhagad_Fort_Pune.jpg/1280px-Sinhagad_Fort_Pune.jpg",
            geoCoordinates: {
              latitude: 18.3517,
              longitude: 73.7614,
            },
            ticketPrice: "Nominal entry fee",
          },
          {
            placeName: "Khadakwasla Dam",
            placeDetails: "Scenic dam and reservoir.",
            placeImageUrl: "https://www.fabhotels.com/blog/wp-content/uploads/2019/09/Khadakwasla-Dam-Pune.jpg",
            geoCoordinates: {
              latitude: 18.4833,
              longitude: 73.75,
            },
            ticketPrice: "Free entry",
          },
        ],
      },
      day3: {
        date: "Day 3",
        activities: [
          {
            placeName: "Paasha - JW Marriott",
            placeDetails: "Rooftop restaurant with North Indian cuisine and city views.",
            placeImageUrl: "https://media-cdn.tripadvisor.com/media/photo-s/0f/8c/7c/ea/paasha-jw-marriott-hotel.jpg",
            geoCoordinates: {
              latitude: 18.5369,
              longitude: 73.8274,
            },
            ticketPrice: "Based on order",
          },
        ],
      },
      day4: {
        date: "Day 4",
        activities: [
          {
            placeName: "Shopping at Phoenix Marketcity",
            placeDetails: "Large shopping mall with various brands and entertainment.",
            placeImageUrl:
              "https://content3.jdmagicbox.com/comp/pune/s3/020px20.x20.120911192757.n2s3/catalogue/phoenix-marketcity-pune-vimannagar-pune-shopping-malls-1975nz6.jpg",
            geoCoordinates: {
              latitude: 18.5616,
              longitude: 73.9162,
            },
            ticketPrice: "Free Entry(Shopping at your own Expense)",
          },
        ],
      },
      day5: {
        date: "Day 5",
        activities: [
          {
            placeName: "Departure",
            placeDetails: "Check out from the hotel and depart from Pune.",
            placeImageUrl: "",
            geoCoordinates: {
              latitude: 0,
              longitude: 0,
            },
            ticketPrice: "NA",
          },
        ],
      },
    },
  }

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Trip Header */}
      <div className="mb-10">
        <h1 className="text-4xl font-bold mb-6">Trip to {tripData.tripDetails.location}</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Location</p>
                  <p className="font-medium">{tripData.tripDetails.location}</p>
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
                  <p className="font-medium">{tripData.tripDetails.duration}</p>
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
                  <p className="font-medium">{tripData.tripDetails.travelers}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Hotels Section */}
      <section className="mb-10">
        <h2 className="text-2xl font-bold mb-6">Accommodations</h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {tripData.hotels.map((hotel, index) => (
            <Card key={index} className="overflow-hidden">
              <div className="relative h-48 w-full">
                <Image
                  src={hotel.hotelImageUrl || "/placeholder.svg?height=400&width=600"}
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
                <p className="text-sm text-muted-foreground mb-2">{hotel.hotelAddress}</p>
                <p className="mb-4">{hotel.description}</p>
                <Badge variant="outline" className="bg-primary/10 text-primary">
                  {hotel.price}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Itinerary Section */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Itinerary</h2>
        <Tabs defaultValue="day1" className="w-full">
          <TabsList className="grid grid-cols-5 mb-6">
            <TabsTrigger value="day1">Day 1</TabsTrigger>
            <TabsTrigger value="day2">Day 2</TabsTrigger>
            <TabsTrigger value="day3">Day 3</TabsTrigger>
            <TabsTrigger value="day4">Day 4</TabsTrigger>
            <TabsTrigger value="day5">Day 5</TabsTrigger>
          </TabsList>

          {Object.entries(tripData.itinerary).map(([day, data]) => (
            <TabsContent key={day} value={day} className="space-y-6">
              <h3 className="text-xl font-semibold">{data.date}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {data.activities.map((activity, index) => (
                  <Card key={index}>
                    {activity.placeImageUrl && (
                      <div className="relative h-48 w-full">
                        <Image
                          src={activity.placeImageUrl || "/placeholder.svg?height=400&width=600"}
                          alt={activity.placeName}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <CardHeader>
                      <CardTitle>{activity.placeName}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="mb-4">{activity.placeDetails}</p>
                      <div className="flex flex-wrap gap-2">
                        {activity.ticketPrice && activity.ticketPrice !== "NA" && (
                          <Badge variant="secondary" className="flex items-center gap-1">
                            <DollarSign className="h-3 w-3" />
                            {activity.ticketPrice}
                          </Badge>
                        )}
                        {activity.geoCoordinates && activity.geoCoordinates.latitude !== 0 && (
                          <Badge variant="outline" className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            Map Location Available
                          </Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </section>
    </div>
  )
}
