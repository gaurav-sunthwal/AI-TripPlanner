import { Button } from "@/components/ui/button";
import { MapPin, Calendar } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import Header from "./AppComponents/Header";

export default function Home() {
  return (
    <>
      <Header />
      <div className="min-h-screen bg-background w-full flex justify-center ">
        {/* Navigation */}
        {/* Hero Section */}
        <section className="container">
          <div className="flex flex-col items-center text-center space-y-6">
            <div className="inline-block rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary">
              AI-Powered Trip Planning
            </div>
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
              Your Next Journey, <span className="text-primary">Optimized</span>
            </h1>
            <p className="max-w-[700px] text-lg text-muted-foreground md:text-xl">
              Build, personalize, and optimize your itineraries with our free AI
              trip planner. Designed for vacations, workations, and everyday
              adventures.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/Create_trip">
                <Button size="lg" className="gap-2">
                  <MapPin className="h-4 w-4" />
                  Create a new trip
                </Button>
              </Link>
              <Link href="/dashboard">
                <Button variant="outline" size="lg" className="gap-2">
                  <Calendar className="h-4 w-4" />
                  View dashboard
                </Button>
              </Link>
            </div>
          </div>

          {/* Preview Image */}
          <div className="rounded-lg border bg-card overflow-hidden shadow-lg mt-5">
            <Image
              src="https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=900&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8dHJhdmVsfGVufDB8fDB8fHww"
              width={1200}
              height={600}
              alt="Trip planner dashboard preview"
              className="w-full object-cover"
            />
          </div>
        </section>
      </div>
    </>
  );
}
