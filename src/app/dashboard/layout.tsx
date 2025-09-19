import React from "react";
import {Sidebar, SidebarHeader, SidebarProvider } from "~/components/ui/sidebar";
import UserButton from "~/modules/dashboard/user-button";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <SidebarProvider>
        <Sidebar>
          <SidebarHeader>
            <UserButton />
          </SidebarHeader>
        </Sidebar>{" "}
        {children}
      </SidebarProvider>
    </div>
  );
}
