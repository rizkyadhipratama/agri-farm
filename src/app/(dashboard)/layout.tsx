"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import {
  Sprout,
  LayoutDashboard,
  Package,
  ArrowDownCircle,
  ArrowUpCircle,
  TrendingUp,
  MapPin,
  LogOut,
  Menu,
  X,
  Loader2,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import SessionActivity from "@/components/session-activity";
import LanguageToggle from "@/components/language-toggle";
import { useTranslation, TranslationProvider } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";

const navItems = [
  { key: "nav.dashboard", href: "/dashboard", icon: LayoutDashboard, color: "text-green-600", bg: "bg-green-100" },
  { key: "nav.products", href: "/dashboard/products", icon: Package, color: "text-blue-600", bg: "bg-blue-100" },
  { key: "nav.inbound", href: "/dashboard/inbound", icon: ArrowDownCircle, color: "text-cyan-600", bg: "bg-cyan-100" },
  { key: "nav.outbound", href: "/dashboard/outbound", icon: ArrowUpCircle, color: "text-orange-600", bg: "bg-orange-100" },
  { key: "nav.planting", href: "/dashboard/planting", icon: Sprout, color: "text-lime-600", bg: "bg-lime-100" },
  { key: "nav.harvest", href: "/dashboard/harvest", icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-100" },
  { key: "nav.sales", href: "/dashboard/sales", icon: TrendingUp, color: "text-purple-600", bg: "bg-purple-100" },
  { key: "nav.locations", href: "/dashboard/locations", icon: MapPin, color: "text-teal-600", bg: "bg-teal-100" },
];

function Sidebar({
  sidebarOpen,
  setSidebarOpen,
}: {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}) {
  const { data: session } = useSession();
  const pathname = usePathname();
  const { t } = useTranslation();

  return (
    <aside
      className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl",
        "transform transition-transform duration-300 ease-in-out",
        sidebarOpen ? "translate-x-0" : "-translate-x-full",
        "md:relative md:translate-x-0 md:shadow-none md:z-auto"
      )}
    >
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-green-600 to-emerald-600">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur">
              <Sprout className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-white">AgriFarm</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-white hover:text-white/80 p-1 rounded"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => {
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.key}
                href={item.href}
                className={cn(
                  "flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                  isActive
                    ? `${item.bg} ${item.color} shadow-sm`
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                )}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                <span>{t(item.key)}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t bg-gray-50">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-3 p-2 bg-white rounded-lg shadow-sm flex-1 min-w-0 mr-2">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                {session?.user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{session?.user?.name}</p>
                <p className="text-xs text-gray-500 capitalize">{session?.user?.role}</p>
              </div>
            </div>
            <LanguageToggle />
          </div>

          {session?.user?.role === "guest" && (
            <Button
              variant="outline"
              className="w-full justify-start text-amber-600 hover:text-amber-700 hover:bg-amber-50 border-amber-200 mb-2"
              onClick={() => {
                fetch("/api/auth/upgrade", { method: "POST" })
                  .then((res) => res.json())
                  .then((data) => {
                    if (data.message) window.location.reload();
                  });
              }}
            >
              <Shield className="w-4 h-4 mr-2" />
              {t("nav.upgrade")}
            </Button>
          )}

          <Button
            variant="outline"
            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
            onClick={() => signOut({ callbackUrl: "/" })}
          >
            <LogOut className="w-4 h-4 mr-2" />
            {t("nav.signout")}
          </Button>
        </div>
      </div>
    </aside>
  );
}

function DashboardLayoutInner({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { status } = useSession();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading" || status === "unauthenticated") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 mx-auto text-green-600 animate-spin" />
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <SessionActivity />
      <div className="min-h-screen flex bg-gradient-to-br from-gray-50 to-green-50">
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
            aria-hidden="true"
          />
        )}
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />

        <div className="flex-1 flex flex-col min-w-0 min-h-screen">
          <header className="bg-white/80 backdrop-blur-sm border-b px-4 py-3 md:hidden flex items-center justify-between shadow-sm sticky top-0 z-30">
            <button
              onClick={() => { console.log("Opening sidebar"); setSidebarOpen(true); }}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="Open sidebar"
            >
              <Menu className="w-6 h-6 text-gray-700" />
            </button>
            <span className="font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
              AgriFarm
            </span>
            <div className="w-10" />
          </header>

          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </>
  );
}

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <TranslationProvider>
      <DashboardLayoutInner>{children}</DashboardLayoutInner>
    </TranslationProvider>
  );
}
