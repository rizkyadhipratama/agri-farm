"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import BarChart from "@/components/ui/bar-chart";
import {
  Package,
  ArrowDownCircle,
  ArrowUpCircle,
  TrendingUp,
  MapPin,
  Sprout,
} from "lucide-react";

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
  plantings: number;
  totalRevenue: number;
  monthlySales: MonthlyData[];
  monthlyHarvests: MonthlyData[];
  locations: LocationItem[];
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<Stats>({
    products: 0,
    inbounds: 0,
    harvests: 0,
    sales: 0,
    plantings: 0,
    totalRevenue: 0,
    monthlySales: [],
    monthlyHarvests: [],
    locations: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/stats")
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <main className="flex-1 p-4 md:p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500">
          Welcome back,{" "}
          <span className="font-semibold text-green-600">
            {session?.user?.name}
          </span>
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <div className="bg-white p-6 rounded-xl border-0 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-white to-green-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Products</p>
              <p className="text-3xl font-bold text-gray-800">
                {loading ? "..." : stats.products}
              </p>
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
              <p className="text-3xl font-bold text-gray-800">
                {loading ? "..." : stats.inbounds}
              </p>
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
              <p className="text-3xl font-bold text-gray-800">
                {loading ? "..." : stats.harvests}
              </p>
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
              <p className="text-3xl font-bold text-gray-800">
                ${loading ? "..." : stats.totalRevenue.toLocaleString()}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border-0 shadow-lg hover:shadow-xl transition-shadow bg-gradient-to-br from-white to-lime-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Plantings</p>
              <p className="text-3xl font-bold text-gray-800">
                {loading ? "..." : stats.plantings}
              </p>
            </div>
            <div className="w-12 h-12 bg-lime-100 rounded-xl flex items-center justify-center">
              <Sprout className="w-6 h-6 text-lime-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="bg-white p-6 rounded-xl border-0 shadow-lg">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">
            Quick Actions
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <Link href="/dashboard/inbound">
              <Button
                variant="outline"
                className="w-full justify-start h-12 border-2 hover:border-blue-500 hover:bg-blue-50"
              >
                <ArrowDownCircle className="w-5 h-5 mr-2 text-blue-500" />
                New Inbound
              </Button>
            </Link>
            <Link href="/dashboard/outbound">
              <Button
                variant="outline"
                className="w-full justify-start h-12 border-2 hover:border-orange-500 hover:bg-orange-50"
              >
                <ArrowUpCircle className="w-5 h-5 mr-2 text-orange-500" />
                New Outbound
              </Button>
            </Link>
            <Link href="/dashboard/planting">
              <Button
                variant="outline"
                className="w-full justify-start h-12 border-2 hover:border-lime-500 hover:bg-lime-50"
              >
                <Sprout className="w-5 h-5 mr-2 text-lime-500" />
                New Planting
              </Button>
            </Link>
            <Link href="/dashboard/harvest">
              <Button
                variant="outline"
                className="w-full justify-start h-12 border-2 hover:border-green-500 hover:bg-green-50"
              >
                <TrendingUp className="w-5 h-5 mr-2 text-green-500" />
                Record Harvest
              </Button>
            </Link>
            <Link href="/dashboard/sales">
              <Button
                variant="outline"
                className="w-full justify-start h-12 border-2 hover:border-purple-500 hover:bg-purple-50"
              >
                <TrendingUp className="w-5 h-5 mr-2 text-purple-500" />
                Record Sale
              </Button>
            </Link>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border-0 shadow-lg">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">
            Tren Penjualan Bulanan
          </h2>
          {stats.monthlySales.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-gray-400">
              <TrendingUp className="w-12 h-12 mb-2 opacity-50" />
              <p>Belum ada data penjualan</p>
            </div>
          ) : (
            <BarChart
              data={stats.monthlySales.map((item) => ({
                label: item.month,
                value: item.revenue,
              }))}
              gradientFrom="#22c55e"
              gradientTo="#10b981"
              formatValue={(v) => `$${v.toLocaleString()}`}
              height={220}
            />
          )}
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="bg-white p-6 rounded-xl border-0 shadow-lg">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">
            Tren Panen Bulanan
          </h2>
          {stats.monthlyHarvests.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-gray-400">
              <TrendingUp className="w-12 h-12 mb-2 opacity-50" />
              <p>Belum ada data panen</p>
            </div>
          ) : (
            <BarChart
              data={stats.monthlyHarvests.map((item) => ({
                label: item.month,
                value: item.quantity,
              }))}
              gradientFrom="#f59e0b"
              gradientTo="#ea580c"
              formatValue={(v) => `${v.toLocaleString()} kg`}
              height={220}
            />
          )}
        </div>

        <div className="bg-white p-6 rounded-xl border-0 shadow-lg">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">
            Daftar Lokasi
          </h2>
          {stats.locations.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-gray-400">
              <MapPin className="w-12 h-12 mb-2 opacity-50" />
              <p>Belum ada lokasi</p>
            </div>
          ) : (
            <div className="space-y-3">
              {stats.locations.map((loc) => (
                <div
                  key={loc.id}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-teal-50 transition-colors"
                >
                  <div className="p-2 bg-teal-100 rounded-lg">
                    <MapPin className="w-4 h-4 text-teal-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {loc.name}
                    </p>
                    <p className="text-xs text-gray-500">{loc.address}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
