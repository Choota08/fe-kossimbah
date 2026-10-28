import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import api from "@/lib/api";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

import { ArrowLeft, Loader2 } from "lucide-react";

/* =====================
   DATA
===================== */
const facilitiesList = [
  "AC",
  "WiFi",
  "Kamar Mandi Dalam",
  "Parkir",
  "Dapur",
  "Laundry",
];

export default function EditKos() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [images, setImages] = useState<File[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    price_per_month: 0,
    facilities: [] as string[],
  });

  /* =====================
     LOAD DATA
  ===================== */
  useEffect(() => {
    if (!id) return;

    const fetchKos = async () => {
      try {
        const res = await api.get(`/kos/${id}`);
        const kos = res.data.data;

        setFormData({
          name: kos.name,
          address: kos.address,
          price_per_month: kos.price_per_month,
          facilities: kos.facilities?.map((f: any) => f.facility) ?? [],
        });
      } catch (err) {
        console.error(err);
        alert("Kos tidak ditemukan");
        navigate("/admin");
      } finally {
        setLoading(false);
      }
    };

    fetchKos();
  }, [id, navigate]);

  /* =====================
     FACILITY TOGGLE
  ===================== */
  const toggleFacility = (facility: string) => {
    setFormData((prev) => ({
      ...prev,
      facilities: prev.facilities.includes(facility)
        ? prev.facilities.filter((f) => f !== facility)
        : [...prev.facilities, facility],
    }));
  };

  /* =====================
     SUBMIT
  ===================== */
  const submitKos = async () => {
    if (!id) return;

    setSaving(true);

    try {
      /* =====================
         1️⃣ UPDATE KOS
      ===================== */
      await api.put(`/kos/${id}`, {
        name: formData.name,
        address: formData.address,
        price_per_month: formData.price_per_month,
      });

      /* =====================
         2️⃣ HAPUS FASILITAS LAMA (FIX)
      ===================== */
      await api.delete(`/kos/${id}/facilities`);

      /* =====================
         3️⃣ SIMPAN FASILITAS BARU
      ===================== */
      for (const facility of formData.facilities) {
        await api.post("/kos-facilities", {
          kos_id: Number(id),
          facility,
        });
      }

      /* =====================
         4️⃣ UPLOAD IMAGE (PER FILE)
      ===================== */
      for (const img of images) {
        const fd = new FormData();
        fd.append("kos_id", id);
        fd.append("file", img);

        await api.post("/kos-images", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      navigate("/admin");
    } catch (err) {
      console.error(err);
      alert("Gagal memperbarui kos");
    } finally {
      setSaving(false);
    }
  };

  /* =====================
     LOADING
  ===================== */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  /* =====================
     UI
  ===================== */
  return (
    <div className="min-h-screen bg-background">
      {/* HEADER */}
      <header className="border-b bg-card">
        <div className="container py-4 flex items-center gap-4">
          <Link to="/admin" className="p-2 rounded-lg hover:bg-secondary">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-xl font-bold">Edit Kos</h1>
        </div>
      </header>

      <main className="container py-8 max-w-3xl space-y-6">
        <div>
          <Label>Nama Kos</Label>
          <Input
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
          />
        </div>

        <div>
          <Label>Alamat</Label>
          <Input
            value={formData.address}
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
          />
        </div>

        <div>
          <Label>Harga / bulan</Label>
          <Input
            type="number"
            value={formData.price_per_month}
            onChange={(e) =>
              setFormData({
                ...formData,
                price_per_month: Number(e.target.value),
              })
            }
          />
        </div>

        <div>
          <Label>Fasilitas</Label>
          <div className="grid grid-cols-2 gap-3 mt-2">
            {facilitiesList.map((f) => (
              <label key={f} className="flex items-center gap-2">
                <Checkbox
                  checked={formData.facilities.includes(f)}
                  onCheckedChange={() => toggleFacility(f)}
                />
                {f}
              </label>
            ))}
          </div>
        </div>

        <div>
          <Label>Tambah Foto Baru</Label>
          <Input
            type="file"
            multiple
            accept="image/*"
            onChange={(e) =>
              e.target.files && setImages(Array.from(e.target.files))
            }
          />
        </div>

        <div className="flex justify-end gap-3 pt-6">
          <Button variant="outline" onClick={() => navigate(-1)}>
            Batal
          </Button>
          <Button onClick={submitKos} disabled={saving}>
            {saving ? "Menyimpan..." : "Simpan Perubahan"}
          </Button>
        </div>
      </main>
    </div>
  );
}
