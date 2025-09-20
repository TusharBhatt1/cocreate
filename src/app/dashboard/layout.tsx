import { Globe } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Separator } from "~/components/ui/separator";
import {
  Sidebar,
  SidebarFooter,
  SidebarHeader,
  SidebarProvider,
} from "~/components/ui/sidebar";
import UserButton from "~/modules/dashboard/user-button";

export default function layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <SidebarProvider>
        <Sidebar className="flex h-screen flex-col">
          <SidebarHeader>
            <div className="flex items-center gap-2">
              <Link href={"/"}>
                <Image
                  alt="Co Cocreate"
                  src={"/logo.png"}
                  height={32}
                  width={32}
                />
              </Link>
              <h1 className="text-xl">CoCreate</h1>
            </div>
            <Separator/>
            <UserButton />
          </SidebarHeader>

          <div className="flex-1" />
          <Separator />
          <SidebarFooter className="mb-1 text-center">
            <a
              href="https://tusharbhatt.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="flex justify-center items-center gap-1 hover:text-primary transition-colors"
            >
              <Globe size={16} />
              <span>Made by Tushar Bhatt</span>
            </a>
          </SidebarFooter>
        </Sidebar>

        {children}
      </SidebarProvider>
    </div>
  );
}
