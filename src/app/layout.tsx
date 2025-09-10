import "~/styles/globals.css";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Providers from "~/modules/shared/providers";
import { auth } from "~/server/auth";

export const metadata: Metadata = {
	title: "Cocreate",
	description: "Figma clone",
	icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const inter = Inter({
	subsets: ["latin"],
	display:"swap"
});

export default async function RootLayout({
	children,
}: Readonly<{ children: React.ReactNode }>) {

	const session= await auth()
	return (
		<html lang="en" className={`${inter.className}`}>
			<body>
				<Providers session={session} >
				{children}
				</Providers>
				</body>
		</html>
	);
}
