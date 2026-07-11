"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormModal } from "@/components/ui/modal";
import { 
  DollarSign, 
  Plus, 
  Search,
  ArrowLeft,
  Loader2,
  TrendingUp,
  Receipt,
  Pencil,
  Trash2,
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
  harvestId: "",
  quantity: "" as number | "",
  unitPrice: "" as number | "",
  buyerName: "",
  salesDate: "",
  notes: "",
};

export default function SalesPage() {
  const { data: session } = useSession();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterMonth, setFilterMonth] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [sales, setSales] = useState<Sale[]>([]);
  const [harvests, setHarvests] = useState<Harvest[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingSale, setEditingSale] = useState<Sale | null>(null);
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
      fetch("/api/sales").then(res => res.json()),
      fetch("/api/harvest").then(res => res.json())
    ]).then(([salesData, harvestsData]) => {
      setSales(salesData);
      setHarvests(harvestsData);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  const fetchSales = () => {
    fetch("/api/sales")
      .then(res => res.json())
      .then(data => setSales(data))
      .catch(console.error);
  };

  const handleAdd = () => {
    setEditingSale(null);
    setFormData(emptyForm);
    setDialogOpen(true);
  };

  const handleEdit = (sale: Sale) => {
    setEditingSale(sale);
    setFormData({
      id: sale.id,
      harvestId: sale.harvestId,
      quantity: parseFloat(sale.quantity),
      unitPrice: parseFloat(sale.unitPrice),
      buyerName: sale.buyerName || "",
      salesDate: sale.salesDate.split("T")[0],
      notes: "",
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/sales/${id}`, { method: "DELETE" });
      const data = await res.json();

      if (!res.ok) {
        setDeleteError(data.error || "Gagal menghapus data.");
        return;
      }
      setDeleteConfirmId(null);
      setDeleteError("");
      fetchSales();
    } catch (error) {
      console.error(error);
      setDeleteError("Gagal menghapus data. Silakan coba lagi.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const url = editingSale ? `/api/sales/${editingSale.id}` : "/api/sales";
      const method = editingSale ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setDialogOpen(false);
        setEditingSale(null);
        setFormData(emptyForm);
        fetchSales();
      }
    } catch (error) {
      console.error(error);
    }

    setSubmitting(false);
  };

  const filteredSales = sales.filter(s => {
    const matchSearch = s.harvest.product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (s.buyerName?.toLowerCase() || "").includes(searchTerm.toLowerCase());
    const date = new Date(s.salesDate);
    const matchMonth = !filterMonth || (date.getMonth() + 1).toString() === filterMonth;
    const matchYear = !filterYear || date.getFullYear().toString() === filterYear;
    return matchSearch && matchMonth && matchYear;
  });

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
                <h1 className="text-xl font-bold text-gray-800">Data Penjualan</h1>
                <p className="text-sm text-gray-500">Kelola data penjualan panen</p>
              </div>
            </div>
          </div>
          {isOperator && (
            <Button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Tambah Penjualan
            </Button>
          )}
        </div>
      </header>

      <main className="p-6">
        <div className="grid gap-6 mb-6 md:grid-cols-3">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-emerald-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-100">Total Pendapatan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">Rp{totalRevenue.toLocaleString()}</div>
              <p className="text-xs text-green-100 mt-1">Total pendapatan</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-emerald-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-100">Total Transaksi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{filteredSales.length}</div>
              <p className="text-xs text-green-100 mt-1">Jumlah penjualan</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-emerald-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-100">Rata-rata Penjualan</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                Rp{filteredSales.length > 0 ? Math.round(totalRevenue / filteredSales.length).toLocaleString() : 0}
              </div>
              <p className="text-xs text-orange-100 mt-1">Per transaksi</p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-0 shadow-xl">
          <CardHeader className="pb-4 border-b">
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Cari penjualan..."
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
                <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
              </div>
            ) : filteredSales.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                <Receipt className="w-12 h-12 mb-4 text-gray-300" />
                <p>Tidak ada data penjualan</p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-md border border-gray-100">
                <table className="w-full min-w-[600px]">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Produk</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Jumlah</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Harga Satuan</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Total</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Pembeli</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Tanggal</th>
                      {isOperator && <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Aksi</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSales.map((sale, idx) => (
                      <tr key={sale.id} className={`border-t ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-purple-50 transition-colors`}>
                        <td className="px-4 py-3 font-medium">{sale.harvest.product.name}</td>
                        <td className="px-4 py-3 text-gray-600">{sale.quantity} kg</td>
                        <td className="px-4 py-3 text-gray-600">Rp{sale.unitPrice}</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                            Rp{sale.totalPrice}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-600">{sale.buyerName || "-"}</td>
                        <td className="px-4 py-3 text-gray-600">{new Date(sale.salesDate).toLocaleDateString()}</td>
                        {isOperator && (
                          <td className="px-4 py-3 text-right">
                            <div className="flex justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="hover:bg-blue-100"
                                onClick={() => handleEdit(sale)}
                              >
                                <Pencil className="w-4 h-4 text-blue-600" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="hover:bg-red-100"
                                onClick={() => setDeleteConfirmId(sale.id)}
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
        title={editingSale ? "Edit Data Penjualan" : "Tambah Data Penjualan"}
        onSubmit={handleSubmit}
        submitLabel={submitting ? "Menyimpan..." : editingSale ? "Perbarui Data" : "Simpan Data"}
      >
        <div>
          <Label htmlFor="harvest">Hasil Panen</Label>
          <select
            value={formData.harvestId}
            onChange={(e) => setFormData({ ...formData, harvestId: e.target.value })}
            required
            style={selectStyle}
          >
            <option value="">Pilih Hasil Panen</option>
            {harvests.map(harvest => (
              <option key={harvest.id} value={harvest.id}>
                {harvest.product.name} ({harvest.quantity})
              </option>
            ))}
          </select>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <Label htmlFor="quantity">Jumlah (kg)</Label>
            <Input
              id="quantity"
              type="number"
              min="1"
              value={formData.quantity}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value === "" ? "" : parseFloat(e.target.value) })}
              required
              style={{ marginTop: '4px' }}
            />
          </div>
          <div>
            <Label htmlFor="unitPrice">Harga Satuan (Rp)</Label>
            <Input
              id="unitPrice"
              type="number"
              min="0"
              step="0.01"
              value={formData.unitPrice}
              onChange={(e) => setFormData({ ...formData, unitPrice: e.target.value === "" ? "" : parseFloat(e.target.value) })}
              required
              style={{ marginTop: '4px' }}
            />
          </div>
        </div>
        <div>
          <Label htmlFor="buyerName">Nama Pembeli (Opsional)</Label>
          <Input
            id="buyerName"
            placeholder="Masukkan nama pembeli"
            value={formData.buyerName}
            onChange={(e) => setFormData({ ...formData, buyerName: e.target.value })}
            style={{ marginTop: '4px' }}
          />
        </div>
        <div>
          <Label htmlFor="salesDate">Tanggal Penjualan</Label>
          <Input
            id="salesDate"
            type="date"
            value={formData.salesDate}
            onChange={(e) => setFormData({ ...formData, salesDate: e.target.value })}
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
        title="Hapus Data Penjualan"
        onSubmit={(e) => { e.preventDefault(); handleDelete(deleteConfirmId!); }}
        submitLabel="Ya, Hapus"
      >
        <p className="text-gray-600">
          Apakah Anda yakin ingin menghapus data penjualan ini? Tindakan ini tidak dapat dibatalkan.
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