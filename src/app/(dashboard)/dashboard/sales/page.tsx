"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormModal } from "@/components/ui/modal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  DollarSign, 
  Plus, 
  Search,
  ArrowLeft,
  Loader2,
  TrendingUp,
  Receipt
} from "lucide-react";
import Link from "next/link";

interface Harvest {
  id: string;
  product: { name: string };
  quantity: string;
}

interface Sale {
  id: string;
  harvestId: string;
  harvest: { product: { name: string } };
  quantity: string;
  unitPrice: string;
  totalPrice: string;
  buyerName: string | null;
  salesDate: string;
}

export default function SalesPage() {
  const { data: session } = useSession();
  const [searchTerm, setSearchTerm] = useState("");
  const [sales, setSales] = useState<Sale[]>([]);
  const [harvests, setHarvests] = useState<Harvest[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    harvestId: "",
    quantity: 0,
    unitPrice: 0,
    buyerName: "",
    notes: "",
  });

  const isOperator = session?.user?.role === "operator" || session?.user?.role === "admin";

  useEffect(() => {
    Promise.all([
      fetch("/api/sales").then(res => res.json()),
      fetch("/api/harvest").then(res => res.json())
    ]).then(([salesData, harvestsData]) => {
      setSales(salesData);
      setHarvests(harvestsData);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const res = await fetch("/api/sales", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      if (res.ok) {
        setDialogOpen(false);
        setFormData({ harvestId: "", quantity: 0, unitPrice: 0, buyerName: "", notes: "" });
        const salesRes = await fetch("/api/sales");
        setSales(await salesRes.json());
      }
    } catch (error) {
      console.error(error);
    }
    
    setSubmitting(false);
  };

  const filteredSales = sales.filter(s => 
    s.harvest.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (s.buyerName?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  );

  const totalRevenue = filteredSales.reduce((sum, s) => sum + Number(s.totalPrice), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      <header className="bg-white/80 backdrop-blur-sm border-b px-6 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon" className="hover:bg-purple-100">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <DollarSign className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Sales Management</h1>
                <p className="text-sm text-gray-500">Track harvest sales and revenue</p>
              </div>
            </div>
          </div>
          {isOperator && (
            <Button onClick={() => setDialogOpen(true)} className="bg-purple-600 hover:bg-purple-700">
              <Plus className="w-4 h-4 mr-2" />
              Record Sale
            </Button>
          )}
        </div>
      </header>

      <main className="p-6">
        <div className="grid gap-6 mb-6 md:grid-cols-3">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-emerald-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-100">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">${totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-green-100 mt-1">All time earnings</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-cyan-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-blue-100">Total Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{filteredSales.length}</div>
              <p className="text-xs text-blue-100 mt-1">Sales records</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-amber-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-orange-100">Average Sale</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                ${filteredSales.length > 0 ? Math.round(totalRevenue / filteredSales.length).toLocaleString() : 0}
              </div>
              <p className="text-xs text-orange-100 mt-1">Per transaction</p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-0 shadow-xl">
          <CardHeader className="pb-4 border-b">
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search sales..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-50 border-gray-200"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
              </div>
            ) : filteredSales.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                <Receipt className="w-12 h-12 mb-4 text-gray-300" />
                <p>No sales records found</p>
              </div>
            ) : (
              <div className="rounded-md border border-gray-100">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Product</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Quantity</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Unit Price</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Total</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Buyer</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSales.map((sale, idx) => (
                      <tr key={sale.id} className={`border-t ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-purple-50 transition-colors`}>
                        <td className="px-4 py-3 font-medium">{sale.harvest.product.name}</td>
                        <td className="px-4 py-3 text-gray-600">{sale.quantity} kg</td>
                        <td className="px-4 py-3 text-gray-600">${sale.unitPrice}</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                            ${sale.totalPrice}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-600">{sale.buyerName || "-"}</td>
                        <td className="px-4 py-3 text-gray-600">{new Date(sale.salesDate).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      <FormModal
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title="Record New Sale"
        onSubmit={handleSubmit}
        submitLabel={submitting ? "Saving..." : "Save Sale"}
      >
        <div>
          <Label htmlFor="harvest">Harvest</Label>
          <Select
            value={formData.harvestId}
            onValueChange={(value) => setFormData({ ...formData, harvestId: value })}
            required
          >
            <SelectTrigger style={{ marginTop: '4px' }}>
              <SelectValue placeholder="Select harvest" />
            </SelectTrigger>
            <SelectContent>
              {harvests.map(harvest => (
                <SelectItem key={harvest.id} value={harvest.id}>
                  {harvest.product.name} ({harvest.quantity})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <Label htmlFor="quantity">Quantity (kg)</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: parseFloat(e.target.value) || 0 })}
              required
              style={{ marginTop: '4px' }}
            />
          </div>
          <div>
            <Label htmlFor="unitPrice">Unit Price ($)</Label>
            <Input
              id="unitPrice"
              type="number"
              min="0"
              step="0.01"
              value={formData.unitPrice}
              onChange={(e) => setFormData({ ...formData, unitPrice: parseFloat(e.target.value) || 0 })}
              required
              style={{ marginTop: '4px' }}
            />
          </div>
        </div>
        <div>
          <Label htmlFor="buyerName">Buyer Name (Optional)</Label>
          <Input
            id="buyerName"
            placeholder="Enter buyer name"
            value={formData.buyerName}
            onChange={(e) => setFormData({ ...formData, buyerName: e.target.value })}
            style={{ marginTop: '4px' }}
          />
        </div>
        <div>
          <Label htmlFor="notes">Notes (Optional)</Label>
          <Input
            id="notes"
            placeholder="Add notes..."
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            style={{ marginTop: '4px' }}
          />
        </div>
      </FormModal>
    </div>
  );
}
