import type { Metadata } from "next";
import "./globals.css";
import Navbar from '@/components/Navbar';

export const metadata: Metadata = {
  title: "SIGHT Confidential ERC20",
  description: "Demo for CERC20 with FHE",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        <Navbar />
        <main className="container mx-auto p-4 mt-50 md:mt-40 lg:mt-30">
          {children}
        </main>
      </body>
    </html>
  );
}
