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
  ArrowUpCircle, 
  Plus, 
  Search,
  ArrowLeft,
  Loader2
} from "lucide-react";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  unit: string | null;
}

interface Outbound {
  id: string;
  productId: string;
  product: { name: string };
  quantity: number;
  unit: string;
  outboundDate: string;
  notes: string | null;
}

export default function OutboundPage() {
  const { data: session } = useSession();
  const [searchTerm, setSearchTerm] = useState("");
  const [outbounds, setOutbounds] = useState<Outbound[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    productId: "",
    quantity: 0,
    unit: "",
    notes: "",
  });

  const isOperator = session?.user?.role === "operator" || session?.user?.role === "admin";

  useEffect(() => {
    Promise.all([
      fetch("/api/outbound").then(res => res.json()),
      fetch("/api/products").then(res => res.json())
    ]).then(([outboundsData, productsData]) => {
      setOutbounds(outboundsData);
      setProducts(productsData);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const res = await fetch("/api/outbound", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      if (res.ok) {
        setDialogOpen(false);
        setFormData({ productId: "", quantity: 0, unit: "", notes: "" });
        const outboundsRes = await fetch("/api/outbound");
        setOutbounds(await outboundsRes.json());
      }
    } catch (error) {
      console.error(error);
    }
    
    setSubmitting(false);
  };

  const filteredOutbounds = outbounds.filter(o => 
    o.product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50">
      <header className="bg-white/80 backdrop-blur-sm border-b px-6 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon" className="hover:bg-orange-100">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-orange-100 rounded-lg">
                <ArrowUpCircle className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Seedling Outbound</h1>
                <p className="text-sm text-gray-500">Manage seedling and supply outbound</p>
              </div>
            </div>
          </div>
          {isOperator && (
            <Button onClick={() => setDialogOpen(true)} className="bg-orange-600 hover:bg-orange-700">
              <Plus className="w-4 h-4 mr-2" />
              New Outbound
            </Button>
          )}
        </div>
      </header>

      <main className="p-6">
        <Card className="border-0 shadow-xl">
          <CardHeader className="pb-4 border-b">
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search outbound..."
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
                <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
              </div>
            ) : filteredOutbounds.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                <ArrowUpCircle className="w-12 h-12 mb-4 text-gray-300" />
                <p>No outbound records found</p>
              </div>
            ) : (
              <div className="rounded-md border border-gray-100">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Product</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Quantity</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Date</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOutbounds.map((outbound, idx) => (
                      <tr key={outbound.id} className={`border-t ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-orange-50 transition-colors`}>
                        <td className="px-4 py-3 font-medium">{outbound.product.name}</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-xs">
                            {outbound.quantity} {outbound.unit}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-600">{new Date(outbound.outboundDate).toLocaleDateString()}</td>
                        <td className="px-4 py-3 text-gray-500 text-sm">{outbound.notes || "-"}</td>
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
        title="New Outbound Record"
        onSubmit={handleSubmit}
        submitLabel={submitting ? "Saving..." : "Save Outbound"}
      >
        <div>
          <Label htmlFor="product">Product</Label>
          <Select
            value={formData.productId}
            onValueChange={(value) => setFormData({ ...formData, productId: value })}
            required
          >
            <SelectTrigger style={{ marginTop: '4px' }}>
              <SelectValue placeholder="Select product" />
            </SelectTrigger>
            <SelectContent>
              {products.map(product => (
                <SelectItem key={product.id} value={product.id}>{product.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
              style={{ marginTop: '4px' }}
            />
          </div>
          <div>
            <Label htmlFor="unit">Unit</Label>
            <Select
              value={formData.unit}
              onValueChange={(value) => setFormData({ ...formData, unit: value })}
              required
            >
              <SelectTrigger style={{ marginTop: '4px' }}>
                <SelectValue placeholder="Unit" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="kg">Kilogram</SelectItem>
                <SelectItem value="pcs">Pieces</SelectItem>
                <SelectItem value="liter">Liter</SelectItem>
              </SelectContent>
            </Select>
          </div>
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
