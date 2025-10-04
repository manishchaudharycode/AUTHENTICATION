import React from "react";
import { Navbar } from "./navbar/navbar";
import { AppSidebar } from "./sidebar";
import { SidebarProvider } from "./ui/sidebar";


export default function Layout({ children }: { children: React.ReactNode }) {
  const [user] = React.useState(true);

  return (
    <div className="flex">
      <SidebarProvider>
        <div>{user ? <AppSidebar /> : null}</div>
        <div className="flex flex-col min-h-screen w-full">
          <div>{user ? <Navbar /> : null}</div>
          <div className="p-6 h-full flex bg-neutral-800">{children} </div>
        </div>
      </SidebarProvider>
    </div>
  );
}
