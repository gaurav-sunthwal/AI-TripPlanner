"use client";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode";
import { UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import React from "react";

export default function Header() {
  const { isLoaded, isSignedIn } = useUser();

  return (
    <header className="border-b border-border bg-background">
      <div className="container mx-auto py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-extrabold">
          TripAI.
        </Link>
        
        

        <div className="flex items-center space-x-4">
          {isLoaded && isSignedIn ? (
            <UserButton  />
          ) : (
            <>
              <Link href="/sign-in">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button size="sm">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        <ModeToggle/>
        </div>
      </div>
    </header>
  );
}