import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import React from "react";
import { AppSidebar } from "./AppSidebar";
import { HStack } from "@chakra-ui/react";
import { ClerkProvider } from "@clerk/nextjs";

export default function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <SidebarProvider>
        <AppSidebar />
        <main className="w-full">
            <SidebarTrigger />
          {children}
        </main>
      </SidebarProvider>
    </ClerkProvider>
  );
}
