import React from "react";
import { Sidebar, SidebarHeader } from "~/components/ui/sidebar";
import UserButton from "./user-button";

export default function DashboardSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <UserButton />
      </SidebarHeader>
    </Sidebar>
  );
}
