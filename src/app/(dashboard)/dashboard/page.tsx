"use client";

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
  ShieldCheck
} from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard, color: "text-green-600", bg: "bg-green-100" },
  { name: "Products", href: "/dashboard/products", icon: Package, color: "text-blue-600", bg: "bg-blue-100" },
  { name: "Inbound", href: "/dashboard/inbound", icon: ArrowDownCircle, color: "text-cyan-600", bg: "bg-cyan-100" },
  { name: "Outbound", href: "/dashboard/outbound", icon: ArrowUpCircle, color: "text-orange-600", bg: "bg-orange-100" },
  { name: "Harvest", href: "/dashboard/harvest", icon: TrendingUp, color: "text-emerald-600", bg: "bg-emerald-100" },
  { name: "Sales", href: "/dashboard/sales", icon: TrendingUp, color: "text-purple-600", bg: "bg-purple-100" },
  { name: "Locations", href: "/dashboard/locations", icon: MapPin, color: "text-teal-600", bg: "bg-teal-100" },
];

interface MonthlyData {
  month: string;
  revenue: number;
  quantity: number;
}

interface LocationItem {
  id: string;
  name: string;
  address: string;
}

interface Stats {
  products: number;
  inbounds: number;
  harvests: number;
  sales: number;
  totalRevenue: number;
  monthlySales: MonthlyData[];
  monthlyHarvests: MonthlyData[];
  locations: LocationItem[];
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState<Stats>({ products: 0, inbounds: 0, harvests: 0, sales: 0, totalRevenue: 0, monthlySales: [], monthlyHarvests: [], locations: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/stats")
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

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
    <div className="min-h-screen flex bg-gradient-to-br from-gray-50 to-green-50">
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-xl transform transition-transform lg:translate-x-0 lg:static",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b bg-gradient-to-r from-green-600 to-emerald-600">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center backdrop-blur">
                <Sprout className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-white">AgriFarm</span>
            </Link>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-white">
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="flex-1 p-4 space-y-1">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                  pathname === item.href
                    ? `${item.bg} ${item.color} shadow-sm`
                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                )}
                onClick={() => setSidebarOpen(false)}
              >
                <item.icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t bg-gray-50">
            <div className="flex items-center space-x-3 mb-4 p-2 bg-white rounded-lg shadow-sm">
              <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-white font-bold">
                {session?.user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{session?.user?.name}</p>
                <p className="text-xs text-gray-500 capitalize">{session?.user?.role}</p>
              </div>
            </div>
            {session?.user?.role === "guest" && (
              <Button
                variant="outline"
                className="w-full justify-start text-amber-600 hover:text-amber-700 hover:bg-amber-50 border-amber-200 mb-2"
                onClick={() => {
                  fetch("/api/auth/upgrade", { method: "POST" })
                    .then(res => res.json())
                    .then(data => {
                      if (data.message) window.location.reload();
                    });
                }}
              >
                <Shield className="w-4 h-4 mr-2" />
                Upgrade to Operator
              </Button>
            )}
            <Button
              variant="outline"
              className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
              onClick={() => signOut({ callbackUrl: "/" })}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-h-screen">
        <header className="bg-white/80 backdrop-blur-sm border-b px-4 py-3 lg:hidden flex items-center justify-between shadow-sm">
          <button onClick={() => setSidebarOpen(true)} className="p-2 hover:bg-gray-100 rounded-lg">
            <Menu className="w-6 h-6" />
          </button>
          <span className="font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">AgriFarm</span>
          <div className="w-10" />
        </header>

        <main className="flex-1 p-4 md:p-6">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
            <p className="text-gray-500">Welcome back, <span className="font-semibold text-green-600">{session?.user?.name}</span></p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="bg-white p-6 rounded-xl border-0 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-white to-green-50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Products</p>
                  <p className="text-3xl font-bold text-gray-800">{loading ? "..." : stats.products}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <Package className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl border-0 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-white to-blue-50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Inbound</p>
                  <p className="text-3xl font-bold text-gray-800">{loading ? "..." : stats.inbounds}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <ArrowDownCircle className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl border-0 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-white to-emerald-50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Harvests</p>
                  <p className="text-3xl font-bold text-gray-800">{loading ? "..." : stats.harvests}</p>
                </div>
                <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-emerald-600" />
                </div>
              </div>
            </div>
            <div className="bg-white p-6 rounded-xl border-0 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-white to-purple-50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Total Revenue</p>
                  <p className="text-3xl font-bold text-gray-800">${loading ? "..." : stats.totalRevenue.toLocaleString()}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <div className="bg-white p-6 rounded-xl border-0 shadow-lg">
              <h2 className="text-lg font-semibold mb-4 text-gray-800">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-3">
                <Link href="/dashboard/inbound">
                  <Button variant="outline" className="w-full justify-start h-12 border-2 hover:border-blue-500 hover:bg-blue-50">
                    <ArrowDownCircle className="w-5 h-5 mr-2 text-blue-500" />
                    New Inbound
                  </Button>
                </Link>
                <Link href="/dashboard/outbound">
                  <Button variant="outline" className="w-full justify-start h-12 border-2 hover:border-orange-500 hover:bg-orange-50">
                    <ArrowUpCircle className="w-5 h-5 mr-2 text-orange-500" />
                    New Outbound
                  </Button>
                </Link>
                <Link href="/dashboard/harvest">
                  <Button variant="outline" className="w-full justify-start h-12 border-2 hover:border-green-500 hover:bg-green-50">
                    <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
                    Record Harvest
                  </Button>
                </Link>
                <Link href="/dashboard/sales">
                  <Button variant="outline" className="w-full justify-start h-12 border-2 hover:border-purple-500 hover:bg-purple-50">
                    <TrendingUp className="w-5 h-5 mr-2 text-purple-500" />
                    Record Sale
                  </Button>
                </Link>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border-0 shadow-lg">
              <h2 className="text-lg font-semibold mb-4 text-gray-800">Tren Penjualan Bulanan</h2>
              {stats.monthlySales.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                  <TrendingUp className="w-12 h-12 mb-2 opacity-50" />
                  <p>Belum ada data penjualan</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {stats.monthlySales.map((item) => {
                    const maxRevenue = Math.max(...stats.monthlySales.map(s => s.revenue), 1);
                    const pct = (item.revenue / maxRevenue) * 100;
                    return (
                      <div key={item.month} className="flex items-center gap-3">
                        <span className="text-xs text-gray-500 w-16 flex-shrink-0">{item.month}</span>
                        <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-green-500 to-emerald-500 h-full rounded-full transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium text-gray-700 w-20 text-right">${item.revenue.toLocaleString()}</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <div className="bg-white p-6 rounded-xl border-0 shadow-lg">
              <h2 className="text-lg font-semibold mb-4 text-gray-800">Tren Panen Bulanan</h2>
              {stats.monthlyHarvests.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                  <TrendingUp className="w-12 h-12 mb-2 opacity-50" />
                  <p>Belum ada data panen</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {stats.monthlyHarvests.map((item) => {
                    const maxQty = Math.max(...stats.monthlyHarvests.map(h => h.quantity), 1);
                    const pct = (item.quantity / maxQty) * 100;
                    return (
                      <div key={item.month} className="flex items-center gap-3">
                        <span className="text-xs text-gray-500 w-16 flex-shrink-0">{item.month}</span>
                        <div className="flex-1 bg-gray-100 rounded-full h-5 overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-amber-500 to-orange-500 h-full rounded-full transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-xs font-medium text-gray-700 w-20 text-right">{item.quantity.toLocaleString()} kg</span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="bg-white p-6 rounded-xl border-0 shadow-lg">
              <h2 className="text-lg font-semibold mb-4 text-gray-800">Daftar Lokasi</h2>
              {stats.locations.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                  <MapPin className="w-12 h-12 mb-2 opacity-50" />
                  <p>Belum ada lokasi</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {stats.locations.map((loc) => (
                    <div key={loc.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-teal-50 transition-colors">
                      <div className="p-2 bg-teal-100 rounded-lg">
                        <MapPin className="w-4 h-4 text-teal-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">{loc.name}</p>
                        <p className="text-xs text-gray-500">{loc.address}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
}