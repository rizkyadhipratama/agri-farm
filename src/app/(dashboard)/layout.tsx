import type { Metadata } from "next";
import { Providers } from "@/components/providers";
import SessionActivity from "@/components/session-activity";

export const metadata: Metadata = {
  title: "Dashboard - AgriFarm",
  description: "Farming management dashboard",
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Providers>
      <SessionActivity />
      {children}
    </Providers>
  );
}