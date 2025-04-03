import type { Metadata } from "next";
import "./globals.css";
import Navbar from '@/components/Navbar';
import { WalletProvider } from '../components/WalletProvider';

export const metadata: Metadata = {
  title: "Vespera",
  description: "Demo of Vespera for Aptos Overmove",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        <WalletProvider>
        <Navbar />
        <main className="container mx-auto p-4 mt-30 ">
          {children}
        </main>
        </WalletProvider>
      </body>
    </html>
  );
}
