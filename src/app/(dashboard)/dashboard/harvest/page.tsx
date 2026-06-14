"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormModal } from "@/components/ui/modal";
import { 
  TrendingUp, 
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
}

interface Harvest {
  id: string;
  productId: string;
  product: { name: string };
  quantity: string;
  unit: string;
  quality: string | null;
  harvestDate: string;
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

const emptyForm = { productId: "", quantity: "" as number | "", unit: "", quality: "", harvestDate: "", notes: "" };

export default function HarvestPage() {
  const { data: session } = useSession();
  const [searchTerm, setSearchTerm] = useState("");
  const [harvests, setHarvests] = useState<Harvest[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingHarvest, setEditingHarvest] = useState<Harvest | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState("");

  const isOperator = session?.user?.role === "operator" || session?.user?.role === "admin";

  const fetchHarvests = () => {
    fetch("/api/harvest")
      .then(res => res.json())
      .then(data => setHarvests(data))
      .catch(console.error);
  };

  useEffect(() => {
    Promise.all([
      fetch("/api/harvest").then(res => res.json()),
      fetch("/api/products").then(res => res.json())
    ]).then(([harvestsData, productsData]) => {
      setHarvests(harvestsData);
      setProducts(productsData);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleAdd = () => {
    setEditingHarvest(null);
    setFormData(emptyForm);
    setDialogOpen(true);
  };

  const handleEdit = (harvest: Harvest) => {
    setEditingHarvest(harvest);
    setFormData({
      productId: harvest.productId,
      quantity: parseFloat(harvest.quantity),
      unit: harvest.unit,
      quality: harvest.quality || "",
      harvestDate: harvest.harvestDate.split("T")[0],
      notes: "",
    });
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const url = editingHarvest ? `/api/harvest/${editingHarvest.id}` : "/api/harvest";
      const method = editingHarvest ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setDialogOpen(false);
        setEditingHarvest(null);
        setFormData(emptyForm);
        fetchHarvests();
      }
    } catch (error) {
      console.error(error);
    }

    setSubmitting(false);
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/harvest/${id}`, { method: "DELETE" });
      const data = await res.json();

      if (!res.ok) {
        setDeleteError(data.error || "Gagal menghapus data.");
        return;
      }
      setDeleteConfirmId(null);
      setDeleteError("");
      fetchHarvests();
    } catch (error) {
      console.error(error);
      setDeleteError("Gagal menghapus data. Silakan coba lagi.");
    }
  };

  const filteredHarvests = harvests.filter(h => 
    h.product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-emerald-50">
      <header className="bg-white/80 backdrop-blur-sm border-b px-6 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon" className="hover:bg-green-100">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Hasil Panen</h1>
                <p className="text-sm text-gray-500">Kelola data hasil panen</p>
              </div>
            </div>
          </div>
          {isOperator && (
            <Button onClick={handleAdd} className="bg-green-600 hover:bg-green-700">
              <Plus className="w-4 h-4 mr-2" />
              Tambah Panen
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
                  placeholder="Cari hasil panen..."
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
                <Loader2 className="w-8 h-8 animate-spin text-green-600" />
              </div>
            ) : filteredHarvests.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                <TrendingUp className="w-12 h-12 mb-4 text-gray-300" />
                <p>Tidak ada data panen</p>
              </div>
            ) : (
              <div className="overflow-x-auto rounded-md border border-gray-100">
                <table className="w-full min-w-[600px]">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Produk</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Jumlah</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Kualitas</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Tanggal</th>
                      {isOperator && <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Aksi</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredHarvests.map((harvest, idx) => (
                      <tr key={harvest.id} className={`border-t ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-green-50 transition-colors`}>
                        <td className="px-4 py-3 font-medium">{harvest.product.name}</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs">
                            {harvest.quantity} {harvest.unit}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            harvest.quality === 'Grade A' ? 'bg-green-100 text-green-700' : 
                            harvest.quality === 'Grade B' ? 'bg-yellow-100 text-yellow-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {harvest.quality || "Belum dinilai"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-600">{new Date(harvest.harvestDate).toLocaleDateString('id-ID')}</td>
                        {isOperator && (
                          <td className="px-4 py-3 text-right">
                            <div className="flex justify-end gap-1">
                              <Button variant="ghost" size="icon" className="hover:bg-blue-100" onClick={() => handleEdit(harvest)}>
                                <Pencil className="w-4 h-4 text-blue-600" />
                              </Button>
                              <Button variant="ghost" size="icon" className="hover:bg-red-100" onClick={() => setDeleteConfirmId(harvest.id)}>
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
        title={editingHarvest ? "Edit Hasil Panen" : "Tambah Hasil Panen"}
        onSubmit={handleSubmit}
        submitLabel={submitting ? "Menyimpan..." : editingHarvest ? "Perbarui" : "Simpan"}
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
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value === "" ? "" : parseFloat(e.target.value) })}
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
              <option value="ton">Ton</option>
              <option value="pcs">Buah</option>
              <option value="liter">Liter</option>
            </select>
          </div>
        </div>
        <div>
          <Label htmlFor="quality">Kualitas</Label>
          <select
            value={formData.quality}
            onChange={(e) => setFormData({ ...formData, quality: e.target.value })}
            style={selectStyle}
          >
            <option value="">Pilih Kualitas</option>
            <option value="Grade A">Grade A</option>
            <option value="Grade B">Grade B</option>
            <option value="Grade C">Grade C</option>
          </select>
        </div>
        <div>
          <Label htmlFor="harvestDate">Tanggal Panen</Label>
          <Input
            id="harvestDate"
            type="date"
            value={formData.harvestDate}
            onChange={(e) => setFormData({ ...formData, harvestDate: e.target.value })}
            required
            style={{ marginTop: '4px' }}
          />
        </div>
        <div>
          <Label htmlFor="notes">Catatan (Opsional)</Label>
          <Input
            id="notes"
            placeholder="Tambahkan catatan..."
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            style={{ marginTop: '4px' }}
          />
        </div>
      </FormModal>

      <FormModal
        open={!!deleteConfirmId}
        onOpenChange={(open) => { if (!open) { setDeleteConfirmId(null); setDeleteError(""); } }}
        title="Hapus Data Panen"
        onSubmit={(e) => { e.preventDefault(); handleDelete(deleteConfirmId!); }}
        submitLabel="Ya, Hapus"
      >
        <p className="text-gray-600">Apakah Anda yakin ingin menghapus data panen ini?</p>
        {deleteError && (
          <div style={{ marginTop: '8px', padding: '12px', backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '6px', color: '#dc2626', fontSize: '14px' }}>
            {deleteError}
          </div>
        )}
      </FormModal>
    </div>
  );
}
