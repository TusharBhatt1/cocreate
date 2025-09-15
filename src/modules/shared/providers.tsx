import { SessionProvider } from "next-auth/react";
import React from "react";
import { SidebarProvider, SidebarTrigger } from "~/components/ui/sidebar";

export default function Providers({
  children,
  session,
}: Readonly<{
  children: React.ReactNode;
  session: any;
}>) {
  return (
    <SessionProvider session={session}>
      <SidebarProvider>{children}</SidebarProvider>
    </SessionProvider>
  );
}
