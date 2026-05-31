import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { AuthProvider } from "@/components/providers/auth-provider";

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",  // use CSS variable instead
});

export const metadata: Metadata = {
  title: "AgriFarm - Smart Farming Management",
  description: "Modern farming management system with inventory, harvest tracking, and sales management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={cn(inter.variable, "font-sans min-h-screen bg-background")}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
