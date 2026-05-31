"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { FormModal } from "@/components/ui/modal";
import { 
  Package, 
  Plus, 
  Search, 
  Pencil, 
  Trash2,
  ArrowLeft,
  Loader2
} from "lucide-react";
import Link from "next/link";

interface Product {
  id: string;
  name: string;
  category: string | null;
  unit: string | null;
  minStock: number;
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

export default function ProductsPage() {
  const { data: session } = useSession();
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    unit: "",
    minStock: "" as number | "",
  });

  const isOperator = session?.user?.role === "operator" || session?.user?.role === "admin";

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = () => {
    fetch("/api/products")
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const handleAdd = () => {
    setEditingProduct(null);
    setFormData({ name: "", category: "", unit: "", minStock: "" as number | "", });
    setDialogOpen(true);
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category: product.category || "",
      unit: product.unit || "",
      minStock: product.minStock,
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string, force: boolean = false) => {
    try {
      const res = await fetch(`/api/products/${id}?force=${force}`, { method: "DELETE" });
      const data = await res.json();
      
      if (!res.ok) {
        setDeleteError(data.error);
        return;
      }
      setDeleteConfirmId(null);
      setDeleteError("");
      fetchProducts();
    } catch (error) {
      console.error(error);
      setDeleteError("Gagal menghapus produk. Silakan coba lagi.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const url = editingProduct ? `/api/products/${editingProduct.id}` : "/api/products";
      const method = editingProduct ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      if (res.ok) {
        setDialogOpen(false);
        setEditingProduct(null);
        setFormData({ name: "", category: "", unit: "", minStock: "" as number | "", });
        fetchProducts();
      }
    } catch (error) {
      console.error(error);
    }
    
    setSubmitting(false);
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.category?.toLowerCase() || "").includes(searchTerm.toLowerCase())
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
                <Package className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Produk</h1>
                <p className="text-sm text-gray-500">Kelola produk pertanian Anda</p>
              </div>
            </div>
          </div>
          {isOperator && (
            <Button onClick={handleAdd} className="bg-green-600 hover:bg-green-700">
              <Plus className="w-4 h-4 mr-2" />
              Tambah Produk
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
                  placeholder="Cari produk..."
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
            ) : filteredProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                <Package className="w-12 h-12 mb-4 text-gray-300" />
                <p>Tidak ada produk ditemukan</p>
              </div>
            ) : (
              <div className="rounded-md border border-gray-100">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Nama</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Kategori</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Satuan</th>
                      <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">Stok Minimum</th>
                      {isOperator && <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">Aksi</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map((product, idx) => (
                      <tr key={product.id} className={`border-t ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-green-50 transition-colors`}>
                        <td className="px-4 py-3 font-medium">{product.name}</td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs">
                            {product.category || "-"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-600">{product.unit || "-"}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs ${product.minStock > 10 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {product.minStock}
                          </span>
                        </td>
                        {isOperator && (
                          <td className="px-4 py-3 text-right">
                            <div className="flex justify-end gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="hover:bg-blue-100"
                                onClick={() => handleEdit(product)}
                              >
                                <Pencil className="w-4 h-4 text-blue-600" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="hover:bg-red-100"
                                onClick={() => setDeleteConfirmId(product.id)}
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

      {/* Modal Tambah/Edit Produk */}
      <FormModal
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title={editingProduct ? "Edit Produk" : "Tambah Produk Baru"}
        onSubmit={handleSubmit}
        submitLabel={submitting ? "Menyimpan..." : editingProduct ? "Perbarui Produk" : "Simpan Produk"}
      >
        <div>
          <Label htmlFor="name">Nama Produk</Label>
          <Input
            id="name"
            placeholder="Masukkan nama produk"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            style={{ marginTop: '4px' }}
          />
        </div>
        <div>
          <Label htmlFor="category">Kategori</Label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            style={selectStyle}
          >
            <option value="">Pilih kategori</option>
            <option value="Benih">Benih</option>
            <option value="Pupuk">Pupuk</option>
            <option value="Pestisida">Pestisida</option>
            <option value="Peralatan">Peralatan</option>
          </select>
        </div>
        <div>
          <Label htmlFor="unit">Satuan</Label>
          <select
            value={formData.unit}
            onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
            style={selectStyle}
          >
            <option value="">Pilih satuan</option>
            <option value="kg">Kilogram (kg)</option>
            <option value="buah">Buah</option>
            <option value="liter">Liter</option>
            <option value="karung">Karung</option>
          </select>
        </div>
        <div>
          <Label htmlFor="minStock">Stok Minimum</Label>
          <Input
            id="minStock"
            type="number"
            min="0"
            value={formData.minStock}
            onChange={(e) => setFormData({ ...formData, minStock: parseInt(e.target.value) || 0 })}
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
        title="Hapus Produk"
        onSubmit={(e) => { e.preventDefault(); handleDelete(deleteConfirmId!); }}
        submitLabel="Ya, Hapus"
      >
        <p className="text-gray-600">
          Apakah Anda yakin ingin menghapus produk ini? Tindakan ini tidak dapat dibatalkan.
        </p>
        {deleteError && (
          <div style={{
            marginTop: '8px',
            padding: '12px',
            backgroundColor: '#fff7ed',
            border: '1px solid #fed7aa',
            borderRadius: '6px',
            color: '#c2410c',
            fontSize: '14px',
          }}>
            <p style={{ fontWeight: '600', marginBottom: '8px' }}>⚠️ {deleteError}</p>
            <p style={{ marginBottom: '12px' }}>
              Apakah Anda ingin menghapus semua data inbound terkait dan melanjutkan penghapusan produk ini?
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => handleDelete(deleteConfirmId!, true)}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#dc2626',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '600',
                }}
              >
                Ya, Hapus Semua
              </button>
              <button
                onClick={() => { setDeleteConfirmId(null); setDeleteError(""); }}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#f3f4f6',
                  color: '#374151',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
              >
                Tidak, Batalkan
              </button>
            </div>
          </div>
        )}
      </FormModal>
    </div>
  );
}