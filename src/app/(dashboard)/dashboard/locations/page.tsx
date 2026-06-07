"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FormModal } from "@/components/ui/modal";
import { 
  MapPin, 
  Plus, 
  Search,
  ArrowLeft,
  Pencil,
  Trash2,
  Loader2,
  Building2
} from "lucide-react";
import Link from "next/link";

interface Location {
  id: string;
  name: string;
  address: string;
  hectares: number;
  description: string | null;
}

export default function LocationsPage() {
  const { data: session } = useSession();
  const [searchTerm, setSearchTerm] = useState("");
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    hectares: 0,
    description: "",
  });

  const isOperator = session?.user?.role === "operator" || session?.user?.role === "admin";

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = () => {
    fetch("/api/locations")
      .then(res => res.json())
      .then(data => {
        setLocations(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  const handleAdd = () => {
    setEditingLocation(null);
    setFormData({ name: "", address: "", hectares: 0, description: "" });
    setDialogOpen(true);
  };

  const handleEdit = (location: Location) => {
    setEditingLocation(location);
    setFormData({
      name: location.name,
      address: location.address,
      hectares: location.hectares,
      description: location.description || "",
    });
    setDialogOpen(true);
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/locations/${id}`, { method: "DELETE" });
      const data = await res.json();

      if (!res.ok) {
        setDeleteError(data.error || "Gagal menghapus data.");
        return;
      }
      setDeleteConfirmId(null);
      setDeleteError("");
      fetchLocations();
    } catch (error) {
      console.error(error);
      setDeleteError("Gagal menghapus data. Silakan coba lagi.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const url = editingLocation ? `/api/locations/${editingLocation.id}` : "/api/locations";
      const method = editingLocation ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      
      if (res.ok) {
        setDialogOpen(false);
        setEditingLocation(null);
        setFormData({ name: "", address: "", hectares: 0, description: "" });
        fetchLocations();
      }
    } catch (error) {
      console.error(error);
    }
    
    setSubmitting(false);
  };

  const filteredLocations = locations.filter(l => 
    l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalArea = filteredLocations.reduce((sum, l) => sum + (l.hectares || 0), 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-cyan-50">
      <header className="bg-white/80 backdrop-blur-sm border-b px-6 py-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="icon" className="hover:bg-teal-100">
                <ArrowLeft className="w-5 h-5" />
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-teal-100 rounded-lg">
                <MapPin className="w-5 h-5 text-teal-600" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Farm Locations</h1>
                <p className="text-sm text-gray-500">Manage farm locations</p>
              </div>
            </div>
          </div>
          {isOperator && (
            <Button onClick={handleAdd} className="bg-teal-600 hover:bg-teal-700">
              <Plus className="w-4 h-4 mr-2" />
              Tambah Lokasi
            </Button>
          )}
        </div>
      </header>

      <main className="p-6">
        <div className="grid gap-6 mb-6 md:grid-cols-2">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-teal-500 to-emerald-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-teal-100">Total Locations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{loading ? "..." : filteredLocations.length}</div>
              <p className="text-xs text-teal-100 mt-1">Farm sites</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-lg bg-gradient-to-br from-amber-500 to-orange-600 text-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-amber-100">Total Area</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{loading ? "..." : `${totalArea} ha`}</div>
              <p className="text-xs text-amber-100 mt-1">Hectares</p>
            </CardContent>
          </Card>
        </div>

        <Card className="border-0 shadow-xl">
          <CardHeader className="pb-4 border-b">
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search locations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-50 border-gray-200"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
              </div>
            ) : filteredLocations.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                <MapPin className="w-12 h-12 mb-4 text-gray-300" />
                <p>No locations found</p>
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {filteredLocations.map((location, idx) => (
                  <Card key={location.id} className={`border-0 shadow-md hover:shadow-lg transition-all hover:-translate-y-1 ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <div className="p-2 bg-teal-100 rounded-lg">
                            <Building2 className="w-4 h-4 text-teal-600" />
                          </div>
                          <CardTitle className="text-lg">{location.name}</CardTitle>
                        </div>
                        {isOperator && (
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-blue-100" onClick={() => handleEdit(location)}>
                              <Pencil className="w-4 h-4 text-blue-600" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-red-100" onClick={() => setDeleteConfirmId(location.id)}>
                              <Trash2 className="w-4 h-4 text-red-600" />
                            </Button>
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-start gap-2 text-sm text-gray-600">
                          <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                          <span>{location.address}</span>
                        </div>
                        {location.description && (
                          <p className="text-sm text-gray-500">{location.description}</p>
                        )}
                        <div className="inline-flex items-center px-2 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-medium mt-2">
                          {location.hectares} hectares
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      <FormModal
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title={editingLocation ? "Edit Data Lokasi" : "Tambah Data Lokasi"}
        onSubmit={handleSubmit}
        submitLabel={submitting ? "Menyimpan..." : editingLocation ? "Perbarui Data" : "Simpan Data"}
      >
        <div>
          <Label htmlFor="name">Nama Lokasi</Label>
          <Input
            id="name"
            placeholder="Masukkan nama lokasi"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            style={{ marginTop: '4px' }}
          />
        </div>
        <div>
          <Label htmlFor="address">Alamat</Label>
          <Input
            id="address"
            placeholder="Masukkan alamat"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            required
            style={{ marginTop: '4px' }}
          />
        </div>
        <div>
          <Label htmlFor="hectares">Luas (Hektar)</Label>
          <Input
            id="hectares"
            type="number"
            min="0"
            value={formData.hectares}
            onChange={(e) => setFormData({ ...formData, hectares: parseFloat(e.target.value) || 0 })}
            required
            style={{ marginTop: '4px' }}
          />
        </div>
        <div>
          <Label htmlFor="description">Deskripsi (Opsional)</Label>
          <Input
            id="description"
            placeholder="Tambah deskripsi..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
        title="Hapus Data Lokasi"
        onSubmit={(e) => { e.preventDefault(); handleDelete(deleteConfirmId!); }}
        submitLabel="Ya, Hapus"
      >
        <p className="text-gray-600">
          Apakah Anda yakin ingin menghapus lokasi ini? Tindakan ini tidak dapat dibatalkan.
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
