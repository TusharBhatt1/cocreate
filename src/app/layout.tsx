import "~/styles/globals.css";

import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import Providers from "~/modules/shared/providers";
import { auth } from "~/server/auth";

export const metadata: Metadata = {
  title: "Cocreate",
  description: "Figma clone",
  icons: [{ rel: "icon", url: "/logo.png" }],
};

const inter = Poppins({
  weight: ["100", "200", "400", "500", "800"],
  subsets:["latin"]
});

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const session = await auth();
  return (
    <html lang="en" className={`${inter.className}`}>
      <body className="overflow-hidden overscroll-none">
        <Providers session={session}>
          {children} 
        </Providers>
      </body>
    </html>
  );
}
