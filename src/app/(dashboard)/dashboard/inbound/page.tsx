"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { FormModal } from "@/components/ui/modal";
import { 
  ArrowDownCircle, 
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
  category: string | null;
  unit: string | null;
}

interface Inbound {
  id: string;
  productId: string;
  product: { name: string };
  supplierId: string | null;
  supplier: { name: string } | null;
  quantity: number;
  unit: string;
  price: string;
  inboundDate: string;
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
  price: "" as number | "",
  inboundDate: "",
  notes: "",
};

export default function InboundPage() {
  const { data: session } = useSession();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMonth, setFilterMonth] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [inbounds, setInbounds] = useState<Inbound[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingInbound, setEditingInbound] = useState<Inbound | null>(null);
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
      fetch("/api/inbound").then(res => res.json()),
      fetch("/api/products").then(res => res.json())
    ]).then(([inboundsData, productsData]) => {
      setInbounds(inboundsData);
      setProducts(productsData);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  const fetchInbounds = () => {
    fetch("/api/inbound")
      .then(res => res.json())
      .then(data => setInbounds(data))
      .catch(console.error);
  };

  const handleAdd = () => {
    setEditingInbound(null);
    setFormData(emptyForm);
    setDialogOpen(true);
  };

  const handleEdit = (inbound: Inbound) => {
    setEditingInbound(inbound);
    setFormData({
      id: inbound.id,
      productId: inbound.productId,
      quantity: inbound.quantity,
      unit: inbound.unit,
      price: parseFloat(inbound.price),
      inboundDate: inbound.inboundDate.split("T")[0], // Format to YYYY-MM-DD for input
      notes: inbound.notes || "",
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/inbound/${id}`, { method: "DELETE" });
      const data = await res.json();

      if (!res.ok) {
        setDeleteError(data.error || "Gagal menghapus data.");
        return;
      }
      setDeleteConfirmId(null);
      setDeleteError("");
      fetchInbounds();
    } catch (error) {
      console.error(error);
      setDeleteError("Gagal menghapus data. Silakan coba lagi.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const url = editingInbound ? `/api/inbound/${editingInbound.id}` : "/api/inbound";
      const method = editingInbound ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setDialogOpen(false);
        setEditingInbound(null);
        setFormData(emptyForm);
        fetchInbounds();
      }
    } catch (error) {
      console.error(error);
    }

    setSubmitting(false);
  };

  const filteredInbounds = inbounds.filter(i => {
    const matchSearch = i.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (i.supplier?.name?.toLowerCase() || "").includes(searchTerm.toLowerCase());
    const date = new Date(i.inboundDate);
    const matchMonth = !filterMonth || (date.getMonth() + 1).toString() === filterMonth;
    const matchYear = !filterYear || date.getFullYear().toString() === filterYear;
    return matchSearch && matchMonth && matchYear;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      <header className="bg-white/80 backdrop-blur-sm border-b px-6 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon" className="hover:bg-blue-100">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <ArrowDownCircle className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Data Pembelian Bibit</h1>
                <p className="text-sm text-gray-500">Kelola Pembelian Bibit</p>
              </div>
            </div>
          </div>
          {isOperator && (
            <Button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Tambah Bibit Baru
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
                  placeholder="Cari Data..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-50 border-gray-200"
                />
              </div>
              <select
                value={filterMonth}
                onChange={(e) => setFilterMonth(e.target.value)}
                style={{ ...selectStyle, width: "140px", marginTop: 0 }}
              >
                <option value="">Semua Bulan</option>
                <option value="1">Januari</option>
                <option value="2">Februari</option>
                <option value="3">Maret</option>
                <option value="4">April</option>
                <option value="5">Mei</option>
                <option value="6">Juni</option>
                <option value="7">Juli</option>
                <option value="8">Agustus</option>
                <option value="9">September</option>
                <option value="10">Oktober</option>
                <option value="11">November</option>
                <option value="12">Desember</option>
              </select>
              <select
                value={filterYear}
                onChange={(e) => setFilterYear(e.target.value)}
                style={{ ...selectStyle, width: "110px", marginTop: 0 }}
              >
                <option value="">Semua Tahun</option>
                {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              </div>
            ) : filteredInbounds.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                <ArrowDownCircle className="w-12 h-12 mb-4 text-gray-300" />
                <p>Tidak Ada Data Pembelian Bibit</p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-md border border-gray-100">
                <table className="w-full min-w-[600px]">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Produk/Bibit</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Jumlah</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Harga</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Tanggal Beli</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Catatan</th>
                      {isOperator && <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Aksi</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInbounds.map((inbound, idx) => (
                      <tr key={inbound.id} className={`border-t ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50 transition-colors`}>
                        <td className="px-4 py-3 font-medium">{inbound.product.name}</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs">
                            {inbound.quantity} {inbound.unit}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-600">Rp{Number(inbound.price).toLocaleString('id-ID')}</td>
                        <td className="px-4 py-3 text-gray-600">{new Date(inbound.inboundDate).toLocaleDateString('id-ID')}</td>
                        <td className="px-4 py-3 text-gray-600">{inbound.notes || "-"}</td>
                        {isOperator && (
                          <td className="px-4 py-3 text-right">
                            <div className="flex justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="hover:bg-blue-100"
                                onClick={() => handleEdit(inbound)}
                              >
                                <Pencil className="w-4 h-4 text-blue-600" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="hover:bg-red-100"
                                onClick={() => setDeleteConfirmId(inbound.id)}
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

      {/* Modal Tambah/Edit */}
      <FormModal
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title={editingInbound ? "Edit Data Pembelian Bibit" : "Tambah Data Pembelian Bibit"}
        onSubmit={handleSubmit}
        submitLabel={submitting ? "Menyimpan..." : editingInbound ? "Perbarui Data" : "Simpan Data"}
      >
        <div>
          <Label htmlFor="product">Produk/Bibit</Label>
          <select
            value={formData.productId}
            onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
            required
            style={selectStyle}
          >
            <option value="">Pilih Produk/Bibit</option>
            {products.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
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
              required
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
          <Label htmlFor="price">Harga</Label>
          <Input
            id="price"
            type="number"
            min="0"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value === "" ? "" : parseFloat(e.target.value) })}
            required
            style={{ marginTop: '4px' }}
          />
        </div>

        <div>
          <Label htmlFor="inboundDate">Tanggal Pembelian</Label>
          <Input
            id="inboundDate"
            type="date"
            value={formData.inboundDate}
            onChange={(e) => setFormData({ ...formData, inboundDate: e.target.value })}
            required
            style={{ marginTop: '4px' }}
          />
        </div>

        <div>
          <Label htmlFor="notes">Catatan</Label>
          <Input
            id="notes"
            placeholder="Tambah Catatan..."
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            style={{ marginTop: '4px' }}
          />
        </div>
      </FormModal>

      {/* Modal Konfirmasi Hapus */}
      <FormModal
        open={!!deleteConfirmId}
        onOpenChange={(open) => {
          if (!open) {
            setDeleteConfirmId(null);
            setDeleteError("");
          }
        }}
        title="Hapus Data Pembelian"
        onSubmit={(e) => { e.preventDefault(); handleDelete(deleteConfirmId!); }}
        submitLabel="Ya, Hapus"
      >
        <p className="text-gray-600">
          Apakah Anda yakin ingin menghapus data pembelian ini? Tindakan ini tidak dapat dibatalkan.
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