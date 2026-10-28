import { useState, useRef, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Camera, Loader2 } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/use-auth-temp";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

/* ================= VALIDATION ================= */
const profileSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter").optional().or(z.literal("")),
  phone: z.string().optional().or(z.literal("")),
});

type ProfileFormData = z.infer<typeof profileSchema>;

export default function Profile() {
  const { user, profile, isLoading, updateProfile, uploadAvatar } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: "", phone: "" },
  });

  /* ================= AUTH GUARD (HALAMAN) ================= */
  useEffect(() => {
    if (!isLoading && !user) {
      navigate("/login", { replace: true });
    }
  }, [user, isLoading, navigate]);

  /* ================= LOAD PROFILE ================= */
  useEffect(() => {
    if (profile) {
      form.reset({
        name: profile.name || "",
        phone: profile.phone || "",
      });
    }
  }, [profile, form]);

  /* ================= AVATAR ================= */
  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({
        title: "Error",
        description: "File harus berupa gambar",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "Ukuran file maksimal 2MB",
        variant: "destructive",
      });
      return;
    }

    setIsUploadingAvatar(true);
    const { error } = await uploadAvatar(file);
    setIsUploadingAvatar(false);

    if (error) {
      toast({
        title: "Error",
        description: "Gagal mengupload foto profil",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Berhasil",
      description: "Foto profil berhasil diperbarui",
    });
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (data: ProfileFormData) => {
    setIsSubmitting(true);

    const { error } = await updateProfile({
      name: data.name || null,
      phone: data.phone || null,
    });

    setIsSubmitting(false);

    if (error) {
      toast({
        title: "Error",
        description: "Gagal menyimpan profil",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Berhasil",
      description: "Profil berhasil diperbarui",
    });
  };

  /* ================= LOADING ================= */
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  const getInitials = (name?: string | null, email?: string) => {
    if (name) {
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    return email?.slice(0, 2).toUpperCase() || "U";
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-2xl">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Dashboard
          </Link>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="font-serif text-3xl font-bold mb-8">Profil Saya</h1>

            <div className="glass rounded-2xl p-8">
              {/* AVATAR */}
              <div className="flex flex-col items-center mb-8">
                <div className="relative">
                  <Avatar className="w-24 h-24 border-4 border-accent">
                    <AvatarImage src={profile?.avatar_url || undefined} />
                    <AvatarFallback className="bg-gradient-gold text-primary text-2xl">
                      {getInitials(profile?.name, user.email)}
                    </AvatarFallback>
                  </Avatar>

                  <button
                    type="button"
                    onClick={handleAvatarClick}
                    disabled={isUploadingAvatar}
                    className="absolute bottom-0 right-0 w-8 h-8 bg-accent rounded-full flex items-center justify-center"
                  >
                    {isUploadingAvatar ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Camera className="w-4 h-4" />
                    )}
                  </button>

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </div>
              </div>

              {/* FORM */}
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <div>
                  <Label>Email</Label>
                  <Input value={user.email || ""} disabled />
                </div>

                <div>
                  <Label>Nama Lengkap</Label>
                  <Input {...form.register("name")} />
                </div>

                <div>
                  <Label>Nomor Telepon</Label>
                  <Input {...form.register("phone")} />
                </div>

                <Button
                  type="submit"
                  variant="gold"
                  className="w-full text-white border border-white/10"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
                </Button>
              </form>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
