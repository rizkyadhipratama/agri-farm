"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { FormModal } from "@/components/ui/modal";
import { 
  ArrowUpCircle, 
  Plus, 
  Search,
  ArrowLeft,
  Loader2,
  Pencil,
  Trash2,
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

const selectStyle = {
  marginTop: '4px',
  width: '100%',
  height: '40px',
  borderRadius: '6px',
  border: '1px solid #e2e8f0',
  padding: '0 12px',
  fontSize: '14px',
  backgroundColor: 'white',
  cursor: 'pointer',
};

const emptyForm = {
  id: "",
  productId: "",
  quantity: "" as number | "",
  unit: "",
  outboundDate: "",
  notes: "",
};

export default function OutboundPage() {
  const { data: session } = useSession();
  const [searchTerm, setSearchTerm] = useState("");
  const [outbounds, setOutbounds] = useState<Outbound[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingOutbound, setEditingOutbound] = useState<Outbound | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState(emptyForm);

  const isOperator = session?.user?.role === "operator" || session?.user?.role === "admin";

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = () => {
    Promise.all([
      fetch("/api/outbound").then(res => res.json()),
      fetch("/api/products").then(res => res.json())
    ]).then(([outboundsData, productsData]) => {
      setOutbounds(outboundsData);
      setProducts(productsData);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  const fetchOutbounds = () => {
    fetch("/api/outbound")
      .then(res => res.json())
      .then(data => setOutbounds(data))
      .catch(console.error);
  };

  const handleAdd = () => {
    setEditingOutbound(null);
    setFormData(emptyForm);
    setDialogOpen(true);
  };

  const handleEdit = (outbound: Outbound) => {
    setEditingOutbound(outbound);
    setFormData({
      id: outbound.id,
      productId: outbound.productId,
      quantity: outbound.quantity,
      unit: outbound.unit,
      outboundDate: outbound.outboundDate.split("T")[0],
      notes: outbound.notes || "",
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/outbound/${id}`, { method: "DELETE" });
      const data = await res.json();

      if (!res.ok) {
        setDeleteError(data.error || "Gagal menghapus data.");
        return;
      }
      setDeleteConfirmId(null);
      setDeleteError("");
      fetchOutbounds();
    } catch (error) {
      console.error(error);
      setDeleteError("Gagal menghapus data. Silakan coba lagi.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const url = editingOutbound ? `/api/outbound/${editingOutbound.id}` : "/api/outbound";
      const method = editingOutbound ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setDialogOpen(false);
        setEditingOutbound(null);
        setFormData(emptyForm);
        fetchOutbounds();
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
                <h1 className="text-xl font-bold text-gray-800">Data Pengeluaran Bibit</h1>
                <p className="text-sm text-gray-500">Kelola pengeluaran bibit dan suplai</p>
              </div>
            </div>
          </div>
          {isOperator && (
            <Button onClick={handleAdd} className="bg-orange-600 hover:bg-orange-700">
              <Plus className="w-4 h-4 mr-2" />
              Tambah Pengeluaran
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
                  placeholder="Cari pengeluaran..."
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
                <p>Tidak ada data pengeluaran</p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-md border border-gray-100">
                <table className="w-full min-w-[600px]">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Produk</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Jumlah</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Tanggal</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Catatan</th>
                      {isOperator && <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Aksi</th>}
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
                        {isOperator && (
                          <td className="px-4 py-3 text-right">
                            <div className="flex justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="hover:bg-blue-100"
                                onClick={() => handleEdit(outbound)}
                              >
                                <Pencil className="w-4 h-4 text-blue-600" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="hover:bg-red-100"
                                onClick={() => setDeleteConfirmId(outbound.id)}
                              >
                                <Trash2 className="w-4 h-4 text-red-600" />
                              </Button>
                            </div>
                          </td>
                        )}
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
        title={editingOutbound ? "Edit Data Pengeluaran" : "Tambah Data Pengeluaran"}
        onSubmit={handleSubmit}
        submitLabel={submitting ? "Menyimpan..." : editingOutbound ? "Perbarui Data" : "Simpan Data"}
      >
        <div>
          <Label htmlFor="product">Produk</Label>
          <select
            value={formData.productId}
            onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
            required
            style={selectStyle}
          >
            <option value="">Pilih Produk</option>
            {products.map(product => (
              <option key={product.id} value={product.id}>{product.name}</option>
            ))}
          </select>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <Label htmlFor="quantity">Jumlah</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value === "" ? "" : parseInt(e.target.value) })}
              style={{ marginTop: '4px' }}
            />
          </div>
          <div>
            <Label htmlFor="unit">Satuan</Label>
            <select
              value={formData.unit}
              onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
              required
              style={selectStyle}
            >
              <option value="">Pilih Satuan</option>
              <option value="kg">Kilogram</option>
              <option value="pcs">Buah</option>
              <option value="liter">Liter</option>
            </select>
          </div>
        </div>
        <div>
          <Label htmlFor="outboundDate">Tanggal Pengeluaran</Label>
          <Input
            id="outboundDate"
            type="date"
            value={formData.outboundDate}
            onChange={(e) => setFormData({ ...formData, outboundDate: e.target.value })}
            required
            style={{ marginTop: '4px' }}
          />
        </div>
        <div>
          <Label htmlFor="notes">Catatan (Opsional)</Label>
          <Input
            id="notes"
            placeholder="Tambah catatan..."
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            style={{ marginTop: '4px' }}
          />
        </div>
      </FormModal>

      <FormModal
        open={!!deleteConfirmId}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteConfirmId(null);
            setDeleteError("");
          }
        }}
        title="Hapus Data Pengeluaran"
        onSubmit={(e) => { e.preventDefault(); handleDelete(deleteConfirmId!); }}
        submitLabel="Ya, Hapus"
      >
        <p className="text-gray-600">
          Apakah Anda yakin ingin menghapus data pengeluaran ini? Tindakan ini tidak dapat dibatalkan.
        </p>
        {deleteError && (
          <div style={{
            marginTop: '8px',
            padding: '12px',
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '6px',
            color: '#dc2626',
            fontSize: '14px',
          }}>
            ⚠️ {deleteError}
          </div>
        )}
      </FormModal>
    </div>
  );
}