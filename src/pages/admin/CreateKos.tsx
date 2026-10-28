import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "@/lib/api";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { ArrowLeft } from "lucide-react";

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

export default function CreateKos() {
  const navigate = useNavigate();

  /* STEP */
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(false);

  /* FORM */
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    price_per_month: 0,
    gender: "all" as "male" | "female" | "all",
    facilities: [] as string[],
  });

  const [images, setImages] = useState<File[]>([]);

  /* =====================
     STEP HANDLER
  ===================== */
  const nextStep = () => setStep((s) => (s < 3 ? (s + 1) as 1 | 2 | 3 : s));
  const prevStep = () => setStep((s) => (s > 1 ? (s - 1) as 1 | 2 | 3 : s));

  const toggleFacility = (facility: string) => {
    setFormData((prev) => ({
      ...prev,
      facilities: prev.facilities.includes(facility)
        ? prev.facilities.filter((f) => f !== facility)
        : [...prev.facilities, facility],
    }));
  };

  /* =====================
     SUBMIT (FINAL & BENAR)
  ===================== */
  const submitKos = async () => {
    if (!formData.name || !formData.address || formData.price_per_month <= 0) {
      alert("Data belum lengkap");
      return;
    }

    setLoading(true);

    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}");

      /* 1️⃣ CREATE KOS */
      const kosRes = await api.post("/kos", {
        user_id: Number(user.id),
        name: formData.name,
        address: formData.address,
        price_per_month: formData.price_per_month,
        gender: formData.gender,
      });

      const kosId = kosRes.data.data.id;

      /* 2️⃣ FACILITIES */
      for (const facility of formData.facilities) {
        await api.post("/kos-facilities", {
          kos_id: kosId,
          facility,
        });
      }

      /* 3️⃣ IMAGES (field = file, 1 per request) */
      if (images.length > 0) {
        for (const img of images) {
          const fd = new FormData();
          fd.append("kos_id", String(kosId));
          fd.append("file", img); // ⬅️ WAJIB "file"

          await api.post("/kos-images", fd);
        }
      }

      navigate("/admin");
    } catch (err: any) {
      console.error(err.response?.data || err);
      alert("Gagal menyimpan kos");
    } finally {
      setLoading(false);
    }
  };

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
          <h1 className="text-xl font-bold">Tambah Kos</h1>
        </div>
      </header>

      <main className="container py-8 max-w-3xl">
        {/* STEP INDICATOR */}
        <div className="flex justify-between mb-8">
          {["Data Kos", "Fasilitas", "Harga & Konfirmasi"].map((label, i) => {
            const current = (i + 1) as 1 | 2 | 3;
            return (
              <div
                key={label}
                className={`flex-1 text-center pb-2 border-b-2 ${
                  step >= current
                    ? "border-gold text-gold"
                    : "border-muted text-muted-foreground"
                }`}
              >
                {label}
              </div>
            );
          })}
        </div>

        {/* STEP 1 */}
        {step === 1 && (
          <div className="space-y-6">
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
              <Label>Disewakan untuk</Label>
              <Select
                value={formData.gender}
                onValueChange={(v) =>
                  setFormData({ ...formData, gender: v as any })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Putra</SelectItem>
                  <SelectItem value="female">Putri</SelectItem>
                  <SelectItem value="all">Campur</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="space-y-4">
            <Label>Fasilitas</Label>
            <div className="grid grid-cols-2 gap-3">
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
        )}

        {/* STEP 3 */}
        {step === 3 && (
          <div className="space-y-8">
            <div className="space-y-4">
              <div>
                <Label>Harga / bulan (Rp)</Label>
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
                <Label>Foto Kos</Label>
                <Input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={(e) =>
                    e.target.files && setImages(Array.from(e.target.files))
                  }
                />
              </div>
            </div>

            {/* PREVIEW */}
            <div className="border rounded-xl p-4 bg-muted/30 space-y-3">
              <h3 className="font-semibold">Preview</h3>
              <p><b>Nama:</b> {formData.name}</p>
              <p><b>Alamat:</b> {formData.address}</p>
              <p><b>Gender:</b> {formData.gender}</p>
              <p>
                <b>Harga:</b>{" "}
                Rp {formData.price_per_month.toLocaleString("id-ID")}
              </p>
              <p>
                <b>Fasilitas:</b>{" "}
                {formData.facilities.length
                  ? formData.facilities.join(", ")
                  : "-"}
              </p>

              {images.length > 0 && (
                <div className="grid grid-cols-3 gap-3">
                  {images.map((img, i) => (
                    <img
                      key={i}
                      src={URL.createObjectURL(img)}
                      className="h-24 w-full rounded-lg object-cover"
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* FOOTER */}
        <div className="flex justify-between mt-10">
          <Button variant="outline" onClick={prevStep} disabled={step === 1}>
            Kembali
          </Button>

          {step < 3 ? (
            <Button onClick={nextStep}>Lanjut</Button>
          ) : (
            <Button onClick={submitKos} disabled={loading}>
              {loading ? "Menyimpan..." : "Simpan Kos"}
            </Button>
          )}
        </div>
      </main>
    </div>
  );
}
