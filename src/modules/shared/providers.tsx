import { SessionProvider } from "next-auth/react";
import React from "react";
import { SidebarProvider } from "~/components/ui/sidebar";
import NextTopLoader from "nextjs-toploader";

export default function Providers({
  children,
  session,
}: Readonly<{
  children: React.ReactNode;
  session: any;
}>) {
  return (
    <SessionProvider session={session}>
      <NextTopLoader />
      <SidebarProvider>{children}</SidebarProvider>
    </SessionProvider>
  );
}
